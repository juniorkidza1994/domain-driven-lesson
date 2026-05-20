// js/nav.js — DRE-7 + DRE-29: Shared Nav, Alpine store, named profiles
// Runs deferred, BEFORE Alpine CDN.

const _inModules = location.pathname.includes('/modules/');
const pathPrefix = _inModules ? '../' : '';

function deriveCurrentModuleId() {
  const m = location.pathname.match(/\/modules\/(\d{2})-[^/]+(?:\.html)?$/);
  return m ? 'module-' + m[1] : null;
}

const MODULE_LIST = [
  { id: 'module-01', num: '01', en: 'Introduction',     th: 'บทนำ',                           href: '01-intro.html' },
  { id: 'module-02', num: '02', en: 'DDD Fundamentals', th: 'พื้นฐาน DDD',                     href: '02-ddd.html' },
  { id: 'module-03', num: '03', en: 'Event Storming',   th: 'Event Storming',                 href: '03-event-storming.html' },
  { id: 'module-04', num: '04', en: 'ES → DDD',         th: 'ES สู่ DDD',                      href: '04-es-to-ddd.html' },
  { id: 'module-05', num: '05', en: 'EDA',              th: 'สถาปัตยกรรมเชิงเหตุการณ์',         href: '05-eda.html' },
  { id: 'module-06', num: '06', en: 'ES → EDA',         th: 'ES สู่ EDA',                      href: '06-es-to-eda.html' },
  { id: 'module-07', num: '07', en: 'Case Study',       th: 'กรณีศึกษา',                       href: '07-case-study.html' },
];

// ── Profile helpers ────────────────────────────────────────────────────────
const PROFILE_KEY     = 'ddd-active-profile';   // sessionStorage
const PROFILES_KEY    = 'ddd-profiles';         // localStorage
const PROGRESS_PREFIX = 'ddd-progress-';        // localStorage prefix
const LEGACY_PROGRESS = 'ddd-progress';         // localStorage legacy

function readProfilesList() {
  try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]'); }
  catch (e) { return []; }
}
function readProgressFor(name) {
  if (!name) {
    // legacy fallback (read-only)
    try { return JSON.parse(localStorage.getItem(LEGACY_PROGRESS) || '{}'); }
    catch (e) { return {}; }
  }
  try { return JSON.parse(localStorage.getItem(PROGRESS_PREFIX + name) || '{}'); }
  catch (e) { return {}; }
}

document.addEventListener('alpine:init', function () {
  const initialActive = sessionStorage.getItem(PROFILE_KEY) || '';
  const initialProfiles = readProfilesList();

  Alpine.store('app', {
    // ── Existing ──────────────────────────────────────────────
    lang: localStorage.getItem('lang') || 'en',
    pathPrefix: pathPrefix,
    currentModuleId: deriveCurrentModuleId(),
    tooltipOpen: null,
    openTooltip(id) { this.tooltipOpen = id; },
    closeTooltip()  { this.tooltipOpen = null; },
    setLang(next) {
      this.lang = next;
      localStorage.setItem('lang', next);
      document.body.setAttribute('data-lang', next);
      document.dispatchEvent(new CustomEvent('lang-change', { detail: next }));
    },
    toggleLang() { this.setLang(this.lang === 'en' ? 'th' : 'en'); },

    // ── Profile state (DRE-29) ────────────────────────────────
    activeProfile: initialActive,
    profiles: initialProfiles,
    profileModalOpen: false,
    profileModalView: 'list',   // 'list' | 'create'
    profileChipOpen: false,
    nameInput: '',
    nameError: '',

    // Progress is profile-scoped
    progress: readProgressFor(initialActive),

    // ── Profile methods ───────────────────────────────────────
    _progressKey() {
      return this.activeProfile ? (PROGRESS_PREFIX + this.activeProfile) : LEGACY_PROGRESS;
    },
    _persistProfilesOrder() {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(this.profiles));
    },
    _loadProgressForActive() {
      this.progress = readProgressFor(this.activeProfile);
    },
    setActiveProfile(name) {
      this.activeProfile = name;
      sessionStorage.setItem(PROFILE_KEY, name);
      // move to head of MRU list
      this.profiles = [name].concat(this.profiles.filter(p => p !== name));
      this._persistProfilesOrder();
      this._loadProgressForActive();
    },
    createProfile(rawName) {
      const name = (rawName || '').trim();
      if (!name) { this.nameError = 'Please enter a name.'; return false; }
      if (name.length > 40) { this.nameError = 'Name too long (max 40).'; return false; }
      this.nameError = '';
      if (!this.profiles.includes(name)) {
        this.profiles = [name].concat(this.profiles);
        this._persistProfilesOrder();
      }
      this.setActiveProfile(name);
      this.profileModalOpen = false;
      this.nameInput = '';
      return true;
    },
    switchProfile(name) {
      this.setActiveProfile(name);
      this.profileModalOpen = false;
      this.profileChipOpen = false;
    },
    openSwitchModal() {
      // Clear active for this tab so user must re-pick
      sessionStorage.removeItem(PROFILE_KEY);
      this.activeProfile = '';
      this.profiles = readProfilesList();
      this.profileModalView = this.profiles.length ? 'list' : 'create';
      this.profileModalOpen = true;
      this.profileChipOpen = false;
    },
    openNewProfileModal() {
      this.profileModalView = 'create';
      this.profileModalOpen = true;
      this.profileChipOpen = false;
      this.nameInput = '';
      this.nameError = '';
    },
    // Called once at startup after Alpine ready
    initProfileFlow() {
      if (this.activeProfile) { return; } // Case C
      this.profileModalView = this.profiles.length ? 'list' : 'create';
      this.profileModalOpen = true;
    },

    // ── Progress (now profile-scoped) ─────────────────────────
    isModuleComplete(id) {
      return !!(this.progress[id] && this.progress[id].quizCompleted === true);
    },
    saveProgress(moduleId, score) {
      this.progress[moduleId] = { quizCompleted: true, score: score };
      localStorage.setItem(this._progressKey(), JSON.stringify(this.progress));
    },
    clearProgress() {
      // Clears progress only for the active profile. Does NOT remove the profile from PROFILES_KEY.
      this.progress = {};
      localStorage.setItem(this._progressKey(), JSON.stringify(this.progress));
    },
  });

  // Sync body[data-lang]
  document.body.setAttribute('data-lang', Alpine.store('app').lang);

  // Trigger profile flow once Alpine has finished initial rendering
  // (use queueMicrotask so MutationObserver picks up nav DOM first)
  queueMicrotask(() => Alpine.store('app').initProfileFlow());

  Alpine.store('modules', { list: MODULE_LIST });
});

// ── Nav injection (unchanged) ───────────────────────────────────────────────
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
