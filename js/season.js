// ---------- Сезоны, пропуск наград, события и кейс недели ----------
// Расписание (seasonId, evNow и т.д.) лежит в app.js. Здесь: состояние сезона, интерфейс и связь с рейтингом сезона.
const SZ_LV = 30, SZ_SPL = 150, SZ_PRICE = 500000, SZ_GROW_STEP = 25000, SZ_GROW_CAP = 3000;
const SZ_NAMES = ['Неоновая осень', 'Ледяной шторм', 'Золотая лихорадка', 'Космический рейс', 'Тёмный лес', 'Огненный вихрь'];
const szId = () => seasonId(Date.now());
const szName = (id) => SZ_NAMES[((id % SZ_NAMES.length) + SZ_NAMES.length) % SZ_NAMES.length];
const szEnd = (id) => EV_ANCHOR + (id + 1) * SEASON_MS;
const szCnt = (k) => (S.cnt || []).slice(k).reduce((a, b) => a + b, 0);
const szLeft = (ms) => { const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4); return d > 0 ? `${d} дн ${h} ч` : h > 0 ? `${h} ч ${m} мин` : `${m} мин`; };
const szHM = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

// награды уровня: бесплатная и платная дорожки
function szReward(l, paid) {
  if (!paid) {
    return { c: 15000 + l * 2500, e: l % 5 === 0 ? 5 : 0, cs: l === 10 ? 'start' : l === 20 ? 'rare' : l === 30 ? 'star' : '' };
  }
  const cs = l === 30 ? 'abyss' : l % 10 === 0 ? 'star' : l % 6 === 0 ? 'rare' : l % 3 === 0 ? 'start' : '';
  return { c: 30000 + l * 6000 + (l === 30 ? 300000 : 0), e: l % 4 === 0 ? 4 : 0, cs };
}
const szRwHtml = (r) => `<b>${fmtC(r.c)} 🪙</b>${r.e ? `<span>+${r.e} ⚡</span>` : ''}${r.cs ? `<span>${(CASES.find((x) => x.id === r.cs) || {}).ic || '📦'} кейс</span>` : ''}`;

const SZQ = [
  { t: 'Крути рулетку', n: 150, r: 300, v: (z) => S.spins - z.b.sp },
  { t: 'Открой кейсы', n: 15, r: 300, v: (z) => S.casen - z.b.ca },
  { t: 'Выиграй апгрейды', n: 8, r: 400, v: (z) => S.upw - z.b.up },
  { t: 'Выбей эпический ник или выше', n: 5, r: 500, v: (z) => szCnt(3) - z.b.e },
  { t: 'Выбей легендарный ник или выше', n: 1, r: 600, v: (z) => szCnt(4) - z.b.l },
];

function szState() {
  const id = szId();
  let z = S.sz;
  if (!z || z.id !== id) {
    z = S.sz = { id, sp: 0, fc: [], pc: [], qc: [], paid: 0, b: { sp: S.spins, ca: S.casen, up: S.upw, e: szCnt(3), l: szCnt(4), net: Math.round(netWorth()) } };
    save();
  }
  z.sp = Math.max(0, Math.floor(+z.sp) || 0);
  for (const k of ['fc', 'pc', 'qc']) if (!Array.isArray(z[k])) z[k] = [];
  if (!z.b || typeof z.b !== 'object') z.b = { sp: S.spins, ca: S.casen, up: S.upw, e: szCnt(3), l: szCnt(4), net: Math.round(netWorth()) };
  return z;
}
const szGrowth = (z) => Math.min(SZ_GROW_CAP, Math.floor(Math.max(0, netWorth() - z.b.net) / SZ_GROW_STEP));
const szTotal = () => { const z = szState(); return z.sp + szGrowth(z); };
const szLevel = () => Math.min(SZ_LV, Math.floor(szTotal() / SZ_SPL));

// очки сезона за действие (во время события «×N к очкам» умножаются)
function spAdd(n) {
  const z = szState();
  z.sp += Math.round(n * evS());
  spDirty();
}

