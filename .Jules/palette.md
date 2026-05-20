## 2024-05-20 - Palette Journal Initialized

**Learning:** Initializing journal for tracking UX/a11y insights.
**Action:** Keep entries focused on critical learnings only.

## 2024-05-20 - Added Empty State and ARIA Live for Client-Side Filtering

**Learning:** When using client-side DOM filtering, adding an empty state and dynamically updating an aria-live region with the result count is required to maintain accessibility for screen reader users, who otherwise would not be notified of content changes.
**Action:** Always provide a visual empty state and an `aria-live="polite"` region when implementing client-side filtering.
