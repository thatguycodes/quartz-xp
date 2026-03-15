# Developer Guide

## Prerequisites

- Node.js 22+
- npm 10+
- Git
- A code editor

---

## Setup

```bash
git clone <repository-url>
cd quartz-xp
npm install
```

Build tokens before running any app for the first time:

```bash
npx nx run design-tokens:build
```

---

## Running the Applications

All application commands go through Nx.

| What                | Command                             |
| ------------------- | ----------------------------------- |
| Storybook           | `npx nx run quartz-ui:storybook`    |
| Build UI library    | `npx nx run quartz-ui:build`        |
| Regenerate tokens   | `npx nx run design-tokens:generate` |
| Build tokens        | `npx nx run design-tokens:build`    |
| Unit tests          | `npx nx run <project>:test`         |
| Lint                | `npx nx run <project>:lint`         |
| Run all tests       | `npx nx run-many -t test`           |
| Run all builds      | `npx nx run-many -t build`          |
| Build affected only | `npx nx affected -t build`          |
| Test affected only  | `npx nx affected -t test`           |

> Never run `npm start`, `npm test`, or similar root-level scripts to run applications. Always use Nx.

---

## Project Structure

```
quartz-xp/
├── apps/                 # Reserved for future applications
├── libs/
│   ├── tokens/
│   │   └── design-tokens/ # Design tokens (@thatguycodes/design-tokens)
│   └── ui/
│       └── quartz-ui/     # React component library (@thatguycodes/quartz-ui)
├── docs/                 # All project documentation
└── .github/
    └── workflows/        # CI/CD pipelines
```

---

## Design Token System

### Overview

