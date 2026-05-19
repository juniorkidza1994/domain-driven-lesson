# Bug Tracker — DDD Learning Website

Automated Playwright suite is the source of truth for regressions.

---

## Open Bugs

_No open bugs at time of DRE-26 completion._

---

## Fixed During DRE-26

### BUG-01 — Quiz spec race condition (12 tests failing)

**Symptom**: All 12 tests in `tests/e2e/quiz.spec.js` failed on every browser with:
```
locator('.quiz-section') not found within 5000ms
```

**Root cause**: `gotoQuiz()` waited for `.quiz-section` (which Alpine renders immediately as an empty container) but the quiz questions are injected asynchronously by `js/quiz.js` after fetching `content/quizzes/en/module-02.json`. The 5s timeout was insufficient under load, especially in Firefox and WebKit.

**Fix**: Changed the wait selector from `.quiz-section` to `.quiz-question[data-question-id="q1"]` with a 15000ms timeout. This waits until the first actual question element is present in the DOM, guaranteeing the quiz is fully rendered before any interaction.

**Files changed**: `tests/e2e/quiz.spec.js`

---

### BUG-02 — Playwright only ran Chromium (missing 3-browser coverage)

**Symptom**: CI ran only `smoke.spec.js` on Chromium. Firefox and WebKit were never executed. The local suite also defaulted to Chromium only.

**Root cause**: `playwright.config.js` had no `projects` array defined and `.github/workflows/test.yml` installed only Chromium and ran only `smoke.spec.js`.

**Fix**:
- Added `projects: [chromium, firefox, webkit]` to `playwright.config.js` using `@playwright/test` `devices`.
- Added `webServer` config so the suite starts `python3 -m http.server 8080` automatically (with `reuseExistingServer: true` for local runs).
- Added `retries: process.env.CI ? 1 : 0` to absorb CDN flakes on WebKit in headless CI.
- Updated `.github/workflows/test.yml` to install all three browsers and run `npx playwright test` (full suite) instead of just smoke.
- Added artifact upload on failure for `playwright-report/` and `test-results/`.
- Removed manual `python3 -m http.server 8080 &` and `wait-on` steps (now handled by `webServer` in config).

**Files changed**: `playwright.config.js`, `.github/workflows/test.yml`

---

## Deferred

_No deferred bugs at time of DRE-26 completion._
