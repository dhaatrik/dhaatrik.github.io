## 2025-04-21 - [Navigation Accessibility]

**Learning:** Adding `aria-current="page"` to active navigation links makes the interface significantly more accessible for screen reader users by properly identifying current context, instead of just relying on visual styling (like an underline or bold text). Also, `focus-visible` with a proper `ring-offset` matching the background (`dark:focus-visible:ring-offset-[var(--bg-main)]`) keeps focus indicators accessible without looking cluttered on hover.
**Action:** Always include `aria-current="page"` for active links and ensure keyboard focus states (`focus-visible`) are clearly visible with high contrast when building navigation components.
