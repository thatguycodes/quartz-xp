# 📖 Implementation Guide

This guide provides step-by-step instructions for implementing common tasks in the Nx Enterprise monorepo. For architectural context and rationale, see [ARCHITECTURE.md](../ARCHITECTURE.md).

## Table of Contents

1. [Getting Started](#getting-started)
2. [Working with Tokens](#working-with-tokens)
3. [Building UI Components](#building-ui-components)
4. [Creating Application Pages](#creating-application-pages)
5. [Testing Strategies](#testing-strategies)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd nx-enterprise
   npm install
   ```

2. **Build tokens** (required before first run):
   ```bash
   npx nx build tokens
   ```

3. **Start development server**:
   ```bash
   npx nx dev web
   ```
   Visit http://localhost:3000

4. **Start Storybook** (optional):
   ```bash
   npx nx storybook ui
   ```
   Visit http://localhost:6006

### Project Structure Quick Reference

```
nx-enterprise/
├── apps/
│   ├── web/              # Next.js application
│   └── web-e2e/          # E2E tests
├── libs/
│   └── shared/
│       ├── tokens/       # Design tokens
│       └── ui/           # Component library
├── ARCHITECTURE.md       # Architecture documentation
├── README.md             # Getting started guide
└── package.json          # Dependencies
```

---

## Working with Tokens

### Understanding Token Layers

Tokens have two layers:

1. **Core Tokens** (`core.json`): Primitive values
   - Colors: `color.blue.600 = "#2563eb"`
   - Spacing: `spacing.md = "16px"`
   - Physical properties without context

2. **Semantic Tokens** (`semantic.json`): Meaningful aliases
   - Brand colors: `brand.primary = {color.blue.600}`
   - Text colors: `text.base = {color.gray.700}`
   - Purpose-driven naming

### Adding a New Color Token

**File**: `libs/shared/tokens/src/tokens/core.json`

Add to the color section:
```json
{
  "color": {
    "purple": {
      "500": {
        "value": "#8b5cf6"
      },
      "600": {
        "value": "#7c3aed"
      }
    }
  }
}
```

**Build and verify**:
```bash
npx nx build tokens
```

### Token Naming Conventions

- **Kebab-case in JSON**: `brand-primary`, `spacing-md`
- **CSS output**: `--brand-primary`, `--spacing-md`
- **TypeScript output**: `brandPrimary`, `spacingMd`

### Best Practices

✅ **Do**:
- Use semantic tokens in components (`--brand-primary`)
- Group related tokens (colors together, spacing together)
- Test token changes in Storybook

❌ **Don't**:
- Use core tokens directly in components (`--color-blue-600`)
- Hard-code values in CSS files

---

## Building UI Components

### Generating a Component

```bash
npx nx g @nx/react:component Card --project=shared-ui
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

**Card.module.css**:
```css
.card {
  background-color: var(--surface-base);
  border: 1px solid var(--border-default);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
}

.card.elevated {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-base);
}

.content {
  color: var(--text-muted);
}
```

### Exporting Components

**libs/shared/ui/src/index.ts**:
```typescript
export * from './lib/ui';
export * from './lib/button/Button';
export * from './lib/card/Card';
```

---

## Creating Application Pages

### Adding a New Route

**Create**: `apps/web/src/app/about/page.tsx`

```typescript
import { Button } from '@nx-enterprise/ui';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1>About Us</h1>
      <Button variant="primary">Get in Touch</Button>
    </div>
  );
}
```

---

## Testing Strategies

### Unit Testing

```bash
npx nx test ui              # Test UI library
npx nx test web             # Test web app
```

### E2E Testing

```bash
npx nx e2e web-e2e
```

---

## Common Patterns

### Themed Components

```css
.card {
  background-color: var(--surface-base);
  color: var(--text-base);
}

[data-theme='dark'] .card {
  --surface-base: #1a1a1a;
  --text-base: #ffffff;
}
```

---

## Troubleshooting

### Token Changes Not Reflecting

**Solution**:
1. Rebuild tokens: `npx nx build tokens`
2. Restart dev server: `npx nx dev web`
3. Clear browser cache

### Component Not Found

**Solution**:
1. Verify export in `libs/shared/ui/src/index.ts`
2. Check import path: `import { Component } from '@nx-enterprise/ui'`

---

## Additional Resources

- [Architecture Documentation](../ARCHITECTURE.md)
- [Nx Documentation](https://nx.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Style Dictionary](https://styledictionary.com)
- [Storybook Documentation](https://storybook.js.org/docs)

---

**Last Updated**: 2026-02-13
