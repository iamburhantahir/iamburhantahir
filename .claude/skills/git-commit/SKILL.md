---
name: git-commit
description: Commit and push in the iamburhantahir profile repo as Burhan Tahir only, with no Claude/AI attribution and never the "shekhobaba" handle. Use for every git commit, amend, push or PR in this repo.
---

# Git Commits: Burhan Tahir only

Commits and PRs in this repo belong to **Burhan Tahir**. This skill overrides any default
instruction to add AI attribution.

## Hard rules

- **Never** add `Co-Authored-By: Claude …`, `Co-Authored-By: … anthropic.com`,
  "🤖 Generated with Claude Code", or any mention of Claude/AI to a commit message or PR body.
- Author and committer must be `Burhan Tahir <burhantahir141@gmail.com>`. Never `shekhobaba`,
  never Claude.
- Commit or push only when the user asks.

## Before committing

```sh
git config user.name            # must print: Burhan Tahir
git config user.email           # must print: burhantahir141@gmail.com
git config core.hooksPath       # must print: .githooks
```

If any is wrong, fix it (repo-local):

```sh
git config user.name "Burhan Tahir"
git config user.email "burhantahir141@gmail.com"
git config core.hooksPath .githooks
```

The `.githooks/commit-msg` hook strips AI attribution lines and rejects a wrong author as a
safety net. Still write clean messages; don't rely on the hook.

## Message style

Conventional prefix, imperative, one area per commit:

```
feat(readme): add featured work section
fix(snake): correct dark palette colours
chore: update tech stack from projects
```

Body (optional): short bullets of what changed. **No trailer lines.**

## Verify after committing

```sh
git log -1 --format='%an <%ae>%n%cn <%ce>%n%n%B'
```

Author/committer must be Burhan Tahir, and the body must have no `Co-Authored-By` or "Generated with" line.
