// Сервер рейтинга «Нейм-рулетки» (Cloudflare Worker + база D1).
// Секреты и настройки: BOT_TOKEN (секрет), ALLOWED_ORIGIN (необязательно, адрес игры).
const MAX_NET = 2e12, MAX_BEST = 6e6, MAX_LVL = 1000, MIN_GAP_MS = 8000, MAX_AGE_S = 3 * 86400;
// Защита от накрутки: капитал игрока не может расти быстрее, чем это возможно в игре.
// Разрешённый рост между двумя отправками = BURST + RATE × секунды с прошлой отправки + выручка с рынка (allow).
// Первая отправка: до FIRST_NET. Если игрок превысил лимит, он помечается (flag=1): скрыт из рейтинга, рынок/кланы/музей для него закрыты,
// а его прошлые данные остаются. Флаг снимается сам, когда отправленный капитал снова укладывается в лимит.
const RATE = 5000, BURST = 100e6, FIRST_NET = 3e9, MAX_ELAPSED_S = 14 * 86400;
const ADMIN_GAME_ID = 587503;   // владелец игры (ID из профиля): на него лимиты не действуют; можно добавить Telegram ID в переменную ADMIN_IDS через запятую
const isAdmin = (uid, env) => {
  const n = Number(uid);
  return n === ADMIN_GAME_ID || (n % 999999) + 1 === ADMIN_GAME_ID || String((env && env.ADMIN_IDS) || '').split(',').map((x) => x.trim()).includes(String(uid));
};

// ---- сезоны и события (то же расписание, что в js/app.js: считается по времени, хранить ничего не нужно) ----
const EV_ANCHOR = Date.UTC(2026, 9, 26), SEASON_MS = 21 * 864e5;
const h32 = (n) => { n = Math.imul(n ^ 0x9E3779B9, 0x85EBCA6B); n ^= n >>> 13; n = Math.imul(n, 0xC2B2AE35); n ^= n >>> 16; return n >>> 0; };
const seasonId = (t) => Math.floor((t - EV_ANCHOR) / SEASON_MS);
const SZ_NAMES = ['Неоновая осень', 'Ледяной шторм', 'Золотая лихорадка', 'Космический рейс', 'Тёмный лес', 'Огненный вихрь'];
function evOfDay(d){   // событие каждый день: 1 час, время/тип/множитель (×1,5…×10) выбираются случайно, но одинаково у всех
  const h=h32(d*7919+13),start=d*864e5+((h>>>8)%23)*36e5,dur=36e5,r=(h>>>18)%100,k=(h>>>25)%20;
  let m=r<30?1.5:r<55?2:r<70?2.5:r<82?3:r<90?4:r<95?5:r<98?7:10;
  const kind=k<8?'coins':k<13?'sp':k<17?'xp':'en';   // coins: монетные награды, sp: очки сезона, xp: опыт, en: энергия из наград
  if(kind!=='coins')m=Math.min(m,kind==='sp'?5:4);
  return {d,start,end:start+dur,m,kind};
}
function evNow(t) { const d = Math.floor(t / 864e5); for (const x of [d, d - 1]) { const e = evOfDay(x); if (e && t >= e.start && t < e.end) return e; } return null; }
const EVK = { coins: 'к монетным наградам (вход, колесо, задания, достижения)', sp: 'к очкам сезона', xp: 'к опыту', en: 'к энергии из наград' };
const SZ_PRIZE = (rank) => rank === 1 ? 5e6 : rank === 2 ? 3e6 : rank === 3 ? 2e6 : rank <= 10 ? 1e6 : rank <= 25 ? 4e5 : 0;
let migrated = false;
async function migrate(db) {   // добавляем новые столбцы сами, SQL вручную выполнять не нужно
  if (migrated) return;
  const have = (await db.prepare('PRAGMA table_info(players)').all()).results.map((r) => r.name);
  for (const [c, d] of [['flag', 'INTEGER NOT NULL DEFAULT 0'], ['cos', "TEXT NOT NULL DEFAULT ''"], ['allow', 'INTEGER NOT NULL DEFAULT 0'], ['un', "TEXT NOT NULL DEFAULT ''"]]) {
    if (!have.includes(c)) await db.prepare(`ALTER TABLE players ADD COLUMN ${c} ${d}`).run();
  }
  await db.prepare('CREATE TABLE IF NOT EXISTS grants (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT NOT NULL, amount INTEGER NOT NULL, claimed INTEGER NOT NULL DEFAULT 0, ts INTEGER NOT NULL DEFAULT 0)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_grants_uid ON grants(uid, claimed)').run();
  try {
    const mh = (await db.prepare('PRAGMA table_info(market)').all()).results.map((r) => r.name);
    if (mh.length && !mh.includes('top')) await db.prepare('ALTER TABLE market ADD COLUMN top INTEGER NOT NULL DEFAULT 0').run();
  } catch (e) {}
  await db.prepare('CREATE TABLE IF NOT EXISTS feed (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT NOT NULL, name TEXT NOT NULL, tier INTEGER NOT NULL, ts INTEGER NOT NULL)').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS auctions (id INTEGER PRIMARY KEY AUTOINCREMENT, seller TEXT NOT NULL, name TEXT NOT NULL, start INTEGER NOT NULL, cur INTEGER NOT NULL, bidder TEXT, bids INTEGER NOT NULL DEFAULT 0, end_ts INTEGER NOT NULL, status INTEGER NOT NULL DEFAULT 0, done INTEGER NOT NULL DEFAULT 0, ts INTEGER NOT NULL DEFAULT 0)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_au ON auctions(status, end_ts)').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS season (sid INTEGER NOT NULL, uid TEXT NOT NULL, sp INTEGER NOT NULL DEFAULT 0, upd INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (sid, uid))').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_season ON season(sid, sp DESC)').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS season_prize (sid INTEGER NOT NULL, uid TEXT NOT NULL, ts INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (sid, uid))').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS promos (code TEXT PRIMARY KEY, kind TEXT NOT NULL, val TEXT NOT NULL DEFAULT \'\', n INTEGER NOT NULL DEFAULT 1, max INTEGER NOT NULL DEFAULT 0, exp INTEGER NOT NULL DEFAULT 0, uses INTEGER NOT NULL DEFAULT 0, ts INTEGER NOT NULL DEFAULT 0)').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS promo_use (code TEXT NOT NULL, uid TEXT NOT NULL, ts INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (code, uid))').run();
  await db.prepare("INSERT OR IGNORE INTO promos(code,kind,val,n,max,exp,uses,ts) VALUES('NAMEROULETTE','case','star',1,0,0,0,0)").run();
  await db.prepare('CREATE TABLE IF NOT EXISTS shop (item TEXT PRIMARY KEY, uid TEXT NOT NULL, ts INTEGER NOT NULL DEFAULT 0)').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS ntf (uid TEXT PRIMARY KEY, mask INTEGER NOT NULL DEFAULT 0, wheel_at INTEGER NOT NULL DEFAULT 0, en_full INTEGER NOT NULL DEFAULT 0, tz INTEGER NOT NULL DEFAULT 0, seen INTEGER NOT NULL DEFAULT 0, nw INTEGER NOT NULL DEFAULT 0, ne INTEGER NOT NULL DEFAULT 0, nl INTEGER NOT NULL DEFAULT 0, nlast INTEGER NOT NULL DEFAULT 0, bad INTEGER NOT NULL DEFAULT 0, tst INTEGER NOT NULL DEFAULT 0)').run();
  try {
    const nh = (await db.prepare('PRAGMA table_info(ntf)').all()).results.map((r) => r.name);
    if (nh.length && !nh.includes('nev')) await db.prepare("ALTER TABLE ntf ADD COLUMN nev TEXT NOT NULL DEFAULT ''").run();
  } catch (e) {}
  migrated = true;
}
const enc = new TextEncoder();

async function hmac(key, data) {
  const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(data)));
}
const hex = (b) => [...b].map((x) => x.toString(16).padStart(2, '0')).join('');

// username из подписанных данных Telegram (подделать нельзя), только допустимые символы
function tgUn(initData) {
  try { const u = JSON.parse(new URLSearchParams(initData).get('user')); const n = u && u.username; return /^[A-Za-z][A-Za-z0-9_]{3,31}$/.test(n || '') ? n : ''; } catch { return ''; }
}

