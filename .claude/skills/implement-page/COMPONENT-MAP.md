# Component Map: React Design → Alpine.js Implementation

## Data sources (design/project/data.jsx)

| Export | Content | Target |
|---|---|---|
| `I18N.en` / `I18N.th` | UI labels, button text, hero copy | Inline `x-text` or `js/i18n.js` |
| `MODULES[0..6]` | 7 module metadata objects | `content/lessons/en/module-NN.json` (schema per CLAUDE.md) |
| `GLOSSARY[0..11]` | 12 seed glossary terms | `content/glossary/en.json` (expand to 42 for DRE-24) |
| `QUIZ` array | 5 quiz questions (MCQ + T/F) | `content/quizzes/en/module-01.json` |

### MODULES object shape (design → JSON)
```js
// design/project/data.jsx MODULES[0]
{ n:1, en:"Why your domain model matters", th:"ทำไมโดเมนโมเดลถึงสำคัญ",
  mins:6, sub_en:"...", sub_th:"...", progress:42, done:false, featured:true }

// → content/lessons/en/module-01.json schema (adapt to CLAUDE.md content schema)
```

### GLOSSARY object shape
```js
{ id:"ubiquitous-language", cat:"ddd",
  term_en, term_th, short_en, short_th, full_en, full_th, ex_en, ex_th }
```

## Component → Alpine pattern

### `<Icon name="..." size={N}/>` 
Replace with inline SVG. Key icons used:
- `menu` → `☰` or 3-line SVG
- `close` → `✕` SVG  
- `search` → magnifier SVG
- `chevron` → `▾` SVG (rotate 180° when open)
- `check` → checkmark SVG
- `arrow-r` → right arrow SVG
- `clock` → clock SVG
- `copy`, `book`, `info`, `warn`, `spark` → matching SVGs

### `<LangProvider>` / `useLang()` / `useT()`
→ `Alpine.store('app').lang` (global, persisted to localStorage)

### `<MobileShell>` 
→ `nav.js` fetches `components/nav.html`, injects before `<main>`, then `Alpine.start()`

### `<Drawer open={} onClose={}>` 
→ `.drawer` + `.drawer-scrim` controlled by `$store.app.drawerOpen`
Drawer nav list: built from modules array, active state by current URL

### `<BottomSheet open={} onClose={}>` 
→ `.sheet` + `.sheet-scrim` controlled by `$store.app.tooltipOpen`

### `<Term id="..." onOpen={}>text</Term>`
→ `<span class="term" @click="$store.app.openTooltip('ID')">text</span>`

### `<TermSheet termId={} open={} onClose={}/>`
→ `tooltip.js` renders one shared sheet, fills content from GLOSSARY data by `tooltipOpen` ID

### `<Callout kind="info|warning|success" title="...">text</Callout>`
→ Static HTML (no interactivity needed):
```html
<div class="callout">
  <div class="icon"><!-- icon svg --></div>
  <div><div class="title">Mental model</div><div>text</div></div>
</div>
```

### `<FlowDiagram/>`
→ Mermaid.js diagram block:
```html
<div class="diagram-wrap">
  <pre class="mermaid">
    flowchart LR
      Cart-->|OrderPlaced|Inventory
      Cart-->|OrderPlaced|Payments
      ...
  </pre>
</div>
```

### `<ESBoard/>`
→ Static HTML grid `.es-board > .es-lanes` with `.note.evt`, `.note.cmd`, etc.
Data comes from `ES_BOARD` array in `components.jsx` — render statically.

### `<ModuleCard m={} />`
→ Loop in content-loader.js or static per-page HTML:
```html
<div class="card module-card">
  <div class="head">
    <span class="badge indigo" x-text="$store.app.lang==='en'?'Module '+n:'บทที่ '+n"></span>
  </div>
  <h3 x-text="$store.app.lang==='en'?title_en:title_th"></h3>
  <div class="pbar"><i :style="'width:'+progress+'%'"></i></div>
</div>
```

### `<Collapsible title={} defaultOpen={}>` 
→ See SKILL.md pattern. CSS class `.collapsible.open` controls visibility.

### `<Quiz/>`
State lives in `x-data` on the quiz container div. Full implementation in `js/quiz.js`.
- `answers` array → Alpine reactive array
- `submitted` boolean → show/hide score card
- `currentQ` index → navigate prev/next
- Score calculation: `answers.filter((a,i)=>a===quiz[i].correct).length`

## Desktop vs mobile

Design has separate `Mobile` and `Desktop` page components but same CSS tokens.
Implementation: **one HTML file, CSS handles both** via `.desk` media query.

```css
/* components.css — add at bottom */
@media (min-width: 1024px) {
  /* Promote .desk.* rules to top-level */
  .hero { display: grid; grid-template-columns: 1.2fr 1fr; ... }
  .topnav { height: 64px; }
  /* etc — mirror design/project/styles.css .desk block */
}
```

The mobile design is the default; desktop overrides kick in at 1024px.

## Landing page section order

From `pages.jsx LandingBody`:
1. Hero (badges, h1, heroSub, CTA buttons)
2. What you'll learn (h-rail of 3 topic cards)
3. Learning path (stepper: Discover → Design → Implement → Apply)
4. Modules (7 ModuleCards)
5. Progress sync (Collapsible with export/import)
6. Footer

## Module page section order

From `pages.jsx ModuleBody`:
1. Page header (badges, h1, subtitle)
2. Intro paragraph with inline Terms
3. Callout (info)
4. "From CRUD to model" section + stepper (4 steps)
5. Three modelling styles (compare-card h-rail)
6. FlowDiagram + caption
7. Callout (warning)
8. ES Board
9. Infographic grid (6 glossary cells)
10. Quiz
11. Footer

## Glossary page structure

From `pages.jsx GlossaryBody`:
1. Page header (h1, subtitle)
2. Sticky filter-bar: search input + chip-rail (All / DDD / ES / EDA)
3. Term card list (expandable — `x-show` for expanded body)
4. Footer with count
