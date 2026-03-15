# Enterprise Nx Monorepo

A production-ready Nx monorepo containing a design token system and a React component library.

## Documentation

| File | Audience |
|---|---|
| [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) | Setup, Nx commands, git workflow, commit messages, releases |
| [docs/DESIGNER_GUIDE.md](./docs/DESIGNER_GUIDE.md) | Token authoring, naming conventions |
| [docs/CONTRIBUTION_GUIDE.md](./docs/CONTRIBUTION_GUIDE.md) | How to contribute code, tokens, or docs |
| [docs/CODE_OF_CONDUCT.md](./docs/CODE_OF_CONDUCT.md) | Expected behaviour for all contributors |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, ADRs, and architectural decisions |
| [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Publishing packages to npm |
| [docs/IMPLEMENTATION_GUIDE.md](./docs/IMPLEMENTATION_GUIDE.md) | Component and token implementation patterns |
| [CLAUDE.md](./CLAUDE.md) | AI agent rules and architectural decisions |

## Architecture Overview

```
libs/
  design-tokens/       @thatguycodes/design-tokens
    src/tokens/        Source JSON (edit here)
    src/generated/     Auto-generated CSS/JS (never edit)
  ui/
    quartz-ui/         @thatguycodes/quartz-ui
      src/lib/         React components + CSS Modules
      .storybook/      Storybook config
```

## Tech Stack

- **Monorepo Tooling**: [Nx](https://nx.dev/)
- **Design Tokens**: [Style Dictionary 5](https://styledictionary.com/)
- **Styling**: Vanilla CSS Modules + CSS custom properties
- **Component Documentation**: [Storybook](https://storybook.js.org/)
- **Testing**: [Jest](https://jestjs.io/) + [@testing-library/react](https://testing-library.com/)
- **Language**: TypeScript

---

## Design Token System

Tokens use a two-layer architecture:

**Primitives** — raw palette values scoped to `:root`:
```css
--brand-60: #7c3aed;
--storm-80: #1e293b;
--smoke-10: #eeeeee;
```

**Semantic tokens** — intent-named, scoped to `[data-theme="light"]` / `[data-theme="dark"]`:
```css
--color-primary-default   /* maps to brand.60 in light, brand.60 in dark */
--color-text-base         /* maps to storm.95 in light, storm.5 in dark  */
--color-background-base   /* maps to storm.5 in light, storm.90 in dark  */
```

**Always use semantic tokens in components.** Never reference primitive variables directly.

### Rebuild tokens after editing source JSON

```bash
npx nx run design-tokens:build
```

Source files are in `libs/design-tokens/src/tokens/`. They are edited manually — **not** auto-generated from Figma.

---

## Contribution Workflows

### Adding or changing a token

1. Edit the relevant JSON under `libs/design-tokens/src/tokens/`
2. Run `npx nx run design-tokens:build`
3. Verify output in `libs/design-tokens/src/generated/css/`
4. Commit both source and generated files

### Adding a component

1. Generate: `npx nx g @nx/react:component MyComponent --project=quartz-ui`
2. Style with `MyComponent.module.css` — use only `var(--color-*)` semantic tokens
3. Document with `MyComponent.stories.tsx`
4. Export from `libs/ui/quartz-ui/src/index.ts`
5. Test: `npx nx run quartz-ui:test`

### Using components in an app

```tsx
import { Button, ThemeProvider } from '@thatguycodes/quartz-ui';

export function App() {
  return (
    <ThemeProvider initialMode="light">
      <Button variant="primary">Click me</Button>
    </ThemeProvider>
  );
}
```

---

## Running the Projects

| Command | Description |
|---|---|
| `npx nx run design-tokens:build` | Rebuild CSS/JS token outputs |
| `npx nx run quartz-ui:storybook` | Storybook at http://localhost:6006 |
| `npx nx run quartz-ui:test` | Run unit tests |
| `npx nx run <project>:lint` | Run linting |

---

## Troubleshooting

### "CSS variables aren't defined"
Import `bundle.css` once at your app or library entry point:
```ts
import '@thatguycodes/design-tokens/css/bundle.css';
```
Or wrap your app in `ThemeProvider` which handles this automatically.

### "Token changes aren't showing up"
Run `npx nx run design-tokens:build` after editing any file in `libs/design-tokens/src/tokens/`.

### "Nx cache issues"
```bash
npx nx reset
```

### "Storybook port in use"
```bash
pkill -f storybook
```
