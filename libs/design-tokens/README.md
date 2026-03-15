# @thatguycodes/design-tokens

Design tokens are the single source of truth for all visual design decisions. Instead of hard-coding values like `#7c3aed` or `#1e293b` directly in styles, components reference semantic tokens like `--color-primary-default` or `--color-background-base`. When a theme changes, only the token mappings change — components are untouched.

Tokens are authored in JSON and processed through [Style Dictionary 5](https://styledictionary.com/).

---

## Installation

```bash
npm install @thatguycodes/design-tokens
```

---

## Usage

### Import the CSS bundle once

At your app or library entry point, import the bundle to load all token layers:

```ts
// Next.js: app/layout.tsx  |  Vite: main.ts  |  Component lib: src/index.ts
import '@thatguycodes/design-tokens/css/bundle.css';
```

Then set `data-theme` on `<html>` to activate a theme:

```html
<html data-theme="light"> ... </html>
<!-- or -->
<html data-theme="dark"> ... </html>
```

### Use tokens in CSS Modules

Always use semantic tokens (`--color-*`) in components. Never use primitives (`--brand-*`, `--storm-*`, `--smoke-*`) directly.

```css
/* Button.module.css */
.button {
  background-color: var(--color-primary-default);
  color: var(--color-text-on-primary);
}

.button:hover {
  background-color: var(--color-primary-hover);
}

.button:focus-visible {
  box-shadow: 0 0 0 2px var(--color-background-base),
              0 0 0 4px var(--color-border-focus);
}

.button:disabled {
  background-color: var(--color-primary-disabled);
  color: var(--color-text-disabled);
}
```

### Use TypeScript constants for inline styles or logic

```ts
import { colorPrimaryDefault, colorTextOnPrimary } from '@thatguycodes/design-tokens';

const styles = {
  backgroundColor: colorPrimaryDefault,
  color: colorTextOnPrimary,
};
```

---

## Token Architecture

### Two-layer system

| Layer | Variables | Scope | Purpose |
|---|---|---|---|
| Primitives | `--brand-*`, `--storm-*`, `--smoke-*` | `:root` | Raw palette values |
| Semantic | `--color-*` | `[data-theme="light/dark"]` | Intent-named, theme-aware |

Components must only reference semantic tokens. The primitive layer is an implementation detail of the token system.

### Semantic token reference

#### Primary action

| Token | Light value | Dark value |
|---|---|---|
| `--color-primary-default` | `brand.60` `#7c3aed` | `brand.60` `#7c3aed` |
| `--color-primary-hover` | `brand.70` `#6d28d9` | `brand.70` `#6d28d9` |
| `--color-primary-active` | `brand.80` `#5b21b6` | `brand.80` `#5b21b6` |
| `--color-primary-disabled` | `brand.20` `#ddd6fe` | `brand.80` `#5b21b6` |

#### Text

| Token | Light value | Dark value |
|---|---|---|
| `--color-text-base` | `storm.95` `#020617` | `storm.5` `#f8fafc` |
| `--color-text-muted` | `storm.60` `#475569` | `storm.40` `#94a3b8` |
| `--color-text-disabled` | `storm.40` `#94a3b8` | `storm.60` `#475569` |
| `--color-text-on-primary` | `storm.5` `#f8fafc` | `storm.5` `#f8fafc` |
| `--color-text-inverse` | `storm.5` `#f8fafc` | `storm.95` `#020617` |

#### Background

| Token | Light value | Dark value |
|---|---|---|
| `--color-background-base` | `storm.5` `#f8fafc` | `storm.90` `#0f172a` |
| `--color-background-subtle` | `storm.10` `#f1f5f9` | `storm.80` `#1e293b` |
| `--color-background-faint` | `storm.20` `#e2e8f0` | `storm.70` `#334155` |

#### Border

| Token | Light value | Dark value |
|---|---|---|
| `--color-border-default` | `storm.20` `#e2e8f0` | `storm.70` `#334155` |
| `--color-border-focus` | `brand.50` `#8b5cf6` | `brand.50` `#8b5cf6` |
| `--color-border-disabled` | `storm.10` `#f1f5f9` | `storm.80` `#1e293b` |

#### Surface

| Token | Light value |
|---|---|
| `--color-surface-base` | `storm.5` `#f8fafc` |
| `--color-surface-muted` | `storm.10` `#f1f5f9` |

---

## Generated Outputs

| File | Description |
|---|---|
| `src/generated/css/bundle.css` | Import this — loads all three layers |
| `src/generated/css/primitives.css` | Primitive palette on `:root` |
| `src/generated/css/light.css` | Semantic tokens scoped to `[data-theme="light"]` |
| `src/generated/css/dark.css` | Semantic tokens scoped to `[data-theme="dark"]` |
| `src/generated/js/es6/tokens.js` | ES module JS constants |

Never edit generated files. They are overwritten on every build.

---

## Updating Tokens

Source files live in `libs/design-tokens/src/tokens/`. Edit them directly, then rebuild:

```bash
npx nx run design-tokens:build
```

### Source file map

| File | Contents |
|---|---|
| `src/tokens/global/smoke.json` | Smoke (neutral warm) palette |
| `src/tokens/global/storm.json` | Storm (neutral cool) palette |
| `src/tokens/brands/quartz/primitives.json` | Brand palette (must use `"brand"` root key) |
| `src/tokens/brands/quartz/semantics.json` | Semantic mappings shared across themes |
| `src/tokens/themes/light.json` | Light mode semantic overrides |
| `src/tokens/themes/dark.json` | Dark mode semantic overrides |

### Adding a new semantic token

1. Add to `semantics.json` (both themes) or to `light.json`/`dark.json` for theme-specific values
2. Use `{brand.60}` reference syntax to point at a primitive
3. Run `npx nx run design-tokens:build`
4. Verify it appears in `src/generated/css/light.css` and `dark.css`

---

## Publishing

```bash
npx nx release version --projects design-tokens
npx nx release publish --projects design-tokens
```