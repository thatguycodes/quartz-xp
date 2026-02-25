# Deploying `@thatguycodes/design-tokens` to npm

> **All releases must go through the CI/CD pipeline.**
> Manual publishing is reserved for emergencies only — see the [Emergency Manual Publish](#emergency-manual-publish-last-resort-only) section below.

---

## Standard Release (Pipeline)

Releases are fully automated. Every merge to `main` triggers the CI pipeline, which:

1. Lints, builds, and tests all affected projects.
2. Runs `npx nx release --yes --projects=design-tokens` (via `.github/workflows/semantic-release.yml`) to:
   - Bump the version using [Conventional Commits](https://www.conventionalcommits.org/).
   - Generate/update the changelog.
   - Publish the package to npm using the `NPM_TOKEN` repository secret.

### To cut a release

1. Merge your feature/fix branch into `main` via a pull request.
2. The pipeline runs automatically — monitor it in the **Actions** tab.
3. Once the `semantic-release` job completes, verify the new version:

```bash
npm view @thatguycodes/design-tokens
```

> On pull requests the pipeline runs a dry-run release (no publish) so you can preview what version would be released before merging. To see the preview, open the **Actions** tab on your pull request and inspect the `semantic-release-dry-run` job logs.

---

## Emergency Manual Publish (Last Resort Only)

> ⚠️ **Only use this if the pipeline is broken and a critical fix must be shipped immediately.**
> Always prefer fixing the pipeline and using the standard release process.

### Prerequisites

- npm account with access to the `@thatguycodes` scope
- MFA enabled on your npm account
- Logged in locally: `npm login`
- Authenticator app ready for OTP

### Steps

#### 1. Build tokens

```bash
npx nx run design-tokens:build
```

Verify key files were generated under `libs/tokens/design-tokens/src/generated/`:

- `css/variables.css` (`:root` fallback)
- `css/variables-default-light.css`, `css/variables-default-dark.css`, `css/variables-purple-light.css`, `css/variables-purple-dark.css`
- `ts/tokens.ts` and `ts/tokens.d.ts` (default-light shorthand)
- `ts/tokens-default-light.ts`, `ts/tokens-default-dark.ts`, etc.
- `scss/`, `android/`, `ios/` — additional platform outputs

#### 2. Bump the version

Edit `libs/tokens/design-tokens/package.json` and increment the version following semver:

| Change type       | Example           |
| ----------------- | ----------------- |
| Bug fix / patch   | `0.0.1` → `0.0.2` |
| New token / minor | `0.0.2` → `0.1.0` |
| Breaking rename   | `0.1.0` → `1.0.0` |

Or use npm from the tokens directory:

```bash
cd libs/tokens/design-tokens

# pick one:
npm version patch   # 0.0.2 → 0.0.3
npm version minor   # 0.0.2 → 0.1.0
npm version major   # 0.0.2 → 1.0.0
```

#### 3. Dry run (recommended)

```bash
cd libs/tokens/design-tokens
npm publish --access public --dry-run
```

Expected files in the tarball:

```
README.md
generated/css/variables.css
generated/css/variables-default-light.css
generated/css/variables-default-dark.css
generated/css/variables-purple-light.css
generated/css/variables-purple-dark.css
generated/ts/tokens.ts
generated/ts/tokens.d.ts
generated/ts/tokens-default-light.ts
generated/ts/tokens-default-light.d.ts
... (+ scss, android, ios files)
package.json
```

#### 4. Get your OTP

Open your authenticator app and get the current 6-digit OTP for npm. **You have ~30 seconds** before it rotates — have the publish command ready before looking it up.

#### 5. Publish

```bash
cd libs/tokens/design-tokens
npm publish --access public --otp=<your-otp>
```

Replace `<your-otp>` with your 6-digit code, e.g. `123456`.

#### 6. Verify

```bash
npm view @thatguycodes/design-tokens
```

After the emergency is resolved, open a PR to restore the pipeline so future releases follow the standard process.

---

## Troubleshooting

| Error                                                       | Fix                                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `You cannot publish over the previously published versions` | Bump the version in `libs/tokens/design-tokens/package.json`                   |
| `EOTP` / OTP invalid or expired                             | Get a fresh OTP and re-run immediately                                         |
| `403 Forbidden`                                             | Ensure you are logged in (`npm login`) and own `@thatguycodes`                 |
| Wrong files published                                       | Check the `files` field in `libs/tokens/design-tokens/package.json`            |
| Pipeline not publishing                                     | Check `NPM_TOKEN` secret is set in repository **Settings → Secrets → Actions** |
