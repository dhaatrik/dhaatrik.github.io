## 2024-04-29 - Accessible Auto-scrolling Marquees

**Learning:** Auto-scrolling elements like marquees can create motion accessibility issues (WCAG 2.2.2). It's crucial not just to pause on hover, but also to ensure they are keyboard focusable (`tabindex="0"`, `role="region"`) and pause on `focus-within` so keyboard users can read the content comfortably.
**Action:** When implementing any auto-scrolling container, always add `focus-within` alongside `:hover` for the pause state, and make the container keyboard navigable with an appropriate ARIA label.
