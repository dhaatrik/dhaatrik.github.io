## 2026-04-22 - Map Component Hover Animations to Focus States

**Learning:** Custom component hover animations (like `.bento-card` lift/glow and animated header underlines) are often overlooked for keyboard navigation. Mouse users get rich feedback while keyboard users are left with default or no indication.
**Action:** Always ensure that custom animated `:hover` states have equivalent `:focus-visible` states to provide equitable accessibility and a delightful experience for keyboard users.

## 2026-04-23 - Handle Motion Sensitivity with `prefers-reduced-motion`

**Learning:** Infinite CSS animations (like `.animate-marquee` for tech stacks or auto-scrolling logos) can trigger nausea and dizziness for users with vestibular disorders. While hovering to pause is a good start, it relies on an active interaction and doesn't solve the immediate visual impact upon loading.
**Action:** Always wrap infinite or significant non-essential animations with a `@media (prefers-reduced-motion: reduce)` query to default to a `paused` state (or static alternative) for users who have requested reduced motion at the OS level.
