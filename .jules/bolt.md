## 2026-04-21 - Astro `<Image>` Default Lazy Loading Anti-Pattern

**Learning:** Astro's built-in `<Image>` component automatically applies `loading="lazy"` to images. While this is great for performance for images below the fold, it acts as an anti-pattern when used for hero images or other Largest Contentful Paint (LCP) elements that appear immediately on screen, delaying their fetch and render time.
**Action:** When using Astro's `<Image>` for hero sections or above-the-fold content, explicitly override the default behavior by setting `loading="eager"` and `fetchpriority="high"`.