// Проверка подписи Telegram: initData нельзя подделать без токена бота.
async function auth(initData, token) {
  if (!initData || !token) return null;
  const p = new URLSearchParams(initData), hash = p.get('hash');
  if (!hash) return null;
  p.delete('hash');
  const str = [...p.entries()].map(([k, v]) => `${k}=${v}`).sort().join('\n');
  const secret = await hmac(enc.encode('WebAppData'), token);
  const calc = hex(await hmac(secret, str));
  if (calc.length !== hash.length) return null;
  let diff = 0; for (let i = 0; i < calc.length; i++) diff |= calc.charCodeAt(i) ^ hash.charCodeAt(i);
  if (diff) return null;
  if (Date.now() / 1000 - Number(p.get('auth_date') || 0) > MAX_AGE_S) return null;
  try { const u = JSON.parse(p.get('user')); return u && u.id ? String(u.id) : null; } catch { return null; }
}

const clean = (s, n) => String(s ?? '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, n);
const int = (v, max) => { v = Math.round(Number(v)); return Number.isFinite(v) && v >= 0 ? Math.min(v, max) : null; };

// ---- уведомления от бота ----
// Биты mask: 1 аукцион, 2 рынок, 4 бесплатное колесо, 8 полная энергия, 16 «давно не заходил».
// Бот может написать только тому, кто разрешил это в игре (requestWriteAccess) или нажимал «Старт».
const NT = { AUC: 1, MKT: 2, WHEEL: 4, EN: 8, AWAY: 16 };
const nf = (n) => Math.floor(Number(n) || 0).toLocaleString('ru-RU');
let CTX = null;
const bg = (p) => { try { if (CTX) CTX.waitUntil(p); } catch (e) {} return p; };
async function tgSend(env, uid, text) {
  if (!env.BOT_TOKEN) return false;
  try {
    const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: uid, text, reply_markup: { inline_keyboard: [[{ text: '🎮 Открыть игру', url: env.APP_LINK || 'https://t.me/NumberRollyBot' }]] } }),
    });
    if (r.status === 403 || r.status === 400) {   // бот заблокирован или чат не начат: больше не пишем, пока игрок сам не включит заново
      await env.DB.prepare('UPDATE ntf SET mask=0, bad=? WHERE uid=?').bind(Date.now(), uid).run();
      return false;
    }
    return r.ok;
  } catch (e) { return false; }
}
async function notifyEvent(env, uid, bit, text) {
  try {
    if (!uid) return;
    const r = await env.DB.prepare('SELECT mask FROM ntf WHERE uid=?').bind(String(uid)).first();
    if (r && (r.mask & bit)) await tgSend(env, String(uid), text);
  } catch (e) {}
}
// раз в 5 минут (Cron Trigger): завершает аукционы и шлёт напоминания. Не больше одного напоминания игроку за 12 часов, ночью (22–10 по его времени) не пишем
async function cron(env) {
  await migrate(env.DB);
  const db = env.DB, now = Date.now(), LIM = 8, DAY = 86400000;
  await auSettle(db, env);
  const quiet = (r) => { const h = new Date(now + r.tz * 60000).getUTCHours(); return h < 10 || h >= 22; };
  const sendTo = async (r, text, col, val) => {
    if (quiet(r)) return;
    await db.prepare(`UPDATE ntf SET ${col}=?, nlast=? WHERE uid=?`).bind(val, now, r.uid).run();
    await tgSend(env, r.uid, text);
  };
  for (const r of (await db.prepare('SELECT * FROM ntf WHERE (mask & 4) AND wheel_at<=?1 AND nw<?2 AND seen>?3 AND nlast<?4 LIMIT ?5').bind(now, now - 20 * 3600000, now - 3 * DAY, now - 4 * 3600000, LIM).all()).results)
    await sendTo(r, '🎡 Бесплатное колесо готово: загляни и забери приз дня.', 'nw', now);
  for (const r of (await db.prepare('SELECT * FROM ntf WHERE (mask & 8) AND en_full>0 AND en_full<=?1 AND ne<en_full AND seen>?2 AND nlast<?3 LIMIT ?4').bind(now, now - 7 * DAY, now - 4 * 3600000, LIM).all()).results)
    await sendTo(r, '⚡ Энергия полная: можно крутить рулетку бесплатно.', 'ne', now);
  for (const r of (await db.prepare('SELECT * FROM ntf WHERE (mask & 16) AND seen>0 AND seen<?1 AND seen>?2 AND nl<seen AND nlast<?3 LIMIT ?4').bind(now - 3 * DAY, now - 30 * DAY, now - 4 * 3600000, LIM).all()).results)
    await sendTo(r, '👋 Давно не виделись! Тебя ждут бесплатное колесо и накопленная энергия.', 'nl', now);
  // события и новый сезон: одно сообщение на событие каждому, у кого включён бит 32
  const ev = evNow(now), sid = seasonId(now), sStart = EV_ANCHOR + sid * SEASON_MS;
  const key = ev ? 'e' + ev.d : (now - sStart < 36 * 3600000 ? 's' + sid : '');
  if (key) {
    for (const r of (await db.prepare("SELECT * FROM ntf WHERE (mask & 32) AND nev<>?1 AND seen>?2 LIMIT 30").bind(key, now - 14 * DAY).all()).results) {
      if (quiet(r)) continue;
      let text;
      if (ev) {
        const t = new Date(ev.end + r.tz * 60000), hm = String(t.getUTCHours()).padStart(2, '0') + ':' + String(t.getUTCMinutes()).padStart(2, '0');
        text = `🎉 Событие часа: ×${String(ev.m).replace('.', ',')} ${EVK[ev.kind]}! Действует до ${hm}.`;
      } else text = `🏅 Начался сезон ${sid + 1}: «${SZ_NAMES[((sid % 6) + 6) % 6]}». Новая дорожка наград и рейтинг ждут!${sid > 0 ? ' Не забудь забрать приз за прошлый сезон.' : ''}`;
      await db.prepare('UPDATE ntf SET nev=?, nlast=? WHERE uid=?').bind(key, now, r.uid).run();
      await tgSend(env, r.uid, text);
    }
  }
}

export default {
  async scheduled(ev, env, ctx) { CTX = ctx; ctx.waitUntil(cron(env).catch(() => {})); },
  async fetch(req, env, ctx) {
    CTX = ctx || null;
    try { return await handle(req, env); }
    catch (e) {
      return new Response(JSON.stringify({ error: 'server', detail: String(e && e.message || e) }), { status: 500, headers: { 'Access-Control-Allow-Origin': (env && env.ALLOWED_ORIGIN) || '*', 'Content-Type': 'application/json' } });
    }
  },
};

