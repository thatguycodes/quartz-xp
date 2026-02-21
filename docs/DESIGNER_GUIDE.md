# Designer Guide

## Overview

As a designer, Figma is your workspace. You own the design tokens — the colours, spacing, radii, and other visual values that the entire product is built from. This guide explains how your Figma changes flow into code.

---

## Token Workflow

```
Figma (your changes) → Sync (GitHub Actions) → PR review → Merge → Live in the product
```

You never touch code. Everything starts in Figma.

---

## Naming Tokens in Figma

Tokens must follow **kebab-case with at least one group**. This is required for the sync to work correctly.

**Format:** `group-name` or `group-subgroup-name`

| ✅ Valid | ❌ Invalid | Reason |
|---|---|---|
| `color-primary` | `primary` | Missing group |
| `spacing-md` | `SpacingMd` | Must be lowercase |
| `typography-heading-lg` | `color_primary` | Use dashes, not underscores |
| `border-radius-sm` | `color--primary` | No double dashes |

---

## Token Layers

Tokens are organised in two layers. You should only need to touch **semantic tokens** for day-to-day work.

| Layer | Example | Rule |
|---|---|---|
| **Core** | `color-blue-600 = #2563eb` | Raw values. Rarely change. |
| **Semantic** | `brand-primary = {color-blue-600}` | Purposeful names. Reference core tokens. |

Components use semantic tokens. A rebrand means updating the semantic layer only — without touching any component.

---

## Available Token Categories

| Category | Example tokens |
|---|---|
| Brand colours | `brand-primary`, `brand-hover` |
| Surface colours | `surface-base`, `surface-muted` |
| Text colours | `text-base`, `text-muted`, `text-on-brand` |
| Border | `border-default` |
| Spacing | `spacing-xs`, `spacing-sm`, `spacing-md`, `spacing-lg`, `spacing-xl` |
| Border radius | `border-radius-sm`, `border-radius-md`, `border-radius-lg` |

---

## Triggering a Token Sync

When you're happy with your token changes in Figma:

1. Go to the repository on GitHub
2. Click the **Actions** tab
3. Select **"Figma Token Sync (On-Demand)"**
4. Click **"Run workflow"** → **"Run workflow"**

A pull request will be created automatically and assigned to you for review.

---

## Reviewing the Sync PR

After triggering a sync you'll receive a GitHub notification. In the PR you'll find:

- A diff of every changed token
- The git commit hash for audit purposes
- A list of any naming convention violations (if found)

**If violations appear:** They are warnings, not blockers. You can either fix the token names in Figma and re-trigger, or approve the PR as-is.

**When ready:** Approve and merge. The tokens will be live in the next deployment.

---

## Merge Policy

- A new sync **closes the previous open PR** and creates a fresh one
- PRs that are open for more than **7 days** are automatically closed with an explanatory comment
- If a PR is auto-closed, just trigger a new sync

---

## Reverting a Token Change

Reverting is done through Figma — not through git.

1. Update the token in Figma to its previous value
2. Trigger a new sync from GitHub Actions
3. A new PR will be created — review and merge it

---

## Questions

For anything token-related, tag `@design-team` in the PR or open an issue in the repository.

