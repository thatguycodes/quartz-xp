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
cd nx-enterprise
npm install
```

Build tokens before running any app for the first time:

```bash
npx nx run design-tokens:build
```

---

## Running the Applications

All application commands go through Nx.

| What | Command |
|---|---|
| Docs site (dev server) | `npx nx run docs:dev` |
| Storybook | `npx nx run quartz-ui:storybook` |
| Build tokens | `npx nx run design-tokens:build` |
| Unit tests | `npx nx run <project>:test` |
| Lint | `npx nx run <project>:lint` |
| E2E tests | `npx nx run docs-e2e:e2e` |
| Run all tests | `npx nx run-many -t test` |
| Run all builds | `npx nx run-many -t build` |
| Build affected only | `npx nx affected -t build` |
| Test affected only | `npx nx affected -t test` |

> Never run `npm start`, `npm test`, or similar root-level scripts to run applications. Always use Nx.

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
├── docs/                 # All project documentation
└── .github/

    └── workflows/        # CI/CD pipelines
```

---

## Git Workflow

This project uses a **trunk-based** workflow with short-lived feature branches.

### Branches

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Protected — no direct pushes. |
| `feat/<description>` | New feature |
| `fix/<description>` | Bug fix |
| `chore/<description>` | Maintenance, dependency updates, config changes |
| `tokens/figma-sync` | Reserved for automated Figma token sync PRs. Do not use manually. |

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

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `chore` | Build process, tooling, dependencies |
| `docs` | Documentation changes only |
| `refactor` | Code change that is neither a fix nor a feature |
| `test` | Adding or updating tests |
| `style` | Formatting, whitespace (no logic change) |
| `perf` | Performance improvement |

### Scopes

Use the project name from `project.json` as the scope.

| Scope | Project |
|---|---|
| `design-tokens` | `libs/tokens/design-tokens` |
| `quartz-ui` | `libs/ui/quartz-ui` |
| `docs` | `apps/docs` |

### Examples

```
feat(quartz-ui): add Button size variants
fix(design-tokens): correct spacing-xl value
chore(docs): upgrade Next.js to 16.1
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

BREAKING CHANGE: --brand-primary renamed to --color-brand-primary.
Update all component stylesheets accordingly.
```

---

## Release

Releases are strictly managed via **Nx Release** and our CI/CD pipeline.

### 🤖 Automated Release (Recommended)

Releases are automatically triggered when merging to `main`. The CI pipeline will:

1.  Calculate new versions based on [Conventional Commits](https://www.conventionalcommits.org/).
2.  Generate CHANGELOGs.
3.  Create git tags.
4.  Publish packages to npm.

**To trigger a release:**
Simply merge a Pull Request to `main` with a meaningful conventional commit message (e.g., `feat:`, `fix:`).

### 🛠️ Manual Release (Maintainers Only)

Local release commands should **only** be used by maintainers in emergency situations or for debugging.

1.  **Ensure Clean State**: Pull latest `main` and ensure working tree is clean.
2.  **Dry Run**: Always verify what will happen first.
    ```bash
    npx nx release --dry-run
    ```
3.  **Perform Release**:
    ```bash
    # This will prompt for version bumps and OTPs
    npx nx release
    ```

> **Note**: You must have a valid `NPM_TOKEN` or be logged in to npm with access to the `@thatguycodes` organization.

### Nx cache

Clear the Nx cache if builds behave unexpectedly:

```bash
npx nx reset
```

---

## Troubleshooting

**Token changes not showing in the browser**
1. Rebuild: `npx nx run design-tokens:build`
2. Restart the dev server: `npx nx run docs:dev`
3. Hard-refresh the browser

**Storybook fails to start**
Kill any process already on the Storybook port, then retry:
```bash
pkill -f storybook
npx nx run quartz-ui:storybook
```

**CSS variables not defined**
Confirm `variables.css` is imported in `apps/docs/src/app/layout.tsx` and in `.storybook/preview.ts`.
