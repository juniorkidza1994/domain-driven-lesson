# Alpine.js v3 — Global Store Reference

## When to Use $store vs x-data

| Scenario | Use |
|---|---|
| State shared across multiple components | `Alpine.store()` + `$store` |
| State local to one component | `x-data` |

---

## Setup

Register stores before Alpine initializes:

```html
<script>
  document.addEventListener('alpine:init', () => {

    // Object store with methods
    Alpine.store('cart', {
      items: [],
      get count() { return this.items.length },
      add(item) { this.items.push(item) },
      remove(id) { this.items = this.items.filter(i => i.id !== id) }
    })

    // Simple value store
    Alpine.store('darkMode', false)

  })
</script>
```

---

## Access in Templates

```html
<!-- Read -->
<span x-text="$store.cart.count"></span>

<!-- Mutate -->
<button @click="$store.cart.add(product)">Add</button>

<!-- Simple value toggle -->
<button @click="$store.darkMode = !$store.darkMode">Toggle Dark</button>

<!-- Read simple value -->
<body :class="{ 'dark': $store.darkMode }">
```

---

## Access in Alpine.data Methods

```js
Alpine.data('productCard', () => ({
  addToCart(product) {
    Alpine.store('cart').add(product)
  }
}))
```

---

## Notes

- Store updates are reactive — all components reading `$store.x` re-render automatically
- Stores persist across component lifecycles (page-level singletons)
- No need for `$store` inside store methods — use `this` instead