// ---- связь с рейтингом сезона ----
let spT = 0, spLast = 0, spSent = -1;
function spDirty() { clearTimeout(spT); spT = setTimeout(() => spSync(), 5000); }
async function spSync(force) {
  if (typeof API === 'undefined' || !API || !tg || !tg.initData) return;
  const z = szState(), sp = szTotal();
  if (sp === spSent && !force) return;
  if (Date.now() - spLast < 9000) { spDirty(); return; }
  spLast = Date.now();
  try { const r = await lbReq('/season/sync', { sid: z.id, sp }); if (r && r.ok) spSent = sp; } catch (e) {}
}
let szTopC = { t: 0, d: null };
async function szLoadTop(force) {
  if (!force && szTopC.d && Date.now() - szTopC.t < 30000) return szTopC.d;
  const d = await lbReq('/season/top');
  szTopC = { t: Date.now(), d };
  return d;
}

// ---- получение наград ----
function szGive(r) {
  S.coins = Math.min(CAP, S.coins + r.c);
  if (r.e) S.en += r.e;
  if (r.cs) { S.cfree = S.cfree || {}; S.cfree[r.cs] = (S.cfree[r.cs] | 0) + 1; }
}
function szClaim(l, paid, silent) {
  const z = szState();
  if (szLevel() < l) return 0;
  if (paid && !z.paid) return 0;
  const arr = paid ? z.pc : z.fc;
  if (arr.includes(l)) return 0;
  arr.push(l);
  szGive(szReward(l, paid));
  if (!silent) { save(); render(); sfx('coins'); hap('n', 'success'); renderSeason(); }
  return 1;
}
function szClaimAll() {
  const z = szState(), lv = szLevel();
  let n = 0;
  for (let l = 1; l <= lv; l++) { n += szClaim(l, false, true); if (z.paid) n += szClaim(l, true, true); }
  if (n) { save(); render(); sfx('coins'); hap('n', 'success'); toast(`Награды получены: ${n}`); renderSeason(); }
}
function szQClaim(i) {
  const z = szState(), q = SZQ[i];
  if (!q || z.qc.includes(i) || q.v(z) < q.n) return;
  z.qc.push(i); z.sp += q.r; save(); sfx('coin'); hap('n', 'success'); toast(`Задание выполнено: +${q.r} очков сезона`); spDirty(); renderSeason();
}
function szBuy() {
  const z = szState();
  if (z.paid) return;
  if (S.coins < SZ_PRICE) { toast(`Не хватает монет: нужно ${fmt(SZ_PRICE)} 🪙`); return; }
  S.coins -= SZ_PRICE; z.paid = 1; save(); render(); sfx('coins'); hap('n', 'success'); toast('Платная дорожка открыта'); renderSeason();
}

// ---- события ----
function evLine() {
  const e = evNow();
  if (e) {
    const what = `×${evF(e.m)} ${EVK[e.kind][0]}`, sub = EVK[e.kind][1];
    return `<div class="evbn on"><span class="evx">×${evF(e.m)}</span><div><b>${what}</b><small>${sub} · до ${szHM(e.end)} (ещё ${szLeft(e.end - Date.now())})</small></div></div>`;
  }
  const n = evNext();
  return `<div class="evbn"><span class="evx">🎉</span><div><b>Событие скоро</b><small>${n ? 'Следующее: ' + new Date(n.start).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' }) + ' в ' + szHM(n.start) : 'Бот сообщит, когда оно начнётся'}</small></div></div>`;
}
function evBarUpd() {
  const g = document.getElementById('tab-game');
  if (!g) return;
  let b = document.getElementById('evbar');
  const e = evNow();
  if (!e) { if (b) b.remove(); return; }
  if (!b) { b = document.createElement('div'); b.id = 'evbar'; g.prepend(b); b.onclick = () => tab('season'); }
  const t = `🎉 ×${evF(e.m)} ${EVK[e.kind][0]} · до ${szHM(e.end)}`;
  if (b.textContent !== t) b.textContent = t;
}