async function handle(req, env) {
  {
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Headers': 'Content-Type, X-Init-Data, X-Admin-Key',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };
    const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    const url = new URL(req.url);
    // ---- админка: выдача монет по ID (пароль ADMIN_KEY или Telegram-владелец) ----
    if (url.pathname.startsWith('/admin/')) {
      const key = req.headers.get('X-Admin-Key') || '';
      let ok = !!(env.ADMIN_KEY && key && key === env.ADMIN_KEY);
      if (!ok) { const au = await auth(req.headers.get('X-Init-Data'), env.BOT_TOKEN); ok = !!(au && isAdmin(au, env)); }
      if (!ok) return json({ error: 'auth' }, 401);
      await migrate(env.DB);
      const find = async (id) => (await env.DB.prepare('SELECT uid,name,net,lvl FROM players WHERE uid=?1 OR (CAST(uid AS INTEGER) % 999999) + 1 = CAST(?1 AS INTEGER) LIMIT 5').bind(id).all()).results;
      if (url.pathname === '/admin/find' && req.method === 'GET') {
        const id = (url.searchParams.get('id') || '').replace(/\D/g, '');
        if (!id) return json({ error: 'id' }, 400);
        return json({ players: await find(id) });
      }
      if (url.pathname === '/admin/grant' && req.method === 'POST') {
        let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
        const id = String(b.id || '').replace(/\D/g, ''), amount = Math.trunc(Number(b.amount));
        if (!id || !Number.isFinite(amount) || amount === 0 || Math.abs(amount) > 1e12) return json({ error: 'bad' }, 400);
        let rows = await find(id);
        if (b.uid) rows = rows.filter((r) => r.uid === String(b.uid));
        if (!rows.length) return json({ error: 'nouser' }, 404);
        if (rows.length > 1) return json({ error: 'many', players: rows }, 409);
        await env.DB.prepare('INSERT INTO grants(uid,amount,claimed,ts) VALUES(?,?,0,?)').bind(rows[0].uid, amount, Date.now()).run();
        return json({ ok: true, name: rows[0].name, uid: rows[0].uid, amount });
      }
      if (url.pathname === '/admin/promo' && req.method === 'POST') {   // создать/обновить промокод: {code, kind:'case'|'coins', val:'star'|'', n, coins, max, days}
        let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
        const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24);
        const kind = b.kind === 'coins' ? 'coins' : 'case';
        const n = kind === 'coins' ? Math.max(1, Math.min(1e9, Math.trunc(Number(b.coins) || 0))) : Math.max(1, Math.min(50, Math.trunc(Number(b.n) || 1)));
        const val = kind === 'case' ? String(b.val || 'star').slice(0, 16) : '';
        const max = Math.max(0, Math.min(1e7, Math.trunc(Number(b.max) || 0))), days = Number(b.days) || 0;
        if (!code || (kind === 'coins' && !(n > 0))) return json({ error: 'bad' }, 400);
        const exp = days > 0 ? Date.now() + days * 864e5 : 0;
        await env.DB.prepare('INSERT INTO promos(code,kind,val,n,max,exp,uses,ts) VALUES(?1,?2,?3,?4,?5,?6,0,?7) ON CONFLICT(code) DO UPDATE SET kind=?2,val=?3,n=?4,max=?5,exp=?6').bind(code, kind, val, n, max, exp, Date.now()).run();
        return json({ ok: true, code, kind, val, n, max, exp });
      }
      if (url.pathname === '/admin/promo' && req.method === 'GET') {
        return json({ promos: (await env.DB.prepare('SELECT code,kind,val,n,max,exp,uses FROM promos ORDER BY ts DESC LIMIT 50').all()).results });
      }
      if (url.pathname === '/admin/promo/delete' && req.method === 'POST') {
        let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
        const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
        await env.DB.prepare('DELETE FROM promos WHERE code=?').bind(code).run();
        return json({ ok: true });
      }
      if (url.pathname === '/admin/log' && req.method === 'GET') {
        const r = (await env.DB.prepare('SELECT g.id,g.amount,g.claimed,g.ts,p.name FROM grants g LEFT JOIN players p ON p.uid=g.uid ORDER BY g.id DESC LIMIT 20').all()).results;
        return json({ log: r });
      }
      return json({ error: 'not found' }, 404);
    }
    const uid = await auth(req.headers.get('X-Init-Data'), env.BOT_TOKEN);
    if (!uid) return json({ error: 'auth' }, 401);
    await migrate(env.DB);
    if (req.method === 'POST' && url.pathname !== '/sync' && !url.pathname.startsWith('/ref') && !isAdmin(uid, env)) {
      const f = await env.DB.prepare('SELECT flag FROM players WHERE uid=?').bind(uid).first();
      if (f && f.flag) return json({ error: 'flag' }, 403);
    }

    if (url.pathname === '/promo/redeem' && req.method === 'POST') {
      let b; try { b = await req.json(); } catch { b = {}; }
      const code = String(b.code || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24), now = Date.now();
      const p = code && await env.DB.prepare('SELECT * FROM promos WHERE code=?').bind(code).first();
      if (!p) return json({ ok: false, err: 'none' });
      if (p.exp && now > p.exp) return json({ ok: false, err: 'expired' });
      if (p.max && p.uses >= p.max) return json({ ok: false, err: 'full' });
      const ins = await env.DB.prepare('INSERT OR IGNORE INTO promo_use(code,uid,ts) VALUES(?,?,?)').bind(code, uid, now).run();
      if (!ins.meta.changes) return json({ ok: false, err: 'used' });
      const up = await env.DB.prepare('UPDATE promos SET uses=uses+1 WHERE code=?1 AND (max=0 OR uses<max)').bind(code).run();
      if (!up.meta.changes) { await env.DB.prepare('DELETE FROM promo_use WHERE code=? AND uid=?').bind(code, uid).run(); return json({ ok: false, err: 'full' }); }
      if (p.kind === 'coins') await env.DB.prepare('UPDATE players SET allow = allow + ? WHERE uid=?').bind(p.n, uid).run();
      return json({ ok: true, code, kind: p.kind, val: p.val, n: p.n, left: p.max ? Math.max(0, p.max - p.uses - 1) : -1 });
    }
    if (url.pathname === '/notify/set' && req.method === 'POST') {
      let b; try { b = await req.json(); } catch { b = {}; }
      const now = Date.now(), mask = int(b.mask, 63) || 0, wa = int(b.wheelAt, 4e12) || 0, ef = int(b.enFull, 4e12) || 0;
      const tz = Math.max(-840, Math.min(840, Math.round(Number(b.tz) || 0)));
      const old = await env.DB.prepare('SELECT mask,bad FROM ntf WHERE uid=?').bind(uid).first();
      const blocked = !!(old && old.bad && !b.fresh && mask && now - old.bad < 7 * 86400000);
      const m = blocked ? 0 : mask;
      await env.DB.prepare(`INSERT INTO ntf(uid,mask,wheel_at,en_full,tz,seen,bad) VALUES(?1,?2,?3,?4,?5,?6,0)
        ON CONFLICT(uid) DO UPDATE SET mask=?2,wheel_at=?3,en_full=?4,tz=?5,seen=?6,bad=CASE WHEN ?7 THEN 0 ELSE bad END`).bind(uid, m, wa, ef, tz, now, b.fresh ? 1 : 0).run();
      return json({ ok: true, blocked: blocked ? 1 : 0 });
    }
    if (url.pathname === '/notify/test' && req.method === 'POST') {
      const now = Date.now();
      await env.DB.prepare('INSERT OR IGNORE INTO ntf(uid) VALUES(?)').bind(uid).run();
      const r = await env.DB.prepare('UPDATE ntf SET tst=? WHERE uid=? AND tst<?').bind(now, uid, now - 30000).run();
      if (!r.meta.changes) return json({ error: 'wait' }, 429);
      const ok = await tgSend(env, uid, '✅ Уведомления работают. Сюда будут приходить новости аукциона, рынка и напоминания.');
      if (ok) await env.DB.prepare('UPDATE ntf SET bad=0 WHERE uid=?').bind(uid).run();
      return json({ ok });
    }

    if (url.pathname === '/sync' && req.method === 'POST') {
      let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
      const net = int(b.net, MAX_NET), best = int(b.best, MAX_BEST), lvl = int(b.lvl, MAX_LVL);
      if (net === null || best === null || lvl === null) return json({ error: 'bad' }, 400);
      const now = Date.now();
      const old = await env.DB.prepare('SELECT net,best,upd,flag,allow FROM players WHERE uid=?').bind(uid).first();
      if (old && now - old.upd < MIN_GAP_MS) return json({ error: 'wait' }, 429);
      const cos = String(b.cos || '').match(/^[a-z0-9_]{0,16}\|[a-z0-9_]{0,16}(\|[a-z0-9_]{0,16})?(\|[a-z,]{0,60})?$/) ? String(b.cos) : '';
      if (!isAdmin(uid, env)) {
        const el = old ? Math.min(MAX_ELAPSED_S, Math.max(0, (now - old.upd) / 1000)) : 0;
        const limit = old ? old.net + BURST + RATE * el + (old.allow || 0) : FIRST_NET;
        if (net > limit) {
          if (old) await env.DB.prepare('UPDATE players SET flag=1, upd=? WHERE uid=?').bind(now, uid).run();
          else await env.DB.prepare('INSERT INTO players(uid,name,net,best,bestn,lvl,hide,upd,flag,cos) VALUES(?,?,?,?,?,?,?,?,1,?)').bind(uid, clean(b.name, 24) || 'Игрок', 0, 0, '', 1, 1, now, cos).run();
          return json({ ok: false, error: 'cheat' });
        }
      }
      await env.DB.prepare(
        `INSERT INTO players(uid,name,net,best,bestn,lvl,hide,upd,flag,cos,allow) VALUES(?,?,?,?,?,?,?,?,0,?,0)
         ON CONFLICT(uid) DO UPDATE SET name=excluded.name,net=excluded.net,best=excluded.best,bestn=excluded.bestn,lvl=excluded.lvl,hide=excluded.hide,upd=excluded.upd,flag=0,cos=excluded.cos,allow=0`
      ).bind(uid, clean(b.name, 24) || 'Игрок', net, best, clean(b.bestn, 32), lvl, b.hide ? 1 : 0, now, cos).run();
      try { await env.DB.prepare('UPDATE players SET un=? WHERE uid=?').bind(tgUn(req.headers.get('X-Init-Data')), uid).run(); } catch {}
      return json({ ok: true });
    }

    // ---- сезон: очки, рейтинг, призы ----
    if (url.pathname === '/season/sync' && req.method === 'POST') {
      let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
      const now = Date.now(), sid = seasonId(now);
      if (Math.floor(Number(b.sid)) !== sid) return json({ ok: false, error: 'season' });
      let sp = int(b.sp, 12000); if (sp === null) return json({ error: 'bad' }, 400);
      const me = await env.DB.prepare('SELECT 1 AS x FROM players WHERE uid=?').bind(uid).first();
      if (!me) return json({ ok: false, error: 'sync' });
      const old = await env.DB.prepare('SELECT sp,upd FROM season WHERE sid=? AND uid=?').bind(sid, uid).first();
      const el = old ? Math.min(86400, Math.max(0, (now - old.upd) / 1000)) : 0;
      const lim = old ? old.sp + 500 + 2 * el : 3000;
      sp = Math.max(old ? old.sp : 0, Math.min(sp, Math.floor(lim)));
      await env.DB.prepare('INSERT INTO season(sid,uid,sp,upd) VALUES(?1,?2,?3,?4) ON CONFLICT(sid,uid) DO UPDATE SET sp=?3, upd=?4').bind(sid, uid, sp, now).run();
      return json({ ok: true, sp });
    }
    if (url.pathname === '/season/top' && req.method === 'GET') {
      const sid = seasonId(Date.now());
      const rows = (await env.DB.prepare('SELECT s.uid,s.sp,p.name,p.hide FROM season s JOIN players p ON p.uid=s.uid WHERE s.sid=? AND p.flag=0 AND s.sp>0 ORDER BY s.sp DESC, s.upd ASC LIMIT 25').bind(sid).all()).results;
      const mine = await env.DB.prepare('SELECT s.sp,s.upd FROM season s JOIN players p ON p.uid=s.uid WHERE s.sid=? AND s.uid=? AND p.flag=0').bind(sid, uid).first();
      let me = null;
      if (mine && mine.sp > 0) {
        const c = await env.DB.prepare('SELECT COUNT(*) AS n FROM season s JOIN players p ON p.uid=s.uid WHERE s.sid=?1 AND p.flag=0 AND (s.sp>?2 OR (s.sp=?2 AND s.upd<?3))').bind(sid, mine.sp, mine.upd).first();
        me = { rank: c.n + 1, sp: mine.sp };
      }
      return json({ sid, top: rows.map((r) => ({ name: r.hide ? 'Игрок' : r.name, sp: r.sp, me: r.uid === uid })), me });
    }
    if ((url.pathname === '/season/prize' && req.method === 'GET') || (url.pathname === '/season/prize/claim' && req.method === 'POST')) {
      const cur = seasonId(Date.now()), claim = url.pathname.endsWith('/claim');
      for (let sid = cur - 1; sid >= Math.max(0, cur - 2); sid--) {
        const done = await env.DB.prepare('SELECT 1 AS x FROM season_prize WHERE sid=? AND uid=?').bind(sid, uid).first();
        if (done) continue;
        const mine = await env.DB.prepare('SELECT s.sp,s.upd FROM season s JOIN players p ON p.uid=s.uid WHERE s.sid=? AND s.uid=? AND p.flag=0').bind(sid, uid).first();
        if (!mine || mine.sp < 300) continue;
        const c = await env.DB.prepare('SELECT COUNT(*) AS n FROM season s JOIN players p ON p.uid=s.uid WHERE s.sid=?1 AND p.flag=0 AND (s.sp>?2 OR (s.sp=?2 AND s.upd<?3))').bind(sid, mine.sp, mine.upd).first();
        const rank = c.n + 1, sum = SZ_PRIZE(rank);
        if (!sum) continue;
        if (!claim) return json({ sid, rank, sum });
        const ins = await env.DB.prepare('INSERT OR IGNORE INTO season_prize(sid,uid,ts) VALUES(?,?,?)').bind(sid, uid, Date.now()).run();
        if (!ins.meta.changes) return json({ sid, rank, sum: 0 });
        await env.DB.prepare('UPDATE players SET allow = allow + ? WHERE uid=?').bind(sum, uid).run();
        return json({ sid, rank, sum });
      }
      return json({ sum: 0 });
    }

    if (url.pathname === '/top' && req.method === 'GET') {
      const col = url.searchParams.get('by') === 'best' ? 'best' : 'net';
      const rows = (await env.DB.prepare(`SELECT p.uid,p.name,p.${col} AS v,p.bestn,p.lvl,p.cos,(SELECT c.tag FROM members m JOIN clans c ON c.id=m.clan WHERE m.uid=p.uid) AS tag FROM players p WHERE p.hide=0 AND p.flag=0 AND p.${col}>0 ORDER BY p.${col} DESC, p.upd ASC LIMIT 50`).all()).results;
      const mine = await env.DB.prepare(`SELECT ${col} AS v, hide, flag FROM players WHERE uid=?`).bind(uid).first();
      let me = null;
      if (mine && !mine.hide && !mine.flag) {
        const c = await env.DB.prepare(`SELECT COUNT(*) AS n FROM players WHERE hide=0 AND flag=0 AND ${col}>?`).bind(mine.v).first();
        me = { rank: c.n + 1, v: mine.v };
      }
      return json({ top: rows.map((r) => ({ name: r.name, v: r.v, bestn: r.bestn, lvl: r.lvl, cos: r.cos || '', tag: r.tag || '', me: r.uid === uid })), me });
    }
    // ---- профиль другого игрока: по месту в таблице (uid наружу не отдаём) ----
    if (url.pathname === '/player' && req.method === 'GET') {
      const col = url.searchParams.get('by') === 'best' ? 'best' : 'net';
      const i = Math.floor(Number(url.searchParams.get('i')));
      if (!(i >= 0 && i < 50)) return json({ error: 'bad' }, 400);
      const r = await env.DB.prepare(`SELECT p.uid,p.name,p.un,p.net,p.best,p.bestn,p.lvl,p.cos,(SELECT c.tag FROM members m JOIN clans c ON c.id=m.clan WHERE m.uid=p.uid) AS tag,(SELECT c.name FROM members m JOIN clans c ON c.id=m.clan WHERE m.uid=p.uid) AS cname FROM players p WHERE p.hide=0 AND p.flag=0 AND p.${col}>0 ORDER BY p.${col} DESC, p.upd ASC LIMIT 1 OFFSET ?`).bind(i).first();
      if (!r) return json({ error: 'none' }, 404);
      return json({ rank: i + 1, name: r.name, net: r.net, best: r.best, bestn: r.bestn, lvl: r.lvl, cos: r.cos || '', tag: r.tag || '', cname: r.cname || '', un: r.un || '', me: r.uid === uid });
    }
    // ---- LIVE-лента: крупные выпадения игроков ----
    if (url.pathname === '/feed' && req.method === 'GET') {
      const rows = (await env.DB.prepare('SELECT f.name,f.tier,f.ts,p.name AS who,p.hide FROM feed f LEFT JOIN players p ON p.uid=f.uid WHERE f.ts>? ORDER BY f.id DESC LIMIT 14').bind(Date.now() - 86400000).all()).results;
      return json({ items: rows.map((r) => ({ name: r.name, tier: r.tier, ts: r.ts, who: r.hide ? 'Игрок' : (r.who || 'Игрок') })) });
    }
    if (url.pathname === '/feed' && req.method === 'POST') {
      let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
      const name = String(b.name || ''), tier = Math.floor(Number(b.tier));
      if (!/^[\p{L}\p{N}_]{1,32}$/u.test(name) || !(tier >= 3 && tier <= 7)) return json({ ok: false });
      const me = await env.DB.prepare('SELECT 1 AS x FROM players WHERE uid=?').bind(uid).first();
      if (!me) return json({ ok: false });
      const last = await env.DB.prepare('SELECT ts FROM feed WHERE uid=? ORDER BY id DESC LIMIT 1').bind(uid).first();
      if (last && Date.now() - last.ts < 15000) return json({ ok: false });
      await env.DB.prepare('INSERT INTO feed(uid,name,tier,ts) VALUES(?,?,?,?)').bind(uid, name, tier, Date.now()).run();
      if (Math.random() < 0.05) await env.DB.prepare('DELETE FROM feed WHERE ts<?').bind(Date.now() - 2 * 86400000).run();
      return json({ ok: true });
    }
    // ---- подарки от админа: игрок забирает сам ----
    if (url.pathname === '/grants/claim' && req.method === 'POST') {
      const rows = (await env.DB.prepare('SELECT id,amount FROM grants WHERE uid=? AND claimed=0 LIMIT 50').bind(uid).all()).results;
      let sum = 0;
      for (const r of rows) {
        const u = await env.DB.prepare('UPDATE grants SET claimed=1 WHERE id=? AND claimed=0').bind(r.id).run();
        if (u.meta.changes) sum += r.amount;
      }
      if (sum > 0) await env.DB.prepare('UPDATE players SET allow = allow + ? WHERE uid=?').bind(sum, uid).run();
      return json({ sum });
    }
    // ---- друзья ----
    const REF_MAX = 20;
    if (url.pathname === '/ref' && req.method === 'POST') {
      let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
      const inviter = String(b.inviter || '');
      if (!/^\d{1,15}$/.test(inviter) || inviter === uid) return json({ ok: false });
      // награда только новичку: его ещё не должно быть в таблице игроков и среди приглашённых
      const seen = await env.DB.prepare('SELECT 1 AS x FROM players WHERE uid=? UNION SELECT 1 FROM refs WHERE invitee=?').bind(uid, uid).first();
      if (seen) return json({ ok: false });
      const cnt = await env.DB.prepare('SELECT COUNT(*) AS n FROM refs WHERE inviter=?').bind(inviter).first();
      if (cnt.n >= REF_MAX) return json({ ok: false });
      await env.DB.prepare('INSERT OR IGNORE INTO refs(invitee,inviter,claimed,ts) VALUES(?,?,0,?)').bind(uid, inviter, Date.now()).run();
      return json({ ok: true });
    }
    if (url.pathname === '/refs' && req.method === 'GET') {
      const r = await env.DB.prepare('SELECT COUNT(*) AS n FROM refs WHERE inviter=? AND claimed=0').bind(uid).first();
      return json({ n: r.n });
    }
    if (url.pathname === '/ref/claim' && req.method === 'POST') {
      const done = await env.DB.prepare('SELECT COUNT(*) AS n FROM refs WHERE inviter=? AND claimed=1').bind(uid).first();
      const left = Math.max(0, REF_MAX - done.n);
      const open = await env.DB.prepare('SELECT COUNT(*) AS n FROM refs WHERE inviter=? AND claimed=0').bind(uid).first();
      const n = Math.min(left, open.n);
      if (n > 0) await env.DB.prepare('UPDATE refs SET claimed=1 WHERE invitee IN (SELECT invitee FROM refs WHERE inviter=? AND claimed=0 LIMIT ?)').bind(uid, n).run();
      return json({ n });
    }
    const cr = await clanRoutes(url, req, env, uid, json);
    if (cr) return cr;
    const mr = await marketRoutes(url, req, env, uid, json);
    if (mr) return mr;
    const au = await auctionRoutes(url, req, env, uid, json);
    if (au) return au;
    const mu = await museumRoutes(url, req, env, uid, json);
    if (mu) return mu;
    return json({ error: 'not found' }, 404);
  }
}

