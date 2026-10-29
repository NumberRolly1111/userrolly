// Замена эмодзи на векторные иконки по всему интерфейсу.
// Работает на лету: смотрит за новыми узлами страницы и заменяет в тексте знакомые эмодзи на <svg>.
// Чтобы добавить иконку, впиши эмодзи и svg-содержимое (viewBox 24×24) в ICONS.
(function () {
  const S = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const G = (c) => `fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  const GOLD = '#FFC933', GD = '#C98A00';
  const I = {};
  const add = (keys, inner, attrs) => keys.split(' ').forEach((k) => { I[k] = { inner, attrs: attrs || S }; });
  // цветные «валютные» иконки
  add('🪙', `<circle cx="12" cy="12" r="9.5" fill="${GOLD}" stroke="${GD}" stroke-width="1.6"/><circle cx="12" cy="12" r="6" fill="none" stroke="${GD}" stroke-width="1.5"/><path d="M12 8.6v6.8M10.2 10.2c0-1 3.6-1 3.6 0 0 1.3-3.6 .8-3.6 2.2 0 1 3.6 1 3.6 0" fill="none" stroke="${GD}" stroke-width="1.2" stroke-linecap="round"/>`, 'stroke-linejoin="round"');
  add('⭐', `<path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z" fill="${GOLD}" stroke="${GD}" stroke-width="1.5" stroke-linejoin="round"/>`, '');
  add('⚡', `<path d="M13.5 2L4.5 14H11l-1 8 9-12h-6.5z" fill="#FFB62E" stroke="#D98A00" stroke-width="1.5" stroke-linejoin="round"/>`, '');
  add('👑', `<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="${GOLD}" stroke="${GD}" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="4" r="1.2" fill="${GOLD}"/>`, '');
  add('🔥', `<path d="M12 22c4.2 0 7-3 7-7 0-3-2-5.2-3.2-7.2-.6 1.8-1.6 2.8-3 3 .2-3.2-1.2-6.2-4.3-7.8.2 5-4.5 7-4.5 12 0 4 3 7 8 7z" fill="#FF7A2E" stroke="#D9501A" stroke-width="1.4" stroke-linejoin="round"/>`, '');
  add('💎', `<path d="M6 3h12l4 6-10 12L2 9z" fill="#5CE1E6" stroke="#1C9AA6" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 9h20M9 3L7 9l5 12 5-12-2-6" fill="none" stroke="#1C9AA6" stroke-width="1.3" stroke-linejoin="round"/>`, '');
  add('🏆', `<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6" fill="none" stroke="${GOLD}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`, '');
  add('🟣', `<circle cx="12" cy="12" r="8" fill="#B455FF"/>`, '');
  add('✅', `<circle cx="12" cy="12" r="9" fill="none" stroke="#3DDC84" stroke-width="2"/><path d="M8 12.5l3 3 5-6" fill="none" stroke="#3DDC84" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`, '');
  add('💰', `<path d="M9 3h6l-1.5 3h-3zM8 8c-3 3-4 6-4 9a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4c0-3-1-6-4-8z" fill="none" stroke="${GOLD}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12v6" stroke="${GOLD}" stroke-width="2" stroke-linecap="round"/>`, '');
  add('🌸', `<g fill="#FF8FC4"><circle cx="12" cy="6" r="3.2"/><circle cx="18" cy="10.5" r="3.2"/><circle cx="15.8" cy="17.5" r="3.2"/><circle cx="8.2" cy="17.5" r="3.2"/><circle cx="6" cy="10.5" r="3.2"/></g><circle cx="12" cy="12" r="2.6" fill="#FFC933"/>`, '');
  // линейные иконки
  add('📦', '<path d="M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8"/>');
  add('🎁', '<path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H8a2.5 2.5 0 1 1 0-5c2 0 4 5 4 5zM12 7h4a2.5 2.5 0 1 0 0-5c-2 0-4 5-4 5z"/>');
  add('🏛️ 🏛', '<path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M2 10l10-7 10 7z"/>');
  add('🎟️ 🎫', '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4zM14 7v10"/>');
  add('🔝', '<path d="M5 4h14M12 20V8M6 14l6-6 6 6"/>');
  add('✨', '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 3v4M17 5h4M5 17v4M3 19h4"/>');
  add('🛡️ 🛡', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>');
  add('🎉', '<path d="M4 20l5-14 9 9zM14 4v2M19 8h2M18 3l1 1M9 6l1-1"/>');
  add('🏅 🎖️', '<circle cx="12" cy="15" r="5"/><path d="M8.5 3l3.5 7 3.5-7"/>');
  add('🔒', '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>');
  add('🎰', '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16M3 10h18"/>');
  add('⚗️', '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3M7.5 14h9"/>');
  add('🎡', '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v7M12 14v7M3 12h7M14 12h7M5.6 5.6l5 5M13.4 13.4l5 5M18.4 5.6l-5 5M10.6 13.4l-5 5"/>');
  add('🔨', '<path d="M15 4l5 5-3 3-5-5zM12 9l-8 8 3 3 8-8M3 21h8"/>');
  add('📖', '<path d="M2 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h8z"/>');
  add('⏱ ⏳ ⏱️', '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>');
  add('📈', '<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>');
  add('📉', '<path d="M3 7l6 6 4-4 8 8M15 17h6v-6"/>');
  add('🏷️', '<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1"/>');
  add('📅', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>');
  add('🌙', '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>');
  add('🗂️ 🗄️', '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>');
  add('🛒', '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11l2-8H6"/>');
  add('💬', '<path d="M21 12a8 8 0 0 1-11.5 7.2L4 21l1.8-5A8 8 0 1 1 21 12z"/>');
  add('🎲', '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/>');
  add('🖼️', '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 16l-5-5-9 9"/>');
  add('🔎', '<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5"/>');
  add('✏️', '<path d="M4 20l1-4L17 4l3 3L8 19zM14 7l3 3"/>');
  add('🔧', '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-3 3-2.4-.6-.6-2.4z"/>');
  add('🕶️', '<path d="M2 11h20M4.5 11l1 6h4l1-4h3l1 4h4l1-6"/>');
  add('🧭', '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>');
  add('⚔️', '<path d="M5 3l9 9M3 5l4 4M19 3l-9 9M21 5l-4 4M8 14l-4 4M16 14l4 4M9 15l-2 2M15 15l2 2"/>');
  add('🦅', '<path d="M3 7c4 0 6 2 9 6 3-4 5-6 9-6-1 6-4 9-9 11C7 16 4 13 3 7z"/>');
  add('🐉', '<path d="M5 19c-2-5 1-10 6-10 4 0 5 3 3 5-1 1-3 1-3-1M14 9c1-3 3-4 6-4-1 3-2 4-4 5M9 19h6"/>');
  add('💠', '<path d="M12 2l9 10-9 10-9-10z"/><path d="M12 7l4.5 5-4.5 5-4.5-5z"/>');
  add('☄️', '<circle cx="17" cy="7" r="4"/><path d="M13.5 10.5L3 21M10 8L3 15M16 14l-7 7"/>');
  add('🌌', '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M4 19c4 2 11 2 16-3"/>');
  add('🔔', '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/>');
  add('⚙ ⚙️', '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>');
  add('👋', '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01"/>');
  add('🔮', '<circle cx="12" cy="11" r="7"/><path d="M7 20h10M9 20l1-2h4l1 2M9 8a4 4 0 0 1 3-2"/>');
  // таблица «эмодзи → svg»
  const keys = Object.keys(I).sort((a, b) => b.length - a.length);
  const esc = (k) => k.replace(/️/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('(' + [...new Set(keys.map(esc))].join('|') + ')\\uFE0F?', 'g');
  const norm = (e) => e.replace(/️/g, '');
  const lookup = (e) => I[e] || I[e + '️'] || I[norm(e)] || null;
  const svg = (e) => { const d = lookup(e); return d ? `<svg viewBox="0 0 24 24" aria-hidden="true" ${d.attrs}>${d.inner}</svg>` : ''; };
  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1, TITLE: 1, CANVAS: 1, NOSCRIPT: 1, SVG: 1 };
  const quick = new RegExp(re.source);
  function textNode(n) {
    const t = n.nodeValue;
    if (!t || !quick.test(t)) return;
    const p = n.parentNode;
    if (!p || SKIP[p.nodeName.toUpperCase()] || (p.closest && p.closest('[data-noic]'))) return;
    re.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while ((m = re.exec(t))) {
      if (m.index > last) frag.append(t.slice(last, m.index));
      const k = m[1], s = svg(k);
      if (s) { const i = document.createElement('i'); i.className = 'ic'; i.setAttribute('role', 'img'); i.dataset.e = k; i.innerHTML = s; frag.append(i); }
      else frag.append(m[0]);
      last = m.index + m[0].length;
    }
    if (last < t.length) frag.append(t.slice(last));
    p.replaceChild(frag, n);
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) return textNode(root);
    if (root.nodeType !== 1 || SKIP[root.nodeName.toUpperCase()]) return;
    if (root.closest && root.closest('[data-noic]')) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const list = [];
    for (let n = w.nextNode(); n; n = w.nextNode()) list.push(n);
    list.forEach(textNode);
  }
  window.iconize = walk;
  let q = new Set(), raf = 0;
  const flush = () => { raf = 0; const a = [...q]; q = new Set(); a.forEach((n) => { if (n.isConnected) walk(n); }); };
  const mo = new MutationObserver((recs) => {
    for (const r of recs) {
      if (r.type === 'childList') r.addedNodes.forEach((n) => { if (n.nodeType === 1 || n.nodeType === 3) q.add(n); });
      else if (r.type === 'characterData') q.add(r.target);
    }
    if (!raf) raf = requestAnimationFrame(flush);
  });
  const start = () => { walk(document.body); mo.observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
