# DDD Learning Website — Claude Instructions

## Behavioral Rules (apply to every action)

### R1 · NO MAGIC
All assumptions must be explicit. If context is missing, state it: "I'm assuming X because Y." Never invent infrastructure, services, or file paths that haven't been shown. If unsure where something lives → ask, don't guess.

### R2 · VERIFY BEFORE DONE
Never claim a change is complete without running verification. "I edited the file" is NOT done. "I edited the file and the output confirms it works" is done. No "should work now." Evidence before assertions, always.

### R3 · DISSENT
Before any major change, surface concerns:
- What's the blast radius if this goes wrong?
- What assumptions are we making?
- What's the reversibility path?
- What are we NOT seeing because of momentum?

### R4 · SCOPE DRIFT DETECTION
Track stated goal vs actual execution. Flag immediately when:
- "Just one more thing" accumulates
- Nice-to-haves get treated as must-haves
- The ask was "fix X" but execution is "refactor the module"

### R5 · R0 / R1 / R2
```
R0 (irreversible)      → STOP. Ask before proceeding.
R1 (costly to reverse) → Do it, but explain why first.
R2 (easily reversed)   → Just do it. No permission needed.
```
Examples:
- Deleting/overwriting content files → R0
- Changing JSON schema (breaks all content) → R0
- Updating CSS tokens → R1
- Adding a new section to a lesson file → R2

---

## Session Start (REQUIRED)

At the start of every session, before doing anything else:

1. Call `mcp__linear-server__list_issues` with `project: "DDD Learning Website"`, `orderBy: "createdAt"`, `limit: 30`
2. Find the lowest-numbered DRE-N ticket whose `status` is NOT `Done` and NOT `Canceled`
3. Display it as the suggested next ticket (title, status, label, URL)
4. Ask the user: "Start this ticket?"

If user confirms → call `mcp__linear-server__save_issue` to move it to `In Progress`.

## Ticket Workflow

- **Starting a ticket**: move status → `In Progress`
- **Finishing a ticket**: move status → `Done`
- **Never skip status changes** — Linear is the source of truth for progress

## Testing Strategy

**Automated only — no manual checklists.**

### Test structure
```
tests/
├── e2e/
│   ├── smoke.spec.js           # CDNs load, no console errors
│   ├── nav.spec.js             # nav injection, links, hamburger, checkmarks
│   ├── language-switch.spec.js # EN↔TH toggle, localStorage persist
│   ├── quiz.spec.js            # MCQ flow, score, localStorage, nav checkmark
│   ├── tooltip.spec.js         # hover/tap open, close, keyboard
│   ├── content.spec.js         # all section types render, lang switch, error state
│   └── diagrams.spec.js        # Mermaid SVG, ES board colors + scroll
└── unit/
    ├── validate-schema.js      # JSON content schema (node --test)
    └── validate-research.js    # research .md structure (node --test)
```

### Run commands
```bash
# Unit (no server needed)
node --test tests/unit/validate-schema.js
node --test tests/unit/validate-research.js

# E2E (requires local server running)
python3 -m http.server 8080 &
npx playwright test
```

### CI: GitHub Actions on every push to main
`.github/workflows/test.yml` — full suite runs automatically. Created in DRE-5.

### Verification by ticket type

| Ticket type | Required before Done |
|---|---|
| Foundation DRE-5–9 | Playwright spec(s) for the feature built pass on CI |
| Research DRE-10–13 | `validate-research.js` structural checks pass |
| Content System DRE-14–17 | Playwright spec(s) for the feature pass on CI |
| Content EN DRE-18–24 | `validate-schema.js` + `content.spec.js` smoke pass |
| Translation DRE-25 | `language-switch.spec.js` passes on CI |
| Deploy/QA DRE-26–28 | Full suite green (3 browsers for DRE-26) |

### TDD workflow
Use `/tdd` skill for **DRE-5–9 and DRE-14–17** only:
1. Write failing Playwright spec from ticket AC assertions
2. Implement the feature
3. Spec passes (green)
4. Push — CI must stay green