// ---- карточка в «Бонусах» ----
function seasonCard() {
  const z = szState(), lv = szLevel(), tot = szTotal(), into = lv >= SZ_LV ? SZ_SPL : tot % SZ_SPL;
  let rdy = 0;
  for (let l = 1; l <= lv; l++) { if (!z.fc.includes(l)) rdy++; if (z.paid && !z.pc.includes(l)) rdy++; }
  const need = lv >= SZ_LV ? 0 : SZ_SPL - into;
  return `<button class="szbig" data-season="1"><span class="szb-top"><span class="szb-k">Сезон ${z.id + 1}</span><span class="szb-left">⏳ осталось ${szLeft(szEnd(z.id) - Date.now())}</span></span>
  <b class="szb-name">🏅 ${szName(z.id)}</b>
  <span class="szb-row"><span class="szb-lv">Уровень <i>${lv}</i> из ${SZ_LV}</span><span class="szb-pts">${fmt(tot)} очков</span></span>
  <span class="szbar big"><i style="width:${into / SZ_SPL * 100}%"></i></span>
  <span class="szb-foot"><small>${lv >= SZ_LV ? 'Все уровни пройдены' : 'До следующего уровня: ' + need + ' очков'}</small>${rdy ? `<span class="szb-rdy">🎁 наград: ${rdy}</span>` : '<span class="szb-go">Открыть ›</span>'}</span></button>${evNow() ? evLine() : ''}`;
}

// ---- страница сезона ----
function renderSeason() {
  const el = document.getElementById('tab-season');
  if (!el || el.hidden) return;
  const z = szState(), lv = szLevel(), tot = szTotal(), into = lv >= SZ_LV ? SZ_SPL : tot % SZ_SPL;
  let rdy = 0;
  for (let l = 1; l <= lv; l++) { if (!z.fc.includes(l)) rdy++; if (z.paid && !z.pc.includes(l)) rdy++; }
  const rows = [];
  for (let l = 1; l <= SZ_LV; l++) {
    const cell = (paid) => {
      const r = szReward(l, paid), arr = paid ? z.pc : z.fc, got = arr.includes(l), ok = lv >= l && (!paid || z.paid);
      return `<div class="szc${got ? ' got' : ok ? ' rdy' : ''}${paid ? ' pd' : ''}${paid && !z.paid ? ' lk' : ''}"${ok && !got ? ` data-szc="${l}" data-szp="${paid ? 1 : 0}"` : ''}>${szRwHtml(r)}<em>${got ? '✓ получено' : ok ? 'Забрать' : paid && !z.paid ? '🔒' : 'уровень ' + l}</em></div>`;
    };
    rows.push(`<div class="szr${lv >= l ? ' dn' : ''}"><i class="szl">${l}</i>${cell(false)}${cell(true)}</div>`);
  }
  const qs = SZQ.map((q, i) => {
    const v = Math.min(q.n, Math.max(0, q.v(z))), got = z.qc.includes(i), ok = v >= q.n;
    return `<div class="quest${got ? ' got' : ''}"><div class="qtop"><b>${q.t}</b><span>+${q.r} очк.</span></div><div class="qbar"><i style="width:${v / q.n * 100}%"></i></div><div class="qbot"><small>${v} / ${q.n}</small>${got ? '<em>Получено ✓</em>' : ok ? `<button class="btn main sm" data-szq="${i}">Забрать</button>` : ''}</div></div>`;
  }).join('');
  el.innerHTML = `<div class="ahead"><button class="btn sm" id="sz-back">‹ Бонусы</button><h2>Сезон ${z.id + 1}</h2></div>
  <div class="pcard szhero"><small>${szName(z.id)} · осталось ${szLeft(szEnd(z.id) - Date.now())}</small><div class="szlv"><b>Уровень ${lv}</b><span>${fmt(tot)} очков</span></div><div class="szbar big"><i style="width:${into / SZ_SPL * 100}%"></i></div><small>${lv >= SZ_LV ? 'Все уровни пройдены' : `До следующего уровня: ${SZ_SPL - into} очков`}</small>
  <div class="szsrc"><span>🎰 крутка +3</span><span>📦 кейс +12</span><span>⚡ апгрейд +15</span><span>📈 рост капитала до ${fmt(SZ_GROW_CAP)}</span></div></div>
  ${evLine()}
  <div class="szact">${z.paid ? '<div class="szpaid">✓ Платная дорожка открыта</div>' : `<button class="btn main" id="sz-buy">Открыть платную дорожку · ${fmt(SZ_PRICE)} 🪙</button>`}${rdy ? `<button class="btn" id="sz-all">Забрать всё (${rdy})</button>` : ''}</div>
  <div class="szth"><i></i><b>Бесплатно</b><b class="pd">Платная</b></div>
  <div class="szlist">${rows.join('')}</div>
  <div class="pcard"><div class="bhead"><h3>Задания сезона</h3><span class="bsub">до конца сезона</span></div>${qs}</div>
  <div class="pcard" id="sz-prize" hidden></div>
  <div class="pcard"><div class="bhead"><h3>Рейтинг сезона</h3><span class="bsub">топ-25 получает призы</span></div><div id="sz-top"><small>Загружаем…</small></div><small class="szprz">Призы: 1 место 5 000 000 🪙, 2 место 3 000 000, 3 место 2 000 000, 4–10 места по 1 000 000, 11–25 места по 400 000. Выдаются после конца сезона.</small></div>`;
  szTopFill();
  szPrizeFill();
}
async function szTopFill() {
  const box = document.getElementById('sz-top');
  if (!box) return;
  if (typeof API === 'undefined' || !API || !tg || !tg.initData) { box.innerHTML = '<small>Рейтинг доступен, когда игра открыта в Telegram.</small>'; return; }
  try {
    await spSync(true);
    const d = await szLoadTop(true), b2 = document.getElementById('sz-top');
    if (!b2) return;
    const top = d.top || [];
    b2.innerHTML = (top.length ? top.map((r, i) => `<div class="szt${r.me ? ' me' : ''}"><i>${i + 1}</i><b>${escH(r.name)}</b><span>${fmt(r.sp)}</span></div>`).join('') : '<small>Пока никого, стань первым.</small>') + (d.me && d.me.rank > 25 ? `<div class="szt me"><i>${d.me.rank}</i><b>Ты</b><span>${fmt(d.me.sp)}</span></div>` : '');
  } catch (e) { const b2 = document.getElementById('sz-top'); if (b2) b2.innerHTML = '<small>Не удалось загрузить рейтинг.</small>'; }
}
async function szPrizeFill() {
  const box = document.getElementById('sz-prize');
  if (!box || typeof API === 'undefined' || !API || !tg || !tg.initData) return;
  try {
    const r = await lbReq('/season/prize');
    if (!r || !(r.sum > 0)) return;
    box.hidden = false;
    box.innerHTML = `<div class="bhead"><h3>🏆 Приз за сезон ${r.sid + 1}</h3><span class="bsub">${r.rank} место</span></div><button class="btn main" id="sz-prz">Забрать ${fmt(r.sum)} 🪙</button>`;
  } catch (e) {}
}
async function szPrizeClaim() {
  try {
    const r = await lbReq('/season/prize/claim', {});
    if (r && r.sum > 0) { S.coins = Math.min(CAP, S.coins + r.sum); save(); render(); sfx('coins'); hap('n', 'success'); toast(`Приз за сезон: +${fmt(r.sum)} 🪙`); }
    szPrizeFill(); const b = document.getElementById('sz-prize'); if (b && !(r && r.sum > 0)) b.hidden = true; else if (b) b.hidden = true;
  } catch (e) { toast('Не удалось получить приз'); }
}

