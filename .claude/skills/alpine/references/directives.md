# Alpine.js v3 — Directives Reference

## x-data
Declares a reactive Alpine component. Scope available to all child elements.

```html
<div x-data="{ count: 0, open: false }">...</div>
<!-- Empty component -->
<div x-data>...</div>
<!-- Named reusable component (registered via Alpine.data) -->
<div x-data="dropdown">...</div>
```

- Methods access state via `this`: `toggle() { this.open = !this.open }`
- Getters act as computed (not cached): `get isOpen() { return this.open }`
- Inner `x-data` shadows outer properties with same name
- Register reusable: `Alpine.data('dropdown', () => ({ open: false, toggle() { this.open = !this.open } }))`

---

## x-bind / :
Dynamically sets HTML attributes.

```html
<input :placeholder="placeholderText">
<div :class="{ 'active': isActive }">   <!-- merges with static classes -->
<div :style="{ color: 'red' }">
<button x-bind="triggerObject">        <!-- bind entire directive object -->
```

- Class binding is additive — Alpine preserves existing classes
- Style binding merges with existing inline styles
- Object binding (`x-bind="obj"`) enables reusable directive bundles

---

## x-on / @
Attaches event listeners.

```html
<button @click="count++">
<input @keyup.enter="submit()">
<div @click.outside="close()">
```

**Modifiers:**
| Modifier | Effect |
|---|---|
| `.prevent` | `event.preventDefault()` |
| `.stop` | `event.stopPropagation()` |
| `.outside` | fires only when click is outside element |
| `.window` | listener on `window` |
| `.document` | listener on `document` |
| `.once` | fires only once |
| `.debounce[.Xms]` | delay 250ms default |
| `.throttle[.Xms]` | limit to 250ms default |
| `.self` | only if event target is element itself |
| `.passive` | improves scroll perf |
| `.capture` | capture phase |

**Keyboard:** `.enter` `.escape` `.space` `.tab` `.shift` `.ctrl` `.cmd` `.alt` `.up` `.down` `.left` `.right`

Access native event: `$event` magic, or method first param if called without `()`.

---

## x-show
Toggles visibility via `display:none`. DOM stays in place.

```html
<div x-show="open">Content</div>
<div x-show.important="open">Content</div>  <!-- override !important CSS -->
```

- Pairs with `x-transition` for animations
- Use `x-cloak` when initial state is hidden to prevent flash

---

## x-if
Conditionally adds/removes element from DOM (not just hidden).

```html
<template x-if="loggedIn">
  <div>Welcome back</div>
</template>
```

- Must wrap in `<template>` tag
- No `x-transition` support (use `x-show` for animated toggles)
- Use when DOM removal matters (e.g., unmounting heavy components)

---

## x-for
Renders list of elements.

```html
<template x-for="item in items" :key="item.id">
  <li x-text="item.name"></li>
</template>

<!-- With index -->
<template x-for="(item, index) in items" :key="item.id">
  <li x-text="`${index}: ${item.name}`"></li>
</template>

<!-- Range -->
<template x-for="i in 5">
  <span x-text="i"></span>
</template>
```

- MUST be on `<template>` tag
- Template must have exactly ONE root child element
- Always use `:key` when list order can change

---

## x-model
Two-way binding between input and data.

```html
<input x-model="search">
<textarea x-model="message"></textarea>
<input type="checkbox" x-model="checked">       <!-- boolean -->
<input type="checkbox" x-model="selectedItems">  <!-- array -->
<select x-model="selected">...</select>
```

**Modifiers:**
| Modifier | Effect |
|---|---|
| `.lazy` | update on blur |
| `.number` | cast to number |
| `.boolean` | cast to boolean |
| `.debounce[.Xms]` | delay updates |
| `.throttle[.Xms]` | limit updates |
| `.fill` | init from element's value attr |

---

## x-text
Sets element text content.

```html
<span x-text="count"></span>
<span x-text="`Hello, ${name}`"></span>
```

---

## x-html
Sets element innerHTML. **Never use with untrusted input — XSS risk.**

```html
<div x-html="trustedMarkup"></div>
```

---

## x-ref
Creates a reference to a DOM element.

```html
<input x-ref="emailInput">
<button @click="$refs.emailInput.focus()">Focus</button>
```

---

## x-init
Runs expression when component initializes.

```html
<div x-data="{ items: [] }" x-init="items = await fetch('/api').then(r => r.json())">
```

---

## x-effect
Re-runs expression when its reactive dependencies change.

```html
<div x-data="{ label: '' }" x-effect="console.log(label)">
  <input x-model="label">
</div>
```

---

## x-cloak
Hidden until Alpine initializes. Requires CSS: `[x-cloak] { display: none }`.

```html
<div x-cloak x-show="open">Hidden until Alpine loads</div>
```

---

## x-ignore
Prevents Alpine from processing this element and its children.

```html
<div x-ignore>
  <!-- Alpine ignores all Alpine attributes here -->
</div>
```

---

## x-teleport
Moves element to target outside component tree (e.g., modals to body).

```html
<template x-teleport="body">
  <div x-show="open">Modal content</div>
</template>
```

---

## x-id
Generates unique IDs scoped to component. Use with `$id()` magic.

```html
<div x-data x-id="['input-label']">
  <label :for="$id('input-label')">Name</label>
  <input :id="$id('input-label')" type="text">
</div>
```
