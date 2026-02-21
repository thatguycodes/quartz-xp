# Contribution Guide

## Who Can Contribute

Everyone — developers, designers, and stakeholders. The type of contribution determines which guide to follow:

- **Developers** — code, tests, infrastructure → this guide
- **Designers** — design tokens → [DESIGNER_GUIDE.md](./DESIGNER_GUIDE.md)

---

## Before You Start

1. Read the [Developer Guide](./DEVELOPER_GUIDE.md) to get your environment set up
2. Check existing issues and open PRs to avoid duplicate work
3. For large changes, open an issue first to discuss the approach

---

## Types of Contribution

### Bug Fix

1. Open an issue describing the bug (or pick an existing one)
2. Branch off `main`: `git checkout -b fix/button-focus-state`
3. Fix the bug, add a regression test
4. Commit: `fix(ui): restore focus ring on Button`
5. Open a PR referencing the issue

### New Feature

1. Open an issue or discuss in an existing one
2. Branch: `git checkout -b feat/card-component`
3. Build the feature with tests and Storybook stories
4. Export from the library's `index.ts`
5. Commit: `feat(ui): add Card component`
6. Open a PR

### New Token

Tokens are managed in Figma — not in this repository.

1. Add the token in Figma following the naming convention (`group-name`)
2. Trigger a token sync from GitHub Actions
3. The sync creates a PR automatically — review and merge it

Never edit `libs/shared/tokens/src/tokens/*.json` manually.

### Documentation

1. Branch: `git checkout -b docs/update-developer-guide`
2. Edit the relevant file in `docs/`
3. Commit: `docs: clarify token naming rules`
4. Open a PR

---

## Pull Request Checklist

Before opening a PR, verify:

- [ ] Tests pass: `npx nx run <project>:test`
- [ ] No lint errors: `npx nx run <project>:lint`
- [ ] Storybook stories added or updated for UI changes
- [ ] Commit messages follow Conventional Commits format
- [ ] The PR description explains _what_ changed and _why_

---

## Review Process

- At least **one approval** is required to merge
- Token sync PRs require approval from the **design team** (auto-assigned via CODEOWNERS)
- Address all review comments before merging
- Use squash merge to keep the history clean

---

## Commit Message Format

See [DEVELOPER_GUIDE.md — Commit Message Format](./DEVELOPER_GUIDE.md#commit-message-format) for the full reference.

Quick examples:

```
feat(ui): add tooltip component
fix(tokens): correct border-radius-lg value
chore: upgrade nx to 22.5
test(ui): add snapshot tests for Button variants
```

---

## Code Standards

- **TypeScript** — no `any` unless unavoidable; prefer explicit types
- **CSS** — CSS Modules only; always use semantic tokens (`var(--brand-primary)`) rather than hardcoded values
- **Components** — each component gets its own folder with `.tsx`, `.module.css`, `.spec.tsx`, and `.stories.tsx`
- **No barrel re-exports** inside lib folders — export explicitly from the root `index.ts`

---

## Getting Help

- Open a GitHub Discussion for questions
- Open an issue for bugs or proposals
- Tag `@design-team` for token-related questions