// ======================= КЛАНЫ =======================
const CLAN_COST = 3_000_000;      // нужный капитал для создания (клиент списывает столько же монет)
const LVL_STEP = 3_000_000;       // очков клана на один уровень клана
const clanLvl = (pts) => Math.min(20, 1 + Math.floor(pts / LVL_STEP));
const clanCap = (lvl) => Math.min(48, 10 + 2 * (lvl - 1));
const TAG_RE = /^[A-Za-z0-9_]{2,5}$/;
const LINK_RE = /^https:\/\/t\.me\/[A-Za-z0-9_\/+\-]{2,64}$/;
const like = (q) => '%' + q.replace(/[\\%_]/g, (c) => '\\' + c) + '%';

const CLAN_SQL = `SELECT c.id,c.tag,c.name,c.descr,c.link,c.joinmode,c.minlvl,c.owner,
  (SELECT COUNT(*) FROM members m WHERE m.clan=c.id) AS n,
  (SELECT COALESCE(SUM(p.net),0) FROM members m JOIN players p ON p.uid=m.uid WHERE m.clan=c.id) AS pts FROM clans c`;
function shape(r) {
  const lvl = clanLvl(r.pts);
  return { id: r.id, tag: r.tag, name: r.name, descr: r.descr, link: r.link, join: r.joinmode, minlvl: r.minlvl, n: r.n, cap: clanCap(lvl), lvl, pts: r.pts };
}
function readClanForm(b) {
  const tag = String(b.tag || '').trim().toUpperCase();
  const name = clean(b.name, 20), descr = clean(b.descr, 90), link = String(b.link || '').trim();
  const joinmode = b.join ? 1 : 0, minlvl = Math.max(1, Math.min(100, Math.round(Number(b.minlvl)) || 1));
  return { tag, name, descr, link: LINK_RE.test(link) ? link : '', joinmode, minlvl };
}

