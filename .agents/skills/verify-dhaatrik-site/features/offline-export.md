# Offline Transmission Export

Offline export generates a self-contained, standalone single-file HTML archive of an engineering transmission with embedded styling and sanitized metadata.

## Sub-features

- `export-menu-toggle`: Opens export options modal when clicking `#export-btn`.
- `export-offline-generation`: Bundles article markup and sanitized metadata into an air-gapped HTML file.
- `export-entity-escaping`: Sanitizes title and description via `escapeHtml()` to neutralize HTML/script injection vectors.

## How to get to it (user POV)

- Open any individual transmission log (e.g., `/transmissions/deltav-lab-mission-log/`).
- Click the `Export` menu trigger button.
- Choose `Offline HTML (.html)`.

## Driving it with Playwright

Preconditions:

- Preview server running at `http://localhost:4325`.

- **Open Article:** Navigate to `http://localhost:4325/transmissions/deltav-lab-mission-log/`.
- **Open Export Menu:** Click `#export-btn`.
- **Trigger Download:** Wait for `#export-offline-btn` to be visible and listen for the browser download event.
- **Verify Content:** Read downloaded file content, ensuring it contains `<!doctype html>`, `VELLOR TRANSMISSION LOG`, and escaped metadata without unescaped injection strings.
- **Automated Spec Command:**
    ```bash
    npx playwright test test/e2e/blogPost.spec.ts -g "Offline transmission HTML export"
    ```

## Gotchas

- Download must be awaited via `page.waitForEvent('download')` before clicking `#export-offline-btn`.
- The export menu is located within the sticky sidebar or header depending on viewport width.
