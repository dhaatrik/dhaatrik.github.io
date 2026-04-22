## 2026-04-22 - Map Component Hover Animations to Focus States

**Learning:** Custom component hover animations (like `.bento-card` lift/glow and animated header underlines) are often overlooked for keyboard navigation. Mouse users get rich feedback while keyboard users are left with default or no indication.
**Action:** Always ensure that custom animated `:hover` states have equivalent `:focus-visible` states to provide equitable accessibility and a delightful experience for keyboard users.
