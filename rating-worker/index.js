// Сервер рейтинга «Нейм-рулетки» (Cloudflare Worker + база D1).
// Секреты и настройки: BOT_TOKEN (секрет), ALLOWED_ORIGIN (необязательно, адрес игры).
const MAX_NET = 5e10, MAX_BEST = 1e9, MAX_LVL = 1000, MIN_GAP_MS = 8000, MAX_AGE_S = 3 * 86400;
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
      'Access-Control-Allow-Headers': 'Content-Type, X-Init-Data',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    };
    const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    const uid = await auth(req.headers.get('X-Init-Data'), env.BOT_TOKEN);
    if (!uid) return json({ error: 'auth' }, 401);
    const url = new URL(req.url);

    if (url.pathname === '/sync' && req.method === 'POST') {
      let b; try { b = await req.json(); } catch { return json({ error: 'json' }, 400); }
      const net = int(b.net, MAX_NET), best = int(b.best, MAX_BEST), lvl = int(b.lvl, MAX_LVL);
      if (net === null || best === null || lvl === null) return json({ error: 'bad' }, 400);
      const now = Date.now();
      const old = await env.DB.prepare('SELECT upd FROM players WHERE uid=?').bind(uid).first();
      if (old && now - old.upd < MIN_GAP_MS) return json({ error: 'wait' }, 429);
      await env.DB.prepare(
        `INSERT INTO players(uid,name,net,best,bestn,lvl,hide,upd) VALUES(?,?,?,?,?,?,?,?)
         ON CONFLICT(uid) DO UPDATE SET name=excluded.name,net=excluded.net,best=excluded.best,bestn=excluded.bestn,lvl=excluded.lvl,hide=excluded.hide,upd=excluded.upd`
      ).bind(uid, clean(b.name, 24) || 'Игрок', net, best, clean(b.bestn, 32), lvl, b.hide ? 1 : 0, now).run();
      return json({ ok: true });
    }

    if (url.pathname === '/top' && req.method === 'GET') {
      const col = url.searchParams.get('by') === 'best' ? 'best' : 'net';
      const rows = (await env.DB.prepare(`SELECT uid,name,${col} AS v,bestn,lvl FROM players WHERE hide=0 AND ${col}>0 ORDER BY ${col} DESC, upd ASC LIMIT 50`).all()).results;
      const mine = await env.DB.prepare(`SELECT ${col} AS v, hide FROM players WHERE uid=?`).bind(uid).first();
      let me = null;
      if (mine && !mine.hide) {
        const c = await env.DB.prepare(`SELECT COUNT(*) AS n FROM players WHERE hide=0 AND ${col}>?`).bind(mine.v).first();
        me = { rank: c.n + 1, v: mine.v };
      }
      return json({ top: rows.map((r) => ({ name: r.name, v: r.v, bestn: r.bestn, lvl: r.lvl, me: r.uid === uid })), me });
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
const MARKET_FEE = 0.05, MARKET_MAX_LOTS = 10, MARKET_MIN = 10, MARKET_MAX = 2_000_000_000;
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
    return json({ items: rows.map((r) => ({ name: r.name, v: r.v, ts: r.ts, owner: r.hide ? 'Игрок' : (r.oname || 'Игрок'), mine: r.owner === uid ? 1 : 0 })), total: total.n, mine: mine.n, max: MUSEUM_PER_PLAYER });
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
