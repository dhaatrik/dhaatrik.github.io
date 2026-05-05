## 2026-04-29 - Accessible Auto-scrolling Marquees

**Learning:** Auto-scrolling elements like marquees can create motion accessibility issues (WCAG 2.2.2). It's crucial not just to pause on hover, but also to ensure they are keyboard focusable (`tabindex="0"`, `role="region"`) and pause on `focus-within` so keyboard users can read the content comfortably.
**Action:** When implementing any auto-scrolling container, always add `focus-within` alongside `:hover` for the pause state, and make the container keyboard navigable with an appropriate ARIA label.

## 2026-05-01 - Screen Reader Context for External Links and Text Contrast

**Learning:** Found that external links opening in a new tab (`target="_blank"`) in `Footer.astro` and `index.astro` lacked context in their `aria-label`s, which can be disorienting for screen reader users. Additionally, observed that `text-slate-400` used for the GitHub icon link on a light/white background did not meet the WCAG contrast ratio for accessibility.
**Action:** Always append `(opens in a new tab)` to the `aria-label` of any `target="_blank"` link. Use `text-slate-500` or darker for interactive elements to ensure sufficient contrast ratios against light backgrounds.

## 2026-05-03 - Tactile Feedback with Transform Transitions

**Learning:** When adding active scaling effects (like `active:scale-95`) to interactive elements, the scaling effect will be instantaneous and lack smoothness if the element only has a `transition-colors` class.
**Action:** Always ensure the base transition utility is `transition-all` or includes `transition-transform` when introducing transform-based active states (like `active:scale-*`) to ensure a polished, tactile feel.

## 2025-05-02 - Redundant Image Alt Text

**Learning:** Using `alt={title}` for hero images that are immediately followed by an `<h1>` containing the exact same title causes screen readers to redundantly announce the title twice.
**Action:** Use empty alt text (`alt=""`) for hero images that are visually decorative and whose context is fully captured by adjacent heading elements.

## 2026-05-04 - False Affordances in Hover States

**Learning:** Applying generic hover styles (like `group-hover:text-[var(--accent)]` mimicking a link color shift) to text within a card wrapper creates a false visual affordance if the text or card itself isn't interactive/clickable. This can lead to dead clicks and user frustration.
**Action:** Reserve distinct interactive hover styles (like link colors or `active:scale` transformations) only for actionable elements (like explicit anchor tags or buttons) to ensure visual feedback accurately represents interactivity.

## 2026-05-05 - Skip-to-Content and Fixed Headers

**Learning:** When navigating via a "Skip to content" link (or any anchor link) to a target beneath a fixed header, the browser scrolls the element to the very top, obscuring it. Furthermore, for focus to jump reliably to non-interactive elements like `<main>` across all browsers, the target must have `tabindex="-1"`.
**Action:** When implementing skip links with fixed headers, set `scroll-padding-top` on the `html` element equal to the header height, ensure the target has `tabindex="-1"`, and add `[tabindex="-1"]:focus { outline: none; }` to hide the focus ring.
