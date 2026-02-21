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
npx nx run tokens:build
```

---

## Running the Applications

All application commands go through Nx.

| What | Command |
|---|---|
| Web app (dev server) | `npx nx run web:dev` |
| Storybook | `npx nx run ui:storybook` |
| Build tokens | `npx nx run tokens:build` |
| Unit tests | `npx nx run <project>:test` |
| Lint | `npx nx run <project>:lint` |
| E2E tests | `npx nx run web-e2e:e2e` |
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
│   ├── web/              # Next.js application
│   └── web-e2e/          # Playwright E2E tests
├── libs/
│   └── shared/
│       ├── tokens/       # Design tokens (@thatguycodes/design-tokens)
│       └── ui/           # React component library
├── docs/                 # All project documentation
└── .github/
    ├── CODEOWNERS        # Auto-assigns reviewers
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
| `tokens` | `libs/shared/tokens` |
| `ui` | `libs/shared/ui` |
| `web` | `apps/web` |

### Examples

```
feat(ui): add Button size variants
fix(tokens): correct spacing-xl value
chore(web): upgrade Next.js to 16.1
test(ui): add Button accessibility tests
docs: update developer guide
refactor(tokens): simplify build script
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

Releases are triggered automatically by `semantic-release` on every merge to `main`. The release version is determined by the commit messages:

| Commit type | Version bump |
|---|---|
| `fix` | Patch — `0.0.1 → 0.0.2` |
| `feat` | Minor — `0.0.1 → 0.1.0` |
| `BREAKING CHANGE` | Major — `0.0.1 → 1.0.0` |

### Publishing the tokens package manually

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions. The short version:

```bash
# 1. Build tokens
npx nx run tokens:build

# 2. Bump version in libs/shared/tokens/package.json

# 3. Publish with MFA OTP
cd libs/shared/tokens
npm publish --access public --otp=<your-otp>
```

### Nx cache

Clear the Nx cache if builds behave unexpectedly:

```bash
npx nx reset
```

---

## Troubleshooting

**Token changes not showing in the browser**
1. Rebuild: `npx nx run tokens:build`
2. Restart the dev server: `npx nx run web:dev`
3. Hard-refresh the browser

**Storybook fails to start**
Kill any process already on the Storybook port, then retry:
```bash
pkill -f storybook
npx nx run ui:storybook
```

**CSS variables not defined**
Confirm `variables.css` is imported in `apps/web/src/app/layout.tsx` and in `.storybook/preview.ts`.

