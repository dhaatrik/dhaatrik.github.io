# Theme Toggle

Theme toggle allows the user to switch between dark and light color modes across all site pages with instant visual feedback and local persistence.

## Sub-features

- `theme-switch`: Switches `html.dark` class and root CSS variables between dark and light palettes.
- `theme-persistence`: Saves theme preference in `localStorage` across page reloads and navigations.
- `theme-aria`: Updates `aria-label` on `#theme-toggle` reflecting the active target state.

## How to get to it (user POV)

- Click the sun/moon icon button (`#theme-toggle`) located on the right side of the main navigation header.

## Driving it with control script

Preconditions:

- Preview server running at `http://localhost:4325`.
- `node scripts/verify-dhaatrik.mjs doctor` passes.

- **Initial State:** Navigate to `http://localhost:4325/`. Observe whether `document.documentElement` contains class `dark`.
- **Toggle Action:** Click `#theme-toggle`.
- **Resulting State:** Verify `document.documentElement.classList.contains('dark')` has flipped boolean state.
- **Visual Proof:** Capture initial screenshot (`01-initial-state.png`) and toggled screenshot (`02-toggled-state.png`) in `.verify/evidence/theme-toggle/`.
- **Automated Drive Command:**
    ```bash
    node scripts/verify-dhaatrik.mjs drive theme-toggle
    ```

## Gotchas

- The theme initializer script runs inline before paint to avoid FOUC.
- Allow 300ms after clicking `#theme-toggle` for CSS opacity and background transitions to settle before capturing final screenshot.
