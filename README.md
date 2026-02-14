# 🚀 Enterprise Nx Monorepo

Welcome to the **Nx Enterprise** monorepo. This project is a production-ready, scalable workspace designed for modern web development, utilizing a modular architecture to share code effectively between applications.

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Comprehensive architecture documentation explaining how the system works and why it's designed this way
- **[Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md)**: Step-by-step guides for common development tasks

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
- **Design Tokens**: [Style Dictionary](https://styledictionary.com/)
- **Styling**: Vanilla CSS with Native Variables (CSS-in-CSS)
- **Component Documentation**: [Storybook](https://storybook.js.org/)
- **Testing**: [Jest](https://jestjs.io/) (Unit) & [Playwright](https://playwright.dev/) (E2E)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## � The Design System (Tokens)

We use a Token-First approach. Styles are driven by variables generated from `shared/tokens`.

### How it works:
1. **Define**: Tokens are defined in `libs/shared/tokens/src/tokens/` as JSON files.
2. **Build**: Running `npx nx build tokens` processes these JSONs through Style Dictionary.
3. **Generate**: It outputs:
   - `generated/css/variables.css`: Native CSS custom properties (e.g., `--brand-primary`).
   - `generated/ts/tokens.ts`: TypeScript constants for use in JS/TS logic.

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

To maintain a consistent and beautiful design system, follow these workflows when introducing changes:

### Level 1: Design Tokens (The Core)
*Use this when: You need to introduce a new color, spacing, or global variable.*
1. **Source**: Open `libs/shared/tokens/src/tokens/`.
2. **Edit**: Modify `core.json` (primitives) or `semantic.json` (aliases).
3. **Build**: Run `npx nx build tokens`.
4. **Verify**: Check `libs/shared/tokens/generated/css/variables.css` to see your new variable.

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
**Fix**: Ensure you ran `npx nx build tokens`. If you are in Storybook or the Web App, you might need to restart the process to pick up changes in the generated files, although HMR usually handles CSS updates.

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
