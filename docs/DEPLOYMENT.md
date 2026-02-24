# Publishing `@thatguycodes/design-tokens` to npm

## Prerequisites

- npm account with access to the `@thatguycodes` scope
- MFA enabled on your npm account (required for publishing)
- Logged in locally: `npm login`
- Authenticator app ready for OTP

---

## Steps

### 1. Build tokens

Always build before publishing to ensure generated files are up to date:

```bash
npx nx run design-tokens:build
```

Verify the following files were generated:
- `libs/tokens/design-tokens/src/generated/css/variables.css`
- `libs/tokens/design-tokens/src/generated/ts/tokens.ts`
- `libs/tokens/design-tokens/src/generated/ts/tokens.d.ts`

### 2. Bump the version

Edit `libs/tokens/design-tokens/package.json` and increment the version. Follow semver:

| Change type | Example |
|---|---|
| Bug fix / patch | `0.0.1` → `0.0.2` |
| New token / minor | `0.0.2` → `0.1.0` |
| Breaking rename | `0.1.0` → `1.0.0` |

Or use npm from the tokens directory:

```bash
cd libs/tokens/design-tokens

# pick one:
npm version patch   # 0.0.2 → 0.0.3
npm version minor   # 0.0.2 → 0.1.0
npm version major   # 0.0.2 → 1.0.0
```

### 3. Dry run (optional but recommended)

Confirm only the right files are included before actually publishing:

```bash
cd libs/tokens/design-tokens
npm publish --access public --dry-run
```

Expected files in the tarball:
```
README.md
generated/css/variables.css
generated/ts/tokens.ts
generated/ts/tokens.d.ts
package.json
```

### 4. Get your OTP

Open your authenticator app and get the current 6-digit OTP for npm. **You have ~30 seconds** before it rotates — have the publish command ready before looking it up.

### 5. Publish

#### Option A — via Nx (from monorepo root)

```bash
NPM_OTP=<your-otp> npx nx run design-tokens:publish
```

#### Option B — directly from the tokens folder

```bash
cd libs/tokens/design-tokens
npm publish --access public --otp=<your-otp>
```

Replace `<your-otp>` with your 6-digit code, e.g. `123456`.

### 6. Verify

```bash
npm view @thatguycodes/design-tokens
```

---

## Troubleshooting

| Error | Fix |
|---|---|
| `You cannot publish over the previously published versions` | Bump the version in `libs/tokens/design-tokens/package.json` |
| `EOTP` / OTP invalid or expired | Get a fresh OTP and re-run immediately |
| `403 Forbidden` | Ensure you are logged in (`npm login`) and own `@thatguycodes` |
| Wrong files published | Check the `files` field in `libs/tokens/design-tokens/package.json` |

