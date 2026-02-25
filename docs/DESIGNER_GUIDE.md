# Designer Guide

## Overview

As a designer, Figma is your workspace. You own the design tokens — the colours, spacing, radii, and other visual values that the entire product is built from. This guide explains how your Figma changes flow into code.

---

## Token Workflow

```
Edit tokens in Figma
  → Trigger sync from GitHub Actions
  → Automated PR created on tokens/figma-sync branch
  → Design team reviews and merges
  → CI builds tokens and publishes package
  → Changes are live
```

You never write code. Everything starts in Figma.

---

## Triggering a Token Sync

When you're ready to push token changes from Figma into the codebase:

1. Go to the repository on GitHub.
2. Click the **Actions** tab.
3. Select **"Figma Token Sync (On-Demand)"**.
4. Click **"Run workflow"** → **"Run workflow"**.

A pull request will be created automatically on the `tokens/figma-sync` branch and assigned to the design team for review.

> No Figma plugin or manual file export is needed. The sync fetches tokens directly from the Figma API.

---

## Naming Tokens in Figma

Tokens must follow **kebab-case with at least one group**. This is required for the sync to work correctly.

**Format:** `group-name` or `group-subgroup-name`

| ✅ Valid                | ❌ Invalid       | Reason                      |
| ----------------------- | ---------------- | --------------------------- |
| `color-primary`         | `primary`        | Missing group               |
| `spacing-md`            | `SpacingMd`      | Must be lowercase           |
| `typography-heading-lg` | `color_primary`  | Use dashes, not underscores |
| `border-radius-sm`      | `color--primary` | No double dashes            |

---

## Token Layers

Tokens are organised in three layers. As a designer, you work primarily in the **semantic** layer.

| Layer        | Location                                  | Rule                                                        |
| ------------ | ----------------------------------------- | ----------------------------------------------------------- |
| **Base**     | `tokens/base/*.json`                      | Raw values (hex, rem, etc.). Auto-generated. Rarely change. |
| **Semantic** | `tokens/semantic/light.json`, `dark.json` | Purpose-driven names per theme. This is what you edit.      |
| **Brand**    | `tokens/brands/<brand>/<theme>.json`      | Overrides for specific brands (default, purple).            |

Components reference semantic tokens only — never base tokens directly. A rebrand means updating the semantic or brand layer without touching any component.

---

## Themes and Brands

The system supports multiple theme/brand combinations. Each combination is built separately:

| Theme         | Applied via                  |
| ------------- | ---------------------------- |
| Default Light | `data-theme="default-light"` |
| Default Dark  | `data-theme="default-dark"`  |
| Purple Light  | `data-theme="purple-light"`  |
| Purple Dark   | `data-theme="purple-dark"`   |

To add a new brand, the development team creates a new folder under `tokens/brands/` and adds it to the build script.

---

## Available Token Categories

These are the semantic tokens components use. Reference them in Figma under these categories:

| Category                 | CSS variable examples                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------ |
| Background colours       | `--color-background-primary`, `--color-background-secondary`                               |
| Text colours             | `--color-text-primary`, `--color-text-secondary`                                           |
| Border colours           | `--color-border-primary`                                                                   |
| Spacing                  | `--spacing-1` through `--spacing-8` (0.25rem to 4rem)                                      |
| Border radius            | `--border-radius-sm`, `--border-radius-md`, `--border-radius-lg`, `--border-radius-full`   |
| Border width             | `--border-width-sm`, `--border-width-md`                                                   |
| Typography — font family | `--font-family-sans`, `--font-family-serif`, `--font-family-mono`                          |
| Typography — font size   | `--font-size-xs` through `--font-size-4xl`                                                 |
| Typography — font weight | `--font-weight-regular` through `--font-weight-bold`                                       |
| Line height              | `--line-height-none`, `--line-height-tight`, `--line-height-normal`, `--line-height-loose` |
| Shadow                   | `--shadow-sm`, `--shadow-md`, `--shadow-lg`                                                |

---

## Reviewing the Sync PR

After the sync runs you'll receive a GitHub notification. The PR includes:

- A diff of every changed token
- Updated CSS variable files for all 4 theme combinations:
  - `generated/css/variables-default-light.css`
  - `generated/css/variables-default-dark.css`
  - `generated/css/variables-purple-light.css`
  - `generated/css/variables-purple-dark.css`
- Updated TypeScript constants (one file per theme + a `tokens.ts` shorthand)
- Any naming convention violations logged as warnings

**When ready:** Approve and merge. The tokens will be live after CI completes.

---

## Merge Policy

- A new sync **closes any previous open PR** on `tokens/figma-sync` and creates a fresh one
- PRs that remain unmerged for **7 days** are automatically closed — trigger a new sync if needed

---

## Reverting a Token Change

Reverting is done through Figma — not through git.

1. Update the token in Figma to its previous value.
2. Trigger a new sync from GitHub Actions.
3. A new PR will be created — review and merge it.

---

## Questions

For anything token-related, tag `@design-team` in the PR or open an issue in the repository.
