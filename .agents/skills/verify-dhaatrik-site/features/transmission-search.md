# Transmission Search

Transmission search enables real-time client-side filtering of engineering logs and articles by keywords, topics, and titles.

## Sub-features

- `search-filter`: Real-time debounced filtering of `.blog-post-card` elements based on `#search-logs` input value.
- `search-keyboard`: Keyboard navigation through search results using Up/Down arrow keys.
- `search-url-sync`: Synchronizes active query to `sessionStorage` and query parameters.

## How to get to it (user POV)

- Navigate to `/transmissions/` and focus the search bar with placeholder _"Search my diary: a concept, a bug, or a late-night thought..."_.

## Driving it with control script

Preconditions:

- Preview server running at `http://localhost:4325`.

- **Navigate:** Open `http://localhost:4325/transmissions/`.
- **Query Input:** Fill `#search-logs` with `'deltav'`.
- **Wait for Filter:** Wait 400ms for debounce.
- **Assertion:** Verify `.blog-post-card:visible` count is greater than 0.
- **Proof:** Screenshot saved to `.verify/evidence/transmission-search/01-search-results.png` with `proof.json`.
- **Automated Drive Command:**
    ```bash
    node scripts/verify-dhaatrik.mjs drive transmission-search
    ```

## Gotchas

- Input element has `id="search-logs"` (not `search-input`).
- A debounce delay of ~150-250ms occurs before the card grid reflects the filtered dataset.