async function clanRoutes(url, req, env, uid, json) {
  const p = url.pathname;
  if (!p.startsWith('/clan')) return null;
  const db = env.DB;
  const body = async () => { try { return await req.json(); } catch { return {}; } };
  const mine = () => db.prepare('SELECT clan FROM members WHERE uid=?').bind(uid).first();
  const player = () => db.prepare('SELECT net,lvl FROM players WHERE uid=?').bind(uid).first();

  if (p === '/clans' && req.method === 'GET') {
    const q = clean(url.searchParams.get('q') || '', 30);
    const rows = (q
      ? await db.prepare(CLAN_SQL + " WHERE c.tag LIKE ?1 ESCAPE '\\' OR c.name LIKE ?1 ESCAPE '\\' ORDER BY pts DESC, c.id ASC LIMIT 30").bind(like(q)).all()
      : await db.prepare(CLAN_SQL + ' ORDER BY pts DESC, c.id ASC LIMIT 30').all()).results;
    const reqs = (await db.prepare('SELECT clan FROM requests WHERE uid=?').bind(uid).all()).results.map((r) => r.clan);
    const my = await mine();
    return json({ clans: rows.map((r) => ({ ...shape(r), req: reqs.includes(r.id) ? 1 : 0 })), my: my ? my.clan : 0 });
  }

  if (p === '/clan/me' && req.method === 'GET') {
    const m = await mine();
    if (!m) return json({ clan: null });
    const c = await db.prepare(CLAN_SQL + ' WHERE c.id=?').bind(m.clan).first();
    if (!c) return json({ clan: null });
    const mem = (await db.prepare(`SELECT m.uid,m.joined,p.name,p.net,p.lvl,p.hide FROM members m LEFT JOIN players p ON p.uid=m.uid WHERE m.clan=? ORDER BY p.net DESC`).bind(m.clan).all()).results;
    const leader = c.owner === uid;
    const reqs = leader ? (await db.prepare(`SELECT r.uid,p.name,p.lvl,p.net FROM requests r LEFT JOIN players p ON p.uid=r.uid WHERE r.clan=? ORDER BY r.ts ASC LIMIT 30`).bind(m.clan).all()).results : [];
    return json({
      clan: shape(c), leader,
      members: mem.map((x) => ({ uid: x.uid, name: x.hide ? 'Скрытый игрок' : (x.name || 'Игрок'), lvl: x.lvl || 1, pts: x.net || 0, owner: x.uid === c.owner ? 1 : 0, me: x.uid === uid ? 1 : 0 })),
      requests: reqs.map((x) => ({ uid: x.uid, name: x.name || 'Игрок', lvl: x.lvl || 1, pts: x.net || 0 })),
    });
  }

  if (req.method !== 'POST') return json({ error: 'not found' }, 404);
  const b = await body();

  if (p === '/clan/create') {
    const pl = await player();
    if (!pl) return json({ error: 'sync' }, 400);
    if (await mine()) return json({ error: 'inclan' }, 400);
    if (pl.net < CLAN_COST) return json({ error: 'nofunds' }, 400);
    const f = readClanForm(b);
    if (!TAG_RE.test(f.tag)) return json({ error: 'tag' }, 400);
    if (f.name.length < 3) return json({ error: 'name' }, 400);
    try {
      const r = await db.prepare('INSERT INTO clans(tag,name,descr,link,joinmode,minlvl,owner,created) VALUES(?,?,?,?,?,?,?,?)').bind(f.tag, f.name, f.descr, f.link, f.joinmode, f.minlvl, uid, Date.now()).run();
      const id = r.meta.last_row_id;
      await db.prepare('INSERT INTO members(uid,clan,joined) VALUES(?,?,?)').bind(uid, id, Date.now()).run();
      await db.prepare('DELETE FROM requests WHERE uid=?').bind(uid).run();
      return json({ ok: true, id });
    } catch (e) { return json({ error: 'exists' }, 409); }
  }

  if (p === '/clan/join') {
    const pl = await player();
    if (!pl) return json({ error: 'sync' }, 400);
    if (await mine()) return json({ error: 'inclan' }, 400);
    const c = await db.prepare(CLAN_SQL + ' WHERE c.id=?').bind(Number(b.id) || 0).first();
    if (!c) return json({ error: 'notfound' }, 404);
    const s = shape(c);
    if (pl.lvl < c.minlvl) return json({ error: 'lvl' }, 400);
    if (c.joinmode === 0) {
      if (s.n >= s.cap) return json({ error: 'full' }, 400);
      await db.prepare('INSERT OR IGNORE INTO members(uid,clan,joined) VALUES(?,?,?)').bind(uid, c.id, Date.now()).run();
      await db.prepare('DELETE FROM requests WHERE uid=?').bind(uid).run();
      return json({ ok: true, joined: 1 });
    }
    const cnt = await db.prepare('SELECT COUNT(*) AS n FROM requests WHERE uid=?').bind(uid).first();
    if (cnt.n >= 5) return json({ error: 'manyreq' }, 400);
    await db.prepare('INSERT OR IGNORE INTO requests(uid,clan,ts) VALUES(?,?,?)').bind(uid, c.id, Date.now()).run();
    return json({ ok: true, joined: 0 });
  }

  if (p === '/clan/cancel') {
    await db.prepare('DELETE FROM requests WHERE uid=? AND clan=?').bind(uid, Number(b.id) || 0).run();
    return json({ ok: true });
  }

  if (p === '/clan/leave') {
    const m = await mine();
    if (!m) return json({ ok: true });
    const c = await db.prepare('SELECT owner FROM clans WHERE id=?').bind(m.clan).first();
    await db.prepare('DELETE FROM members WHERE uid=?').bind(uid).run();
    if (c && c.owner === uid) {   // лидер ушёл: клан переходит самому богатому участнику, а пустой клан удаляется
      const next = await db.prepare('SELECT m.uid FROM members m LEFT JOIN players p ON p.uid=m.uid WHERE m.clan=? ORDER BY p.net DESC LIMIT 1').bind(m.clan).first();
      if (next) await db.prepare('UPDATE clans SET owner=? WHERE id=?').bind(next.uid, m.clan).run();
      else { await db.prepare('DELETE FROM clans WHERE id=?').bind(m.clan).run(); await db.prepare('DELETE FROM requests WHERE clan=?').bind(m.clan).run(); }
    }
    return json({ ok: true });
  }

  // дальше — только для лидера
  const m = await mine();
  const c = m ? await db.prepare(CLAN_SQL + ' WHERE c.id=?').bind(m.clan).first() : null;
  if (!c || c.owner !== uid) return json({ error: 'leader' }, 403);

  if (p === '/clan/edit') {
    const f = readClanForm({ ...b, tag: c.tag, name: c.name });
    await db.prepare('UPDATE clans SET descr=?,link=?,joinmode=?,minlvl=? WHERE id=?').bind(f.descr, f.link, f.joinmode, f.minlvl, c.id).run();
    return json({ ok: true });
  }
  if (p === '/clan/accept') {
    const target = String(b.uid || '');
    const r = await db.prepare('SELECT 1 AS x FROM requests WHERE uid=? AND clan=?').bind(target, c.id).first();
    if (!r) return json({ error: 'notfound' }, 404);
    if (b.ok) {
      const s = shape(c);
      if (s.n >= s.cap) return json({ error: 'full' }, 400);
      const other = await db.prepare('SELECT 1 AS x FROM members WHERE uid=?').bind(target).first();
      if (!other) await db.prepare('INSERT INTO members(uid,clan,joined) VALUES(?,?,?)').bind(target, c.id, Date.now()).run();
      await db.prepare('DELETE FROM requests WHERE uid=?').bind(target).run();
    } else await db.prepare('DELETE FROM requests WHERE uid=? AND clan=?').bind(target, c.id).run();
    return json({ ok: true });
  }
  if (p === '/clan/kick') {
    const target = String(b.uid || '');
    if (target === uid) return json({ error: 'self' }, 400);
    await db.prepare('DELETE FROM members WHERE uid=? AND clan=?').bind(target, c.id).run();
    return json({ ok: true });
  }
  return json({ error: 'not found' }, 404);
}


