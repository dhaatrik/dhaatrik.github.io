## 2026-04-21 - Astro `<Image>` Default Lazy Loading Anti-Pattern

**Learning:** Astro's built-in `<Image>` component automatically applies `loading="lazy"` to images. While this is great for performance for images below the fold, it acts as an anti-pattern when used for hero images or other Largest Contentful Paint (LCP) elements that appear immediately on screen, delaying their fetch and render time.
**Action:** When using Astro's `<Image>` for hero sections or above-the-fold content, explicitly override the default behavior by setting `loading="eager"` and `fetchpriority="high"`.

## 2026-04-24 - Astro `render()` for Frontmatter Anti-Pattern

**Learning:** Using Astro's `render(post)` API inside component scripts purely to extract injected remark plugin frontmatter (like reading time) acts as a performance bottleneck. It needlessly runs the entire MDX/Markdown compilation pipeline for every post on index/listing pages.
**Action:** When computing metadata like reading time for listing pages, bypass `render()` and use standard Node APIs (`fs` + `reading-time`) directly on the raw markdown content to keep the SSG/SSR build fast.

## 2026-04-25 - [Astro Prefetching]

**Learning:** This static application uses Astro's ViewTransitions, but can further improve initial perceived performance during navigation by enabling Astro's native `prefetch` capability in `astro.config.mjs` and configuring `<ClientRouter />` appropriately if needed. The links will be prefetched either on hover or visibility.
**Action:** Always consider using Astro's `prefetch: true` config for purely static sites with SPA-like navigation, as it preloads resources for subsequent pages and significantly reduces perceived navigation time without requiring large architectural changes.

## 2026-04-26 - [Fontsource Weight Optimization Anti-Pattern]

**Learning:** Changing the default `@fontsource/poppins` import (which loads weight 400) to a specific weight like `@fontsource/poppins/700.css` in an attempt to optimize payload size for heading fonts does not reduce bundle size or HTTP requests if the font files are already pre-processed and optimized during the build step. More importantly, it risks breaking design semantics or causing visual regressions if the application relies on the default weight elsewhere.
**Action:** Do not micro-optimize fontsource imports by restricting weights unless there's a clear, measured network bottleneck and visual confirmation that no other weights are needed.

## 2026-04-27 - [Date Formatting in SSG]

**Learning:** Using `date.toLocaleDateString()` inside an Astro component that is rendered in a loop (like a blog index) incurs significant performance overhead during the SSG build. In Node.js, `toLocaleDateString` re-initializes the `Intl.DateTimeFormat` object on every call. Our benchmarks in this environment showed a ~94x difference (1.422s vs 15.142ms for 10k dates).
**Action:** When repeatedly formatting dates with the same locale and options, instantiate an `Intl.DateTimeFormat` object once outside the component/loop (or in a shared utility file) and reuse its `.format(date)` method.