// ---- события кликов ----
document.addEventListener('click', (e) => {
  const t = e.target;
  if (!t.closest) return;
  if (t.closest('[data-season]')) return tab('season');
  if (t.closest('#sz-back')) return tab('bon');
  if (t.closest('#sz-buy')) return szBuy();
  if (t.closest('#sz-all')) return szClaimAll();
  if (t.closest('#sz-prz')) return szPrizeClaim();
  const c = t.closest('[data-szc]');
  if (c) return void szClaim(+c.dataset.szc, c.dataset.szp === '1');
  const q = t.closest('[data-szq]');
  if (q) return szQClaim(+q.dataset.szq);
});

// ---- кейс недели: раз в неделю бесплатно ----
CASES.push({ id: 'week', n: 'Кейс недели', ic: '🏆', c: '#FF8A3D', price: 0, cd: 7 * 864e5, d: 'Бесплатно: открыл — и снова через 7 дней. Лучшие шансы на редкие, эпические и выше', w: [[2, 40], [3, 38], [4, 16], [5, 5], [6, 1]] });
if (S.cfree && S.cfree.week) { S.cfree.week = 0; }
setInterval(() => { evBarUpd(); }, 30000);
document.addEventListener('visibilitychange', () => { if (document.hidden) spSync(); });
setTimeout(() => { evBarUpd(); spSync(); }, 4000);
