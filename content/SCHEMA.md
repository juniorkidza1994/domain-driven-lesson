# DDD Learning Website — Content Schema

## Overview

All user-facing content lives under `content/` and is split into four types:

| Type | Path pattern | Purpose |
|---|---|---|
| Lesson | `content/lessons/{en,th}/module-0N.json` | Module text, diagrams, and sections |
| Quiz | `content/quizzes/{en,th}/module-0N.json` | MCQ and true-false questions |
| Tooltips | `content/tooltips/{en,th}.json` | Inline term definitions |
| Glossary | `content/glossary/{en,th}.json` | Categorised full glossary |

## Bilingual Convention

Every user-facing string field is a bilingual object:

```json
{ "en": "English text", "th": "Thai text" }
```

Rules:
- `en` is **required** and must be **non-empty**.
- `th` is **required as a key** but may be `""` until DRE-25 (Thai translation sprint).
- The validator enforces `th` key existence but allows empty string.

## ID Naming Convention

All `id` fields must be **kebab-case**: `^[a-z0-9]+(-[a-z0-9]+)*$`

Examples: `module-01`, `bounded-context`, `q1`, `ddd-strategic`

The validator enforces this regex on: module ids, section ids, question ids, option ids, tooltip ids, category ids, term ids.

## Section Type Enum

| Type | When to use |
|---|---|
| `text` | Plain prose with optional tooltip refs |
| `diagram` | Mermaid or SVG diagram with caption |
| `infographic` | Illustrated concept (image-based) |
| `comparison` | Side-by-side comparison table |
| `callout` | Highlighted note, tip, or warning |
| `es-board` | Event Storming board with sticky notes |
| `flow` | Process flow diagram |

Diagram types (for `diagram.type` field): `mermaid`, `es-board`, `svg`

## 1. Lesson Schema

File: `content/lessons/{en,th}/module-0N.json`

```json
{
  "module": {
    "id": "module-01",
    "number": 1,
    "title": { "en": "Introduction to DDD", "th": "..." },
    "estimatedMinutes": 20,
    "sections": [
      {
        "id": "intro",
        "type": "text",
        "title": { "en": "Introduction", "th": "..." },
        "content": { "en": "Markdown-ish prose here.", "th": "..." },
        "diagram": {
          "type": "mermaid",
          "source": "flowchart TD\n  A --> B",
          "caption": { "en": "Caption text", "th": "..." }
        },
        "tooltipRefs": ["bounded-context"]
      }
    ]
  }
}
```

### Required fields

| Field | Type | Rules |
|---|---|---|
| `module.id` | string | kebab-case, e.g. `module-01` |
| `module.number` | integer | 1..7 |
| `module.title` | bilingual | non-empty en |
| `module.estimatedMinutes` | positive number | > 0 |
| `module.sections` | array | length >= 1 |
| `sections[].id` | string | kebab-case, unique within module |
| `sections[].type` | string | see Section Type Enum above |
| `sections[].title` | bilingual | non-empty en |
| `sections[].content` | bilingual | non-empty en |

### Optional section fields

| Field | Type | Rules |
|---|---|---|
| `sections[].diagram` | object | required when type is `diagram`, `es-board`, or `flow` |
| `sections[].diagram.type` | string | `mermaid` \| `es-board` \| `svg` |
| `sections[].diagram.source` | string | non-empty |
| `sections[].diagram.caption` | bilingual | optional |
| `sections[].tooltipRefs` | string[] | kebab-case tooltip IDs |

## 2. Quiz Schema

File: `content/quizzes/{en,th}/module-0N.json`

```json
{
  "moduleId": "module-01",
  "questions": [
    {
      "id": "q1",
      "type": "mcq",
      "question": { "en": "What does DDD stand for?", "th": "..." },
      "options": [
        { "id": "a", "text": { "en": "Domain-Driven Design", "th": "..." } },
        { "id": "b", "text": { "en": "Data-Driven Design", "th": "..." } }
      ],
      "correctOption": "a",
      "explanation": { "en": "DDD = Domain-Driven Design.", "th": "..." }
    }
  ]
}
```

### Required fields

