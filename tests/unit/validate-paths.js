// tests/unit/validate-paths.js
// Verifies that every fetch() URL pattern in js/*.js resolves to a real,
// lowercase file on disk. Guards against case-sensitivity bugs on Linux
// (Cloudflare Pages) where Module-01.json ≠ module-01.json.
//
// Uses only Node built-ins: node:fs, node:path, node:test, node:assert
// Run with: node --test tests/unit/validate-paths.js

'use strict';

const { test }     = require('node:test');
const assert       = require('node:assert/strict');
const fs           = require('node:fs');
const path         = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');

// ── helpers ──────────────────────────────────────────────────────────────────

function fileExistsOnDisk(relPath) {
  const abs = path.join(ROOT, relPath);
  try {
    fs.accessSync(abs, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function isLowercase(relPath) {
  return relPath === relPath.toLowerCase();
}

// ── fetch() URL expansion ─────────────────────────────────────────────────────
//
// The four fetch() calls in the codebase use these template patterns:
//
//   nav.js:          pathPrefix + 'components/nav.html'
//   content-loader:  `${pathPrefix}content/lessons/${lang}/${moduleId}.json`
//   quiz.js:         `${pathPrefix}content/quizzes/${lang}/${this.moduleId}.json`
//   tooltip.js:      `${pathPrefix()}content/tooltips/${l}.json`
//
// We expand known variables statically:
//   pathPrefix / pathPrefix()  → '' (root-relative)
//   lang / l                   → ['en', 'th']
//   moduleId / this.moduleId   → ['module-01' … 'module-07']
//
// IMPORTANT: Thai-specific lesson and quiz files do NOT exist on disk.
// The project stores both EN and TH content inside the EN JSON file.
// So content/lessons/th/* and content/quizzes/th/* are intentionally absent.
// We skip those paths with a clear note rather than failing.
//
// Tooltip files DO exist for both languages: content/tooltips/en.json and
// content/tooltips/th.json — those are validated for both.

const MODULE_IDS = [
  'module-01', 'module-02', 'module-03',
  'module-04', 'module-05', 'module-06', 'module-07',
];

const LANGS = ['en', 'th'];

/**
 * Returns an array of { path, skipReason } objects.
 * skipReason is null when the path must exist; a string explains why it is skipped.
 */
function expandFetchPaths() {
  const entries = [];

  // nav.js: components/nav.html
  entries.push({ path: 'components/nav.html', skipReason: null });

  // tooltip.js: content/tooltips/${l}.json  — both en and th exist
  for (const l of LANGS) {
    entries.push({ path: `content/tooltips/${l}.json`, skipReason: null });
  }

  // content-loader.js: content/lessons/${lang}/${moduleId}.json
  for (const lang of LANGS) {
    for (const moduleId of MODULE_IDS) {
      const p = `content/lessons/${lang}/${moduleId}.json`;
      if (lang === 'th') {
        // TH lesson files don't exist — content lives in the EN JSON's `th` branches.
        // Skip existence check; validate-schema.js checks bilingual completeness.
        entries.push({
          path: p,
          skipReason: 'TH lesson files do not exist; bilingual content is in EN JSON',
        });
      } else {
        entries.push({ path: p, skipReason: null });
      }
    }
  }

  // quiz.js: content/quizzes/${lang}/${moduleId}.json
  for (const lang of LANGS) {
    for (const moduleId of MODULE_IDS) {
      const p = `content/quizzes/${lang}/${moduleId}.json`;
      if (lang === 'th') {
        // Same reasoning as lessons above.
        entries.push({
          path: p,
          skipReason: 'TH quiz files do not exist; bilingual content is in EN JSON',
        });
      } else {
        entries.push({ path: p, skipReason: null });
      }
    }
  }

  return entries;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test('fetch() path expansion — all required files exist on disk', () => {
  const entries = expandFetchPaths();
  const missing = [];

  for (const { path: p, skipReason } of entries) {
    if (skipReason) continue; // intentionally skipped
    if (!fileExistsOnDisk(p)) {
      missing.push(p);
    }
  }

  assert.deepEqual(
    missing,
    [],
    `Missing files:\n  ${missing.join('\n  ')}`
  );
});

test('fetch() path expansion — all required paths are lowercase', () => {
  const entries = expandFetchPaths();
  const caseIssues = [];

  for (const { path: p, skipReason } of entries) {
    if (skipReason) continue;
    if (!isLowercase(p)) {
      caseIssues.push(p);
    }
  }

  assert.deepEqual(
    caseIssues,
    [],
    `Non-lowercase fetch paths (would 404 on Linux):\n  ${caseIssues.join('\n  ')}`
  );
});

test('HTML page filenames in /modules/ are lowercase', () => {
  const modulesDir = path.join(ROOT, 'modules');
  const files = fs.readdirSync(modulesDir).filter(f => f.endsWith('.html'));
  const nonLower = files.filter(f => f !== f.toLowerCase());

  assert.deepEqual(
    nonLower,
    [],
    `Non-lowercase module filenames:\n  ${nonLower.join('\n  ')}`
  );
});

test('Root HTML pages (index.html, glossary.html) are lowercase', () => {
  const rootHtml = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  const nonLower = rootHtml.filter(f => f !== f.toLowerCase());

  assert.deepEqual(
    nonLower,
    [],
    `Non-lowercase root HTML files:\n  ${nonLower.join('\n  ')}`
  );
});
