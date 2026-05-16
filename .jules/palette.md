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

## 2026-05-06 - Explicit Focus Rings on CTAs

**Learning:** Adding standard `focus-visible` classes to call-to-action buttons (like `<a>` tags with background colors) is necessary because default browser focus rings may not contrast sufficiently with the button's background. Explicit rings (`focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[var(--bg-main)]`) ensure keyboard accessibility without affecting mouse users.
**Action:** Always check interactive elements, especially primary CTAs, for visible focus styles. Use the pattern `focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-[var(--bg-main)]` for standard elements.

## 2026-05-07 - Directional Affordances on CTAs

**Learning:** Adding directional icons (like an arrow pointing right or a mail icon shifting up/right) to adjacent but fundamentally different Call-To-Action (CTA) buttons provides users with clearer mental models and immediate tactile feedback. This small visual cue sets expectations for what type of action will occur before the user clicks, reducing cognitive load.
**Action:** When placing primary and secondary CTAs side-by-side, consider adding relevant semantic icons with subtle transform animations on hover/focus to visually distinguish their purposes and provide tactile affordance.

## 2026-05-09 - Restricting Bento Card Hover Effects

**Learning:** The `.bento-card` class applies interactive hover and focus styles (transform and box-shadow) indiscriminately. Applying this class to non-interactive elements creates false visual affordances, confusing users.
**Action:** Restrict interactive hover and focus styles in CSS to explicitly actionable elements (like `a.bento-card` or `button.bento-card`) to ensure visual feedback accurately represents interactivity, while keeping `.bento-card:focus-within` intact for accessibility highlights when focusing interactive children.

## 2026-05-10 - Dynamic ARIA Labels for Theme Toggles

**Learning:** When building interactive state toggle buttons (like a theme toggle), static `aria-label`s (e.g., "Toggle theme") don't inform screen reader users about the _current_ state or the _outcome_ of the action. This can be confusing.
**Action:** Use JavaScript to dynamically update the `aria-label` (and `title`) of state toggle buttons to describe the _next state_ it will transition to (e.g., "Switch to light mode" or "Switch to dark mode"), providing immediate context and clarity.

## 2026-05-12 - Repetitive 'Buy' links accessibility

**Learning:** Repetitive mapped call-to-action links (like "Buy" or "Read More") in list items are terrible for screen readers, as they just hear the generic action text multiple times without context.
**Action:** When mapping over items with identical CTA text, always use a dynamic `aria-label` (e.g., `Buy ${item.title}`) and ensure `target="_blank"` links append `(opens in a new tab)` for full context. Also, ensure modals have accessible close buttons and all interactive elements maintain clear `focus-visible` styling.

## 2026-05-13 - Focusable skip link targets

**Learning:** When using skip links (like "Skip to content"), the target elements (e.g. `<main id="main-content">`) must have `tabindex="-1"`. Without this, some browsers won't programmatically focus the container when navigating via the skip link, breaking the keyboard navigation flow.
**Action:** Always ensure that elements targeted by skip links have `tabindex="-1"` so that focus is reliably moved to the main content area for keyboard and screen reader users.

## 2026-05-15 - Terminal-Style CTAs Need Explicit Context

**Learning:** Stylized "terminal command" buttons (e.g., `~ $ connect --x` or `~ $ copy --link`) read poorly or confusingly to screen readers if the raw text is left exposed. Furthermore, setting `focus-visible:outline-none` without an explicit focus ring makes them completely inaccessible for keyboard users.
**Action:** When creating stylized terminal CTAs, always wrap the stylized text in `aria-hidden="true"`, provide a clear, descriptive `aria-label` on the parent button/link, and ensure an explicit `focus-visible:ring-2` class is applied to replace the default outline.