// ======================= РЫНОК МЕЖДУ ИГРОКАМИ =======================
// Сервер хранит лоты и сделки. Ник при выставлении «замораживается» в лоте, покупатель получает его после успешной покупки,
// продавец забирает выручку кнопкой (комиссия MARKET_FEE). Тип и цену ника клиент пересчитывает сам по названию.
const MARKET_TOP_PRICE = 500_000;   // «Лот в топ»: первое место на рынке на 24 часа
const MARKET_FEE = 0.05, MARKET_MAX_LOTS = 10, MARKET_MIN = 10, MARKET_MAX = 1_000_000_000_000;
const NICK_RE = /^[\p{L}\p{N}_#$%@?!*~.\-]{1,24}$/u;

async function marketRoutes(url, req, env, uid, json) {
  const p = url.pathname;
  if (!p.startsWith('/market')) return null;
  const db = env.DB;

  if (p === '/market' && req.method === 'GET') {
    const q = clean(url.searchParams.get('q') || '', 24), sort = url.searchParams.get('sort');
    const order = '(m.top > ' + Date.now() + ') DESC, ' + (sort === 'cheap' ? 'm.price ASC' : sort === 'exp' ? 'm.price DESC' : 'm.id DESC');
    const base = `SELECT m.id,m.name,m.price,m.seller,m.top,p.name AS sname,p.hide FROM market m LEFT JOIN players p ON p.uid=m.seller WHERE m.status=0`;
    const rows = (q
      ? await db.prepare(base + " AND m.name LIKE ?1 ESCAPE '\\' ORDER BY " + order + ' LIMIT 60').bind(like(q)).all()
      : await db.prepare(base + ' ORDER BY ' + order + ' LIMIT 60').all()).results;
    return json({ lots: rows.map((r) => ({ id: r.id, name: r.name, price: r.price, seller: r.hide ? 'Игрок' : (r.sname || 'Игрок'), mine: r.seller === uid ? 1 : 0, top: r.top > Date.now() ? 1 : 0 })) });
  }

  if (p === '/market/history' && req.method === 'GET') {
    const rows = (await db.prepare(`SELECT m.name,m.price,m.seller,m.buyer,m.sold_ts,ps.name AS sname,ps.hide AS shide,pb.name AS bname,pb.hide AS bhide
      FROM market m LEFT JOIN players ps ON ps.uid=m.seller LEFT JOIN players pb ON pb.uid=m.buyer
      WHERE m.status=1 AND (m.seller=?1 OR m.buyer=?1) ORDER BY m.sold_ts DESC LIMIT 40`).bind(uid).all()).results;
    return json({ items: rows.map((r) => {
      const sold = r.seller === uid;
      const who = sold ? (r.bhide ? 'Игрок' : (r.bname || 'Игрок')) : (r.shide ? 'Игрок' : (r.sname || 'Игрок'));
      return { name: r.name, price: r.price, kind: sold ? 'sold' : 'bought', who, ts: r.sold_ts, get: Math.floor(r.price * (1 - MARKET_FEE)) };
    }) });
  }

  if (p === '/market/my' && req.method === 'GET') {
    const act = (await db.prepare('SELECT id,name,price,top FROM market WHERE seller=? AND status=0 ORDER BY id DESC').bind(uid).all()).results;
    const sold = (await db.prepare('SELECT id,name,price FROM market WHERE seller=? AND status=1 AND claimed=0 ORDER BY id DESC').bind(uid).all()).results;
    return json({ now: Date.now(), active: act, sold: sold.map((s) => ({ ...s, get: Math.floor(s.price * (1 - MARKET_FEE)) })), fee: MARKET_FEE, max: MARKET_MAX_LOTS });
  }

  if (req.method !== 'POST') return json({ error: 'not found' }, 404);
  let b; try { b = await req.json(); } catch { b = {}; }

  if (p === '/market/top') {
    const id = Number(b.id) || 0;
    const lot = await db.prepare('SELECT top FROM market WHERE id=? AND seller=? AND status=0').bind(id, uid).first();
    if (!lot) return json({ error: 'gone' }, 404);
    if (lot.top > Date.now()) return json({ error: 'already' }, 409);
    const me = await db.prepare('SELECT net FROM players WHERE uid=?').bind(uid).first();
    if (!me || me.net < MARKET_TOP_PRICE) return json({ error: 'poor' }, 400);
    const until = Date.now() + 24 * 3600000;
    const r = await db.prepare('UPDATE market SET top=? WHERE id=? AND seller=? AND status=0').bind(until, id, uid).run();
    if (!r.meta.changes) return json({ error: 'gone' }, 404);
    return json({ ok: true, price: MARKET_TOP_PRICE, until });
  }

  if (p === '/market/list') {
    const name = String(b.name || ''), price = Math.round(Number(b.price));
    if (!NICK_RE.test(name)) return json({ error: 'name' }, 400);
    if (!(price >= MARKET_MIN && price <= MARKET_MAX)) return json({ error: 'price' }, 400);
    if (!(await db.prepare('SELECT 1 AS x FROM players WHERE uid=?').bind(uid).first())) return json({ error: 'sync' }, 400);
    const c = await db.prepare('SELECT COUNT(*) AS n FROM market WHERE seller=? AND status=0').bind(uid).first();
    if (c.n >= MARKET_MAX_LOTS) return json({ error: 'toomany' }, 400);
    const r = await db.prepare('INSERT INTO market(seller,name,price,status,claimed,ts) VALUES(?,?,?,0,0,?)').bind(uid, name, price, Date.now()).run();
    return json({ ok: true, id: r.meta.last_row_id });
  }

  if (p === '/market/cancel') {
    const id = Number(b.id) || 0;
    const lot = await db.prepare('SELECT name FROM market WHERE id=? AND seller=? AND status=0').bind(id, uid).first();
    if (!lot) return json({ error: 'gone' }, 404);
    const r = await db.prepare('UPDATE market SET status=2 WHERE id=? AND seller=? AND status=0').bind(id, uid).run();
    if (!r.meta.changes) return json({ error: 'gone' }, 404);
    return json({ ok: true, name: lot.name });
  }

  if (p === '/market/buy') {
    const id = Number(b.id) || 0;
    const lot = await db.prepare('SELECT name,price,seller FROM market WHERE id=? AND status=0').bind(id).first();
    if (!lot) return json({ error: 'gone' }, 404);
    if (lot.seller === uid) return json({ error: 'own' }, 400);
    if (Number(b.max) && lot.price > Number(b.max)) return json({ error: 'changed' }, 409);
    // покупатель должен реально иметь такой капитал (по проверенным данным сервера)
    const me = await db.prepare('SELECT net FROM players WHERE uid=?').bind(uid).first();
    if (!me || me.net < lot.price) return json({ error: 'poor' }, 400);
    // атомарно: лот достаётся только тому, кто первым сменил статус
    const r = await db.prepare('UPDATE market SET status=1,buyer=?,sold_ts=? WHERE id=? AND status=0').bind(uid, Date.now(), id).run();
    if (!r.meta.changes) return json({ error: 'gone' }, 404);
    bg(notifyEvent(env, lot.seller, NT.MKT, `💰 Твой ник @${lot.name} купили на рынке за ${nf(lot.price)} 🪙. Выручка (минус ${Math.round(MARKET_FEE * 100)}%) придёт в игре.`));
    return json({ ok: true, name: lot.name, price: lot.price });
  }

  if (p === '/market/claim') {
    const rows = (await db.prepare('SELECT id,price FROM market WHERE seller=? AND status=1 AND claimed=0').bind(uid).all()).results;
    let sum = 0, n = 0;
    for (const r of rows) {
      const u = await db.prepare('UPDATE market SET claimed=1 WHERE id=? AND claimed=0').bind(r.id).run();
      if (u.meta.changes) { sum += Math.floor(r.price * (1 - MARKET_FEE)); n++; }
    }
    // выручка с рынка не считается накруткой: добавляем её к разрешённому росту капитала
    if (sum > 0) await db.prepare('UPDATE players SET allow = allow + ? WHERE uid=?').bind(sum, uid).run();
    return json({ sum, n });
  }
  return json({ error: 'not found' }, 404);
}


// ======================= МУЗЕЙ =======================
// Игрок навсегда ставит ник в музей: имя может висеть только у одного игрока. Сервер хранит имя, поданную клиентом оценку (только чтобы
// отобрать лучшие экспонаты) и владельца. Реальную цену ника клиенты считают сами по названию и по ней же сортируют список.
const MUSEUM_PER_PLAYER = 3, MUSEUM_SHOW = 200;
async function museumRoutes(url, req, env, uid, json) {
  const p = url.pathname;
  if (!p.startsWith('/museum')) return null;
  const db = env.DB;
  if (p === '/museum' && req.method === 'GET') {
    const rows = (await db.prepare('SELECT m.name,m.v,m.owner,m.ts,p.name AS oname,p.hide FROM museum m LEFT JOIN players p ON p.uid=m.owner ORDER BY m.v DESC, m.ts ASC LIMIT ?').bind(MUSEUM_SHOW).all()).results;
    const total = await db.prepare('SELECT COUNT(*) AS n FROM museum').first();
    const mine = await db.prepare('SELECT COUNT(*) AS n FROM museum WHERE owner=?').bind(uid).first();
    const my = (await db.prepare('SELECT name,v,ts FROM museum WHERE owner=? ORDER BY ts ASC LIMIT ?').bind(uid, MUSEUM_PER_PLAYER).all()).results;
    return json({ items: rows.map((r) => ({ name: r.name, v: r.v, ts: r.ts, owner: r.hide ? 'Игрок' : (r.oname || 'Игрок'), mine: r.owner === uid ? 1 : 0 })), my: my.map((r) => ({ name: r.name, v: r.v, ts: r.ts })), total: total.n, mine: mine.n, max: MUSEUM_PER_PLAYER });
  }
  if (p === '/museum/add' && req.method === 'POST') {
    let b; try { b = await req.json(); } catch { b = {}; }
    const name = String(b.name || ''), v = Math.round(Number(b.v));
    if (!NICK_RE.test(name)) return json({ error: 'name' }, 400);
    if (!(v >= 1 && v <= 1e10)) return json({ error: 'price' }, 400);
    if (!(await db.prepare('SELECT 1 AS x FROM players WHERE uid=?').bind(uid).first())) return json({ error: 'sync' }, 400);
    const c = await db.prepare('SELECT COUNT(*) AS n FROM museum WHERE owner=?').bind(uid).first();
    if (c.n >= MUSEUM_PER_PLAYER) return json({ error: 'many' }, 400);
    const r = await db.prepare('INSERT OR IGNORE INTO museum(name,v,owner,ts) VALUES(?,?,?,?)').bind(name, v, uid, Date.now()).run();
    if (!r.meta.changes) return json({ error: 'taken' }, 409);
    return json({ ok: true });
  }
  return json({ error: 'not found' }, 404);
}


// ======================= МАГАЗИН И АУКЦИОН =======================
// Аукцион ников: ставка списывается у игрока сразу, при перебитии возвращается (через таблицу grants).
// По окончании победитель забирает ник (/auction/claim), продавец получает монеты (за вычетом комиссии) тоже через grants.
const AU_FEE = 0.05, AU_MAX_LOTS = 5, AU_MIN = 10, AU_MAX = 1_000_000_000_000, AU_HOURS = [1, 6, 12, 24], AU_SNIPE = 120000;
const EXCL = { ceo: 25_000_000 };   // эксклюзивные ники магазина
const EXCL_STOCK = { ceo: 3 };      // сколько экземпляров каждого на весь сервер (первый уже куплен)
const auMin = (l) => (l.bids === 0 ? l.start : Math.max(l.cur + 1, Math.ceil(l.cur * 1.05)));
async function auSettle(db, env) {
  const now = Date.now();
  const rows = (await db.prepare('SELECT id,seller,name,cur,bidder FROM auctions WHERE status=0 AND end_ts<=? LIMIT 100').bind(now).all()).results;
  for (const r of rows) {
    if (r.bidder) {
      const u = await db.prepare('UPDATE auctions SET status=1 WHERE id=? AND status=0').bind(r.id).run();
      if (u.meta.changes) {
        await db.prepare('INSERT INTO grants(uid,amount,claimed,ts) VALUES(?,?,0,?)').bind(r.seller, Math.floor(r.cur * (1 - AU_FEE)), now).run();
        if (env) {
          bg(notifyEvent(env, r.bidder, NT.AUC, `🏆 Ты выиграл аукцион: @${r.name} за ${nf(r.cur)} 🪙. Ник уже ждёт в игре.`));
          bg(notifyEvent(env, r.seller, NT.AUC, `💰 Лот @${r.name} продан за ${nf(r.cur)} 🪙. Тебе придёт ${nf(r.cur * (1 - AU_FEE))} 🪙.`));
        }
      }
    } else {
      const u = await db.prepare('UPDATE auctions SET status=2 WHERE id=? AND status=0').bind(r.id).run();
      if (u.meta.changes && env) bg(notifyEvent(env, r.seller, NT.AUC, `⌛ Лот @${r.name} не продан. Ник вернётся в коллекцию, когда откроешь игру.`));
    }
  }
}
async function auctionRoutes(url, req, env, uid, json) {
  const p = url.pathname, db = env.DB;
  const slotsOf = (k) => Array.from({ length: EXCL_STOCK[k] }, (_, i) => (i === 0 ? k : k + (i + 1)));   // 'ceo', 'ceo2', 'ceo3'
  if (p === '/shop' && req.method === 'GET') {
    const out = {};
    for (const [k, price] of Object.entries(EXCL)) {
      const sl = slotsOf(k), rows = (await db.prepare(`SELECT item,uid FROM shop WHERE item IN (${sl.map(() => '?').join(',')})`).bind(...sl).all()).results;
      out[k] = { price, total: sl.length, sold: rows.length, left: sl.length - rows.length, mine: rows.some((r) => r.uid === uid) ? 1 : 0 };
    }
    return json({ ex: out });
  }
  if (p === '/shop/buy' && req.method === 'POST') {
    let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
    const item = String(b.item || ''), price = EXCL[item];
    if (!price) return json({ error: 'bad' }, 400);
    const sl = slotsOf(item), rows = (await db.prepare(`SELECT item,uid FROM shop WHERE item IN (${sl.map(() => '?').join(',')})`).bind(...sl).all()).results;
    if (rows.some((r) => r.uid === uid)) return json({ error: 'have' }, 400);
    const me = await db.prepare('SELECT net FROM players WHERE uid=?').bind(uid).first();
    if (!me || me.net < price) return json({ error: 'poor' }, 400);
    for (const slot of sl) {
      if (rows.some((r) => r.item === slot)) continue;
      const r = await db.prepare('INSERT OR IGNORE INTO shop(item,uid,ts) VALUES(?,?,?)').bind(slot, uid, Date.now()).run();
      if (r.meta.changes) return json({ ok: true, item, price });
    }
    return json({ error: 'sold' }, 409);
  }
  if (!p.startsWith('/auction')) return null;
  await auSettle(db, env);
  const now = Date.now();
  if (p === '/auction' && req.method === 'GET') {
    const sort = url.searchParams.get('sort'), q = (url.searchParams.get('q') || '').toLowerCase().replace(/[^a-z0-9_а-яё]/g, '').slice(0, 32);
    const ord = sort === 'cheap' ? 'a.cur ASC' : sort === 'exp' ? 'a.cur DESC' : 'a.end_ts ASC';
    const rows = (await db.prepare(`SELECT a.id,a.name,a.start,a.cur,a.bids,a.end_ts,a.bidder,a.seller,p.name AS sname,p.hide FROM auctions a LEFT JOIN players p ON p.uid=a.seller WHERE a.status=0 AND a.end_ts>? AND a.name LIKE ? ORDER BY ${ord} LIMIT 60`).bind(now, '%' + q + '%').all()).results;
    return json({ now, lots: rows.map((r) => ({ id: r.id, name: r.name, start: r.start, cur: r.cur, bids: r.bids, end: r.end_ts, min: auMin(r), lead: r.bidder === uid ? 1 : 0, mine: r.seller === uid ? 1 : 0, seller: r.hide ? 'Игрок' : (r.sname || 'Игрок') })) });
  }
  if (p === '/auction/my' && req.method === 'GET') {
    const lots = (await db.prepare('SELECT id,name,start,cur,bids,end_ts FROM auctions WHERE seller=? AND status=0 ORDER BY end_ts ASC').bind(uid).all()).results;
    const lead = (await db.prepare('SELECT id,name,cur,end_ts FROM auctions WHERE bidder=? AND status=0 ORDER BY end_ts ASC').bind(uid).all()).results;
    const pend = await db.prepare('SELECT COUNT(*) AS n FROM auctions WHERE done=0 AND ((status=1 AND bidder=?1) OR (status=2 AND seller=?1))').bind(uid).first();
    return json({ now, lots: lots.map((r) => ({ id: r.id, name: r.name, start: r.start, cur: r.cur, bids: r.bids, end: r.end_ts })), lead: lead.map((r) => ({ id: r.id, name: r.name, cur: r.cur, end: r.end_ts })), pend: pend.n, fee: AU_FEE, max: AU_MAX_LOTS });
  }
  if (p === '/auction/history' && req.method === 'GET') {
    const rows = (await db.prepare(`SELECT a.id,a.name,a.cur,a.status,a.seller,a.bidder,a.end_ts,ps.name AS sn,pb.name AS bn FROM auctions a LEFT JOIN players ps ON ps.uid=a.seller LEFT JOIN players pb ON pb.uid=a.bidder WHERE a.status IN (1,2) AND (a.seller=?1 OR a.bidder=?1) ORDER BY a.end_ts DESC LIMIT 30`).bind(uid).all()).results;
    return json({ items: rows.map((r) => {
      const sell = r.seller === uid;
      return { name: r.name, price: r.cur, kind: sell ? (r.status === 1 ? 'sold' : 'unsold') : 'won', who: sell ? (r.bn || 'Игрок') : (r.sn || 'Игрок'), ts: r.end_ts, get: Math.floor(r.cur * (1 - AU_FEE)) };
    }) });
  }
  if (req.method !== 'POST') return json({ error: 'not found' }, 404);
  let b; try { b = await req.json(); } catch { b = {}; }
  if (p === '/auction/list') {
    const name = String(b.name || '').trim().slice(0, 32), price = Math.floor(Number(b.price)), hours = Number(b.hours);
    if (!/^[\p{L}\p{N}_]{1,32}$/u.test(name) || !AU_HOURS.includes(hours)) return json({ error: 'bad' }, 400);
    if (!(price >= AU_MIN && price <= AU_MAX)) return json({ error: 'price' }, 400);
    const c = await db.prepare('SELECT COUNT(*) AS n FROM auctions WHERE seller=? AND status=0').bind(uid).first();
    if (c.n >= AU_MAX_LOTS) return json({ error: 'toomany' }, 400);
    const r = await db.prepare('INSERT INTO auctions(seller,name,start,cur,bids,end_ts,status,done,ts) VALUES(?,?,?,?,0,?,0,0,?)').bind(uid, name, price, price, now + hours * 3600000, now).run();
    return json({ ok: true, id: r.meta.last_row_id });
  }
  if (p === '/auction/bid') {
    const id = Number(b.id) || 0, amount = Math.floor(Number(b.amount));
    const lot = await db.prepare('SELECT * FROM auctions WHERE id=?').bind(id).first();
    if (!lot || lot.status !== 0 || lot.end_ts <= now) return json({ error: 'gone' }, 404);
    if (lot.seller === uid) return json({ error: 'own' }, 400);
    if (lot.bidder === uid) return json({ error: 'lead' }, 400);
    const min = auMin(lot);
    if (!(amount >= min) || amount > AU_MAX) return json({ error: 'low', min }, 409);
    const me = await db.prepare('SELECT net FROM players WHERE uid=?').bind(uid).first();
    if (!me || me.net < amount) return json({ error: 'poor' }, 400);
    const end = lot.end_ts - now < AU_SNIPE ? now + AU_SNIPE : lot.end_ts;
    const r = await db.prepare('UPDATE auctions SET cur=?,bidder=?,bids=bids+1,end_ts=? WHERE id=? AND status=0 AND cur=? AND bids=? AND end_ts>?').bind(amount, uid, end, id, lot.cur, lot.bids, now).run();
    if (!r.meta.changes) return json({ error: 'changed' }, 409);
    if (lot.bidder) {
      await db.prepare('INSERT INTO grants(uid,amount,claimed,ts) VALUES(?,?,0,?)').bind(lot.bidder, lot.cur, now).run();
      bg(notifyEvent(env, lot.bidder, NT.AUC, `⚠️ Твою ставку на @${lot.name} перебили: теперь ${nf(amount)} 🪙. Деньги вернутся, можно поставить выше.`));
    }
    return json({ ok: true, name: lot.name, amount, end });
  }
  if (p === '/auction/cancel') {
    const id = Number(b.id) || 0;
    const lot = await db.prepare('SELECT name FROM auctions WHERE id=? AND seller=? AND status=0 AND bids=0').bind(id, uid).first();
    if (!lot) return json({ error: 'gone' }, 404);
    const r = await db.prepare('UPDATE auctions SET status=3,done=1 WHERE id=? AND seller=? AND status=0 AND bids=0').bind(id, uid).run();
    if (!r.meta.changes) return json({ error: 'gone' }, 404);
    return json({ ok: true, name: lot.name });
  }
  if (p === '/auction/claim') {
    const rows = (await db.prepare('SELECT id,name,status FROM auctions WHERE done=0 AND ((status=1 AND bidder=?1) OR (status=2 AND seller=?1)) LIMIT 50').bind(uid).all()).results;
    const won = [], back = [];
    for (const r of rows) {
      const u = await db.prepare('UPDATE auctions SET done=1 WHERE id=? AND done=0').bind(r.id).run();
      if (u.meta.changes) (r.status === 1 ? won : back).push(r.name);
    }
    return json({ won, back });
  }
  return json({ error: 'not found' }, 404);
}
