# CLAUDE.md

Architectural decisions, conventions, and agent rules for this monorepo.
Read this before making any changes to design tokens, UI components, or theme infrastructure.

---

## Project Layout

```
libs/design-tokens/     → @thatguycodes/design-tokens  (npm, public)
libs/ui/quartz-ui/      → @thatguycodes/quartz-ui       (npm, public)
apps/                   → empty — future consumer applications
```

---

## Design Token System

### Source files (`libs/design-tokens/src/tokens/`)

| File | Purpose |
|---|---|
| `global/storm.json` | Slate/cool-gray scale — 13 steps (5–95) |
| `global/smoke.json` | Warm-gray scale — 11 steps (5–95) |
| `brands/quartz/primitives.json` | Brand violet palette — 11 steps under root key `"brand"` |
| `brands/quartz/semantics.json` | Semantic mappings referencing `{brand.*}`, `{storm.*}`, `{smoke.*}` |
| `themes/light.json` | Light mode theme overrides |
| `themes/dark.json` | Dark mode theme overrides |

### Build

```bash
nx run design-tokens:build   # regenerates src/generated/ and compiles
```

Generated outputs land in `libs/design-tokens/src/generated/`:

| File | Selector | Contents |
|---|---|---|
| `css/primitives.css` | `:root` | Raw primitive custom properties |
| `css/light.css` | `[data-theme="light"]` | Semantic + primitive variables for light mode |
| `css/dark.css` | `[data-theme="dark"]` | Semantic + primitive variables for dark mode |
| `css/bundle.css` | — | `@import` of all three above — use this in most cases |

### CSS variable naming

| Layer | Pattern | Example |
|---|---|---|
| Primitive | `--brand-{step}` | `--brand-60` = `#7c3aed` |
| Primitive | `--storm-{step}` | `--storm-20` = `#e2e8f0` |
| Primitive | `--smoke-{step}` | `--smoke-30` = `#8b8b8b` |
| Semantic | `--color-primary-{state}` | `--color-primary-default` |
| Semantic | `--color-text-{role}` | `--color-text-base` |
| Semantic | `--color-background-{level}` | `--color-background-subtle` |
| Semantic | `--color-border-{role}` | `--color-border-focus` |
| Semantic | `--color-surface-{level}` | `--color-surface-muted` |

### Immutable primitives

**Never change hex values** in `global/*.json` or `brands/*/primitives.json`.
See `libs/design-tokens/guard-rails/PRIMITIVE_CONSTRAINTS.md` for full constraints.

---

## Theme System

Theme switching uses the `data-theme` attribute on `<html>`:

```
data-theme="light"  →  activates [data-theme="light"] CSS variables
data-theme="dark"   →  activates [data-theme="dark"] CSS variables
```

### ThemeContext

`libs/ui/quartz-ui/src/lib/theme/ThemeContext.tsx` manages this:
- Sets `document.documentElement.setAttribute('data-theme', mode)` on mode change
- Exposes `mode: 'light' | 'dark'`, `setMode`, `toggleMode`
- **No brand dimension** — only `quartz` brand exists; context was simplified when `ruby` was removed

### Storybook

`withThemeByDataAttribute` in `.storybook/preview.ts` maps:
```typescript
themes: { Light: 'light', Dark: 'dark' }
attributeName: 'data-theme'
```
This sets the attribute on `<html>`, consistent with ThemeContext's production behaviour.

---

## Brand Architecture

Only one brand exists: **quartz**.

Brand primitives **must** be defined under the root key `"brand"` in `primitives.json` — not `"quartz"`. This lets `semantics.json` reference `{brand.60}` abstractly, so shared semantic files work when future brands are added without modification.

**Do not add `ruby` brand** or any other brand until corresponding `primitives.json` token files exist.

---

## CSS Import Strategy

### Consuming the npm package

```typescript
// Single import — primitives + light + dark (recommended)
import '@thatguycodes/design-tokens/css/bundle.css';

// Selective imports
import '@thatguycodes/design-tokens/css/primitives.css';
import '@thatguycodes/design-tokens/css/light.css';
import '@thatguycodes/design-tokens/css/dark.css';
```

