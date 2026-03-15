# Implementation Guide

This guide provides step-by-step instructions for implementing common tasks in the Nx Enterprise monorepo. For architectural context and rationale, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Table of Contents

1. [Getting Started](#getting-started)
2. [Working with Tokens](#working-with-tokens)
3. [Building UI Components](#building-ui-components)
4. [Testing Strategies](#testing-strategies)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 22+ and npm
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone and install**:

   ```bash
   git clone <repository-url>
   cd quartz-xp
   npm install
   ```

2. **Build tokens** (required before first run):

   ```bash
   npx nx run design-tokens:build
   ```

3. **Start Storybook** to browse components:
   ```bash
   npx nx run quartz-ui:storybook
   ```
   Visit http://localhost:6006

### Project Structure Quick Reference

```
quartz-xp/
├── apps/                  # Reserved for future applications
├── libs/
│   ├── design-tokens/ # Design tokens (@thatguycodes/design-tokens)
│   └── quartz-ui/     # Component library (@thatguycodes/quartz-ui)
├── docs/                  # All project documentation
└── package.json
```

---

## Working with Tokens

### Understanding the Token Structure

Tokens are organised into core, global, mode, and component layers:

```
src/tokens/
├── core.json       # Primitive values (auto-generated from Figma)
├── global/         # Shared scales and primitives
├── mode/           # Theme-aware aliases (light.json, dark.json)
└── components/     # Component-level tokens
```

> **Never edit these JSON files manually.** They are auto-generated from Figma via the token sync workflow.

### Adding or Updating a Token

Tokens are managed Figma-first:

1. Make the change in Figma following kebab-case naming (`group-name` format)
2. Trigger the **"Figma Token Sync"** workflow from the **Actions** tab on GitHub
3. Review and merge the generated PR
4. CI runs `design-tokens:build` automatically after merge
5. Use the token in components: `var(--your-token-name)`

For local iteration (regenerating from existing JSON without changes):

```bash
npx nx run design-tokens:generate
```

### Token Naming Conventions

- **In JSON (DTCG format)**: `"charcoal": { "$type": "color", "$value": "#1a1a1a" }`
- **CSS output**: `--color-charcoal`, `--color-background-primary`, `--spacing-4`
- **TypeScript output**: `colorCharcoal`, `colorBackgroundPrimary`, `spacing4`

### Using Tokens in CSS

Always use **semantic tokens** in component styles — never base/primitive tokens and never hard-coded values:

```css
/* ✅ Semantic token (correct) */
.button {
  background-color: var(--color-background-primary);
}

/* ❌ Base/primitive token (wrong) */
.button {
  background-color: var(--color-charcoal);
}

/* ❌ Hard-coded value (wrong) */
.button {
  background-color: #1a1a1a;
}
```

### Theme Switching

Themes are applied via a `data-theme` attribute on a parent element:

```html
<html data-theme="light">
  ...
</html>
<html data-theme="dark">
  ...
</html>
<html data-theme="light">
  ...
</html>
<html data-theme="dark">
  ...
</html>
```

The default light variables are also available on `:root` as a fallback.

---

## Building UI Components

### Generating a Component

```bash
npx nx g @nx/react:component Card --project=quartz-ui
```

This creates:

```
libs/quartz-ui/src/lib/card/
  ├── Card.tsx
  ├── Card.module.css
  ├── Card.spec.tsx
  └── Card.stories.tsx
```

### Component Implementation

**Card.tsx**:

```typescript
import styles from './Card.module.css';

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
}

export function Card({ title, children, variant = 'default' }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default Card;
```

**Card.module.css** — always use semantic tokens:

```css
.card {
  background-color: var(--color-background-secondary);
  border: var(--border-width-sm) solid var(--color-border-primary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-5);
}

.card.elevated {
  box-shadow: var(--shadow-md);
}

.title {
  margin: 0 0 var(--spacing-3) 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.content {
  color: var(--color-text-secondary);
}
```

### Exporting Components

Add the export to `libs/quartz-ui/src/index.ts`:

```typescript
export * from './lib/button/Button';
export * from './lib/card/Card';
```

### Adding Storybook Stories

```typescript
// Card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Components/Card',
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { title: 'Card Title', children: 'Card content goes here.' },
};

export const Elevated: Story = {
  args: { title: 'Elevated Card', children: 'Card content.', variant: 'elevated' },
};
```

Use Storybook to verify the component renders correctly across all 4 themes:

```bash
npx nx run quartz-ui:storybook
```

---

## Testing Strategies

### Unit Testing

```bash
npx nx run quartz-ui:test    # Test the UI library
npx nx run-many -t test      # Test all projects
```

**Example test** (`Card.spec.tsx`):

```typescript
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders title', () => {
    render(<Card title="Hello">Content</Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## Common Patterns

### Theme-Aware Components

Tokens automatically reflect the active theme — no extra work needed in components. Just use semantic tokens:

```css
/* This adapts to whichever data-theme is set on the root element */
.card {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
}
```

### Applying a Theme

To switch themes programmatically, set `data-theme` on the `<html>` element:

```typescript
document.documentElement.setAttribute('data-theme', 'dark');
```

In Storybook, themes are controlled via the theme switcher toolbar (powered by `@storybook/addon-themes`).

### Variant-Pattern Components

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}
```

```css
.button.primary {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
}

.button.small {
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-size-xs);
}
.button.medium {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}
.button.large {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-base);
}
```

---

## Troubleshooting

### Token Changes Not Reflecting in Storybook

1. Regenerate tokens: `npx nx run design-tokens:generate`
2. Restart Storybook: `npx nx run quartz-ui:storybook`
3. Hard-refresh the browser

### Component Not Found

1. Verify the export in `libs/quartz-ui/src/index.ts`
2. Check the import: `import { Component } from '@thatguycodes/quartz-ui'`

### CSS Variables Undefined

Confirm all 4 theme CSS files are imported in `libs/quartz-ui/.storybook/preview.ts`:

```ts
import '../../../design-tokens/src/generated/css/variables-light.css';
import '../../../design-tokens/src/generated/css/variables-dark.css';
import '../../../design-tokens/src/generated/css/';
import '../../../design-tokens/src/generated/css/';
```

If the CSS files are missing, run `npx nx run design-tokens:generate` first.

---

## Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Nx Documentation](https://nx.dev)
- [Style Dictionary](https://styledictionary.com)
- [Storybook Documentation](https://storybook.js.org/docs)

---

**Last Updated**: 2026-02-25
