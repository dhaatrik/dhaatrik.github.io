# Dhaatrik Site Verification Map

This directory is the maintained source for verifying user-facing behavior across `dhaatrik.github.io`. Read this index before driving the app, then follow the matching feature recipe.

## Baseline Preconditions

- Launch the preview server at `http://localhost:4325` (`node scripts/verify-dhaatrik.mjs launch`).
- Run `node scripts/verify-dhaatrik.mjs doctor` to confirm Node `>= 22` and `dist/index.html` exist.
- Never drive an instance not started for verification to avoid colliding with development sessions on port `4321`.

## Driving Conventions

- Use stable handles: ARIA roles, IDs (`#theme-toggle`, `#search-logs`), and data attributes (`data-nav-key`, `popovertarget`).
- Capture both the user action and the resulting state change, not merely the final snapshot.
- Run interactive feature verification via `node scripts/verify-dhaatrik.mjs drive <feature>`.
- Preserved proof artifacts are saved under `.verify/evidence/<feature>/`.

## Feature Entry Contract

Each feature document contains exactly four H2 sections:

1. `Sub-features`: Bulleted list of verifiable user capabilities.
2. `How to get to it (user POV)`: UI navigation paths.
3. `Driving it with Playwright / control script`: Action-by-action recipe with exact handles and proof assertions.
4. `Gotchas`: Common timing, CSS transitions, or viewport nuances to account for.

## Features

- [Theme Toggle](./theme-toggle.md) — Dark and light mode switching, DOM class manipulation, and theme persistence.
- [Books Popover](./books-popover.md) — Modal book recommendation dialog with accessible dialog semantics.
- [Transmission Search](./transmission-search.md) — Live search combobox, debounce filtering, and card list updates.
- [Offline Transmission Export](./offline-export.md) — Client-side HTML single-file package generation with sanitized entities.
