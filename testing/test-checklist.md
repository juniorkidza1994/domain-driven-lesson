# Test Checklist — DRE-26

Spec → AC mapping → browsers executed → last-run status.

The automated Playwright suite is the source of truth. This file is the human-readable QA hand-off summary.

## Unit Tests

| Test file | What it validates | Status |
|---|---|---|
| `tests/unit/validate-schema.js` | All 7 lesson + 7 quiz JSON files conform to schema | PASS |
| `tests/unit/validate-research.js` | All 4 research .md files have required sections | PASS |
| `tests/unit/validate-claude-md.js` | CLAUDE.md structural rules | PASS |

## E2E Tests — 3-Browser Matrix

### smoke.spec.js

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1 | Index loads, Alpine + Mermaid globals present, zero console.error | PASS | PASS | PASS |

### nav.spec.js

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1 | Nav injection visible on all 9 pages | PASS | PASS | PASS |
| AC2 | 7 module links with correct hrefs | PASS | PASS | PASS |
| AC3 | Default lang is `en` | PASS | PASS | PASS |
| AC4 | Mobile: hamburger visible, desktop nav hidden at 375px | PASS | PASS | PASS |
| AC5 | Hamburger opens drawer, scrim closes it | PASS | PASS | PASS |
| AC6 | Progress checkmark visible after localStorage seed | PASS | PASS | PASS |
| AC7 | Active link has `aria-current="page"` | PASS | PASS | PASS |
| AC8 | Lang toggle switches labels, persists to localStorage | PASS | PASS | PASS |

### quiz.spec.js

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1 | Quiz section renders with ≥1 question | PASS | PASS | PASS |
| AC2 | True/false question has exactly 2 options | PASS | PASS | PASS |
| AC3 | Selecting answer shows explanation immediately | PASS | PASS | PASS |
| AC4 | Correct answer gets `.quiz-correct` class | PASS | PASS | PASS |
| AC5 | Wrong answer: selected red, correct highlighted green | PASS | PASS | PASS |
| AC6 | Option locked after selection | PASS | PASS | PASS |
| AC7 | Submit disabled until all answered | PASS | PASS | PASS |
| AC8 | Submit → score displayed | PASS | PASS | PASS |
| AC9 | Submit → localStorage progress persisted | PASS | PASS | PASS |
| AC10 | Reload → store.progress restored | PASS | PASS | PASS |
| AC11 | Nav checkmark visible after submit (mobile) | PASS | PASS | PASS |
| AC12 | Retake clears answers, explanations, score | PASS | PASS | PASS |

### language-switch.spec.js (new — DRE-26)

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1 | Default lang is `en` (body[data-lang] + Alpine store) | PASS | PASS | PASS |
| AC2 | Click TH → data-lang=th, localStorage=th | PASS | PASS | PASS |
| AC3 | TH preference persists after reload | PASS | PASS | PASS |
| AC4 | Toggle back to EN works | PASS | PASS | PASS |
| AC5 | Toggle re-renders lesson content (EN↔TH text) | PASS | PASS | PASS |

### content.spec.js

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1 | #sections-container has ≥1 child after load (mocked) | PASS | PASS | PASS |
| AC2 | Text section renders `<section class="content-section">` with `<p>` | PASS | PASS | PASS |
| AC3 | Callout renders `.callout` with non-empty text | PASS | PASS | PASS |
| AC4 | Diagram renders `.mermaid-block` | PASS | PASS | PASS |
| AC5 | Flow renders `.step-flow` with ≥2 items | PASS | PASS | PASS |
| AC6 | Language toggle re-renders with TH text | PASS | PASS | PASS |
| AC7 | Fetch 404 → "Content unavailable" visible | PASS | PASS | PASS |
| AC8 (smoke) | Module-01..07 real content loads, zero console.error | PASS | PASS | PASS |

### responsive.spec.js (new — DRE-26)

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1 | Home `/` — no horizontal overflow at 375px, zero console.error | PASS | PASS | PASS |
| AC2 | Glossary — no overflow, zero errors | PASS | PASS | PASS |
| AC3-9 | Modules 01–07 — no overflow, zero errors (one per module) | PASS | PASS | PASS |

### tooltip.spec.js

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1-6 | Hover/tap/keyboard/glossary tooltip interactions | PASS | PASS | PASS |

### diagrams.spec.js

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1-5 | Mermaid SVG renders, ES board colors + scroll | PASS | PASS | PASS |

### layout.spec.js

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1-4 | Layout/overflow checks for home page | PASS | PASS | PASS |

### alpine.spec.js

| AC | Description | Chromium | Firefox | WebKit |
|---|---|---|---|---|
| AC1-5 | Alpine store integration on index | PASS | PASS | PASS |
