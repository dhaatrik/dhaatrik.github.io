---
name: verify-dhaatrik-site
description: Drive and verify dhaatrik.github.io static site web UI, interactive popovers, search, theme toggle, and offline archives using the repo control script and Playwright. Use when proving frontend behavior, verifying UI bug fixes, or capturing visual evidence of features.
---

# Verify Dhaatrik Site

Control harness and verification recipes for `dhaatrik.github.io`. Drives the static preview server on a dedicated isolated port (`4325`), executes programmatic user actions via Playwright, captures visual/DOM evidence, and cleans up running instances without destroying evidence.

## Launch

Build static assets and launch the local preview server on isolated port `4325`:

```bash
node scripts/verify-dhaatrik.mjs launch
```

Ready indicator: The script polls `http://localhost:4325` until HTTP 200 is returned (typically ~2-4s after compilation).

To launch manually without the helper:

```bash
npm run build
npx astro preview --port 4325
```

## Doctor

Run the read-only environment check before driving:

```bash
node scripts/verify-dhaatrik.mjs doctor
```

Validates:

1. Node version is `>= 22`
2. Static production artifacts exist in `dist/`
3. Port `4325` status (ready or already running preview server)

## Drive

Drive mapped user features via the CLI helper:

```bash
# Drive theme toggle (light <-> dark mode transition and persistence)
node scripts/verify-dhaatrik.mjs drive theme-toggle

# Drive books popover (modal dialog semantics and close action)
node scripts/verify-dhaatrik.mjs drive books-popover

# Drive transmission search (combobox query filtering and result count)
node scripts/verify-dhaatrik.mjs drive transmission-search
```

Or run Playwright directly against mapped specs:

```bash
npm run test:e2e -- test/e2e/ui.spec.ts
npm run test:e2e -- test/e2e/blogPost.spec.ts
```

Stable handles used across the app:

- `#theme-toggle`: Theme button in the header
- `button[popovertarget="books-popover"]`: Recommended books trigger
- `#books-popover`: Popover modal dialog (`role="dialog"`, `aria-modal="true"`)
- `#search-logs`: Main transmission search input (`role="combobox"`)
- `.blog-post-card`: Transmission article cards in the search grid
- `#export-btn`: Transmission export dropdown trigger
- `#export-offline-btn`: Offline single-file HTML generator

## Evidence

Evidence artifacts are captured in `.verify/evidence/<feature>/`:

- `01-*.png`: Initial state screenshot
- `02-*.png`: State after user interaction
- `proof.json`: Structured assertions, timestamps, before/after values, and verification status

All evidence is preserved across test runs and survives cleanup.

## Cleanup

Tear down preview server instances started by verification runs:

```bash
node scripts/verify-dhaatrik.mjs cleanup
```

Kills the process tree recorded in `.verify/preview.pid` and removes the PID file. Preserves `.verify/evidence/`.

## Helpers

- `scripts/verify-dhaatrik.mjs`: Central control script supporting `doctor`, `launch`, `drive <feature>`, and `cleanup`.
- `features/`: The maintained feature map detailing user journeys, entry points, and gotchas.