| Field | Type | Rules |
|---|---|---|
| `moduleId` | string | kebab-case |
| `questions` | array | length >= 1 |
| `questions[].id` | string | kebab-case, unique within file |
| `questions[].type` | string | `mcq` \| `true-false` |
| `questions[].question` | bilingual | non-empty en |
| `questions[].options` | array | mcq: 2..6 items; true-false: exactly `[{id:"true"}, {id:"false"}]` |
| `questions[].options[].id` | string | kebab-case, unique within question |
| `questions[].options[].text` | bilingual | non-empty en |
| `questions[].correctOption` | string | must match one option id |
| `questions[].explanation` | bilingual | non-empty en |

## 3. Tooltip Schema

File: `content/tooltips/{en,th}.json`

```json
{
  "tooltips": [
    {
      "id": "bounded-context",
      "term": { "en": "Bounded Context", "th": "ขอบเขตที่มีบริบท" },
      "short": { "en": "A boundary within which a domain model is defined.", "th": "..." },
      "full": { "en": "A Bounded Context is a central pattern in DDD...", "th": "..." },
      "example": { "en": "In an e-commerce system...", "th": "..." },
      "sourceRef": "Eric Evans, Domain-Driven Design (2003)"
    }
  ]
}
```

### Required fields

| Field | Type | Rules |
|---|---|---|
| `tooltips` | array | length >= 1 |
| `tooltips[].id` | string | kebab-case, unique across file |
| `tooltips[].term` | bilingual | non-empty en |
| `tooltips[].short` | bilingual | non-empty en; soft limit 120 chars |
| `tooltips[].full` | bilingual | non-empty en |

### Optional fields

| Field | Type |
|---|---|
| `tooltips[].example` | bilingual |
| `tooltips[].sourceRef` | string |

**Single source of truth:** `en.json` and `th.json` must contain the same tooltip IDs in the same order. The validator checks ID set equality.

## 4. Glossary Schema

File: `content/glossary/{en,th}.json`

```json
{
  "categories": [
    {
      "id": "ddd-strategic",
      "name": { "en": "DDD Strategic Patterns", "th": "..." },
      "terms": [
        {
          "id": "bounded-context",
          "term": { "en": "Bounded Context", "th": "..." },
          "definition": { "en": "A boundary within which...", "th": "..." },
          "relatedTerms": ["ubiquitous-language"],
          "sourceRef": "Evans 2003"
        }
      ]
    }
  ]
}
```

### Required fields

| Field | Type | Rules |
|---|---|---|
| `categories` | array | length >= 1 |
| `categories[].id` | string | kebab-case, unique |
| `categories[].name` | bilingual | non-empty en |
| `categories[].terms` | array | length >= 1 |
| `categories[].terms[].id` | string | kebab-case, unique across whole glossary |
| `categories[].terms[].term` | bilingual | non-empty en |
| `categories[].terms[].definition` | bilingual | non-empty en |

### Optional fields

| Field | Type | Rules |
|---|---|---|
| `categories[].terms[].relatedTerms` | string[] | all must resolve to a term id in same file |
| `categories[].terms[].sourceRef` | string | citation |

### Defined categories

| ID | Description |
|---|---|
| `ddd-strategic` | Bounded Context, Ubiquitous Language, Context Map, etc. |
| `ddd-tactical` | Aggregate, Entity, Value Object, Domain Event, etc. |
| `event-storming` | Event Storming specific terminology |
| `eda` | Event-Driven Architecture terminology |

## Adding a New Section Type (for DRE-15+)

When a new section type is needed:

1. Add the type string to `SECTION_TYPES` set in `tests/unit/validate-schema.js`
2. Add the type to the Section Type Enum table in this document
3. If the type requires a `diagram` field, update the `validateLesson` function condition
4. Create a Playwright spec or update `content.spec.js` to cover the new renderer
5. Implement the renderer in `js/content-loader.js`
6. Update `content/SCHEMA.md` with the new type's description

## How to Run the Validator

```bash
# From project root — no server needed
node --test tests/unit/validate-schema.js
```

Expected output: all tests pass, exit code `0`.

The same command runs on every push via `.github/workflows/test.yml` (Unit — schema step).
