// js/nav.js — DRE-7: Shared Nav & Alpine store
// Runs deferred, BEFORE Alpine CDN (script order in <head> guarantees this).

// ── Location detection ──────────────────────────────────────────────────────
const _inModules = location.pathname.includes('/modules/');
const pathPrefix = _inModules ? '../' : '';

// Derive current module id from filename, e.g. /modules/03-event-storming.html → module-03
function deriveCurrentModuleId() {
  const m = location.pathname.match(/\/modules\/(\d{2})-[^/]+(?:\.html)?$/);
  return m ? 'module-' + m[1] : null;
}

// ── Module data (single source of truth) ───────────────────────────────────
const MODULE_LIST = [
  { id: 'module-01', num: '01', en: 'Introduction',     th: 'บทนำ',                           href: '01-intro.html' },
  { id: 'module-02', num: '02', en: 'DDD Fundamentals', th: 'พื้นฐาน DDD',                     href: '02-ddd.html' },
  { id: 'module-03', num: '03', en: 'Event Storming',   th: 'Event Storming',                 href: '03-event-storming.html' },
  { id: 'module-04', num: '04', en: 'ES → DDD',         th: 'ES สู่ DDD',                      href: '04-es-to-ddd.html' },
  { id: 'module-05', num: '05', en: 'EDA',              th: 'สถาปัตยกรรมเชิงเหตุการณ์',         href: '05-eda.html' },
  { id: 'module-06', num: '06', en: 'ES → EDA',         th: 'ES สู่ EDA',                      href: '06-es-to-eda.html' },
  { id: 'module-07', num: '07', en: 'Case Study',       th: 'กรณีศึกษา',                       href: '07-case-study.html' },
];

// ── Alpine store registration (fires before Alpine scans DOM) ───────────────
document.addEventListener('alpine:init', function () {
  Alpine.store('app', {
    lang: localStorage.getItem('lang') || 'en',
    progress: JSON.parse(localStorage.getItem('ddd-progress') || '{}'),
    pathPrefix: pathPrefix,
    currentModuleId: deriveCurrentModuleId(),
    setLang: function (next) {
      this.lang = next;
      localStorage.setItem('lang', next);
      document.body.setAttribute('data-lang', next);
      document.dispatchEvent(new CustomEvent('lang-change', { detail: next }));
    },
    toggleLang: function () {
      this.setLang(this.lang === 'en' ? 'th' : 'en');
    },
    isModuleComplete: function (id) {
      return !!(this.progress[id] && this.progress[id].quizCompleted === true);
    },
    tooltipOpen: null,
    openTooltip: function (id) { this.tooltipOpen = id; },
    closeTooltip: function () { this.tooltipOpen = null; },
    saveProgress: function (moduleId, score) {
      this.progress[moduleId] = { quizCompleted: true, score: score };
      localStorage.setItem('ddd-progress', JSON.stringify(this.progress));
    },
  });

  // Sync body[data-lang] on init so Sarabun CSS rule fires immediately on reload
  document.body.setAttribute('data-lang', Alpine.store('app').lang);

  Alpine.store('modules', {
    list: MODULE_LIST,
  });
});

// ── Nav injection (async fetch → Alpine MutationObserver picks up new DOM) ──
(async function injectNav() {
  const root = document.getElementById('nav-root');
  if (!root) return;
  try {
    const url = pathPrefix + 'components/nav.html';
    const res = await fetch(url);
    if (!res.ok) { console.error('[nav] fetch failed', res.status, url); return; }
    root.innerHTML = await res.text();
  } catch (err) {
    console.error('[nav] inject error', err);
  }
})();
