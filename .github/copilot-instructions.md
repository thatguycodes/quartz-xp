# Copilot Instructions

## Project Overview

This is an **Nx Enterprise monorepo** implementing a token-first design system. It contains shared libraries (design tokens and a React component library) consumed by a Next.js documentation site.

### Packages published to npm

| Package | Path |
|---|---|
| `@thatguycodes/design-tokens` | `libs/tokens/design-tokens` |
| `@thatguycodes/quartz-ui` | `libs/ui/quartz-ui` |

---

## Tech Stack

- **Monorepo**: [Nx](https://nx.dev/) 22
- **Language**: TypeScript (strict; avoid `any`)
- **Framework**: [Next.js](https://nextjs.org/) 16 App Router (`apps/docs`)
- **Design Tokens**: JSON → [Style Dictionary](https://styledictionary.com/) → CSS + TypeScript
- **Styling**: Vanilla CSS Modules (`*.module.css`); no Tailwind, no CSS-in-JS
- **Components**: React 19 (`libs/ui/quartz-ui`)
- **Component Docs**: [Storybook](https://storybook.js.org/) (Vite-based)
- **Unit Tests**: [Jest](https://jestjs.io/) + Testing Library
- **E2E Tests**: [Playwright](https://playwright.dev/)

---

## Project Structure

```
nx-enterprise/
├── apps/
│   ├── docs/             # Next.js documentation site
│   └── docs-e2e/         # Playwright E2E tests
├── libs/
│   ├── tokens/
│   │   └── design-tokens/ # Design tokens (@thatguycodes/design-tokens)
│   └── ui/
│       └── quartz-ui/     # React component library (@thatguycodes/quartz-ui)
└── docs/                 # Project documentation (ARCHITECTURE, DEVELOPER_GUIDE, etc.)
```

---

## Key Commands

Always use Nx — never run `npm start`, `npm test`, or other root-level scripts directly.

| Task | Command |
|---|---|
| Start docs dev server | `npx nx run docs:dev` |
| Start Storybook | `npx nx run quartz-ui:storybook` |
| Build tokens | `npx nx run design-tokens:build` |
| Build UI library | `npx nx run quartz-ui:build` |
| Run unit tests (single project) | `npx nx run <project>:test` |
| Run lint (single project) | `npx nx run <project>:lint` |
| Run all tests | `npx nx run-many -t test` |
| Run all builds | `npx nx run-many -t build` |
| Build/test affected only | `npx nx affected -t build` / `npx nx affected -t test` |
| E2E tests | `npx nx run docs-e2e:e2e` |
| Clear Nx cache | `npx nx reset` |

Build tokens once before the first run:

```bash
npx nx run design-tokens:build
```

---

## Coding Conventions

### TypeScript

- No `any` unless unavoidable; prefer explicit types.
- Components must have exported `interface` or `type` for props.

### CSS

- **CSS Modules only** (`Component.module.css`).
- **Always use semantic design tokens** — never hard-code values:
  ```css
  /* ✅ */
  .button { background-color: var(--brand-primary); padding: var(--spacing-md); }
  /* ❌ */
  .button { background-color: #2563eb; padding: 16px; }
  ```
- Reference semantic tokens (e.g. `--brand-primary`), not core tokens (e.g. `--color-blue-600`), in component styles.

### Components

Each component lives in its own folder with four co-located files:

```
libs/ui/quartz-ui/src/lib/<component>/
  ├── <Component>.tsx           # Implementation
  ├── <Component>.module.css    # Scoped styles
  ├── <Component>.spec.tsx      # Unit tests
  └── <Component>.stories.tsx   # Storybook stories
```

Export components explicitly from `libs/ui/quartz-ui/src/index.ts` — no barrel re-exports inside lib folders.

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

| Type | When |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Tooling, dependencies, config |
| `docs` | Documentation only |
| `refactor` | Neither fix nor feature |
| `test` | Adding/updating tests |
| `style` | Formatting only (no logic) |
| `perf` | Performance improvement |

Scopes: `design-tokens`, `quartz-ui`, `docs`.

Examples:
```
feat(quartz-ui): add Card component
fix(design-tokens): correct spacing-xl value
test(quartz-ui): add Button accessibility tests
```

---

## Design Token Workflow

Tokens are managed **Figma-first**. The JSON token files (`core.json`, `semantic.json`) are auto-generated — **never edit them manually**.

```
Figma → GitHub Actions (Figma Token Sync) → PR (design team review) → merge → auto-build
```

To update tokens, trigger the **"Figma Token Sync"** workflow from the GitHub Actions tab. It will open a PR on the `tokens/figma-sync` branch for design team review.

Token naming in Figma must follow **kebab-case with at least one group**: `color-primary`, `spacing-md`, `typography-heading-lg`.

---

## Pull Request Checklist

Before opening a PR:

- [ ] Tests pass: `npx nx run <project>:test`
- [ ] No lint errors: `npx nx run <project>:lint`
- [ ] Storybook stories added/updated for UI changes
- [ ] Commit messages follow Conventional Commits
- [ ] PR description explains what changed and why

---

## Generating New Code

Generate a new React component:

```bash
npx nx g @nx/react:component <ComponentName> --project=quartz-ui
```

---

## Additional Documentation

- [`docs/DEVELOPER_GUIDE.md`](../docs/DEVELOPER_GUIDE.md) — setup, Nx commands, git workflow, releases
- [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) — system design and ADRs
- [`docs/CONTRIBUTION_GUIDE.md`](../docs/CONTRIBUTION_GUIDE.md) — contribution workflow
- [`docs/IMPLEMENTATION_GUIDE.md`](../docs/IMPLEMENTATION_GUIDE.md) — step-by-step implementation patterns
- [`docs/DESIGNER_GUIDE.md`](../docs/DESIGNER_GUIDE.md) — Figma token workflow