### Storybook / local monorepo

`.storybook/main.ts` `viteFinal` has a Vite regex alias:

```typescript
find: /^@thatguycodes\/design-tokens\/css\/(.+)$/
replacement: resolve(__dirname, '../../../design-tokens/src/generated/css') + '/$1'
```

This resolves CSS imports directly to the local source, bypassing `node_modules`. This is necessary because `npm install` replaces our local symlinks with whatever is published to the registry.

---

## Component CSS Rules

1. **Only use `--color-*` semantic tokens** in component CSS — never hardcode hex values or reference primitive tokens directly.
2. **Exception**: Dark mode overrides that need a different visual weight may reference `--brand-*` or `--smoke-*` primitives via `:global([data-theme="dark"]) .component` blocks.
3. **No ad-hoc values** for spacing or sizing unless no token exists — document why with a comment.

---

## Accessibility Standards

All components must meet **WCAG 2.1 AA** minimum.

| Criterion | Requirement | Implementation |
|---|---|---|
| 1.4.3 Text contrast | ≥ 4.5:1 normal, ≥ 3:1 large | Verified via contrast audit script |
| 1.4.11 Non-text contrast | ≥ 3:1 for UI components | Focus rings checked |
| 2.4.7 Focus visible | Must be visible | `box-shadow` ring + `forced-colors` fallback |
| 2.3.3 Animation | Respect user preference | `prefers-reduced-motion` guard on all transitions |
| 4.1.2 Accessible name | Required on all interactive elements | Children or `aria-label` |

**Disabled state exemption**: WCAG 1.4.3 and 1.4.11 explicitly exempt inactive UI components from contrast requirements.

### Verified contrast ratios (Button, both modes)

| State | Light | Dark |
|---|---|---|
| Primary default | 5.45:1 ✅ | 5.37:1 ✅ |
| Primary hover | 6.79:1 ✅ | 6.69:1 ✅ |
| Primary active | 8.59:1 ✅ | 8.46:1 ✅ |
| Secondary | 18.41:1 ✅ | 16.81:1 ✅ |
| Outline default | 5.45:1 ✅ | 7.41:1 ✅ |
| Focus ring | 4.05:1 ✅ | 7.41:1 ✅ |

---

## Button Component Conventions

- `type="button"` is the default — prevents accidental form submission inside `<form>`
- className assembled with `[...].filter(Boolean).join(' ')` — no trailing whitespace
- All state colours resolved through `--color-*` semantic tokens
- Dark mode outline variant overrides via `:global([data-theme="dark"])` to use lighter brand shades (`--brand-40`, `--brand-30`) for adequate contrast on the dark canvas

---

## Testing

Jest is configured with `setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts']` which imports `@testing-library/jest-dom`.

Button tests cover: semantic role, `type="button"` default, accessible name (children + `aria-label`), disabled state (click prevention + tab order), keyboard focus, and `aria-*` passthrough.

---

## Package Publishing

Both packages are released independently using Nx release:

```bash
# Version bump (reads conventional commits)
npx nx release version --projects design-tokens
npx nx release version --projects quartz-ui

# Publish to npm (requires NPM_OTP env var)
npx nx release publish --projects design-tokens
npx nx release publish --projects quartz-ui
```

Release tags follow `{projectName}@{version}` (e.g. `design-tokens@0.3.0`).

---

## Agent Rules

1. **Never modify primitive hex values** in `global/*.json` or `brands/*/primitives.json`
2. **Never use hardcoded hex** in component CSS — always use `--color-*` semantic tokens
3. **Rebuild tokens** after any edit to `src/tokens/` via `nx run design-tokens:build`
4. **Check WCAG contrast** after any new colour pairing — use the ratio formula in the codebase
5. **Never add a new brand** until `brands/{name}/primitives.json` exists with a `"brand"` root key
6. **Always run tests** before marking work done: `nx run quartz-ui:test`
7. **No placeholder/scaffold exports** — `src/index.ts` must export real values only