## Dependency Order (hard constraints)

```
Phase 1 — Foundation (DRE-5 → 6 → 7 → 8 → 9, sequential)
Phase 2 — Research   (DRE-10/11/12/13, can parallelize)
Phase 3 — Content System (DRE-14 → 15 → 16 → 17)
Phase 4 — Content EN (DRE-18 first = MVP; then 19–24)
Phase 5 — Polish     (DRE-25 → 26 → 27 → 28)
```

Rule: Never start a Phase 4 content ticket until the matching research `.md` file exists in `/research/`.

## Tech Stack

- Alpine.js v3 via CDN only (`cdn.jsdelivr.net/npm/alpinejs@3`)
- Mermaid.js v11 via CDN only (`cdn.jsdelivr.net/npm/mermaid@11`)
- No npm, no build step, no React/Vue/Next.js, no TypeScript compilation
- Local dev: `python3 -m http.server 8080` (fetch() fails on file://)
- Cloudflare Pages: auto-deploys main branch, paths are case-sensitive (Linux)

## Project Structure

```
/
├── index.html              # Landing page
├── modules/
│   ├── module-01.html      # One file per module
│   └── ...
├── glossary.html
├── css/
│   ├── tokens.css          # Design tokens
│   ├── base.css            # Reset + typography
│   └── components.css      # Cards, buttons, sticky notes
├── js/
│   ├── nav.js              # Injects shared nav, Alpine store
│   ├── content-loader.js   # Fetches + renders lesson JSON
│   ├── quiz.js             # Quiz logic
│   └── tooltip.js          # Tooltip system
├── components/
│   └── nav.html            # Shared nav markup
├── content/
│   ├── lessons/en/         # module-01.json … module-07.json
│   ├── quizzes/en/         # module-01.json … module-07.json
│   ├── tooltips/en.json
│   └── glossary/en.json
└── research/
    ├── ddd.md
    ├── event-storming.md
    ├── eda.md
    └── ecommerce-examples.md
```

## Design Tokens

```css
--color-bg: #faf9f7;
--color-surface: #ffffff;
--color-primary: #6366f1;    /* indigo */
--color-secondary: #14b8a6;  /* teal */
--color-accent: #f59e0b;     /* amber */
--color-text: #1e1b4b;
--font-sans: 'Inter', system-ui, sans-serif;
--font-thai: 'Sarabun', sans-serif;
```

## Alpine.js Rules

```javascript
Alpine.store('app', {
  lang: localStorage.getItem('lang') || 'en',
  progress: JSON.parse(localStorage.getItem('ddd-progress') || '{}'),
  tooltipOpen: null,
  toggleLang() { this.lang = this.lang === 'en' ? 'th' : 'en'; localStorage.setItem('lang', this.lang); },
  openTooltip(id) { this.tooltipOpen = id; },
  closeTooltip() { this.tooltipOpen = null; },
  isModuleComplete(moduleId) { return this.progress[moduleId]?.quizCompleted === true; },
  saveProgress(moduleId, score) {
    this.progress[moduleId] = { quizCompleted: true, score };
    localStorage.setItem('ddd-progress', JSON.stringify(this.progress));
  }
});
```

## Sticky Note CSS Classes

```css
.sticky-event     { background: #f97316; color: white; }
.sticky-command   { background: #3b82f6; color: white; }
.sticky-actor     { background: #fde68a; color: #1e1b4b; }
.sticky-policy    { background: #a78bfa; color: white; }
.sticky-hotspot   { background: #fb7185; color: white; }
.sticky-readmodel { background: #34d399; color: white; }
.sticky-external  { background: #fbbf24; color: #1e1b4b; }
.sticky-aggregate { background: #f3f4f6; color: #1e1b4b; border: 2px solid #d1d5db; }
```

## Linear Project

- **Project**: DDD Learning Website (ID: d406a275-711c-4e98-bd1f-9ae15b87e2e7)
- **Team**: Dream-come-true (key: DRE)
- **Tickets**: DRE-5 through DRE-28

---

## Project Overview

**Audience**: Thai developers learning Domain-Driven Design and Event Sourcing.
**Learning outcomes**: Understand DDD tactical patterns, Event Storming, EDA, and apply them to e-commerce.
**Target user**: Mid-level backend developers who have heard of DDD but never applied it.

---

## Development Commands

```bash
# Local dev server (required — fetch() fails on file://)
python3 -m http.server 8080

# Unit tests (no server needed)
node --test tests/unit/validate-schema.js
node --test tests/unit/validate-research.js
node --test tests/unit/validate-claude-md.js

# E2E tests (server must be running first)
npx playwright test
```

DO NOT use `npm install`, `npm run`, or any build tool.

---

## Content Rules

- **Research First**: never write content from memory. Read the relevant file in `/research/` first.
- **Cite sources**: attribute claims to Evans, Vernon, Brandolini, Fowler, Richardson, or Newman.
- **Simple English**: short sentences, active voice, concrete examples. Avoid academic tone.
- **No hallucination**: if a fact isn't in the research file, don't include it.
- **Section types allowed**: `text`, `diagram`, `infographic`, `comparison`, `callout`, `es-board`, `flow`
- **Bilingual**: every `title`, `body`, and `text` field must have both `en` and `th` values.

---

## Thai Content Rules

- **Adaptation, not translation**: Thai content must feel natural to a Thai developer, not like a Google Translate output.
- **Technical terms stay English**: DDD, Event Sourcing, Aggregate, Bounded Context, Command, Event, Policy — never translate these.
- **Thai font**: body copy uses `--font-thai: 'Sarabun', sans-serif`. Apply via `[lang="th"]` selectors.
- **Tone**: conversational, not formal. Use everyday Thai, not royal/formal register.
- **Code examples**: keep in English; add Thai comments if needed.

---

## JSON Content Rules

### Lesson schema (`content/lessons/en/module-NN.json`)

```json
{
  "module": {
    "id": "kebab-case-string",
    "number": 1,
    "title": { "en": "...", "th": "..." },
    "estimatedMinutes": 20,
    "sections": [ ... ]
  }
}
```

- `id`: kebab-case, matches filename without `.json`
- `number`: integer 1–7
- `sections`: array of section objects, each with `id` (kebab-case), `type`, and type-specific fields
- All text fields: `{ "en": "...", "th": "..." }` — both values required, `th` may be `""`

### Quiz schema (`content/quizzes/en/module-NN.json`)

```json
{
  "questions": [
    {
      "id": "kebab-case",
      "type": "mcq",
      "question": { "en": "...", "th": "..." },
      "options": [ { "id": "a", "text": { "en": "...", "th": "..." } } ],
      "correctOption": "a",
      "explanation": { "en": "...", "th": "..." }
    }
  ]
}
```

- Minimum 5 questions per module
- `type`: `mcq` or `truefalse`
- `correctOption`: must match one of the option `id` values

### Tooltip ID format

`<domain>-<term>` in kebab-case. Example: `ddd-aggregate`, `es-domain-event`.

### Validation

```bash
node --test tests/unit/validate-schema.js
```

---

## Visual Design Rules

- Use CSS custom properties from `css/tokens.css` — never hardcode hex values.
- Mobile-first: design for 320px width, enhance for larger screens.
- Touch targets: minimum 44px × 44px for all interactive elements.
- No inline styles except for dynamically computed values (e.g. positioning).

### Design tokens reference

```css
--color-bg: #faf9f7;
--color-surface: #ffffff;
--color-primary: #6366f1;    /* indigo */
--color-secondary: #14b8a6;  /* teal */
--color-accent: #f59e0b;     /* amber */
--color-text: #1e1b4b;
--font-sans: 'Inter', system-ui, sans-serif;
--font-thai: 'Sarabun', sans-serif;
```

---

## Mermaid.js Rules

- Always initialize with `startOnLoad: false` — Alpine manages the lifecycle.
- Call `window.renderDiagrams()` after content is injected into the DOM.
- Diagrams live in `.mermaid-block[data-source]` elements; `diagrams.js` renders them.
- Add `x-ignore` to Mermaid container elements so Alpine doesn't try to parse their content.
- Theme is configured globally in `js/diagrams.js` — do not override per-diagram.

---

## ES Board Rules

- Implement using HTML + CSS only — no canvas, no SVG, no JS framework.
- Must include all 8 sticky note types: Event, Command, Actor, Policy, Hotspot, Read Model, External System, Aggregate.
- Horizontal scroll required — boards are wider than the viewport on mobile.
- Legend required at the top of every ES Board section.
- Use the `.sticky-*` CSS classes defined in `components.css`.
- DO NOT render ES boards as Mermaid diagrams.

---

## Quiz Rules

- Save `quizCompleted: true` to localStorage on **any** submit (even 0%).
- DO NOT auto-submit when last question is answered — user clicks Submit button explicitly.
- Minimum 5 questions per module.
- Show explanation for each question immediately after the user answers (not after Submit).
- Submit button is disabled until all questions answered; enabled on `allAnswered()`.
- Support `mcq` and `truefalse` question types.
- Retake clears all answers and score; does not clear `quizCompleted` from localStorage.

---

## Tooltip Rules

- Tooltip data lives in `content/tooltips/en.json` — never hardcode tooltip text in HTML.
- **Desktop** (≥768px): show as popover bubble on hover and click.
- **Mobile** (<768px): show as bottom sheet on tap.
- Keyboard accessible: Enter/Space on `.tooltip-trigger` opens the tooltip; Escape closes it.
- Tooltip IDs must match the `data-tooltip` attribute on `.tooltip-trigger` elements.
- DO NOT use `title` attribute tooltips — they are not accessible on mobile.

---

## Do Not Rules

DO NOT do any of the following — ever, without exception:

- `npm install` / `npm run` / any npm command in the project (CI uses npm only for Playwright setup)
- Import React, Vue, Next.js, or any component framework
- Use a build step, bundler, or transpiler (Webpack, Vite, Rollup, esbuild, Babel, tsc)
- Write content (lesson text, quiz questions) from memory without reading the research files first
- Hardcode hex color values — use CSS custom properties
- Add `disabled` attribute to quiz radio inputs (breaks Playwright clicks; use `.quiz-locked` class instead)
- Push to `main` directly — always use a feature branch and PR
- Commit `.env` files or secrets

---

## File Editing Rules

- Read before edit: always read the current file state before making changes.
- Preserve JSON indentation: 2-space indent, no trailing commas, no comments.
- No JSON comments: JSON spec forbids them; the validator will fail.
- Preserve existing section ordering in lesson/quiz JSON files.
- When adding Thai translations: fill `th` field only, never touch `en` field.

---

## Deployment

- **Host**: Cloudflare Pages
- **Trigger**: push to `main` branch auto-deploys
- **Paths**: case-sensitive on Linux — `Module-01.html` ≠ `module-01.html`
- **No build step**: Cloudflare serves static files as-is
- **CDN assets**: Alpine.js and Mermaid.js load from jsDelivr CDN at runtime

---

## Sources to Cite

- **Evans**: *Domain-Driven Design* (2003) — tactical patterns, Ubiquitous Language, Bounded Context
- **Vernon**: *Implementing Domain-Driven Design* (2013) — Aggregate design, application of DDD
- **Brandolini**: Event Storming workshop methodology
- **Fowler**: *Patterns of Enterprise Application Architecture*, bliki entries on Event Sourcing
- **Richardson**: *Microservices Patterns* — saga pattern, EDA in microservices
- **Newman**: *Building Microservices* — service decomposition, EDA

Always cite when making factual claims about DDD concepts.
