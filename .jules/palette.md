## 2026-04-22 - Map Component Hover Animations to Focus States

**Learning:** Custom component hover animations (like `.bento-card` lift/glow and animated header underlines) are often overlooked for keyboard navigation. Mouse users get rich feedback while keyboard users are left with default or no indication.
**Action:** Always ensure that custom animated `:hover` states have equivalent `:focus-visible` states to provide equitable accessibility and a delightful experience for keyboard users.

## 2026-04-23 - Handle Motion Sensitivity with `prefers-reduced-motion`

**Learning:** Infinite CSS animations (like `.animate-marquee` for tech stacks or auto-scrolling logos) can trigger nausea and dizziness for users with vestibular disorders. While hovering to pause is a good start, it relies on an active interaction and doesn't solve the immediate visual impact upon loading.
**Action:** Always wrap infinite or significant non-essential animations with a `@media (prefers-reduced-motion: reduce)` query to default to a `paused` state (or static alternative) for users who have requested reduced motion at the OS level.

## 2026-04-24 - Missing Skip-to-Content link in Astro site without unified layout

**Learning:** Found that this app is missing a skip-to-content link, which is a critical accessibility feature for keyboard users to bypass repetitive header navigation. In Astro projects where there is no single top-level `Layout.astro` (instead pages like `index.astro`, `about.astro`, etc., individually include `<Header />` and `<main>`), the `<main>` element needs an `id` across all files to act as the target for the skip link.
**Action:** Next time I encounter a site without a skip-to-content link, I will ensure that the link is placed as early as possible in the DOM (e.g., inside the `<Header />` component) and that all corresponding `<main>` elements have the matching `id`.

## 2026-04-25 - [Accessible Icon Links & Tooltips]

**Learning:** Combining `aria-label` with a visually-hidden `<span class="sr-only">` text block on icon-only links is redundant, and can cause some screen readers to announce the label twice. Native `title` attributes on icon-only links provide helpful browser tooltips for sighted users without conflicting with `aria-label`.
**Action:** When adding `title` tooltips to icon-only links that already have an `aria-label`, remove any visually-hidden (`sr-only`) fallback text to ensure a pristine accessible name calculation.
