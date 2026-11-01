// Новогоднее обновление 2027: календарь, ёлка, задания, подарки, ночи удачи, ники, анимации.
// Работает только на время праздника (30 ноября 2026 — 7 января 2027) и только при html.ny.
// Каталог предметов (темы, рамки, титулы, кейсы) всегда зарегистрирован в app.js, чтобы купленное не пропадало после праздника.
(function () {
  'use strict';
  var H = document.documentElement;
  var START = new Date(2026, 10, 30).getTime();        // 30 ноября 00:00
  var END = new Date(2027, 0, 8).getTime();            // до конца 7 января
  var NYD = new Date(2027, 0, 1).getTime();            // Новый год
  var ADV0 = new Date(2026, 11, 1).getTime();          // 1 декабря
  var SALE_FROM = new Date(2026, 11, 20).getTime();    // распродажа с 20 декабря (так же на сервере)
  var h = location.hostname;
  // Перемотка времени для проверки — только на тестовом сайте и локально, на основном сайте её нет
  var TEST = /^nytest[.-]/.test(h) || h === 'localhost' || h === '127.0.0.1';
  var off = 0, qs = location.search;
  try {
    var m = /[?&]nyd=([0-9T:\-]+)/.exec(qs);
    if (TEST && m) { var t = new Date(m[1]).getTime(); if (isFinite(t)) { off = t - Date.now(); sessionStorage.setItem('nyoff', String(off)); } }
    else if (TEST && sessionStorage.getItem('nyoff')) off = +sessionStorage.getItem('nyoff') || 0;
    else if (TEST && sessionStorage.getItem('nyprev') === '1' && (Date.now() < START || Date.now() >= END)) {
      off = new Date(2026, 11, 12, 12, 0).getTime() - Date.now(); sessionStorage.setItem('nyoff', String(off));
    }
    if (/[?&]ny=0/.test(qs)) sessionStorage.removeItem('nyoff');
  } catch (e) {}
  var DEMO = TEST && /[?&]nydemo=1/.test(qs);
  var now = function () { return Date.now() + off; };
  var NYW = ['snow', 'elka', 'ded_moroz', 'moroz', 'sneg', 'santa', 'noel', 'frost', 'yolka', 'snegurka', 'gift', 'ny2027', 'mandarin', 'salut'];

  var on = function () { return H.classList.contains('ny') && now() >= START && now() < END; };
  var teaser = function () { return H.classList.contains('ny') && now() < START; };
  var NYG = window.NYG = { on: on, now: now, words: NYW, test: TEST };

  // ----- состояние -----
  function st() {
    var n = S.ny;
    if (!n || typeof n !== 'object') n = S.ny = {};
    if (!n.adv || typeof n.adv !== 'object') n.adv = {};
    if (!Array.isArray(n.ach)) n.ach = [];
    if (!Array.isArray(n.tm)) n.tm = [];
    ['toys', 'pend', 'boxes', 'gifts', 'inv', 'sp0'].forEach(function (k) { n[k] = +n[k] || 0; });
    return n;
  }
  var fmtN = function (n) { return fmt(n); };
  var give = {
    coins: function (n) { S.coins = Math.min(CAP, S.coins + Math.round(n)); },
    en: function (n) { S.en = (+S.en || 0) + n; try { updEn(); } catch (e) {} },
    cs: function (id, n) { if (!S.cfree || typeof S.cfree !== 'object') S.cfree = {}; S.cfree[id] = (S.cfree[id] | 0) + (n || 1); }
  };
  var csName = function (id) { var c = CASES.find(function (x) { return x.id === id; }); return c ? c.ic + ' ' + c.n : id; };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var hasTg = function () { try { return !!(tg && tg.initData); } catch (e) { return false; } };
  var req = function (p, b) { return hasTg() ? lbReq(p, b) : Promise.reject(new Error('offline')); };
  var after = function (msg, snd) { try { save(); render(); } catch (e) {} try { sfx(snd || 'coins'); hap('n', 'success'); } catch (e) {} if (msg) toast(msg); };
  var dayOf = function () { var d = new Date(now()); return d.getMonth() === 11 ? d.getDate() : (d.getFullYear() >= 2027 || d.getMonth() === 0 ? 32 : 0); };   // 0 — до декабря, 1..31, 32 — после

  // ----- календарь -----
  function advGen(d) {
    var coins = 80000 * (1 + d * 0.12) * rnd(0.6, 1.8), r = { c: Math.round(coins / 1000) * 1000 };
    if (d === 31) return { c: 3000000, e: 30, cs: 'nygold' };
    if (Math.random() < 0.16 + d * 0.004) r.e = d < 10 ? 2 : d < 20 ? 4 : 8;
    if (Math.random() < 0.06 + d * 0.012) r.cs = d < 12 || Math.random() < 0.6 ? 'nybox' : 'nygold';
    if (Math.random() < 0.14) r.toy = 1;
    return r;
  }
  function advClaim(d) {
    var n = st(), cur = dayOf();
    if (n.adv[d] || d > cur || d < 1) return;
    var r = advGen(d); n.adv[d] = r;
    give.coins(r.c); if (r.e) give.en(r.e); if (r.cs) give.cs(r.cs, 1);
    var tx = '🎁 Окно ' + d + ': +' + fmtN(r.c) + ' 🪙' + (r.e ? ' · +' + r.e + ' ⚡' : '') + (r.cs ? ' · ' + csName(r.cs) : '');
    if (r.toy) toy('календарь', true);
    after(tx, 'ach'); draw();
  }
  var advText = function (r) { return fmtN(r.c) + ' 🪙' + (r.e ? ' · ' + r.e + ' ⚡' : '') + (r.cs ? ' · ' + csName(r.cs) : '') + (r.toy ? ' · 🎄 игрушка' : ''); };

  // ----- ёлка -----
  var tree = { n: 0, mine: 0, ok: false, busy: false };
  var TM = [[500, 150000, 0, ''], [2000, 400000, 5, ''], [10000, 800000, 10, 'nybox'], [30000, 1500000, 15, 'nybox'], [100000, 3000000, 25, 'nygold'], [250000, 5000000, 35, 'nygold'], [500000, 8000000, 50, 'nygold'], [1000000, 15000000, 100, 'nygold']];
  var treeN = function () { return DEMO ? 123456 + st().toys : (tree.ok ? tree.n : st().toys); };
  function treeLoad(cb) {
    if (!on()) return;
    req('/ny/tree').then(function (r) { tree.n = r.n | 0; tree.mine = r.mine | 0; tree.ok = true; flush(); cb && cb(); }).catch(function () { tree.ok = false; cb && cb(); });
  }
  function flush() {
    var n = st();
    if (tree.busy || n.pend < 1 || !hasTg()) return;
    var k = Math.min(10, n.pend); tree.busy = true;
    req('/ny/tree/add', { n: k }).then(function (r) { if (r && r.ok) { n.pend = Math.max(0, n.pend - k); tree.n = r.n | 0; tree.ok = true; save(); } else if (r && r.n) { tree.n = r.n; tree.ok = true; } }).catch(function () {}).then(function () { tree.busy = false; });
  }
  function toy(src, quiet) {
    var n = st(), c = Math.round((5000 + 95000 * Math.pow(Math.random(), 2.6)) / 100) * 100;
    n.toys++; n.pend++; give.coins(c);
    if (!quiet) { toast('🎄 Игрушка на ёлку! +' + fmtN(c) + ' 🪙'); try { sfx('coins'); } catch (e) {} }
    save(); flush(); if (open_) draw();
    return c;
  }
  function tmClaim(i) {
    var n = st(), t = TM[i];
    if (!t || n.tm.indexOf(i) >= 0 || treeN() < t[0] || n.toys < 1) return;
    n.tm.push(i); give.coins(t[1]); if (t[2]) give.en(t[2]); if (t[3]) give.cs(t[3], 1);
    after('🎄 Ёлка: +' + fmtN(t[1]) + ' 🪙' + (t[2] ? ' · +' + t[2] + ' ⚡' : '') + (t[3] ? ' · ' + csName(t[3]) : ''), 'ach'); draw();
  }
  function treeSvg(n) {
    var lit = Math.min(36, Math.round(36 * Math.min(1, Math.sqrt(n / 1000000)) + (n > 0 ? 2 : 0)));
    var pts = [[50, 30], [42, 40], [58, 42], [36, 52], [50, 50], [64, 54], [30, 64], [44, 62], [57, 64], [70, 66], [24, 78], [37, 76], [50, 74], [63, 77], [76, 79], [18, 92], [30, 90], [43, 89], [56, 90], [69, 91], [82, 93], [47, 40], [53, 58], [38, 68], [62, 70], [27, 86], [73, 86], [49, 82], [35, 58], [66, 48], [46, 96], [59, 96], [40, 46], [60, 60], [52, 68], [45, 76]];
    var cols = ['#E5484D', '#FFC857', '#4DA3FF', '#F2EFFF', '#FF8A3D', '#B05BFF'], o = '';
    for (var i = 0; i < lit; i++) o += '<circle cx="' + pts[i][0] + '" cy="' + pts[i][1] + '" r="2.6" fill="' + cols[i % 6] + '" class="nyb" style="animation-delay:' + (i % 7 * 0.25) + 's"/>';
    return '<svg viewBox="0 0 100 112" class="nytreesvg" aria-label="Новогодняя ёлка"><polygon points="50,6 71,40 62,40 82,70 70,70 94,102 6,102 30,70 18,70 38,40 29,40" fill="#1E8F4E"/><polygon points="50,6 62,40 82,70 94,102 50,102" fill="#17743E" opacity=".55"/><rect x="43" y="102" width="14" height="8" rx="2" fill="#7A4A25"/><path d="M50 0l2.2 5h5.3l-4.3 3.2 1.7 5.3-4.9-3.2-4.9 3.2 1.7-5.3L42.5 5h5.3z" fill="#FFD34E"/>' + o + '</svg>';
  }

  // ----- задания -----
  var ANYNICK = function () { return (S.items || []).some(function (x) { return NYW.indexOf(String(x.n).toLowerCase()) >= 0; }); };
  var ACH = [
    { id: 'box', t: 'Открой 12 коробок', d: 'Праздничные картонные коробки в разделе кейсов', goal: 12, cur: function () { return st().boxes; }, c: 800000 },
    { id: 'inv', t: 'Пригласи 3 друзей', d: 'Приглашённые по твоей ссылке из раздела «Друзья»', goal: 3, cur: function () { return st().inv; }, c: 1200000, e: 10 },
    { id: 'toy', t: 'Повесь 10 игрушек на ёлку', d: 'Игрушки выпадают при кручениях', goal: 10, cur: function () { return st().toys; }, c: 500000 },
    { id: 'adv', t: 'Открой 10 окон календаря', d: 'Любые окна адвент-календаря', goal: 10, cur: function () { return Object.keys(st().adv).length; }, c: 700000 },
    { id: 'sp', t: 'Сделай 150 круток в праздник', d: 'Считаются крутки с начала праздника', goal: 150, cur: function () { return Math.max(0, (S.spins | 0) - st().sp0); }, c: 600000, e: 5 },
    { id: 'nick', t: 'Выбей новогодний ник', d: 'snow, elka, ded_moroz и другие', goal: 1, cur: function () { return ANYNICK() ? 1 : 0; }, c: 500000 },
    { id: 'gift', t: 'Подари подарок другу', d: 'Вкладка «Подарки»', goal: 1, cur: function () { return st().gifts; }, c: 300000 },
    { id: 'ng', t: 'Забери подарок 31 декабря', d: 'Особая награда в новогодний день', goal: 1, cur: function () { return st().eve ? 1 : 0; }, c: 1000000 }
  ];
  function achClaim(id) {
    var n = st(), a = ACH.filter(function (x) { return x.id === id; })[0];
    if (!a || n.ach.indexOf(id) >= 0 || a.cur() < a.goal) return;
    n.ach.push(id); give.coins(a.c); if (a.e) give.en(a.e);
    var all = n.ach.length === ACH.length;
    if (all) { give.coins(3000000); unlock('ny27'); }
    after('🏆 ' + a.t + ': +' + fmtN(a.c) + ' 🪙' + (a.e ? ' · +' + a.e + ' ⚡' : '') + (all ? ' · все задания: +3 000 000 🪙 и титул «Встретил 2027»' : ''), 'ach'); draw();
  }
  function unlock(id) { if (!Array.isArray(S.cown)) S.cown = []; if (S.cown.indexOf(id) < 0) S.cown.push(id); }

  // ----- 31 декабря -----
  var eveOpen = function () { var d = new Date(now()); return on() && ((d.getMonth() === 11 && d.getDate() === 31) || (d.getFullYear() === 2027)); };
  function eveClaim() {
    var n = st(); if (n.eve || !eveOpen()) return;
    n.eve = 1; give.coins(3000000); give.en(31); give.cs('nygold', 2); unlock('ny27');
    after('🎆 Подарок Нового года: +3 000 000 🪙, +31 ⚡, 2 золотые коробки и титул «Встретил 2027»', 'ach'); draw(); cardUpd();
  }

  // ----- ночи безумных подарков (30 и 31 декабря): удача ×3 -----
  var NIGHTS = [[new Date(2026, 11, 30, 18).getTime(), new Date(2026, 11, 31, 6).getTime()], [new Date(2026, 11, 31, 18).getTime(), new Date(2027, 0, 1, 6).getTime()]];
  var nightNow = function () { if (!on()) return null; var t = now(); for (var i = 0; i < NIGHTS.length; i++) if (t >= NIGHTS[i][0] && t < NIGHTS[i][1]) return NIGHTS[i]; return null; };
  var nightNext = function () { var t = now(); for (var i = 0; i < NIGHTS.length; i++) if (t < NIGHTS[i][0]) return NIGHTS[i]; return null; };
  NYG.night = nightNow;

  // ----- подарки друзьям -----
  var gf = { load: false, err: '', list: [], left: 0, coins: [25000, 100000, 500000], pick: null, busy: false };
  function gfLoad() {
    gf.load = true; gf.err = '';
    req('/ny/friends').then(function (r) { gf.list = r.friends || []; gf.left = r.left | 0; gf.coins = r.coins || gf.coins; gf.load = false; draw(); })
      .catch(function () { gf.load = false; gf.err = hasTg() ? 'Не удалось загрузить друзей, попробуй позже' : 'Друзья доступны внутри Telegram'; draw(); });
  }
  function giftSend(gid, kind, v) {
    if (gf.busy) return; var n = st();
    if (kind === 'coins' && S.coins < v) return toast('Не хватает монет');
    var idx = -1;
    if (kind === 'nick') { idx = (S.items || []).findIndex(function (x) { return String(x.n).toLowerCase() === v; }); if (idx < 0) return toast('У тебя нет ника @' + v); }
    gf.busy = true;
    req('/ny/gift', { gid: gid, kind: kind, v: v }).then(function (r) {
      gf.busy = false;
      if (!r || !r.ok) { var e = { limit: 'Сегодня уже отправлено 5 подарков', friend: 'Это не твой друг', off: 'Праздник уже закончился', bad: 'Подарок не принят' }[r && r.err]; return toast(e || 'Не получилось отправить'); }
      if (kind === 'coins') S.coins -= v; else { S.items.splice(idx, 1); }
      n.gifts++; gf.left = r.left | 0; gf.pick = null;
      after('🎅 Отправлено: ' + (r.name || 'другу') + ' получит ' + (kind === 'coins' ? fmtN(v) + ' 🪙' : '@' + v) + ' при следующем входе', 'ach'); draw();
    }).catch(function () { gf.busy = false; toast('Нет связи, подарок не отправлен'); });
  }

  // ----- распродажа ⭐ -----
  var SALE = [['pack_pro', 'Набор «Профи»', 99, 79], ['pack_gold', 'Золотой набор', 249, 199], ['energy60', 'Энергия ×60', 39, 29], ['vip_m', 'VIP на 30 дней', 229, 179], ['luck_m', 'Талисман удачи · 30 дней', 249, 199]];
  var saleOn = function () { return on() && now() >= SALE_FROM; };

  // ----- интерфейс -----
  var tab_ = 'adv', open_ = false;
  var TABS = [['adv', '🎁 Календарь'], ['tree', '🎄 Ёлка'], ['ach', '🏆 Задания'], ['gift', '🎅 Подарки'], ['sale', '⭐ Акция']];
  function box() { return document.getElementById('nysheet'); }
  function openHub(t) {
    if (!on()) return toast(teaser() ? 'Новогоднее обновление начнётся 30 ноября' : 'Праздник закончился');
    if (t) tab_ = t;
    var o = box(); if (o) o.remove();
    o = document.createElement('div'); o.id = 'nysheet'; o.className = 'usheet'; document.body.append(o); open_ = true;
    o.onclick = function (e) {
      if (e.target.closest('[data-nx]')) { o.remove(); open_ = false; return; }
      var tb = e.target.closest('[data-nt]'); if (tb) { tab_ = tb.dataset.nt; if (tab_ === 'gift' && !gf.list.length && !gf.load) gfLoad(); if (tab_ === 'ach') invLoad(); try { sfx('tap'); } catch (x) {} return draw(); }
      var b = e.target.closest('[data-na]'); if (!b) return;
      var a = b.dataset.na, v = b.dataset.v;
      if (a === 'adv') return advClaim(+v);
      if (a === 'tm') return tmClaim(+v);
      if (a === 'ach') return achClaim(v);
      if (a === 'eve') return eveClaim();
      if (a === 'pick') { gf.pick = v; return draw(); }
      if (a === 'gcoin') return giftSend(b.dataset.g, 'coins', +b.dataset.v);
      if (a === 'gnick') return giftSend(b.dataset.g, 'nick', b.dataset.v);
      if (a === 'shop') { o.remove(); open_ = false; return goStar(v || 'pack_pro'); }
      if (a === 'promo') { try { navigator.clipboard.writeText('HELLO2027'); toast('Промокод скопирован'); } catch (x) { toast('HELLO2027'); } }
    };
    if (!st().sp0) { st().sp0 = S.spins | 0; save(); }
    treeLoad(function () { if (open_) draw(); });
    if (tab_ === 'gift' && !gf.list.length && !gf.load) gfLoad();
    draw();
  }
  NYG.open = openHub;
  function invLoad() { if (!hasTg()) return; req('/ref/stats').then(function (r) { var n = st(), t = r.total | 0; if (t > n.inv) { n.inv = t; save(); if (open_) draw(); } }).catch(function () {}); }

  function advHtml() {
    var n = st(), cur = dayOf(), cells = '', got = Object.keys(n.adv).length;
    for (var d = 1; d <= 31; d++) {
      var r = n.adv[d], can = !r && d <= cur, cls = r ? ' got' : can ? ' can' : ' lock', today = d === cur ? ' today' : '';
      cells += '<button class="nyd' + cls + today + '" data-na="adv" data-v="' + d + '"' + (can ? '' : ' disabled') + '><b>' + d + '</b><span>' + (r ? '✓' : can ? '🎁' : '🔒') + '</span></button>';
    }
    var last = Object.keys(n.adv).sort(function (a, b) { return b - a; })[0];
    var evel = on() && now() >= new Date(2026, 11, 31).getTime() && now() < END
      ? '<div class="nyeve">🎆 <b>Подарок Нового года</b><small>3 000 000 🪙, 31 ⚡, 2 золотые коробки и титул «Встретил 2027»</small>' + (n.eve ? '<button class="btn" disabled>Получено ✓</button>' : '<button class="btn main" data-na="eve">Забрать</button>') + '</div>' : '';
    var pre = cur === 0 ? '<p class="nyhint">Окна откроются 1 декабря. Каждый день — новое окно, награды случайные: в начале месяца попроще, к 31 декабря ценнее. Пропущенные окна можно открыть позже.</p>' : '<p class="nyhint">Открыто окон: ' + got + ' из 31. Награды случайные и растут к концу месяца. Пропущенные окна можно открыть позже.</p>';
    return pre + '<div class="nygrid">' + cells + '</div>' + (last ? '<p class="nylast">Последняя награда (окно ' + last + '): ' + advText(n.adv[last]) + '</p>' : '') + evel +
      '<div class="nypromo"><div><b>Промокод HELLO2027</b><small>1 000 000 🪙 и 50 ⚡. Действует с 30 ноября по 7 января. Вводится в «Бонусы» → «Промокод»</small></div><button class="btn sm" data-na="promo">Копировать</button></div>';
  }
  function treeHtml() {
    var n = st(), g = treeN(), nxt = TM.findIndex(function (x) { return g < x[0]; });
    var pct = nxt < 0 ? 100 : Math.min(100, (g - (nxt ? TM[nxt - 1][0] : 0)) / (TM[nxt][0] - (nxt ? TM[nxt - 1][0] : 0)) * 100);
    var rows = TM.map(function (t, i) {
      var ok = g >= t[0], cl = n.tm.indexOf(i) >= 0, can = ok && !cl && n.toys >= 1;
      return '<div class="nytm' + (cl ? ' cl' : ok ? ' ok' : '') + '"><div><b>' + fmtN(t[0]) + ' игрушек</b><small>' + fmtN(t[1]) + ' 🪙' + (t[2] ? ' · ' + t[2] + ' ⚡' : '') + (t[3] ? ' · ' + csName(t[3]) : '') + '</small></div>' +
        (cl ? '<em>✓ получено</em>' : can ? '<button class="btn sm main" data-na="tm" data-v="' + i + '">Забрать</button>' : ok ? '<em>нужна своя игрушка</em>' : '<em>ещё ' + fmtN(t[0] - g) + '</em>') + '</div>';
    }).join('');
    var src = DEMO ? '<p class="nyhint">Демо: общий счёт показан условно.</p>' : tree.ok ? '' : '<p class="nyhint">Общий счёт ёлки сейчас недоступен — показаны только твои игрушки.</p>';
    return '<div class="nytree">' + treeSvg(g) + '<div class="nytc"><b>' + fmtN(g) + '</b><small>игрушек у всех игроков</small><span>Твои: ' + fmtN(n.toys) + '</span></div></div>' +
      '<p class="nyhint">Каждое кручение рулетки с шансом 30% приносит игрушку: она сразу даёт от 5 000 до 100 000 🪙 и украшает общую ёлку. Чем больше игроков вешают игрушки, тем больше наград для всех.</p>' + src +
      '<div class="nybar"><i style="width:' + pct + '%"></i></div><div class="nytms">' + rows + '</div>';
  }
  function achHtml() {
    var n = st();
    var rows = ACH.map(function (a) {
      var cur = Math.min(a.goal, a.cur()), done = n.ach.indexOf(a.id) >= 0, can = !done && cur >= a.goal;
      return '<div class="nyq' + (done ? ' got' : '') + '"><div class="nyqt"><b>' + a.t + '</b><span>' + fmtN(a.c) + ' 🪙' + (a.e ? ' · ' + a.e + ' ⚡' : '') + '</span></div><small>' + a.d + '</small><div class="nyqb"><i style="width:' + cur / a.goal * 100 + '%"></i></div><div class="nyqf"><small>' + cur + ' / ' + a.goal + '</small>' + (done ? '<em>Получено ✓</em>' : can ? '<button class="btn sm main" data-na="ach" data-v="' + a.id + '">Забрать</button>' : '') + '</div></div>';
    }).join('');
    return '<p class="nyhint">Выполнено: ' + n.ach.length + ' из ' + ACH.length + '. За все задания — ещё 3 000 000 🪙 и титул «Встретил 2027».</p>' + rows;
  }
  function giftHtml() {
    var mine = (S.items || []).map(function (x) { return String(x.n).toLowerCase(); }).filter(function (x) { return NYW.indexOf(x) >= 0; });
    if (gf.load) return '<p class="nyhint">Загружаю друзей…</p>';
    if (gf.err) return '<p class="nyhint">' + gf.err + '</p>';
    if (!gf.list.length) return '<p class="nyhint">Пока нет друзей, которым можно отправить подарок. Пригласи друзей в разделе «Друзья» — подарки можно отправлять тем, кого ты пригласил, и тому, кто пригласил тебя.</p>';
    var rows = gf.list.map(function (f) {
      var open = gf.pick === String(f.gid);
      return '<div class="nyf"><button class="nyfh" data-na="pick" data-v="' + f.gid + '"><b>' + escH(f.name) + '</b><span>' + (open ? '▾' : '▸ подарить') + '</span></button>' + (open ?
        '<div class="nyfg"><div class="nyfr">' + gf.coins.map(function (c) { return '<button class="btn sm" data-na="gcoin" data-g="' + f.gid + '" data-v="' + c + '"' + (S.coins < c ? ' disabled' : '') + '>' + short(c) + ' 🪙</button>'; }).join('') + '</div>' +
        '<div class="nyfr">' + (mine.length ? Array.from(new Set(mine)).map(function (w) { return '<button class="btn sm" data-na="gnick" data-g="' + f.gid + '" data-v="' + w + '">@' + w + '</button>'; }).join('') : '<small>Ник «под ёлку» можно подарить, если выбить новогодний ник: ' + NYW.slice(0, 5).join(', ') + '…</small>') + '</div></div>' : '') + '</div>';
    }).join('');
    return '<p class="nyhint">Можно отправить до 5 подарков в сутки. Сегодня осталось: ' + gf.left + '. Подарок приходит другу при следующем входе в игру.</p>' + rows;
  }
  function saleHtml() {
    if (!saleOn()) return '<p class="nyhint">Новогодняя распродажа начнётся 20 декабря и продлится до 7 января. Скидки действуют на наборы, энергию, VIP на 30 дней и талисман удачи на 30 дней, цены в магазине покажут старую и новую стоимость.</p>';
    return '<p class="nyhint">Новогодняя распродажа до 7 января. Цены в ⭐ ниже обычных, старая цена зачёркнута. Действует только на эти товары.</p>' + SALE.map(function (x) {
      return '<div class="nysl"><div><b>' + x[1] + '</b><small><s>' + x[2] + ' ⭐</s> → <b>' + x[3] + ' ⭐</b> · −' + Math.round((1 - x[3] / x[2]) * 100) + '%</small></div><button class="btn sm main" data-na="shop" data-v="' + x[0] + '">В магазин</button></div>';
    }).join('');
  }
  function draw() {
    var o = box(); if (!o) return;
    var body = tab_ === 'tree' ? treeHtml() : tab_ === 'ach' ? achHtml() : tab_ === 'gift' ? giftHtml() : tab_ === 'sale' ? saleHtml() : advHtml();
    var ng = nightNow(), nx = nightNext();
    var nb = ng ? '<div class="nynight">🌙 <b>НОЧЬ БЕЗУМНЫХ ПОДАРКОВ!!</b><small>Удача ×3 в рулетке ещё ' + hm(ng[1] - now()) + '</small></div>' : nx ? '<div class="nynight soon">🌙 Ночи безумных подарков: 30 и 31 декабря с 18:00 до 6:00, удача ×3<small>Ближайшая через ' + hm(nx[0] - now()) + '</small></div>' : '';
    var sc = o.querySelector('.nybody'), top = sc ? sc.scrollTop : 0;
    o.innerHTML = '<div class="sbg" data-nx="1"></div><div class="sbox casebox nybox"><div class="shead"><b>🎄 Новый год 2027</b><button class="btn sm" data-nx="1">✕</button></div>' + nb +
      '<div class="ptabs sm nytabs" role="tablist">' + TABS.map(function (t) { return '<button role="tab" data-nt="' + t[0] + '" aria-selected="' + (tab_ === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div><div class="nybody">' + body + '</div></div>';
    var nb2 = o.querySelector('.nybody'); if (nb2) nb2.scrollTop = top;
  }
  function hm(ms) { var s = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(s / 86400), hh = Math.floor(s % 86400 / 3600), mm = Math.floor(s % 3600 / 60); return (d ? d + ' д ' : '') + hh + ' ч ' + mm + ' мин'; }

  // ----- карточка на главном экране -----
  function cardHtml() {
    var t = now(), ng = nightNow();
    if (teaser()) { var d0 = Math.max(0, START - t), dd = Math.ceil(d0 / 864e5); return '<div class="nyc-i">🎄</div><div class="nyc-t"><b>Новогоднее обновление</b><small>Старт 30 ноября · через ' + dd + ' ' + dw(dd) + '</small></div>'; }
    var left = Math.max(0, NYD - t);
    var c = left > 0 ? '<div class="nyc-cd" id="nycd">' + cd(left) + '</div>' : '<div class="nyc-cd">С Новым годом! 🎆</div>';
    var sub = ng ? '🌙 Ночь безумных подарков: удача ×3' : eveOpen() && !st().eve ? '🎆 Ждёт подарок Нового года' : left > 0 ? 'до Нового года · календарь, ёлка, задания' : 'каникулы до 7 января';
    return '<div class="nyc-i">🎄</div><div class="nyc-t"><b>Новый год 2027</b><small>' + sub + '</small></div>' + c;
  }
  var dw = function (n) { return n % 10 === 1 && n % 100 !== 11 ? 'день' : [2, 3, 4].indexOf(n % 10) >= 0 && [12, 13, 14].indexOf(n % 100) < 0 ? 'дня' : 'дней'; };
  function cd(ms) { var s = Math.floor(ms / 1000), d = Math.floor(s / 86400), hh = Math.floor(s % 86400 / 3600), mm = Math.floor(s % 3600 / 60), ss = s % 60, p = function (x) { return String(x).padStart(2, '0'); }; return d + 'д ' + p(hh) + ':' + p(mm) + ':' + p(ss); }
  function cardUpd() {
    var c = document.getElementById('nycard'); if (!c) return;
    if (!on() && !teaser()) { c.remove(); return; }
    var k = String(on()) + String(!!nightNow()) + String(!!st().eve) + String(eveOpen()) + (teaser() ? Math.ceil((START - now()) / 864e5) : '');
    if (c.dataset.k !== k) { c.dataset.k = k; c.innerHTML = cardHtml(); }
    var e = document.getElementById('nycd'); if (e) e.textContent = cd(Math.max(0, NYD - now()));
    c.classList.toggle('night', !!nightNow());
  }
  function mountCard() {
    if (!(on() || teaser()) || document.getElementById('nycard')) return;
    var g = document.getElementById('tab-game'); if (!g) return;
    var c = document.createElement('button'); c.id = 'nycard'; c.className = 'nycard'; c.type = 'button';
    c.onclick = function () { if (on()) { try { sfx('tap'); } catch (e) {} openHub(); } else toast('Новогоднее обновление начнётся 30 ноября'); };
    var anchor = g.querySelector('.reelw'); g.insertBefore(c, anchor || g.firstChild); cardUpd();
  }

  // ----- анимация мифика и секретки -----
  function burst(sec) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    var o = document.createElement('div'); o.className = 'nyburst' + (sec ? ' sec' : ''); o.setAttribute('aria-hidden', 'true');
    var F = sec ? ['🎁', '❄', '🎁', '❅', '⭐', '🎁', '❆', '✦'] : ['🎁', '❄', '❅', '🎁', '❆', '⭐'], s = '', N = sec ? 90 : 70;
    for (var i = 0; i < N; i++) s += '<span style="left:' + (Math.random() * 100).toFixed(1) + '%;animation-delay:' + (Math.random() * 1.6).toFixed(2) + 's;animation-duration:' + (1.8 + Math.random() * 1.6).toFixed(2) + 's;font-size:' + (14 + Math.floor(Math.random() * 24)) + 'px">' + F[i % F.length] + '</span>';
    o.innerHTML = s;
    document.body.appendChild(o); setTimeout(function () { o.remove(); }, 4500);
  }
  NYG.burst = burst;

  // ----- кейсы -----
  NYG.box = function (c) { if (c && c.ny && on()) { st().boxes++; if (open_) draw(); } };

  // ----- подключение к игре -----
  var lastSp = null;
  function tick() {
    if (!on()) return;
    var n = st();
    if (!n.sp0) { n.sp0 = S.spins | 0; save(); }
    if (lastSp === null) lastSp = S.spins | 0;
    var d = (S.spins | 0) - lastSp;
    if (d > 0 && d < 30) { for (var i = 0; i < d; i++) if (Math.random() < 0.3) toy('рулетка'); }
    lastSp = S.spins | 0;
    flush();
  }
  function init() {
    try { if (typeof S === 'undefined') return setTimeout(init, 200); } catch (e) { return setTimeout(init, 200); }
    // новогодние ники на время праздника не хуже «Редких»: у каждого своя редкость (выпавший ник сохраняет её и после праздника)
    var sc0 = window.score, NT = { snow: 3, elka: 3, ded_moroz: 4, snegurka: 4, moroz: 3, sneg: 2, santa: 3, noel: 2, frost: 3, yolka: 2, gift: 2, ny2027: 4, mandarin: 2, salut: 3 }, NP = [0, 0, 75, 100, 130];
    if (typeof sc0 === 'function') window.score = function (s) { if (on() && NT[s] !== undefined) return { t: NT[s], tags: ['новогодний ник'], p: NP[NT[s]] }; return sc0.apply(this, arguments); };
    // ники: на время праздника иногда выпадает новогодний (шанс считаем на итог крутки, а не на каждый образец, иначе он заполонил бы режимы «Редкий+» и «Эпик+»)
    var rl0 = window.roll;
    if (typeof rl0 === 'function' && typeof sc0 === 'function') window.roll = function (m, n) {
      var r = rl0.apply(this, arguments);
      try {
        if (on() && r && Math.random() < 0.04) {
          var min = (m && m.min) || 0, ok = NYW.filter(function (w) { return NT[w] >= min && NT[w] >= r.t; });
          if (ok.length) { var w = ok[Math.floor(Math.random() * ok.length)], x = window.score(w); return Object.assign({}, r, { name: w, t: x.t, tags: x.tags, p: x.p }); }
        }
      } catch (e) {}
      return r;
    };
    // ночи безумных подарков
    var lk = window.luckK;
    if (typeof lk === 'function') window.luckK = function (n) { var k = lk.apply(this, arguments); return nightNow() ? Math.min(9, k * 3) : k; };
    // мифик и секретка
    var ep = window.epic;
    if (typeof ep === 'function') window.epic = function (r) { var x = ep.apply(this, arguments); try { if (on() && r && r.t >= 5) burst(r.t >= 6); } catch (e) {} return x; };
    mountCard(); cardUpd();
    setInterval(function () { tick(); mountCard(); cardUpd(); }, 1000);
    if (on()) treeLoad();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); }); else setTimeout(init, 0);
})();
