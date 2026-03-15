# @thatguycodes/quartz-ui

A React component library backed by `@thatguycodes/design-tokens`. Components are styled with CSS Modules using semantic token variables and support light and dark modes out of the box.

## Installation

```bash
npm install @thatguycodes/quartz-ui
```

Peer dependencies (not auto-installed):

```
react >=18
react-dom >=18
```

---

## Setup

Wrap your app with `ThemeProvider`. It sets `data-theme` on `<html>`, which activates the correct CSS token layer.

```tsx
// app/layout.tsx (Next.js) or main.tsx (Vite)
import { ThemeProvider } from '@thatguycodes/quartz-ui';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider initialMode="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`ThemeProvider` also imports the token CSS bundle automatically — no separate CSS import required in your app.

---

## Switching Themes

`ThemeProvider` exposes `mode` and `setMode` via the `useTheme` hook:

```tsx
import { useTheme } from '@thatguycodes/quartz-ui';

function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      Switch to {mode === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

`ThemeProvider` props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `initialMode` | `'light' \| 'dark'` | `'light'` | Starting theme mode |
| `children` | `ReactNode` | — | App content |

---

## Components

### Button

```tsx
import { Button } from '@thatguycodes/quartz-ui';

<Button variant="primary" size="medium" onClick={handleClick}>
  Save changes
</Button>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Visual style |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Height and padding |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `disabled` | `boolean` | `false` | Disables interaction |
| `aria-label` | `string` | — | Accessible name for icon-only buttons |
| `...rest` | `ButtonHTMLAttributes` | — | All standard button attributes |

#### Accessibility

- Defaults to `type="button"` to prevent accidental form submission
- Focus ring meets WCAG 2.4.7 in both light and dark mode
- Disabled state removes from tab order and blocks click events
- `prefers-reduced-motion` removes transitions and scale transforms
- `forced-colors` (Windows High Contrast) falls back to `outline` instead of `box-shadow` for focus rings
- All ARIA attributes pass through to the underlying `<button>` element

#### Variants

| Variant | Use case |
|---|---|
| `primary` | Main call to action |
| `secondary` | Supporting actions, less visual weight |
| `outline` | Tertiary / ghost style |

---

## Development

```bash
# Start Storybook
npx nx run quartz-ui:storybook

# Run unit tests
npx nx run quartz-ui:test

# Build the library
npx nx run quartz-ui:build

# Lint
npx nx run quartz-ui:lint
```

### Storybook theme switching

The Storybook toolbar includes a light/dark toggle powered by `@storybook/addon-themes`. It sets `data-theme` on the story root so all CSS token variables respond correctly.

---

## Adding a Component

1. Generate scaffold: `npx nx g @nx/react:component MyComponent --project=quartz-ui`
2. Style with `MyComponent.module.css` — use only `var(--color-*)` semantic tokens
3. Add stories in `MyComponent.stories.tsx`
4. Export from `libs/ui/quartz-ui/src/index.ts`

Do not use primitive token variables (`--brand-*`, `--storm-*`, `--smoke-*`) directly in components. They are implementation details of the token layer.

---

## Publishing

```bash
npx nx release version --projects quartz-ui
npx nx release publish --projects quartz-ui
```