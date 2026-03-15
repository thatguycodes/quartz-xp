# Guard Rails for AI Agents: Design Primitives

This document defines the core primitive constraints for the design system. AI Agents MUST adhere to these rules when proposing changes, generating UI, or modifying tokens.

## 🎨 Core Primitives (Immutable)

These are the primitive color scales defined within the `global` directory (e.g., `storm.json`, `smoke.json`) and specific `brands/<name>/primitives.json` files. AI Agents MUST NOT modify these hex values.

### Brand Accents

> Currently only one brand (`quartz`) is defined. Its primitives are stored under the root key `"brand"` in `brands/quartz/primitives.json`.

| Palette | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand (Violet/Indigo)** | `#f5f3ff` | `#ede9fe` | `#ddd6fe` | `#c4b5fd` | `#a78bfa` | `#8b5cf6` | `#7c3aed` | `#6d28d9` | `#5b21b6` | `#4c1d95` | `#2e1065` |

### Grays & Neutrals

| Palette | 5 | 10 | 15 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Storm (Slate)** | `#f8fafc` | `#f1f5f9` | `#eef2f6` | `#e2e8f0` | `#d1d5db` | `#cbd5e1` | `#94a3b8` | `#64748b` | `#475569` | `#334155` | `#1e293b` | `#0f172a` | `#020617` |
| **Smoke (Gray)** | `#f8f8f8` | `#eeeeee` | `-` | `#a0a0a0` | `-` | `#8b8b8b` | `#7c7c7c` | `#747474` | `#6f6f6f` | `#616161` | `#505050` | `#181818` | `#0b0b0b` |

## 🌓 Semantic Text Tokens

Text colors are resolved via theme files (`themes/light.json`, `themes/dark.json`) which reference these primitives.

### Light Mode (`[data-theme="light"]`)

| Semantic Token | Reference | Resolved Hex | Role |
| :--- | :--- | :--- | :--- |
| `color.text.base` | `{storm.95}` | `#020617` | Body & primary text |
| `color.text.muted` | `{storm.60}` | `#475569` | Subtitles, secondary info |
| `color.text.disabled` | `{storm.40}` | `#94a3b8` | Disabled states |
| `color.text.on-primary` | `{storm.5}` | `#f8fafc` | Text on filled primary elements |
| `color.text.inverse` | `{storm.5}` | `#f8fafc` | Inverse text (on dark surfaces) |

### Dark Mode (`[data-theme="dark"]`)

| Semantic Token | Reference | Resolved Hex | Role |
| :--- | :--- | :--- | :--- |
| `color.text.base` | `{smoke.5}` | `#f8f8f8` | Body & primary text |
| `color.text.muted` | `{smoke.30}` | `#8b8b8b` | Subtitles, secondary info |
| `color.text.disabled` | `{smoke.60}` | `#6f6f6f` | Disabled states |
| `color.text.on-primary` | `{smoke.5}` | `#f8f8f8` | Text on filled primary elements |
| `color.text.inverse` | `{smoke.95}` | `#0b0b0b` | Inverse text (on light surfaces) |

## 🏗️ Semantic Backgrounds & Surfaces

| Token | Light Mode | Dark Mode | Role |
| :--- | :--- | :--- | :--- |
| `color.background.base` | `{storm.5}` | `{storm.95}` | Main app surface |
| `color.background.subtle` | `{storm.10}` | `{storm.90}` | Section / secondary backgrounds |
| `color.background.faint` | `{storm.20}` | `{storm.80}` | Card backgrounds, hover states |
| `color.surface.base` | `{storm.5}` | `{storm.95}` | Base surface layer |
| `color.surface.muted` | `{storm.10}` | `{storm.90}` | Muted surface layer |

## 🎯 Primary Action Tokens

| Token | Light Mode | Dark Mode | Role |
| :--- | :--- | :--- | :--- |
| `color.primary.default` | `{brand.60}` | `{brand.60}` | Default action color |
| `color.primary.hover` | `{brand.70}` | `{brand.50}` | Hover state |
| `color.primary.active` | `{brand.80}` | `{brand.40}` | Active / pressed state |
| `color.primary.disabled` | `{brand.20}` | `{brand.90}` | Disabled state background |
| `color.border.focus` | `{brand.50}` | `{brand.40}` | Focus ring |

## 📏 Scale & Sizing

- **Base Unit**: The system is built on an **8px grid** (`core.size.SCALE: 8`).
- **Mathematical Multipliers**: Sizing tokens (dimension, space) MUST be derived from the base scale. Avoid hardcoded fractional pixels.

### AI Agent Rules:

1. **Immutable Primitives**: Never modify the hex values in `global/storm.json`, `global/smoke.json`, or `brands/quartz/primitives.json`.
2. **Semantic Linking**: Always reference colors via semantic tokens (e.g., `color.primary.default`) or brand primitives (e.g., `{brand.60}`). Never use hardcoded hex values in UI code.
3. **No Ad-hoc Hexes**: Do not approximate these colors with hardcoded hex values. Use the provided CSS variables or JSON tokens.
4. **Brand Structure**: When introducing new brands under `brands/<brandName>/primitives.json`, ALWAYS define the palette under the root key `"brand"` (i.e., `"brand": { ... }`). This allows shared files like `semantics.json` to abstractly reference `{brand.60}` regardless of which brand is active.
5. **Token Names**: Use the actual token names defined in the theme files (`base`, `muted`, `disabled`, `on-primary`, `inverse`). The legacy names `extreme`, `severe`, `moderate`, `soft`, `delicate` are not part of this system.

---

_Created to ensure consistency across automated agent interventions._
