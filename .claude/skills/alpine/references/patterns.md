# Alpine.js v3 — Common Component Patterns

## Dropdown / Menu

```html
<div x-data="{ open: false }">
  <button @click="open = !open" @keyup.escape="open = false">
    Menu
  </button>
  <div x-show="open" @click.outside="open = false" x-transition>
    <a href="#">Item 1</a>
    <a href="#">Item 2</a>
  </div>
</div>
```

---

## Modal / Dialog

```html
<div x-data="{ open: false }">
  <button @click="open = true">Open Modal</button>

  <template x-teleport="body">
    <div x-show="open" @keydown.escape.window="open = false" x-transition>
      <!-- Backdrop -->
      <div @click="open = false" style="position:fixed;inset:0;background:rgba(0,0,0,0.5)"></div>
      <!-- Panel -->
      <div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%)" x-trap="open">
        <button @click="open = false">Close</button>
        <p>Modal content</p>
      </div>
    </div>
  </template>
</div>
```

> Note: `x-trap` requires the `@alpinejs/focus` plugin.

---

## Tabs

```html
<div x-data="{ activeTab: 'one' }">
  <nav>
    <button @click="activeTab = 'one'" :aria-selected="activeTab === 'one'">Tab 1</button>
    <button @click="activeTab = 'two'" :aria-selected="activeTab === 'two'">Tab 2</button>
    <button @click="activeTab = 'three'" :aria-selected="activeTab === 'three'">Tab 3</button>
  </nav>

  <div x-show="activeTab === 'one'">Content 1</div>
  <div x-show="activeTab === 'two'">Content 2</div>
  <div x-show="activeTab === 'three'">Content 3</div>
</div>
```

---

## Accordion

```html
<div x-data="{ active: null }">
  <template x-for="(item, i) in ['FAQ 1', 'FAQ 2', 'FAQ 3']" :key="i">
    <div>
      <button @click="active = active === i ? null : i" x-text="item"></button>
      <div x-show="active === i" x-transition>
        <p>Answer content here</p>
      </div>
    </div>
  </template>
</div>
```

---

## Search / Filter

```html
<div x-data="{
  search: '',
  items: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
  get filtered() {
    return this.items.filter(i => i.toLowerCase().includes(this.search.toLowerCase()))
  }
}">
  <input x-model.debounce.300ms="search" placeholder="Search...">
  <ul>
    <template x-for="item in filtered" :key="item">
      <li x-text="item"></li>
    </template>
  </ul>
  <p x-show="filtered.length === 0">No results</p>
</div>
```

---

## Toast / Notification

```html
<!-- Global store setup -->
<script>
  document.addEventListener('alpine:init', () => {
    Alpine.store('toast', {
      messages: [],
      show(msg, duration = 3000) {
        const id = Date.now()
        this.messages.push({ id, msg })
        setTimeout(() => this.dismiss(id), duration)
      },
      dismiss(id) {
        this.messages = this.messages.filter(m => m.id !== id)
      }
    })
  })
</script>

<!-- Trigger from anywhere -->
<button @click="$store.toast.show('Saved!')">Save</button>

<!-- Toast container -->
<div style="position:fixed;top:1rem;right:1rem" x-data>
  <template x-for="t in $store.toast.messages" :key="t.id">
    <div x-show="true" x-transition @click="$store.toast.dismiss(t.id)">
      <span x-text="t.msg"></span>
    </div>
  </template>
</div>
```

---

## Toggle / Switch

```html
<div x-data="{ enabled: false }">
  <button
    role="switch"
    :aria-checked="enabled"
    @click="enabled = !enabled">
    <span x-text="enabled ? 'On' : 'Off'"></span>
  </button>
</div>
```

---

## Form Validation (client-side)

```html
<div x-data="{
  form: { email: '', password: '' },
  errors: {},
  validate() {
    this.errors = {}
    if (!this.form.email.includes('@')) this.errors.email = 'Invalid email'
    if (this.form.password.length < 8) this.errors.password = 'Min 8 characters'
    return Object.keys(this.errors).length === 0
  },
  submit() {
    if (this.validate()) {
      // proceed
    }
  }
}">
  <input x-model="form.email" type="email">
  <span x-show="errors.email" x-text="errors.email"></span>

  <input x-model="form.password" type="password">
  <span x-show="errors.password" x-text="errors.password"></span>

  <button @click="submit()">Submit</button>
</div>
```

---

## Infinite Scroll / Load More

```html
<div x-data="{
  items: [],
  page: 1,
  loading: false,
  async loadMore() {
    this.loading = true
    const res = await fetch(`/api/items?page=${this.page}`)
    const data = await res.json()
    this.items.push(...data)
    this.page++
    this.loading = false
  }
}" x-init="loadMore()">

  <template x-for="item in items" :key="item.id">
    <div x-text="item.name"></div>
  </template>

  <button @click="loadMore()" :disabled="loading">
    <span x-show="!loading">Load More</span>
    <span x-show="loading">Loading...</span>
  </button>
</div>
```
