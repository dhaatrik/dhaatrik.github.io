# Books Popover

Recommended Books popover provides a non-affiliate list of formative engineering and science books inside an accessible modal dialog.

## Sub-features

- `books-open`: Opens `#books-popover` via native Popover API upon clicking the footer trigger button.
- `books-a11y`: Enforces `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="books-popover-title"`.
- `books-close`: Dismisses the popover via close button (`popovertargetaction="hide"`), backdrop click, or Escape key.

## How to get to it (user POV)

- Scroll to the site footer on any page and click the `Books That Shaped My Thinking` button.

## Driving it with control script

Preconditions:

- Preview server running at `http://localhost:4325`.

- **Trigger:** Scroll into view and click `button[popovertarget="books-popover"]`.
- **Open State:** Verify `#books-popover` is visible, has attribute `role="dialog"`, and `aria-modal="true"`.
- **Dismiss:** Click the close button inside `#books-popover` (`button[popovertargetaction="hide"]`).
- **Closed State:** Verify `#books-popover` is no longer visible in layout.
- **Proof:** Captured screenshot saved to `.verify/evidence/books-popover/01-books-popover-open.png` with `proof.json`.
- **Automated Drive Command:**
    ```bash
    node scripts/verify-dhaatrik.mjs drive books-popover
    ```

## Gotchas

- Native HTML `popover` attribute handles top-layer positioning; do not rely on z-index overrides.
- Ensure the trigger button is scrolled into view before clicking when testing on desktop viewports.
