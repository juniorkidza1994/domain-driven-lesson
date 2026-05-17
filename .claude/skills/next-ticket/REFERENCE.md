# next-ticket — Reference

## Plan file spec

**Location:** `.claude/plans/DRE-N.html`
**Gitignore:** add `.claude/plans/` to `.gitignore`

### Required structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Plan: DRE-N — [ticket title]</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <style>
    /* Paste :root tokens from design/project/styles.css */
    /* Minimal layout: max-width 860px, padding 32px, font Inter */
  </style>
</head>
<body>

<!-- MACHINE-READABLE META — parsed by gate check and Sonnet agent -->
<script type="application/json" id="plan-meta">
{
  "ticket": "DRE-N",
  "review_required": false,
  "review_reason": "",
  "r_level": "R2",
  "files_changed": ["index.html", "css/tokens.css"],
  "test_command": "npx playwright test tests/e2e/smoke.spec.js",
  "branch": "feature/DRE-N-kebab-title",
  "commit_type": "feat"
}
</script>

<!-- HUMAN-READABLE SECTIONS -->

<header><!-- DRE-N badge, ticket title, status chip, Linear URL --></header>

<!-- 1. Goal — one paragraph -->
<section id="goal">...</section>

<!-- 2. File tree — color-coded: green=create, yellow=edit, red=delete -->
<section id="files">
  <!-- Use .card + inline SVG tree or styled <ul> -->
</section>

<!-- 3. Implementation steps — use .stepper from design tokens -->
<section id="steps">
  <!-- <div class="step"> per step, numbered dots -->
</section>

<!-- 4. Diagram — only if data flow / component relations involved -->
<section id="diagram">
  <pre class="mermaid">
    flowchart LR
      A --> B
  </pre>
</section>

<!-- 5. Design refs — which design/project/ files + components to follow -->
<section id="design-refs">
  <!-- Card per ref: filename, component name, what to extract -->
</section>

<!-- 6. AC checklist — every AC from the Linear ticket -->
<section id="acceptance-criteria">
  <!-- <ul> with each AC as <li> — checkboxes for review -->
</section>

</body>
</html>
```

### plan-meta field reference

| Field | Type | Description |
|---|---|---|
| `ticket` | string | Linear ticket ID e.g. `DRE-5` |
| `review_required` | bool | Opus flags if human should review before implement |
| `review_reason` | string | Why review needed (empty if false) |
| `r_level` | `R0`/`R1`/`R2` | Reversibility per CLAUDE.md rules |
| `files_changed` | string[] | Files to create/edit/delete |
| `test_command` | string | Exact command Sonnet runs to verify |
| `branch` | string | `feature/DRE-N-slug` |
| `commit_type` | string | From git-commit skill table (feat/fix/chore/etc) |

## Hard gate rules (always override `review_required: false`)

```
r_level === "R0"                     → gate
ticket AC section is empty           → gate
phase dep not met (CLAUDE.md order)  → gate
```

Phase dependency order from CLAUDE.md:
```
DRE-5→9 (Foundation) → DRE-10–13 (Research) → DRE-14–17 (Content System)
→ DRE-18–24 (Content EN, needs research/*.md) → DRE-25→28 (Polish)
```

## Opus planner agent prompt template

```
You are a senior architect planning implementation for ticket [TICKET_ID].

## Ticket details
[paste full ticket: title, description, AC]

## Project context
- Stack: Alpine.js v3 + plain HTML, NO React/npm/build step
- Design files: design/project/ (React prototype — translate to Alpine)
- Use /implement-page skill reference for component mapping
- CLAUDE.md rules: R0/R1/R2 reversibility, phase dependencies

## Your job
1. Read relevant design files from design/project/
2. Identify every file to create or modify
3. Write a plan to .claude/plans/[TICKET_ID].html
4. Set review_required: true if:
   - Design decision not covered in ticket
   - >3 files changed
   - Conflict with existing code found
   - Ambiguous AC
5. Set r_level based on CLAUDE.md R0/R1/R2 rules

Output ONLY the HTML plan file. No prose outside the file.
```

## Sonnet developer agent prompt template

```
You are a senior developer implementing a pre-approved plan.

## Plan file
[PLAN_FILE_PATH]

Read the plan file. Extract plan-meta JSON. Follow the steps exactly.

## Instructions
1. git checkout -b [branch from plan-meta]
2. Implement each step in the plan
3. For design translation: read design/project/ files referenced in plan
4. Use /implement-page skill for component → Alpine.js patterns
5. Use /alpine skill for interactive component markup
6. Run: [test_command from plan-meta]
7. If tests fail: read output, fix ONE issue, re-run once
8. If still failing: STOP. Report exact test output. Do not commit.
9. If tests pass: call /git-commit skill (type: [commit_type from plan-meta])

Do not deviate from plan scope. If you find something wrong with the plan, stop and report.
```

## PR body template

```markdown
## Summary
- [bullet 1]
- [bullet 2]

## Test plan
- [ ] [test from plan AC checklist]

## Design ref
Implemented from `design/project/[file]` — [component name]

Closes DRE-N

🤖 Planned by Claude Opus · Implemented by Claude Sonnet
```
