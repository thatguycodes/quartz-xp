# Quartz UI

A lightweight React component library backed by the `@thatguycodes/design-tokens` package. Ships as `@thatguycodes/quartz-ui` for reuse across apps and Storybook demos.

## Installation

```bash
npm install @thatguycodes/quartz-ui @thatguycodes/design-tokens
```

Peer deps (not auto-installed):
- react >=18
- react-dom >=18

## Usage

Just import components; tokens CSS is auto-loaded by the package entry:

```tsx
import { Button } from '@thatguycodes/quartz-ui';

export function Example() {
  return (
    <Button variant="primary" size="medium">
      Click me
    </Button>
  );
}
```

Button props:
- `variant`: `primary | secondary | outline` (default `primary`)
- `size`: `small | medium | large` (default `medium`)
- plus standard `button` HTML props

## Development

- Build: `npx nx run ui:build`
- Storybook: `npx nx run ui:storybook`
- Tests: `npx nx run ui:test`

## Publishing (maintainers)

Release per package via Nx:
- Version: `npx nx release version --projects ui`
- Publish: `npx nx release publish --projects ui`
