# @thatguycodes/design-tokens

Design tokens are the single source of truth for all visual design decisions — colors, spacing, typography, border radii, and more. Instead of hard-coding values like `#2563eb` or `16px` directly in your styles, you reference a named token like `--brand-primary` or `spacingMd`. When a value changes, it changes once and propagates everywhere automatically.

This package is generated from Figma and processed through [Style Dictionary](https://styledictionary.com/). It ships two consumable formats:

| Format | File | Use case |
|---|---|---|
| CSS custom properties | `generated/css/variables.css` | Web apps, component libraries using CSS / CSS Modules |
| TypeScript constants | `generated/ts/tokens.ts` | Logic, inline styles, CSS-in-JS, tests |

---

## Installation

```bash
npm install @thatguycodes/design-tokens
```

---

## Usage in a Web App (Next.js, Vite, etc.)

### 1. Import the CSS variables globally

In your root layout or global stylesheet, import the CSS file once:

```ts
// Next.js: app/layout.tsx  |  Vite: main.ts
import '@thatguycodes/design-tokens/css';
```

All CSS custom properties are now available on `:root` across the entire app.

### 2. Use tokens in your stylesheets

```css
/* any .css or .module.css file */
.button {
  background-color: var(--brand-primary);
  color: var(--text-on-brand);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
}

.button:hover {
  background-color: var(--brand-hover);
}

.card {
  background-color: var(--surface-base);
  border: 1px solid var(--border-default);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}
```

### 3. Use TypeScript constants for inline styles or logic

```ts
import { brandPrimary, spacingMd, borderRadiusMd } from '@thatguycodes/design-tokens';

const styles = {
  backgroundColor: brandPrimary,
  padding: spacingMd,
  borderRadius: borderRadiusMd,
};
```

---

## Usage in a Component Library

### CSS Modules (recommended)

Import the CSS once at the library entry point so all components can reference the variables:

```ts
// src/index.ts
import '@thatguycodes/design-tokens/css';
export * from './components';
```

Then in each component:

```css
/* Button.module.css */
.root {
  background-color: var(--brand-primary);
  color: var(--text-on-brand);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: none;
  cursor: pointer;
}

.root:hover {
  background-color: var(--brand-hover);
}

.root.secondary {
  background-color: var(--surface-muted);
  color: var(--text-base);
}
```

### Storybook

Import the CSS in `.storybook/preview.ts` so tokens are available in all stories:

```ts
// .storybook/preview.ts
import '@thatguycodes/design-tokens/css';
```

---

## Available Tokens

### Colors

| Token (CSS) | Token (TS) | Value |
|---|---|---|
| `--color-blue-500` | `colorBlue500` | `#3b82f6` |
| `--color-blue-600` | `colorBlue600` | `#2563eb` |
| `--color-blue-700` | `colorBlue700` | `#1d4ed8` |
| `--color-gray-50` | `colorGray50` | `#f9fafb` |
| `--color-gray-100` | `colorGray100` | `#f3f4f6` |
| `--color-gray-700` | `colorGray700` | `#374151` |

### Semantic Colors

| Token (CSS) | Token (TS) | Value |
|---|---|---|
| `--brand-primary` | `brandPrimary` | `#2563eb` |
| `--brand-hover` | `brandHover` | `#1d4ed8` |
| `--surface-base` | `surfaceBase` | `#ffffff` |
| `--surface-muted` | `surfaceMuted` | `#f3f4f6` |
| `--text-base` | `textBase` | `#374151` |
| `--text-muted` | `textMuted` | `#6b7280` |
| `--text-on-brand` | `textOnBrand` | `#ffffff` |
| `--border-default` | `borderDefault` | `#e5e7eb` |

### Spacing

| Token (CSS) | Token (TS) | Value |
|---|---|---|
| `--spacing-xs` | `spacingXs` | `4px` |
| `--spacing-sm` | `spacingSm` | `8px` |
| `--spacing-md` | `spacingMd` | `16px` |
| `--spacing-lg` | `spacingLg` | `24px` |
| `--spacing-xl` | `spacingXl` | `32px` |

### Border Radius

| Token (CSS) | Token (TS) | Value |
|---|---|---|
| `--border-radius-sm` | `borderRadiusSm` | `4px` |
| `--border-radius-md` | `borderRadiusMd` | `6px` |
| `--border-radius-lg` | `borderRadiusLg` | `8px` |

---

## Token Design

Tokens follow a two-layer system:

- **Core tokens** — raw values tied to physical properties (`color-blue-600`, `spacing-md`). Never use these directly in components.
- **Semantic tokens** — named by intent (`brand-primary`, `text-muted`, `surface-base`). These are what your components should reference.

This means a rebrand or theme change only requires updating semantic token mappings, not touching every component.

---

## Updating Tokens

Tokens are managed in Figma. Changes flow automatically via the sync pipeline:

```
Figma → GitHub Actions (on-demand sync) → PR review → Merge → Rebuild
```

Do not edit the generated files directly. See the [Designer Guide](../../docs/DESIGNER_GUIDE.md) to trigger a sync.
