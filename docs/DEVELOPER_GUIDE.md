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

Releases are managed via Nx release config in `nx.json`. Tokens and UI are published packages and must run builds before versioning.

### Preferred flow (Nx release for tokens and UI):

1. Ensure working tree is clean and up to date with `main`.
2. Builds run automatically via Nx preVersion command (`nx run-many -t build --projects tokens,ui`).
3. Run `npx nx release version` to bump versions and tag.
4. Run `npx nx release publish` to publish packages (tokens + quartz-ui). MFA/OTP required unless using an automation token.

### Manual publish (emergency only):

```bash
# 1. Build tokens via Nx
npx nx run tokens:build

# 2. Build UI via Nx
npx nx run ui:build

# 3. Bump versions in the respective package.json files if needed

# 4. Publish with MFA OTP
cd dist/libs/shared/tokens && npm publish --access public --otp=<your-otp>
cd dist/libs/shared/ui && npm publish --access public --otp=<your-otp>
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
