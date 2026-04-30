## 2026-04-30 - Accessible Infinite Marquees
**Learning:** Infinite CSS marquees (like the TechMarquee component) can be inaccessible to keyboard and screen reader users if they cannot be paused or identified. WCAG 2.2.2 requires moving content to have a mechanism for the user to pause, stop, or hide it.
**Action:** When implementing marquees, always make the container focusable (`tabindex="0"`), give it a `role="region"` with an `aria-label`, and use CSS (`:focus-within`) to pause the animation when the user focuses on it or its children.
