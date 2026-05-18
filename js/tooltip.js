// js/tooltip.js — DRE-15: tooltip & glossary system
(function () {
  'use strict';

  let CACHE = { en: null, th: null };
  let FETCHING = { en: null, th: null };
  let bubble;
  let sheet;
  let overlay;

  function getStore() { return window.Alpine && Alpine.store('app'); }
  function pathPrefix() { return getStore()?.pathPrefix || ''; }
  function lang() { return getStore()?.lang || 'en'; }
  function pick(field, l) { return (field && (field[l] || field.en)) || ''; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  async function load(l) {
    if (CACHE[l]) return CACHE[l];
    if (!FETCHING[l]) {
      FETCHING[l] = fetch(`${pathPrefix()}content/tooltips/${l}.json`)
        .then(r => r.ok ? r.json() : { tooltips: [] })
        .then(d => { CACHE[l] = d; return d; })
        .catch(() => ({ tooltips: [] }));
    }
    return FETCHING[l];
  }

  function findTip(data, id) {
    return (data.tooltips || []).find(t => t.id === id);
  }

  function isDesktop() {
    return window.matchMedia('(min-width: 768px)').matches;
  }

  // ── Singleton elements ────────────────────────────────────────────────────

  function ensureBubble() {
    if (bubble) return bubble;
    bubble = document.createElement('div');
    bubble.className = 'tooltip-bubble';
    bubble.setAttribute('role', 'tooltip');
    bubble.hidden = true;
    document.body.appendChild(bubble);
    return bubble;
  }

  function ensureSheet() {
    if (sheet) return sheet;
    overlay = document.createElement('div');
    overlay.className = 'tooltip-overlay';
    overlay.hidden = true;
    overlay.addEventListener('click', closeSheet);

    sheet = document.createElement('aside');
    sheet.className = 'tooltip-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.hidden = true;
    document.body.appendChild(overlay);
    document.body.appendChild(sheet);
    return sheet;
  }

  // ── Desktop popover ───────────────────────────────────────────────────────

  let hoverTarget = null;

  function showBubble(trigger, tip) {
    const b = ensureBubble();
    const l = lang();
    b.innerHTML = `<strong>${esc(pick(tip.term, l))}</strong><p>${esc(pick(tip.short, l))}</p>`;
    const r = trigger.getBoundingClientRect();
    b.hidden = false;
    b.style.top = (window.scrollY + r.bottom + 8) + 'px';
    b.style.left = Math.max(8, Math.min(
      window.innerWidth - b.offsetWidth - 8,
      window.scrollX + r.left
    )) + 'px';
    hoverTarget = trigger;
    getStore()?.openTooltip(tip.id);
  }

  function hideBubble() {
    if (!bubble) return;
    bubble.hidden = true;
    hoverTarget = null;
    getStore()?.closeTooltip();
  }

  // ── Mobile sheet ──────────────────────────────────────────────────────────

  function showSheet(tip) {
    const s = ensureSheet();
    const l = lang();
    s.innerHTML =
      `<button class="tooltip-sheet__close" aria-label="Close">&times;</button>` +
      `<h2>${esc(pick(tip.term, l))}</h2>` +
      `<p>${esc(pick(tip.full, l))}</p>` +
      (pick(tip.example, l)
        ? `<p class="tooltip-sheet__example"><em>${esc(pick(tip.example, l))}</em></p>`
        : '');
    s.querySelector('.tooltip-sheet__close').addEventListener('click', closeSheet);
    overlay.hidden = false;
    s.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    getStore()?.openTooltip(tip.id);
  }

  function closeSheet() {
    if (!sheet) return;
    sheet.hidden = true;
    overlay.hidden = true;
    document.documentElement.style.overflow = '';
    getStore()?.closeTooltip();
  }

  // ── Event delegation ──────────────────────────────────────────────────────

  let bound = false;
  async function bindOnce() {
    if (bound) return;
    bound = true;

    document.addEventListener('mouseover', async (e) => {
      const t = e.target.closest('.tooltip-trigger');
      if (!t || !isDesktop()) return;
      const data = await load(lang());
      const tip = findTip(data, t.dataset.tooltip);
      if (tip) showBubble(t, tip);
    });

    document.addEventListener('mouseout', (e) => {
      const t = e.target.closest('.tooltip-trigger');
      if (!t || !isDesktop()) return;
      const to = e.relatedTarget;
      if (to && (to.closest('.tooltip-bubble') || to.closest('.tooltip-trigger'))) return;
      hideBubble();
    });

    document.addEventListener('mouseleave', (e) => {
      if (e.target?.classList?.contains?.('tooltip-bubble')) hideBubble();
    }, true);

    document.addEventListener('click', async (e) => {
      const t = e.target.closest('.tooltip-trigger');
      if (t) {
        e.preventDefault();
        const data = await load(lang());
        const tip = findTip(data, t.dataset.tooltip);
        if (!tip) return;
        if (isDesktop()) {
          if (hoverTarget === t) hideBubble(); else showBubble(t, tip);
        } else {
          showSheet(tip);
        }
        return;
      }
      if (bubble && !bubble.hidden && !e.target.closest('.tooltip-bubble')) {
        hideBubble();
      }
    });

    document.addEventListener('keydown', async (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const t = document.activeElement;
      if (!t || !t.classList?.contains('tooltip-trigger')) return;
      e.preventDefault();
      const data = await load(lang());
      const tip = findTip(data, t.dataset.tooltip);
      if (!tip) return;
      if (isDesktop()) showBubble(t, tip); else showSheet(tip);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (sheet && !sheet.hidden) closeSheet();
      else hideBubble();
    });

    document.addEventListener('lang-change', () => {
      hideBubble();
      closeSheet();
    });
  }

  function initTooltips() {
    bindOnce();
    load(lang());
  }

  window.initTooltips = initTooltips;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
  } else {
    initTooltips();
  }
})();
