---
name: next-ticket
description: Full ticket ship pipeline for DDD Learning Website. Finds next open DRE-N from Linear, plans with Opus agent (HTML plan file), gates on complexity, then implements + tests + commits + opens PR with Sonnet agent. Use when user says "next ticket", "ship ticket", "work on DRE-N", or wants to start/continue a Linear ticket.
---

# next-ticket

Ships a Linear ticket end-to-end: plan → implement → test → commit → PR.

## Invocation

```
/next-ticket          # auto-picks lowest open DRE-N
/next-ticket DRE-5    # targets specific ticket
```

## Pipeline

### Step 1 — Read ticket
- Call `mcp__linear-server__list_issues` (project: "DDD Learning Website", orderBy: createdAt, limit: 30)
- If arg given: use that ticket. Else: find lowest DRE-N not Done/Canceled.
- Call `mcp__linear-server__get_issue` for full details.
- Display: title, status, labels, URL, AC bullet list.
- Call `mcp__linear-server__save_issue` → status: **In Progress**.

### Step 2 — Plan (Opus agent)
Use the **Agent tool**:
- `model`: `"opus"`
- `description`: `"Plan DRE-N implementation"`
- `prompt`: use the **Opus planner prompt template** from [REFERENCE.md](REFERENCE.md), populated with full ticket title, description, AC, and ticket ID.

Agent writes `.claude/plans/DRE-N.html` — see [REFERENCE.md](REFERENCE.md) for format.

### Step 3 — Gate check
Parse `<script id="plan-meta">` from plan file.

Hard rules (always gate regardless of Opus flag):
- `r_level` is `R0`
- Ticket has no clear AC
- Phase dependency not met (see CLAUDE.md dependency order)

If gated → print plan path, ask: **"Review plan at `.claude/plans/DRE-N.html`, then confirm to continue."** Wait.
If not gated → auto-proceed.

### Step 4 — Implement (Sonnet agent)
Use the **Agent tool**:
- `model`: `"sonnet"`
- `description`: `"Implement DRE-N"`
- `prompt`: use the **Sonnet developer prompt template** from [REFERENCE.md](REFERENCE.md), with the plan file path substituted.

Agent must:
1. `git checkout -b feature/DRE-N-kebab-title`
2. Implement per plan steps + design refs
3. Run `test_command` from plan-meta
4. If tests fail → one self-fix attempt → re-run
5. If still failing → stop, report output to user
6. If passing → call `/git-commit` skill

### Step 5 — PR + Linear
- `gh pr create --base main` — title: `DRE-N: [ticket title]`, body includes `Closes DRE-N`
- Call `mcp__linear-server__save_issue` → status: **In Review**
- Print PR URL

## Prerequisites
- Linear GitHub integration set up (for auto-Done on merge) — one-time manual setup
- `.claude/plans/` in `.gitignore`

See [REFERENCE.md](REFERENCE.md) for plan file spec and agent prompt templates.
