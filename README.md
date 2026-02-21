# 🚀 Enterprise Nx Monorepo

Welcome to the **Nx Enterprise** monorepo. This project is a production-ready, scalable workspace designed for modern web development, utilizing a modular architecture to share code effectively between applications.

## 📚 Documentation

| File | Audience |
|---|---|
| [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) | Setup, Nx commands, git workflow, commit messages, releases |
| [docs/DESIGNER_GUIDE.md](./docs/DESIGNER_GUIDE.md) | Figma token workflow, naming conventions, sync process |
| [docs/CONTRIBUTION_GUIDE.md](./docs/CONTRIBUTION_GUIDE.md) | How to contribute code, tokens, or docs |
| [docs/CODE_OF_CONDUCT.md](./docs/CODE_OF_CONDUCT.md) | Expected behaviour for all contributors |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, ADRs, and architectural decisions |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Publishing the tokens package to npm |
| [docs/IMPLEMENTATION_GUIDE.md](./docs/IMPLEMENTATION_GUIDE.md) | Component and token implementation patterns |

## 🏗️ Architecture Overview

Our monorepo is structured to maximize code reuse and maintainability through a layered approach:

- **`apps/`**: End-user applications.
  - **`web`**: A high-performance Next.js 16 (TypeScript) application.
  - **`web-e2e`**: Automated end-to-end tests using Playwright.
- **`libs/`**: Shared libraries and business logic.
  - **`shared/tokens`**: The "Source of Truth" for design. Contains primitive and semantic tokens managed by Style Dictionary.
  - **`shared/ui`**: A curated library of React components styled with vanilla CSS Modules and documented via Storybook.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Monorepo Tooling**: [Nx](https://nx.dev/)
- **Design Tokens**: [Figma API](https://www.figma.com/developers/api) → [Style Dictionary](https://styledictionary.com/)
- **Styling**: Vanilla CSS with Native Variables (CSS-in-CSS)
- **Component Documentation**: [Storybook](https://storybook.js.org/)
- **Testing**: [Jest](https://jestjs.io/) (Unit) & [Playwright](https://playwright.dev/) (E2E)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## � The Design System (Tokens)

We use a **Figma-first** token management approach where Figma is the single source of truth:

### Token Workflow

```
Figma (Design) → GitHub Actions (Sync) → PR (Review) → Merge (Build)
```

### How it works:
1. **Design**: Designers maintain tokens in Figma using kebab-case naming
2. **Sync**: Trigger automated sync from GitHub Actions
3. **Review**: Design team reviews PR for correctness and approves
4. **Build**: Merge automatically runs Style Dictionary to generate outputs

### Outputs Generated

- `generated/css/variables.css`: Native CSS custom properties (e.g., `--brand-primary`)
- `generated/ts/tokens.ts`: TypeScript constants for use in JS/TS logic

### Setup Required

See the [Figma Setup Guide](./docs/FIGMA_SETUP.md) to:
- Create Figma API token
- Add GitHub secrets
- Configure design team CODEOWNERS
- Trigger first sync

### Usage in CSS:
```css
/* Inside a .module.css file */
.button {
  background-color: var(--brand-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}
```

---

## 🔄 Layered Contribution Workflows

To maintain a consistent and beautiful design system:

### Level 1: Design Tokens (The Core)
*Use this when: You need to introduce a new color, spacing, or global variable.*

**New approach (Figma-first)**:
1. **Edit in Figma**: Modify tokens in Figma using kebab-case naming (e.g., `color-primary`, `spacing-md`)
2. **Trigger Sync**: Go to Actions → "Figma Token Sync" → Run workflow
3. **Review PR**: Design team reviews the token sync PR
4. **Merge**: After approval, merge to `main` to trigger build

⚠️ **Do not manually edit** `libs/shared/tokens/src/tokens/core.json` or `semantic.json` - these are auto-generated from Figma

### Level 2: UI Library (The Components)
*Use this when: You need to build a new reusable UI element or update an existing one.*
1. **Generate**: `npx nx g @nx/react:component MyComponent --project=shared-ui`.
2. **Style**: Use `MyComponent.module.css`. Reference tokens with `var(--your-token)`.
3. **Document**: Add `MyComponent.stories.tsx`.
4. **Test**: Run `npx nx storybook ui` and verify the visuals across different variants.
5. **Export**: Ensure the component is exported from `libs/shared/ui/src/index.ts`.

### Level 3: Web Application (The Consumption)
*Use this when: You are building a new page or feature.*
1. **Import**: Use `@nx-enterprise/ui` to bring in components.
2. **Compose**: Lay out your components in the Next.js App Router (`apps/web/src/app`).
3. **Local Styles**: Use page-specific `.module.css` for layout-only styles.
4. **Run**: Verify at http://localhost:3000 with `npx nx dev web`.

---

## 🏃 Running the Projects

| Component | Command | Description |
|-----------|---------|-------------|
| **Web App** | `npx nx dev web` | Starts the Next.js dev server at http://localhost:3000 |
| **Storybook** | `npx nx storybook ui` | Starts Storybook for the UI library at http://localhost:6006 |
| **Tokens Build**| `npx nx build tokens` | Rebuilds the CSS/TS token outputs |
| **Tests** | `npx nx test <project>`| Runs unit tests with Jest |
| **Lint** | `npx nx lint <project>`| Runs linting checks |

---

## 💡 Troubleshooting & FAQs

### "My token changes aren't showing up in the browser."
**Fix**: Make sure your token changes were merged to `main`. Token sync PRs must be approved and merged by the design team before changes take effect. Check the Actions tab to see if the sync workflow has completed.

### "I edited the token JSON files but nothing changed."
**Fix**: Token JSON files are now auto-generated from Figma. Don't edit them manually! Instead:
1. Make changes in Figma
2. Trigger sync from Actions → "Figma Token Sync"
3. Design team reviews and merges PR

See [Figma Setup Guide](./docs/FIGMA_SETUP.md) for complete instructions.

### "Nx is acting weird (Cache issues)."
**Fix**: Sometimes the Nx daemon or cache can get out of sync. Use the reset command:
```bash
npx nx reset
```

### "Storybook fails to start."
**Fix**: Check if a process is already running on the Storybook port. You can kill all storybook processes with:
```bash
pkill -f storybook
```

### "The CSS variables aren't defined."
**Fix**: Ensure `variables.css` is being imported in the root of your app (`apps/web/src/app/layout.tsx`) or in Storybook's `preview.ts`.

---

Built with ❤️ by the Enterprise Team.
