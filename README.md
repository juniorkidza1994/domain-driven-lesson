# DDD Learning Website

A bilingual (EN/TH) Domain-Driven Design and Event Sourcing course for Thai backend developers. Static site — no build step required.

**Live site**: _to be added after Cloudflare Pages deployment_

---

## What this is

An interactive learning website covering:

- **DDD tactical patterns** — Aggregate, Bounded Context, Ubiquitous Language, Domain Events
- **Event Storming** — Brandolini's workshop methodology, all 8 sticky note types
- **Event-Driven Architecture (EDA)** — sagas, CQRS, event sourcing
- **E-commerce case study** — applying all patterns to a real domain

Target audience: mid-level Thai backend developers who have heard of DDD but never applied it.

Tech stack: Alpine.js v3 + Mermaid.js v11, served as plain static files. No React, no Vue, no build step.

---

## Local development

Fetch-based content loading requires an HTTP server — `file://` URLs will fail with CORS errors.

```bash
# Start the dev server (port 8080)
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

All 9 pages:

| Path | Description |
|---|---|
| `/index.html` | Landing page |
| `/glossary.html` | DDD glossary |
| `/modules/01-intro.html` | Module 1 — Introduction |
| `/modules/02-ddd.html` | Module 2 — DDD Fundamentals |
| `/modules/03-event-storming.html` | Module 3 — Event Storming |
| `/modules/04-es-to-ddd.html` | Module 4 — ES to DDD |
| `/modules/05-eda.html` | Module 5 — EDA |
| `/modules/06-es-to-eda.html` | Module 6 — ES to EDA |
| `/modules/07-case-study.html` | Module 7 — Case Study |

---

## Testing

### Unit tests (no server needed)

```bash
node --test tests/unit/validate-schema.js
node --test tests/unit/validate-research.js
node --test tests/unit/validate-claude-md.js
node --test tests/unit/validate-paths.js
```

`validate-paths.js` scans all `js/*.js` fetch() calls, expands URL patterns, and asserts every resolved path exists on disk with a lowercase filename — guards against case-sensitivity bugs on Linux hosts.

### End-to-end tests (server must be running)

```bash
# The playwright.config.js webServer block auto-starts python3 -m http.server 8080.
# Just run:
npx playwright test

# Run a single spec:
npx playwright test tests/e2e/smoke.spec.js
```

### CI

GitHub Actions runs the full suite on every push to `main` and on pull requests targeting `main`. See `.github/workflows/test.yml`.

---

## Project structure

```
/
├── index.html              # Landing page
├── glossary.html
├── _headers                # Cloudflare Pages security headers
├── modules/
│   ├── 01-intro.html
│   └── ...                 # 7 module pages
├── css/
│   ├── tokens.css          # Design tokens
│   ├── base.css            # Reset + typography
│   └── components.css      # Cards, buttons, sticky notes
├── js/
│   ├── nav.js              # Shared nav + Alpine store
│   ├── content-loader.js   # Fetches + renders lesson JSON
│   ├── quiz.js             # Quiz logic
│   ├── tooltip.js          # Tooltip system
│   └── diagrams.js         # Mermaid lifecycle
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

---

## Deployment

The site auto-deploys from the `main` branch via Cloudflare Pages.

### Manual setup (first-time only)

1. Log in to [https://dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub OAuth for the repo owner.
3. Select the repository and set **Branch** = `main`.
4. Build settings:
   - **Framework preset**: None
   - **Build command**: _(leave empty)_
   - **Build output directory**: `/`
   - **Root directory**: _(leave empty)_
5. Click **Save and Deploy**. Wait ~1 minute.
6. Copy the assigned `*.pages.dev` URL.
7. (Optional) Add a custom domain under **Custom domains** in the dashboard.

### After deploy — production smoke

```bash
PROD=https://<your-project>.pages.dev

# HTTP status + headers for all 9 pages
for p in / /glossary.html /modules/01-intro.html /modules/02-ddd.html \
         /modules/03-event-storming.html /modules/04-es-to-ddd.html \
         /modules/05-eda.html /modules/06-es-to-eda.html /modules/07-case-study.html; do
  echo "--- $p"
  curl -sI "$PROD$p" | grep -E "^HTTP|cf-ray|x-frame|content-type"
done

# E2E smoke against production
PLAYWRIGHT_BASE_URL=$PROD npx playwright test tests/e2e/smoke.spec.js
```

Expected: `HTTP/2 200`, `cf-ray` header present, `x-frame-options: DENY`.

---

## Tech stack constraints

- **No npm / no build step** in the project source — CDN-only Alpine.js and Mermaid.js
- **CDN**: both loaded from `cdn.jsdelivr.net` at runtime
- **Case-sensitive paths**: Cloudflare Pages runs on Linux — `Module-01.html` and `module-01.html` are different files. All paths and filenames must be lowercase. The `validate-paths.js` unit test enforces this.
- **Bilingual content**: lesson/quiz JSON files hold both `en` and `th` values in the same file. There are no separate `content/lessons/th/` files.

---

## Contributing

- Always use a feature branch; never push directly to `main`.
- Run `node --test tests/unit/validate-paths.js` before opening a PR if you rename any content files or fetch paths.
- Thai content rules: technical terms (DDD, Event Sourcing, Aggregate, Bounded Context…) stay in English; only prose is translated.
