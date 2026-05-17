# Alpine.js v3 — Transitions Reference

## Default Helper (simplest)

```html
<div x-show="open" x-transition>
  Content fades + scales in/out
</div>
```

Default timing: 150ms enter, 75ms leave. Applies opacity + scale.

---

## Modifier Variants

```html
<!-- Opacity only -->
<div x-show="open" x-transition.opacity>

<!-- Scale only -->
<div x-show="open" x-transition.scale>

<!-- Custom scale amount -->
<div x-show="open" x-transition.scale.90>

<!-- Custom duration -->
<div x-show="open" x-transition.duration.300ms>

<!-- Enter and leave separate durations -->
<div x-show="open"
     x-transition:enter.duration.300ms
     x-transition:leave.duration.150ms>

<!-- Delay -->
<div x-show="open" x-transition.delay.100ms>

<!-- Scale origin -->
<div x-show="open" x-transition.scale.origin.top>
<div x-show="open" x-transition.scale.origin.top.right>
```

---

## CSS Class Approach (full control)

```html
<div x-show="open"
     x-transition:enter="transition ease-out duration-300"
     x-transition:enter-start="opacity-0 scale-95"
     x-transition:enter-end="opacity-100 scale-100"
     x-transition:leave="transition ease-in duration-200"
     x-transition:leave-start="opacity-100 scale-100"
     x-transition:leave-end="opacity-0 scale-95">
```

**Stages:**
| Modifier | Applied During |
|---|---|
| `:enter` | Entire enter phase |
| `:enter-start` | First frame of enter |
| `:enter-end` | Last frame of enter |
| `:leave` | Entire leave phase |
| `:leave-start` | First frame of leave |
| `:leave-end` | Last frame of leave |

---

## Notes

- `x-transition` only works with `x-show`, NOT with `x-if`
- For `x-if` animated toggles, switch to `x-show` instead
- CSS class approach requires you to provide the actual CSS (Tailwind shown above, but any classes work)
