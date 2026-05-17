# Alpine.js v3 — Magic Properties Reference

## $el
Current element reference.

```html
<div x-data @click="$el.classList.toggle('active')"></div>
```

---

## $refs
Access elements marked with `x-ref`.

```html
<div x-data>
  <input x-ref="search">
  <button @click="$refs.search.focus()">Focus</button>
</div>
```

---

## $store
Access global Alpine stores (registered via `Alpine.store()`).

```html
<button @click="$store.cart.addItem(product)">Add to cart</button>
<span x-text="$store.cart.count"></span>
```

See `store.md` for setup.

---

## $watch
Watch a data property and run callback on change.

```html
<div x-data="{ open: false }" x-init="$watch('open', val => console.log(val))">
```

Returns an unsubscribe function. Can watch nested paths: `$watch('user.name', cb)`.

---

## $dispatch
Dispatch a custom DOM event (bubbles up by default).

```html
<button @click="$dispatch('notify', { message: 'Saved!' })">Save</button>

<!-- Parent listens -->
<div @notify.window="alert($event.detail.message)">
```

Use `.window` modifier to catch dispatched events from anywhere.

---

## $nextTick
Wait for Alpine to finish DOM updates before running code.

```html
<div x-data="{ open: false }">
  <button @click="open = true; $nextTick(() => $refs.modal.focus())">Open</button>
  <div x-ref="modal" x-show="open">Modal</div>
</div>
```

---

## $root
Reference to the root `x-data` element of the current component.

```html
<div x-data>
  <span x-text="$root.id"></span>
</div>
```

---

## $data
The full reactive data object of the current component.

```html
<div x-data="{ a: 1, b: 2 }" x-init="console.log(JSON.stringify($data))">
```

---

## $id
Generate unique IDs scoped to the component (requires `x-id` on parent).

```html
<div x-data x-id="['input']">
  <label :for="$id('input')">Name</label>
  <input :id="$id('input')" type="text">
</div>
```

Same `$id('input')` call inside same `x-id` scope returns same ID. Nested components get distinct IDs.
