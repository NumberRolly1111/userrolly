// Сервер Нейм-рулетки: синхронизация игроков, бан и админ-команды.
// Секреты (wrangler secret put): ADMIN_PASSWORD, BOT_TOKEN. База D1 подключена как DB.
const START_BALANCE = 3000;
const enc = new TextEncoder();
const hex = (u) => [...u].map((b) => b.toString(16).padStart(2, "0")).join("");
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });
const bad = (m = "Некорректный запрос", s = 400) => json({ ok: false, error: m }, s);

function corsHeaders(req, env) {
  const origin = req.headers.get("Origin") || "";
  const list = (env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = !list.length || list.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin || "*" : list[0],
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
async function hmac(key, data) {
  const k = await crypto.subtle.importKey("raw", typeof key === "string" ? enc.encode(key) : key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(data)));
}
const sha = async (s) => hex(new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(s))));
function safeEq(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
// Проверка подписи Telegram initData (https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
async function tgUser(initData, token) {
  const p = new URLSearchParams(initData), hash = p.get("hash");
  if (!hash) return null;
  p.delete("hash");
  const str = [...p.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join("\n");
  const sig = hex(await hmac(await hmac("WebAppData", token), str));
  if (!safeEq(sig, hash)) return null;
  if (Date.now() / 1000 - Number(p.get("auth_date")) > 86400) return null;
  try { return JSON.parse(p.get("user")); } catch { return null; }
}

// ---------- игра ----------
async function sync(req, env) {
  let b;
  try { b = await req.json(); } catch { return bad("Invalid JSON"); }
  let key, name = "";
  if (b.initData) {
    if (!env.BOT_TOKEN) return bad("BOT_TOKEN не задан", 500);
    const u = await tgUser(b.initData, env.BOT_TOKEN);
    if (!u) return bad("Не удалось проверить Telegram", 401);
    key = "tg:" + u.id;
    name = u.username ? "@" + u.username : u.first_name || "";
  } else if (env.REQUIRE_TELEGRAM === "1") return bad("Только из Telegram", 401);
  else if (/^[a-f0-9]{32}$/.test(b.anon || "")) key = "anon:" + b.anon;
  else return bad("Нет идентификатора");
  const s = b.state && typeof b.state === "object" ? b.state : {};
  const st = JSON.stringify(s);
  if (st.length > 60000) return bad("Слишком большое состояние", 413);
  await env.DB.prepare(
    `INSERT INTO players(key,name,state,balance,items_count,spins) VALUES(?,?,?,?,?,?)
     ON CONFLICT(key) DO UPDATE SET name=excluded.name,state=excluded.state,balance=excluded.balance,
       items_count=excluded.items_count,spins=excluded.spins,last_seen=CURRENT_TIMESTAMP`
  ).bind(key, name, st, Math.round(+s.coins) || 0, Array.isArray(s.items) ? s.items.length : 0, Math.round(+s.spins) || 0).run();
  const p = await env.DB.prepare("SELECT id,banned,ban_reason FROM players WHERE key=?").bind(key).first();
  if (Array.isArray(b.acks) && b.acks.length)
    await env.DB.batch(b.acks.slice(0, 50).map((i) => env.DB.prepare("UPDATE ops SET done=1 WHERE id=? AND player_id=?").bind(+i, p.id)));
  const rows = (await env.DB.prepare("SELECT id,type,payload FROM ops WHERE player_id=? AND done=0 ORDER BY id LIMIT 50").bind(p.id).all()).results;
  const ops = rows.map((o) => ({ id: o.id, type: o.type, ...JSON.parse(o.payload || "{}") }));
  return json({ ok: true, id: p.id, banned: !!p.banned, ban_reason: p.ban_reason || "", ops });
}

// ---------- админка ----------
async function adminAuth(req, env) {
  const ip = req.headers.get("CF-Connecting-IP") || "?";
  const f = await env.DB.prepare("SELECT COUNT(*) c FROM admin_fail WHERE ip=? AND ts>datetime('now','-10 minutes')").bind(ip).first();
  if (f.c >= 5) return 429;
  const pw = (req.headers.get("Authorization") || "").replace(/^Bearer /, "");
  if (env.ADMIN_PASSWORD && safeEq(await sha(pw), await sha(env.ADMIN_PASSWORD))) return 200;
  await env.DB.prepare("INSERT INTO admin_fail(ip) VALUES(?)").bind(ip).run();
  return 401;
}
const summary = (r) => ({ id: r.id, name: r.name, key: r.key, banned: !!r.banned, ban_reason: r.ban_reason, balance: r.balance, items_count: r.items_count, spins: r.spins, last_seen: r.last_seen, created_at: r.created_at });

async function adminPlayer(url, env) {
  const id = Number(url.searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return bad("Укажи ID цифрами");
  const r = await env.DB.prepare("SELECT * FROM players WHERE id=?").bind(id).first();
  if (!r) return bad("Игрок не найден", 404);
  let st = {};
  try { st = JSON.parse(r.state); } catch {}
  const pend = (await env.DB.prepare("SELECT id,type,payload FROM ops WHERE player_id=? AND done=0 ORDER BY id").bind(id).all()).results;
  return json({
    ok: true,
    player: { ...summary(r), items: (Array.isArray(st.items) ? st.items : []).map((i) => ({ id: i.id, n: i.n, t: i.t })), stats: { ups: st.ups, upw: st.upw, cnt: st.cnt, time: st.time } },
    pending: pend.map((o) => ({ id: o.id, type: o.type, ...JSON.parse(o.payload || "{}") })),
  });
}
async function adminAction(req, env) {
  const b = await req.json().catch(() => null);
  if (!b || !Number.isInteger(+b.id)) return bad();
  const id = +b.id;
  if (!(await env.DB.prepare("SELECT id FROM players WHERE id=?").bind(id).first())) return bad("Игрок не найден", 404);
  const op = (type, payload) => env.DB.prepare("INSERT INTO ops(player_id,type,payload) VALUES(?,?,?)").bind(id, type, JSON.stringify(payload)).run();
  const num = (v) => Math.round(Number(v));
  switch (b.type) {
    case "ban": await env.DB.prepare("UPDATE players SET banned=1,ban_reason=? WHERE id=?").bind(String(b.reason || "").slice(0, 200), id).run(); break;
    case "unban": await env.DB.prepare("UPDATE players SET banned=0,ban_reason='' WHERE id=?").bind(id).run(); break;
    case "setBalance": { const v = num(b.value); if (!(v >= 0 && v <= 1e9)) return bad("Баланс от 0 до 1 000 000 000"); await op("setBalance", { value: v }); break; }
    case "addCoins": { const v = num(b.value); if (!Number.isFinite(v) || v === 0 || Math.abs(v) > 1e9) return bad("Укажи число монет (можно со знаком минус)"); await op("addCoins", { value: v }); break; }
    case "resetBalance": await op("setBalance", { value: START_BALANCE }); break;
    case "give": { const n = String(b.name || "").trim(); if (!n || n.length > 32 || /\s/.test(n)) return bad("Ник от 1 до 32 символов без пробелов"); await op("give", { name: n }); break; }
    case "take": if (!b.itemId) return bad("Выбери ник"); await op("take", { itemId: String(b.itemId) }); break;
    case "message": { const t = String(b.text || "").trim().slice(0, 300); if (!t) return bad("Введи текст"); await op("message", { text: t }); break; }
    case "reset": await op("reset", {}); break;
    default: return bad("Неизвестная команда");
  }
  return json({ ok: true });
}

async function route(req, env) {
  const url = new URL(req.url), path = url.pathname;
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });
  if (path === "/health") return json({ ok: true });
  if (!env.DB) return bad("База данных не подключена", 500);
  if (path === "/api/sync" && req.method === "POST") return sync(req, env);
  if (path.startsWith("/api/admin/")) {
    const a = await adminAuth(req, env);
    if (a === 429) return bad("Слишком много попыток, подожди 10 минут", 429);
    if (a !== 200) return bad("Неверный пароль", 401);
    if (path === "/api/admin/players") {
      const rows = (await env.DB.prepare("SELECT * FROM players ORDER BY last_seen DESC LIMIT 30").all()).results;
      return json({ ok: true, players: rows.map(summary) });
    }
    if (path === "/api/admin/player" && req.method === "GET") return adminPlayer(url, env);
    if (path === "/api/admin/action" && req.method === "POST") return adminAction(req, env);
  }
  return bad("Not found", 404);
}
export default {
  async fetch(req, env) {
    let res;
    try { res = await route(req, env); } catch (e) { res = bad("Ошибка сервера", 500); }
    const h = corsHeaders(req, env);
    for (const k in h) res.headers.set(k, h[k]);
    return res;
  },
};
