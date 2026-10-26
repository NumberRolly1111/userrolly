// Сервер рейтинга «Нейм-рулетки» (Cloudflare Worker + база D1).
// Секреты и настройки: BOT_TOKEN (секрет), ALLOWED_ORIGIN (необязательно, адрес игры).
const MAX_NET = 2e12, MAX_BEST = 6e6, MAX_LVL = 1000, MIN_GAP_MS = 8000, MAX_AGE_S = 3 * 86400;
// Защита от накрутки: капитал игрока не может расти быстрее, чем это возможно в игре.
// Разрешённый рост между двумя отправками = BURST + RATE × секунды с прошлой отправки + выручка с рынка (allow).
// Первая отправка: до FIRST_NET. Если игрок превысил лимит, он помечается (flag=1): скрыт из рейтинга, рынок/кланы/музей для него закрыты,
// а его прошлые данные остаются. Флаг снимается сам, когда отправленный капитал снова укладывается в лимит.
const RATE = 5000, BURST = 40e6, FIRST_NET = 3e9, MAX_ELAPSED_S = 14 * 86400;
const ADMIN_GAME_ID = 587503;   // владелец игры (ID из профиля): на него лимиты не действуют; можно добавить Telegram ID в переменную ADMIN_IDS через запятую
const isAdmin = (uid, env) => {
  const n = Number(uid);
  return n === ADMIN_GAME_ID || (n % 999999) + 1 === ADMIN_GAME_ID || String((env && env.ADMIN_IDS) || '').split(',').map((x) => x.trim()).includes(String(uid));
};
let migrated = false;
async function migrate(db) {   // добавляем новые столбцы сами, SQL вручную выполнять не нужно
  if (migrated) return;
  const have = (await db.prepare('PRAGMA table_info(players)').all()).results.map((r) => r.name);
  for (const [c, d] of [['flag', 'INTEGER NOT NULL DEFAULT 0'], ['cos', "TEXT NOT NULL DEFAULT ''"], ['allow', 'INTEGER NOT NULL DEFAULT 0']]) {
    if (!have.includes(c)) await db.prepare(`ALTER TABLE players ADD COLUMN ${c} ${d}`).run();
  }
  await db.prepare('CREATE TABLE IF NOT EXISTS grants (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT NOT NULL, amount INTEGER NOT NULL, claimed INTEGER NOT NULL DEFAULT 0, ts INTEGER NOT NULL DEFAULT 0)').run();
  await db.prepare('CREATE INDEX IF NOT EXISTS idx_grants_uid ON grants(uid, claimed)').run();
  migrated = true;
}
const enc = new TextEncoder();

async function hmac(key, data) {
  const k = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', k, enc.encode(data)));
}
const hex = (b) => [...b].map((x) => x.toString(16).padStart(2, '0')).join('');

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

export default {
  async fetch(req, env) {
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

    if (url.pathname === '/sync' && req.method === 'POST') {
      let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
      const net = int(b.net, MAX_NET), best = int(b.best, MAX_BEST), lvl = int(b.lvl, MAX_LVL);
      if (net === null || best === null || lvl === null) return json({ error: 'bad' }, 400);
      const now = Date.now();
      const old = await env.DB.prepare('SELECT net,best,upd,flag,allow FROM players WHERE uid=?').bind(uid).first();
      if (old && now - old.upd < MIN_GAP_MS) return json({ error: 'wait' }, 429);
      const cos = String(b.cos || '').match(/^[a-z0-9_]{0,16}\|[a-z0-9_]{0,16}(\|[a-z0-9_]{0,16})?$/) ? String(b.cos) : '';
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
      return json({ ok: true });
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
      const r = await env.DB.prepare(`SELECT p.uid,p.name,p.net,p.best,p.bestn,p.lvl,p.cos,(SELECT c.tag FROM members m JOIN clans c ON c.id=m.clan WHERE m.uid=p.uid) AS tag,(SELECT c.name FROM members m JOIN clans c ON c.id=m.clan WHERE m.uid=p.uid) AS cname FROM players p WHERE p.hide=0 AND p.flag=0 AND p.${col}>0 ORDER BY p.${col} DESC, p.upd ASC LIMIT 1 OFFSET ?`).bind(i).first();
      if (!r) return json({ error: 'none' }, 404);
      return json({ rank: i + 1, name: r.name, net: r.net, best: r.best, bestn: r.bestn, lvl: r.lvl, cos: r.cos || '', tag: r.tag || '', cname: r.cname || '', me: r.uid === uid });
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
const MARKET_FEE = 0.05, MARKET_MAX_LOTS = 10, MARKET_MIN = 10, MARKET_MAX = 1_000_000_000_000;
const NICK_RE = /^[\p{L}\p{N}_#$%@?!*~.\-]{1,24}$/u;

async function marketRoutes(url, req, env, uid, json) {
  const p = url.pathname;
  if (!p.startsWith('/market')) return null;
  const db = env.DB;

  if (p === '/market' && req.method === 'GET') {
    const q = clean(url.searchParams.get('q') || '', 24), sort = url.searchParams.get('sort');
    const order = sort === 'cheap' ? 'm.price ASC' : sort === 'exp' ? 'm.price DESC' : 'm.id DESC';
    const base = `SELECT m.id,m.name,m.price,m.seller,p.name AS sname,p.hide FROM market m LEFT JOIN players p ON p.uid=m.seller WHERE m.status=0`;
    const rows = (q
      ? await db.prepare(base + " AND m.name LIKE ?1 ESCAPE '\\' ORDER BY " + order + ' LIMIT 60').bind(like(q)).all()
      : await db.prepare(base + ' ORDER BY ' + order + ' LIMIT 60').all()).results;
    return json({ lots: rows.map((r) => ({ id: r.id, name: r.name, price: r.price, seller: r.hide ? 'Игрок' : (r.sname || 'Игрок'), mine: r.seller === uid ? 1 : 0 })) });
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
    const act = (await db.prepare('SELECT id,name,price FROM market WHERE seller=? AND status=0 ORDER BY id DESC').bind(uid).all()).results;
    const sold = (await db.prepare('SELECT id,name,price FROM market WHERE seller=? AND status=1 AND claimed=0 ORDER BY id DESC').bind(uid).all()).results;
    return json({ active: act, sold: sold.map((s) => ({ ...s, get: Math.floor(s.price * (1 - MARKET_FEE)) })), fee: MARKET_FEE, max: MARKET_MAX_LOTS });
  }

  if (req.method !== 'POST') return json({ error: 'not found' }, 404);
  let b; try { b = await req.json(); } catch { b = {}; }

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