Tokens are built using [Style Dictionary](https://styledictionary.com/) in [DTCG format](https://tr.designtokens.org/format/) and output to multiple platforms.

### Token Structure

```
libs/design-tokens/src/tokens/
├── core.json       # Primitive/core values (color, spacing, typography, etc.)
├── global/         # Shared scales (space, radius, border, size, etc.)
├── mode/           # Theme-aware mappings (light.json, dark.json)
└── components/     # Component-level tokens (button, input, etc.)
```

**Never edit token JSON files manually** — they are auto-generated from Figma.

### Themes

The build produces 4 theme combinations, applied via a `data-theme` attribute:

| Theme        | Selector                    |
| ------------ | --------------------------- |
| Light        | `data-theme="light"`        |
| Dark         | `data-theme="dark"`         |

The default light theme variables are also output as `:root` in `variables.css` for backwards compatibility.

### Build Outputs

Running `npx nx run design-tokens:build` generates the following under `src/generated/`:

| Format               | Path                                            | Use Case                    |
| -------------------- | ----------------------------------------------- | --------------------------- |
| CSS variables        | `generated/css/variables-<brand>-<theme>.css`   | Web (theme switching)       |
| CSS (default)        | `generated/css/variables.css`                   | Web (`:root` fallback)      |
| SCSS variables       | `generated/scss/variables-<brand>-<theme>.scss` | SCSS-based projects         |
| TypeScript           | `generated/ts/tokens-<brand>-<theme>.ts`        | JS/TS consumers             |
| TypeScript (default) | `generated/ts/tokens.ts`                        | Shorthand for light |
| Android XML          | `generated/android/`                            | Android native              |
| iOS Swift            | `generated/ios/`                                | iOS native                  |

### Generate vs Build

| Command                             | What it does                                                       |
| ----------------------------------- | ------------------------------------------------------------------ |
| `npx nx run design-tokens:generate` | Clears and re-runs Style Dictionary only                           |
| `npx nx run design-tokens:build`    | Runs `generate`, then compiles TypeScript and packages the library |

Use `generate` when iterating on token files locally. Use `build` before publishing or when other packages depend on the compiled output.

### Consuming Tokens

**In CSS Modules (Web):**

```css
/* Always use mode/component tokens, not core tokens */
.button {
  background-color: var(--color-background-primary);
}
```

**In TypeScript:**

```ts
import { colorBackgroundPrimary } from '@thatguycodes/design-tokens';
```

**CSS import (default light theme only):**

```ts
import '@thatguycodes/design-tokens/css';
```

**Per-theme CSS imports:**

```ts
import '@thatguycodes/design-tokens/generated/css/variables-light.css';
import '@thatguycodes/design-tokens/generated/css/variables-dark.css';
import '@thatguycodes/design-tokens/generated/css/';
import '@thatguycodes/design-tokens/generated/css/';
```

### Token Workflow (Figma-first)

```
Figma → GitHub Actions (Figma Token Sync) → PR (tokens/figma-sync branch) → design review → merge → auto-build
```

To update tokens, trigger the **"Figma Token Sync"** workflow from the GitHub Actions tab. It will open a PR on the `tokens/figma-sync` branch for review.

Token naming in Figma must follow **kebab-case with at least one group**: `color-primary`, `spacing-md`.

---

## Git Workflow

This project uses a **trunk-based** workflow with short-lived feature branches.

### Branches

| Branch                | Purpose                                                           |
| --------------------- | ----------------------------------------------------------------- |
| `main`                | Production-ready code. Protected — no direct pushes.              |
| `feat/<description>`  | New feature                                                       |
| `fix/<description>`   | Bug fix                                                           |
| `chore/<description>` | Maintenance, dependency updates, config changes                   |
| `tokens/figma-sync`   | Reserved for automated Figma token sync PRs. Do not use manually. |

### Flow

```
1. Pull latest main
   git checkout main && git pull

2. Create a branch
   git checkout -b feat/my-feature

3. Make changes and commit
   git add .
   git commit -m "feat(ui): add Card component"

4. Push and open a PR
   git push origin feat/my-feature
   # open PR against main on GitHub

5. Address review feedback

6. Merge (squash merge preferred for clean history)
```

### Rules

- Never push directly to `main`
- Keep branches short-lived — open a PR within a day or two
- Delete branches after merging
- Rebase on main before opening a PR if your branch is behind
- Do not introduce AI agents or automation services into the codebase (configs, secrets, or code). You may use AI assistants locally for coding help, but all committed changes must be reviewed like any other contribution.

---

## Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short summary>
```

### Types

| Type       | When to use                                     |
| ---------- | ----------------------------------------------- |
| `feat`     | A new feature                                   |
| `fix`      | A bug fix                                       |
| `chore`    | Build process, tooling, dependencies            |
| `docs`     | Documentation changes only                      |
| `refactor` | Code change that is neither a fix nor a feature |
| `test`     | Adding or updating tests                        |
| `style`    | Formatting, whitespace (no logic change)        |
| `perf`     | Performance improvement                         |

### Scopes

Use the project name from `project.json` as the scope.

| Scope           | Project                     |
| --------------- | --------------------------- |
| `design-tokens` | `libs/design-tokens` |
| `quartz-ui`     | `libs/quartz-ui`         |

### Examples

```
feat(quartz-ui): add Button size variants
fix(design-tokens): correct spacing-xl value
chore(quartz-ui): upgrade Storybook to 10.x
test(quartz-ui): add Button accessibility tests
docs: update developer guide
refactor(design-tokens): simplify build script
```

### Rules

- Use the **imperative mood** in the summary: "add Card" not "added Card"
- Keep the summary under 72 characters
- Do not end the summary with a period
- Breaking changes must include `BREAKING CHANGE:` in the commit body

```
feat(tokens): rename brand tokens

BREAKING CHANGE: --brand-primary renamed to --color-background-primary.
Update all component stylesheets accordingly.
```

---

## Release

Releases are strictly managed via **Nx Release** and our CI/CD pipeline.

### Automated Release (Recommended)

Releases are automatically triggered when merging to `main`. The CI pipeline will:

1. Calculate new versions based on [Conventional Commits](https://www.conventionalcommits.org/).
2. Generate CHANGELOGs.
3. Create git tags.
4. Publish packages to npm.

**To trigger a release:**
Simply merge a Pull Request to `main` with a meaningful conventional commit message (e.g., `feat:`, `fix:`).

### Manual Release (Maintainers Only)

Local release commands should **only** be used by maintainers in emergency situations or for debugging.

1. **Ensure Clean State**: Pull latest `main` and ensure working tree is clean.
2. **Dry Run**: Always verify what will happen first.
   ```bash
   npx nx release --dry-run --projects=design-tokens
   ```
3. **Version + Tags (No Publish)**: Create versions, changelogs, commit, and tags.
   ```bash
   npx nx release --skip-publish --projects=design-tokens
   ```
4. **Publish**: Publish the tagged versions.
   ```bash
   npx nx release publish -p design-tokens,quartz-ui
   ```

#### Important Publishing Rules

- **Nx publish uses npm** under the hood. Switching to `pnpm` or `bun` does not change the publish behavior.
- **Local `file:` dependencies cannot be published with npm.** Make sure `libs/quartz-ui/package.json` uses a **semver** version for `@thatguycodes/design-tokens` (for example `^0.2.2`) before publishing.
- **Publish order**: publish `design-tokens` first, then `quartz-ui`, since `quartz-ui` depends on it.

> **Note**: You must have a valid `NPM_TOKEN` or be logged in to npm with access to the `@thatguycodes` organization.

### Nx cache

Clear the Nx cache if builds behave unexpectedly:

```bash
npx nx reset
```

---

## Troubleshooting

**Token changes not showing in Storybook**

1. Regenerate: `npx nx run design-tokens:generate`
2. Restart Storybook: `npx nx run quartz-ui:storybook`
3. Hard-refresh the browser

**Storybook fails to start**
Kill any process already on the Storybook port, then retry:

```bash
pkill -f storybook
npx nx run quartz-ui:storybook
```

**CSS variables not defined in Storybook**
Confirm all four theme CSS files are imported in `libs/quartz-ui/.storybook/preview.ts`:

```ts
import '../../../design-tokens/src/generated/css/variables-light.css';
import '../../../design-tokens/src/generated/css/variables-dark.css';
import '../../../design-tokens/src/generated/css/';
import '../../../design-tokens/src/generated/css/';
```

If the CSS files are missing, run `npx nx run design-tokens:generate` first.

**Publish fails with `ENOTFOUND registry.npmjs.org`**

This is a network/DNS issue. Check your connection, proxy settings, or corporate VPN/DNS. Retry the publish after connectivity is restored.
