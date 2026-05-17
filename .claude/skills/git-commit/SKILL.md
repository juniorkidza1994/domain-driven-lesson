---
name: git-commit
description: Stage and commit current changes using the project commit message convention. Use when the user wants to commit staged or unstaged changes.
user-invocable: true
---

# Git Commit

Follow these steps to stage and commit the current changes.

## Commit Message Format

```
[type] <short_description>
```

Where `type` is one of:

| Type | When to use |
|------|-------------|
| `feat` | Adding a new feature |
| `fix` | Fixing an issue or bug |
| `doc` | Adding or updating documentation |
| `build` | Changes to build system or external dependencies |
| `chore` | Routine task or maintenance |
| `ci` | Changes to CI scripts and configuration files |
| `style` | Non-functional formatting changes (linting, whitespace) |
| `refactor` | Rewriting code without behavioral changes |
| `test` | Adding or updating tests |

Prefix `type` with `!` for breaking changes (e.g. `[!feat]`).

### Examples

```
[feat] added user login functionality
[fix] corrected typo in response message
[doc] added setup steps to README.md
[build] updated config for production
[chore] updated dependencies
[ci] added cicd for deployment
[style] fixed formatting
[refactor] simplified authentication flow
[test] added unit test for payment module
```

## Steps

1. Run `git status` to see all changed and untracked files.
2. Run `git diff` (staged + unstaged) to understand what changed.
3. Run `git log --oneline -5` to see recent commits for context.
4. Analyze the changes and determine the appropriate `type`.
5. Draft a concise `short_description` in lowercase (one sentence, no period).
6. Stage relevant files — prefer specific file names over `git add -A` to avoid accidentally including `.env` or secrets.
7. Create the commit using the format above.

## Rules

- **Never** use `--no-verify` or skip hooks unless the user explicitly asks.
- **Never** amend a previous commit — always create a new commit.
- **Never** commit `.env`, credential files, or secrets.
- **Never** commit if there are no changes to stage.
- Short description must be lowercase and under 72 characters.
- Add `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` as a trailer.

## Commit Command Template

```bash
git commit -m "$(cat <<'EOF'
[type] short description here

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```
