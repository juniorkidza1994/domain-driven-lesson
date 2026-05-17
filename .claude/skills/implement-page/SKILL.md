---
name: implement-page
description: Implement a page or component for the DDD Learning Website by translating the Claude Design prototype (design/project/) into Alpine.js + plain HTML. Use when implementing index.html, module pages, glossary, nav, quiz, tooltips, or any UI component from the DRE ticket series. Always reads design files first, then translates React → Alpine.js.
---

# Implement Page

Design prototype lives in `design/project/`. Never use React/npm — output is Alpine.js + plain HTML per CLAUDE.md stack constraints.

## Quick start

1. Read the relevant design file(s) for the target page
2. Identify which Alpine.js patterns map to the React components used
3. Extract content data from `data.jsx` → put into JSON files or inline
4. Implement using the component map below
5. Verify with `python3 -m http.server 8080` + Playwright spec

## Design file → target file map

| Design file | React exports | Target |
|---|---|---|
| `pages.jsx` `LandingMobile/Desktop` | Hero, Topics, Stepper, Modules, Sync | `index.html` |
| `pages.jsx` `ModuleMobile/Desktop` | Module header, body, Quiz | `modules/module-NN.html` |
| `pages.jsx` `GlossaryMobile/Desktop` | Search, filter chips, term cards | `glossary.html` |
| `components.jsx` `TopNav + Drawer` | Logo, hamburger, nav list, lang toggle | `js/nav.js` + `components/nav.html` |
| `components.jsx` `BottomSheet + Term` | Tooltip sheets | `js/tooltip.js` |
| `components.jsx` `Quiz` | MCQ + T/F + score | `js/quiz.js` |
| `styles.css` | All tokens, layout, cards, ES board | `css/tokens.css` + `css/components.css` |
| `data.jsx` `I18N` | Bilingual UI strings | inline in each HTML or `js/i18n.js` |
| `data.jsx` `MODULES` | Module metadata | `content/lessons/en/module-NN.json` |
| `data.jsx` `GLOSSARY` | 12 seed terms (expand to 42) | `content/glossary/en.json` |

## Component translation patterns

### TopNav + Drawer → Alpine store
```html
<!-- Alpine store in nav.js -->
Alpine.store('app', {
  drawerOpen: false,
  lang: localStorage.getItem('lang') || 'en',
  toggleLang() { this.lang = this.lang==='en'?'th':'en'; localStorage.setItem('lang',this.lang); },
});
```
```html
<!-- nav.html injected by nav.js -->
<div class="topnav">
  <div class="logo"><div class="mark">A</div><span x-text="$store.app.lang==='en'?'ArchPath':'ArchPath'"></span></div>
  <button class="icon-btn" @click="$store.app.drawerOpen=true"><!-- hamburger svg --></button>
</div>
<div class="drawer-scrim" :class="{open:$store.app.drawerOpen}" @click="$store.app.drawerOpen=false"></div>
<div class="drawer" :class="{open:$store.app.drawerOpen}">...</div>
```

### BottomSheet / Term → tooltip.js
```html
<span class="term" @click="$store.app.openTooltip('bounded-context')">Bounded Context</span>
<!-- Sheet rendered by tooltip.js, reads GLOSSARY data -->
```

### Quiz → quiz.js
- State: `currentQ`, `answers[]`, `submitted` as `x-data` on quiz container
- MCQ: `x-for` over options array, `:class` for selected/correct/wrong
- T/F: two buttons with `@click` setting boolean answer
- Score: `x-show="submitted"` reveals score card

### ModuleCard → content-loader.js
```html
<div class="card module-card" x-data="moduleCard(moduleData)">
  <!-- progress bar, button state driven by Alpine -->
</div>
```

### Collapsible
```html
<div class="collapsible" :class="{open: open}" x-data="{open:false}">
  <div class="head" @click="open=!open"><h3>Title</h3><span class="caret">▾</span></div>
  <div class="body">content</div>
</div>
```

## CSS reuse

Copy `design/project/styles.css` wholesale into `css/`. Split:
- `:root` vars + typography + layout → `css/tokens.css` + `css/base.css`
- `.card`, `.btn`, `.badge`, `.callout`, `.term`, `.sheet` → `css/components.css`
- `.topnav`, `.drawer`, `.lang-toggle`, `.filter-bar` → keep in components.css
- `.desk` block (desktop overrides) → add responsive breakpoint `@media (min-width: 1024px)`

## Bilingual content

Design uses `lang === "en" ? en_text : th_text` inline. In Alpine:
```html
<h1 x-text="$store.app.lang==='en' ? module.title_en : module.title_th"></h1>
```
Or use `x-html` for rich text with `<strong>` / `<Term>` links.

## ES Board / Mermaid

- `ESBoard` component in `components.jsx` → pure HTML table with `.es-board .es-lanes` grid + `.note.evt` etc. classes
- `FlowDiagram` SVG → use Mermaid.js v11 CDN instead: `flowchart LR` syntax

## Workflow checklist

- [ ] Read target design file + components.jsx for all used components
- [ ] Check `data.jsx` for all data the page needs
- [ ] Map each React component to Alpine.js pattern
- [ ] Copy relevant CSS classes from `styles.css`
- [ ] Extract bilingual strings — put in Alpine store or x-text bindings
- [ ] Run dev server and visually verify against design
- [ ] Run matching Playwright spec (see CLAUDE.md testing table)

See [COMPONENT-MAP.md](COMPONENT-MAP.md) for full React→Alpine translation reference.
