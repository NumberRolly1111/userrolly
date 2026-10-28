// Эпичные сцены выпадения: мифический (разлом магмы) и секретный (расшифровка).
// Рисуются на canvas без тяжёлых эффектов (никакого shadowBlur): свечение берётся из заранее нарисованных спрайтов.
// Подключается после app.js и перекрывает старую CSS-сцену; если canvas недоступен, остаётся старая.
(function () {
  'use strict';
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, k) => a + (b - a) * k;
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const easeIO = (x) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const sm = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const rr = (a, b) => a + Math.random() * (b - a);
  const FONT = (s) => `800 ${s}px Unbounded, system-ui, sans-serif`;
  const GL = '01ABCDEF<>/\\|+*#%$&?!ЖЫФЯЮЭΩΨΣ';

  // спрайт мягкого свечения
  function glow(rgb, a0 = 1) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, `rgba(${rgb},${a0})`); g.addColorStop(.25, `rgba(${rgb},${a0 * .45})`); g.addColorStop(.6, `rgba(${rgb},${a0 * .12})`); g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g; x.fillRect(0, 0, 128, 128); return c;
  }
  function ring(rgb) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 60, 128, 128, 128);
    g.addColorStop(0, `rgba(${rgb},0)`); g.addColorStop(.72, `rgba(${rgb},.0)`); g.addColorStop(.88, `rgba(${rgb},.9)`); g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g; x.fillRect(0, 0, 256, 256); return c;
  }

  function epic2(r) {
    return new Promise((res) => {
      let cv, ctx;
      try {
        cv = document.createElement('canvas'); ctx = cv.getContext('2d');
        if (!ctx) throw 0;
      } catch (e) { return res(window.epicOld ? window.epicOld(r) : undefined); }
      const sec = r.t === 6, NAME = String(r.name || '').toLowerCase();
      const fk = (window.S && S.fast) ? .55 : 1;                // быстрый режим: короче
      const o = document.createElement('div');
      o.id = 'epic'; o.className = 'ep2';
      o.style.cssText = 'position:fixed;inset:0;z-index:90;background:#000;opacity:0;transition:opacity .45s ease';
      cv.style.cssText = 'display:block;width:100%;height:100%';
      const skip = document.createElement('div'); skip.className = 'ep-skip'; skip.textContent = 'нажми, чтобы продолжить'; skip.style.opacity = 0; skip.style.transition = 'opacity .6s';
      o.append(cv, skip); document.body.append(o);
      requestAnimationFrame(() => { o.style.opacity = 1; });

      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      let W = 0, H = 0, u = 0;
      const fit = () => { W = Math.max(1, Math.round(innerWidth * dpr)); H = Math.max(1, Math.round(innerHeight * dpr)); cv.width = W; cv.height = H; u = Math.min(W, H); };
      fit(); addEventListener('resize', fit);

      const chars = ['@', ...NAME];
      const N = chars.length;
      // расписание сцены (секунды, до масштабирования fk)
      const TL = sec
        ? { title: 1.3, dec0: 2.2, lock: (i) => 3.0 + i * .42, end: 3.0 + (N - 1) * .42 + 2.6 }
        : { crack: .55, title: 1.9, lock: (i) => 2.7 + i * .4, end: 2.7 + (N - 1) * .4 + 2.6 };
      const DUR = TL.end * fk;

      // шрифт под ширину экрана
      let fs = 0, widths = [];
      const measure = () => {
        fs = u * .2; const tw = (f) => { ctx.font = FONT(f); return chars.reduce((a, c) => a + ctx.measureText(c).width + f * .06, 0); };
        while (tw(fs) > W * .88 && fs > 12) fs *= .95;
        ctx.font = FONT(fs); widths = chars.map((c) => ctx.measureText(c).width);
      };

      // ---------- общие ресурсы ----------
      const gWhite = glow('255,255,255'), gOr = glow('255,120,40'), gRed = glow('230,40,20'), gGold = glow('255,200,120'), gCy = glow('0,229,255', .9), gMg = glow('255,45,85', .8);
      const rOr = ring('255,170,90'), rWh = ring('255,255,255');
      const spr = (img, x, y, s, a) => { if (a <= 0.003) return; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(img, x - s / 2, y - s / 2, s, s); };

      // ---------- мифический ----------
      let cracks = [], embers = [], smoke = [], sparks = [];
      function mkCrack(x, y, ang, len, depth, t0) {
        const step = u * .014, pts = [[x, y]]; let a = ang, drift = 0;
        const n = Math.max(6, Math.floor(len / step));
        for (let i = 0; i < n; i++) {
          drift = drift * .9 + rr(-.085, .085); a += drift;
          x += Math.cos(a) * step; y += Math.sin(a) * step; pts.push([x, y]);
          if (depth < 3 && i > 3 && Math.random() < .05) cracks.push(mkCrack(x, y, a + (Math.random() < .5 ? -1 : 1) * rr(.45, 1), len * rr(.3, .55), depth + 1, t0 + i * step / (u * .5) * .55));
        }
        return { pts, t0, depth, speed: rr(.8, 1.15) };
      }
      function initMyt() {
        const cx = W / 2, cy = H * .46, k = 11;
        for (let i = 0; i < k; i++) cracks.push(mkCrack(cx, cy, i / k * 6.2832 + rr(-.22, .22), u * rr(.55, 1.0), 0, TL.crack + rr(0, .25)));
        for (let i = 0; i < 90; i++) embers.push({ x: Math.random(), y: Math.random() * 1.2, s: rr(.7, 2.4), v: rr(.03, .11), ph: rr(0, 6.28), dr: rr(-.012, .012), b: rr(.4, 1) });
        for (let i = 0; i < 26; i++) smoke.push({ x: Math.random(), y: Math.random() * 1.3, s: rr(.18, .42), v: rr(.012, .035), ph: rr(0, 6.28), a: rr(.05, .13) });
      }
      const cool = (t) => clamp(t / 1.8);
      function myt(t) {
        const cx = W / 2, cy = H * .46;
        const push = 1 + .055 * easeIO(t / (TL.end));
        // плавная тряска из суммы синусов, растёт при ударах
        let amp = u * .0015 * sm(t / 1.2);
        for (let i = 0; i < N; i++) { const d = t - TL.lock(i); if (d > 0 && d < .9) amp += u * .006 * Math.pow(1 - d / .9, 2); }
        const shx = (Math.sin(t * 31) + Math.sin(t * 17.3 + 1)) * .5 * amp, shy = (Math.sin(t * 27 + 2) + Math.sin(t * 13.1)) * .5 * amp;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#060202'; ctx.fillRect(0, 0, W, H);
        ctx.setTransform(push, 0, 0, push, cx - cx * push + shx, cy - cy * push + shy);

        const heat = sm((t - TL.crack) / 2.2);
        // тёплое свечение пола
        ctx.globalCompositeOperation = 'lighter';
        const br = .9 + .1 * Math.sin(t * 2.1);
        spr(gRed, cx, cy, u * (1.0 + heat * 1.6), (.12 + heat * .42) * br);
        spr(gOr, cx, cy, u * (.35 + heat * .75), (.1 + heat * .38) * br);
        // заряд в центре
        const ch = sm(t / TL.crack) * (1 - sm((t - TL.crack - .5) / 1));
        spr(gWhite, cx, cy, u * (.04 + ch * .12), ch * .9);
        spr(gGold, cx, cy, u * (.1 + ch * .3), ch * .8);
        // ударные волны (мягкие кольца)
        for (const [s0, im, al] of [[TL.crack, rOr, .8], [TL.crack + .35, rOr, .5]]) {
          const d = (t - s0) / 1.9; if (d > 0 && d < 1) { const e = easeOut(d); spr(im, cx, cy, u * (.15 + e * 2.3), (1 - d) * (1 - d) * al); }
        }
        // трещины: три слоя, группировка по глубине
        ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const cl = cool(t - TL.crack - 1);
        for (let depth = 0; depth < 4; depth++) {
          const wBase = u * (.0185 - depth * .0035);
          const layers = [[wBase * 2.6, `rgba(210,40,14,${.10 + .05 * heat})`], [wBase * 1.25, `rgba(255,${Math.round(125 - cl * 40)},30,${.38 + heat * .22})`], [wBase * .42, `rgba(255,${Math.round(235 - cl * 30)},${Math.round(190 - cl * 60)},${.9 - cl * .12})`]];
          for (const [w, col] of layers) {
            ctx.beginPath();
            for (const c of cracks) {
              if (c.depth !== depth) continue;
              const k = easeOut(clamp((t - c.t0) / (1.9 / c.speed))); if (k <= 0) continue;
              const m = k * (c.pts.length - 1), mi = Math.floor(m);
              ctx.moveTo(c.pts[0][0], c.pts[0][1]);
              for (let i = 1; i <= mi; i++) ctx.lineTo(c.pts[i][0], c.pts[i][1]);
              if (mi < c.pts.length - 1) { const f = m - mi, a = c.pts[mi], b = c.pts[mi + 1]; ctx.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); }
            }
            ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke();
          }
        }
        // дым (тёмный, нормальное наложение)
        ctx.globalCompositeOperation = 'source-over';
        for (const s of smoke) {
          const y = ((s.y - t * s.v) % 1.3 + 1.3) % 1.3 - .15, x = s.x + Math.sin(t * .4 + s.ph) * .04;
          spr(gRedDark, x * W, y * H, u * s.s * 2, s.a * heat);
        }
        // искры и угли (аддитивно)
        ctx.globalCompositeOperation = 'lighter';
        for (const e of embers) {
          const y = ((e.y - t * e.v) % 1.2 + 1.2) % 1.2 - .1, x = ((e.x + Math.sin(t * .8 + e.ph) * .025 + e.dr * t) % 1 + 1) % 1;
          const tw = .55 + .45 * Math.sin(t * 2.2 + e.ph);
          spr(gOr, x * W, y * H, e.s * 7 * dpr, heat * e.b * tw * .9);
        }
        // заголовок
        const ta = sm((t - TL.title) / 1.0);
        ctx.globalCompositeOperation = 'source-over'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        if (ta > 0) {
          const fsz = u * .05; ctx.font = FONT(fsz); const sp = lerp(1.2, .3, easeOut(ta));
          const title = 'МИФИЧЕСКИЙ'.split('').join(String.fromCharCode(8202).repeat(Math.round(2 + sp * 4)));
          ctx.globalCompositeOperation = 'lighter'; spr(gOr, cx, cy - u * .2, u * .9, ta * .35); ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = ta; ctx.fillStyle = '#ffdacb'; ctx.fillText(title, cx, cy - u * .2 + (1 - ta) * -u * .02); ctx.globalAlpha = 1;
        }
        // буквы: проявляются из жара и остывают
        ctx.font = FONT(fs);
        const total = widths.reduce((a, b) => a + b, 0) + fs * .06 * N; let x = cx - total / 2;
        for (let i = 0; i < N; i++) {
          const w = widths[i], lt = TL.lock(i) - .0, d = t - lt;
          if (d > -.55) {
            const k = easeOut((d + .55) / 1.1), ck = clamp(d / 2.2), px = x + w / 2, py = cy + fs * .05 + (1 - k) * fs * .22, sc = 1 + (1 - k) * .16;
            const heatC = 1 - ck;
            ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc);
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 1; ctx.drawImage(gOr, -w * 1.2, -fs * .95, w * 2.4, fs * 1.9);
            ctx.globalAlpha = clamp(k * (.25 + heatC * .5)); ctx.drawImage(gGold, -w * 1.1, -fs * .9, w * 2.2, fs * 1.8);
            ctx.globalAlpha = clamp(k * (.6 + .4 * heatC));
            ctx.globalAlpha = clamp(k * (.55 + heatC * .3) * (.6 + .06 * Math.sin(t * 3 + i)));
            ctx.restore(); ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc);
            ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = clamp(k * 1.3);
            ctx.lineWidth = fs * .06; ctx.strokeStyle = `rgba(70,12,4,${.55 * k})`; ctx.strokeText(chars[i], 0, 0);
            ctx.fillStyle = `rgb(255,${Math.round(lerp(236, 214, ck) - heatC * 8)},${Math.round(lerp(210, 160, ck))})`; ctx.fillText(chars[i], 0, 0);
            if (heatC > .02) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = clamp(k * heatC * .9); ctx.fillStyle = '#ff7a2a'; ctx.fillText(chars[i], 0, 0); }
            ctx.restore();
          }
          if (d > 0 && !lastHit[i]) { lastHit[i] = 1; for (let q = 0; q < 16; q++) sparks.push({ x: x + w / 2, y: cy + fs * .2, vx: rr(-.5, .5) * u, vy: rr(-.55, .05) * u, l: rr(.7, 1.5), t, s: rr(1, 2.6) * dpr }); }
          x += w + fs * .06;
        }
        // искры с гравитацией и сопротивлением
        ctx.globalCompositeOperation = 'lighter';
        for (const s of sparks) {
          const a = t - s.t; if (a < 0 || a > s.l) continue; const k = a / s.l, drag = 1 - Math.exp(-2.2 * a);
          const sx = s.x + s.vx * drag / 2.2, sy = s.y + s.vy * drag / 2.2 + u * .22 * a * a;
          spr(gGold, sx, sy, s.s * 9, (1 - k) * (1 - k)); spr(gWhite, sx, sy, s.s * 3.5, (1 - k));
        }
        // мягкая вспышка после последней буквы
        const fl = (t - TL.lock(N - 1) - .1) / 1.4;
        if (fl > 0 && fl < 1) { spr(gGold, cx, cy, u * (1.2 + fl * .9), Math.sin(fl * Math.PI) * .4); }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.setTransform(1, 0, 0, 1, 0, 0);
        // виньетка
        const g = ctx.createRadialGradient(cx, cy, u * .45, cx, cy, u * 1.15); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.62)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      const gRedDark = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(40,10,6,.9)'); g.addColorStop(1, 'rgba(40,10,6,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return c; })();
      const lastHit = [];

      // ---------- секретный ----------
      let cols = [];
      function initSec() {
        for (const [n, sz, sp, al] of [[Math.floor(innerWidth / 30), 13, .16, .4], [Math.floor(innerWidth / 44), 17, .26, .7]]) {
          for (let i = 0; i < n; i++) cols.push({ x: (i + .5) / n, sz: sz * dpr, v: sp * rr(.8, 1.25), len: Math.floor(rr(9, 20)), ph: rr(0, 40), al });
        }
      }
      const glyphAt = (a, b, ts) => GL[Math.floor(Math.abs(Math.sin(a * 12.9898 + b * 78.233 + Math.floor(ts) * 3.17) * 43758.5453)) % GL.length];
      const decodeGlyph = (i, t, lock, start) => {   // символ меняется всё реже и фиксируется
        const k = clamp((t - start) / (lock - start)), rate = lerp(26, 5, k * k);
        return GL[Math.floor(Math.abs(Math.sin(i * 91.7 + Math.floor(t * rate) * 12.3) * 9999)) % GL.length];
      };
      function secFn(t) {
        const cx = W / 2, cy = H * .46;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#02030a'; ctx.fillRect(0, 0, W, H);
        const conv = sm((t - TL.lock(0)) / 3.6), fade = sm(t / .8);
        // мягкий свет по центру
        ctx.globalCompositeOperation = 'lighter';
        spr(gCy, cx, cy, u * 1.6, .08 + .1 * sm((t - 1) / 2) );
        // дождь символов
        ctx.globalCompositeOperation = 'source-over'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (const c of cols) {
          const x = c.x * W, head = ((t * c.v + c.ph) % 1.5) * (H + c.len * c.sz * 1.1) - c.len * c.sz * .5;
          ctx.font = `700 ${c.sz}px monospace`;
          const att = 1 - conv * .92;
          for (let j = 0; j < c.len; j++) {
            const y = head - j * c.sz * 1.15; if (y < -c.sz || y > H + c.sz) continue;
            const k = 1 - j / c.len, a = k * k * c.al * att * fade;
            ctx.fillStyle = j === 0 ? `rgba(215,252,255,${Math.min(1, a * 1.9)})` : `rgba(70,${Math.round(170 + k * 70)},${Math.round(200 + k * 50)},${a})`;
            ctx.fillText(glyphAt(x, j + Math.floor(head / c.sz), t * .8 + x), x, y);
          }
        }
        // луч-сканер
        const sy = (((t * .22) % 1.25) - .12) * H;
        const g = ctx.createLinearGradient(0, sy - u * .08, 0, sy + u * .08); g.addColorStop(0, 'rgba(0,229,255,0)'); g.addColorStop(.5, 'rgba(0,229,255,.10)'); g.addColorStop(1, 'rgba(0,229,255,0)');
        ctx.fillStyle = g; ctx.fillRect(0, sy - u * .08, W, u * .16);
        // кольца замка
        const ra = easeOut((t - .7) / 1.6);
        if (ra > 0) {
          ctx.save(); ctx.translate(cx, cy); ctx.lineWidth = Math.max(1, dpr);
          for (let q = 0; q < 3; q++) {
            ctx.save(); ctx.rotate(t * (q % 2 ? -.35 : .3) * (1 - conv * .5)); ctx.strokeStyle = `rgba(190,240,255,${.2 * ra * (1 - conv * .6)})`; ctx.setLineDash([u * .035, u * .028 * (q + 1)]);
            ctx.beginPath(); ctx.arc(0, 0, u * (.27 + q * .06) * (.8 + .2 * ra), 0, 6.2832); ctx.stroke(); ctx.restore();
          }
          ctx.restore(); ctx.setLineDash([]);
        }
        // заголовок: расшифровка
        const title = 'СЕКРЕТНЫЙ', ta = clamp((t - TL.title) / 1.4);
        ctx.font = FONT(u * .055);
        if (ta > 0) {
          let tx = ''; for (let i = 0; i < title.length; i++) tx += ta * title.length > i + .6 ? title[i] : decodeGlyph(i + 40, t, TL.title + 1.4, TL.title);
          tx = tx.split('').join(String.fromCharCode(8202).repeat(3));
          const split = u * .0035 * (1 - ta * .6), y = cy - u * .2;
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = `rgba(255,45,85,${.8 * sm(ta * 3)})`; ctx.fillText(tx, cx - split, y);
          ctx.fillStyle = `rgba(0,229,255,${.8 * sm(ta * 3)})`; ctx.fillText(tx, cx + split, y);
          ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = `rgba(255,255,255,${sm(ta * 3)})`; ctx.fillText(tx, cx, y);
        }
        // имя: символы замедляются и фиксируются
        ctx.font = FONT(fs);
        const total = widths.reduce((a, b) => a + b, 0) + fs * .06 * N; let x = cx - total / 2;
        for (let i = 0; i < N; i++) {
          const w = widths[i], lk = TL.lock(i), d = t - lk, st = TL.dec0, on = sm((t - st) / .5);
          if (on > 0) {
            const locked = d >= 0, sh = locked ? chars[i] : decodeGlyph(i, t, lk, st);
            const px = x + w / 2, py = cy + fs * .05;
            const pulse = locked ? Math.pow(Math.max(0, 1 - d / 1.1), 2) : 0;
            const split = fs * (locked ? .045 * pulse + .008 : .05);
            ctx.globalCompositeOperation = 'lighter';
            if (pulse > 0) { spr(gCy, px, py, fs * 2.6, pulse * .55); spr(gWhite, px, py, fs * 1.5, pulse * .35); }
            ctx.globalAlpha = on * (locked ? 1 : .8); ctx.fillStyle = 'rgba(255,45,85,.85)'; ctx.fillText(sh, px - split, py);
            ctx.fillStyle = 'rgba(0,229,255,.85)'; ctx.fillText(sh, px + split, py);
            ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = on * (locked ? 1 : .55); ctx.fillStyle = locked ? '#fff' : '#bfefff'; ctx.fillText(sh, px, py); ctx.globalAlpha = 1;
          }
          x += w + fs * .06;
        }
        // подпись и блик по готовому имени
        const done = TL.lock(N - 1) + .3, la = sm((t - done) / .7);
        if (la > 0) {
          ctx.globalAlpha = la; ctx.font = `700 ${Math.round(u * .028)}px monospace`; ctx.fillStyle = '#7fe9ff'; ctx.fillText('[ ДОСТУП ОТКРЫТ ]', cx, cy + fs * .85); ctx.globalAlpha = 1;
          const sw = (t - done - .2) / 1.3;
          if (sw > 0 && sw < 1) { ctx.globalCompositeOperation = 'lighter'; spr(gWhite, lerp(cx - total / 2 - fs, cx + total / 2 + fs, easeIO(sw)), cy + fs * .05, fs * 1.6, Math.sin(sw * Math.PI) * .22); }
        }
        // мягкая вспышка при завершении
        const f = (t - TL.lock(N - 1)) / 1.2;
        if (f > 0 && f < 1) { ctx.globalCompositeOperation = 'lighter'; spr(gWhite, cx, cy, u * 2.2, Math.pow(1 - f, 2) * .28); spr(gCy, cx, cy, u * 1.8, Math.pow(1 - f, 2) * .2); }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        // строки развёртки и виньетка
        ctx.fillStyle = 'rgba(0,0,0,.12)'; for (let y = 0; y < H; y += 4 * dpr) ctx.fillRect(0, y, W, dpr);
        const vg = ctx.createRadialGradient(cx, cy, u * .35, cx, cy, u * 1.15); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.7)');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      }

      // ---------- запуск ----------
      measure(); if (sec) initSec(); else initMyt();
      const run = () => {
        const t0 = performance.now(); let raf = 0, done = false, tm = [];
        const fin = () => {
          if (done) return; done = true; cancelAnimationFrame(raf); tm.forEach(clearTimeout); removeEventListener('resize', fit);
          o.style.opacity = 0; setTimeout(() => { o.remove(); res(); }, 480);
        };
        r.epic = true;
        try { sfx('tier', r.t); hap('n', 'success'); rareHap(r.t); } catch (e) {}
        for (let i = 0; i < N; i++) tm.push(setTimeout(() => { try { sfx(sec ? 'sec' : 'myt', i); hap('i', sec ? 'medium' : 'heavy'); } catch (e) {} }, TL.lock(i) * fk * 1000));
        tm.push(setTimeout(() => { skip.style.opacity = .85; }, 1500));
        tm.push(setTimeout(fin, DUR * 1000));
        setTimeout(() => { o.onclick = fin; }, 900);
        const loop = () => {
          if (done) return;
          const t = (performance.now() - t0) / 1000 / fk;
          try { sec ? secFn(t) : myt(t); } catch (e) { fin(); return; }
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      };
      (document.fonts && document.fonts.load ? document.fonts.load('800 40px Unbounded', 'Aa Яя@').catch(() => {}) : Promise.resolve()).then(() => { measure(); run(); });
    });
  }
  window.epic2 = epic2;
})();
