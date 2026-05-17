---
name: alpine
description: Generates Alpine.js v3 components for plain HTML pages. Handles any input — natural language descriptions or existing HTML to enhance. Outputs clean Alpine markup with brief directive explanations. No CSS classes added; behavior only. Use when working with Alpine.js, writing x-data components, adding interactivity to plain HTML, or using directives like x-show, x-model, x-on, x-bind, x-for, x-transition.
license: MIT
metadata:
  version: "1.0.0"
  domain: frontend
  triggers: Alpine.js, alpinejs, x-data, x-show, x-model, x-on, x-bind, x-for, x-transition, alpine component, alpine directive
  role: specialist
  scope: implementation
  output-format: code
---

# Alpine.js Pro

## When to Use This Skill

- Building interactive HTML components without a JS framework
- Adding reactivity to existing plain HTML (dropdowns, modals, tabs, accordions, forms)
- Implementing two-way data binding, event handling, transitions, or global state
- Reviewing or enhancing Alpine.js markup for correctness and best practices

## Input Detection

Detect input mode automatically:

| Input Shape | Mode |
|---|---|
| Natural language ("make a modal that...") | **Greenfield** — generate full component from scratch |
| HTML snippet pasted | **Enhancement** — add Alpine directives to existing markup |
| Mixed | Handle both; ask if ambiguous |

## Core Workflow

1. **Parse input** — identify component type and required behavior
2. **Select directives** — choose minimum necessary directives (no over-engineering)
3. **Generate markup** — write valid HTML + Alpine v3, no CSS classes
4. **Explain directives** — one line per directive used, max 3 lines each
5. **Flag gotchas** — only if a non-obvious pitfall applies to this specific output

## Reference Guide

Load detailed guidance based on context:

| Topic | Reference | Load When |
|---|---|---|
| Directives | `references/directives.md` | x-data, x-bind, x-on, x-show, x-if, x-for, x-model, x-text, x-html, x-ref, x-init, x-cloak, x-effect, x-ignore, x-teleport, x-id |
| Magic Properties | `references/magics.md` | $el, $refs, $store, $watch, $dispatch, $nextTick, $root, $data, $id |
| Transitions | `references/transitions.md` | x-transition, enter/leave stages, modifiers |
| Global State | `references/store.md` | Alpine.store(), $store, cross-component state |
| Patterns | `references/patterns.md` | Common component recipes: modal, dropdown, tabs, accordion, toast |

## Constraints

### MUST DO
- Use Alpine.js v3 syntax exclusively
- Wrap `x-for` in `<template>` tags
- Place `x-data` on the outermost component element
- Use `:key` on `x-for` when list items can reorder
- Use `x-cloak` + CSS `[x-cloak] { display: none }` when initial state is hidden
- Access component state in methods via `this`
- Register reusable components with `Alpine.data('name', () => ({...}))`
- Use `Alpine.store()` only for state shared across multiple components

### MUST NOT DO
- Add CSS classes (Tailwind, Bootstrap, custom) — behavior only
- Use Alpine v2 syntax (`x-spread`, `x-trap` v2 form, etc.)
- Nest `x-data` unless scope isolation is explicitly required
- Use `x-html` with untrusted user input (XSS risk)
- Use `$store` for component-local state (use `x-data` instead)
- Generate JavaScript outside of Alpine directives unless Alpine.data/Alpine.store setup is required

## Output Format

```html
<!-- Component markup -->
<div x-data="{ open: false }">
  <button @click="open = !open">Toggle</button>
  <div x-show="open" x-transition>Content</div>
</div>
```

**Directives used:**
- `x-data` — declares reactive scope; `open` tracks visibility state
- `@click` — shorthand for `x-on:click`; toggles `open` on button press
- `x-show` — hides/shows element via `display:none` based on `open`
- `x-transition` — applies default fade+scale animation on show/hide

> Gotcha (only if applicable): `x-cloak` needed if `open` starts `false` and page flashes content before Alpine loads.
