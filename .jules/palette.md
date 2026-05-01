## 2026-04-29 - Accessible Auto-scrolling Marquees

**Learning:** Auto-scrolling elements like marquees can create motion accessibility issues (WCAG 2.2.2). It's crucial not just to pause on hover, but also to ensure they are keyboard focusable (`tabindex="0"`, `role="region"`) and pause on `focus-within` so keyboard users can read the content comfortably.
**Action:** When implementing any auto-scrolling container, always add `focus-within` alongside `:hover` for the pause state, and make the container keyboard navigable with an appropriate ARIA label.
## 2026-05-01 - Screen Reader Context for External Links and Text Contrast
**Learning:** Found that external links opening in a new tab (`target="_blank"`) in `Footer.astro` and `index.astro` lacked context in their `aria-label`s, which can be disorienting for screen reader users. Additionally, observed that `text-slate-400` used for the GitHub icon link on a light/white background did not meet the WCAG contrast ratio for accessibility.
**Action:** Always append `(opens in a new tab)` to the `aria-label` of any `target="_blank"` link. Use `text-slate-500` or darker for interactive elements to ensure sufficient contrast ratios against light backgrounds.
