## 2026-04-30 - Remove dead remark plugin to eliminate redundant AST parsing

**Learning:** In Astro, if a previous optimization bypassed a Remark plugin (e.g., calculating reading time via `post.body` instead of AST), failing to remove the plugin itself means the expensive AST traversal still runs on every build, effectively nullifying the SSG performance gain.
**Action:** Always verify that the old expensive code path is completely removed from configuration (`astro.config.mjs`) when migrating to a faster alternative.

## 2026-05-01 - Astro link prefetching

**Learning:** Setting `prefetch: true` in `astro.config.mjs` enables prefetch support but doesn't prefetch any links by default. Links must manually include the `data-astro-prefetch` attribute (e.g. `data-astro-prefetch="hover"`) for the actual prefetching to take place.
**Action:** When enabling prefetch in Astro config, remember to also update the link components to apply the `data-astro-prefetch` attribute to ensure it works.

## 2026-05-02 - Comprehensive Astro Link Prefetching

**Learning:** When enabling link prefetching in Astro, applying `data-astro-prefetch` to main navigation components (like `<HeaderLink>`) is not enough. You must also proactively check for isolated internal link anchors (`<a href="...">`) throughout pages, headers, footers, and layouts, otherwise users will experience inconsistent perceived performance on site traversal.
**Action:** Always do a codebase-wide search for internal `<a>` tags and add `data-astro-prefetch` explicitly to ensure SPA-like instant transitions are applied universally.

## 2026-05-03 - The Danger of Phantom Optimizations

**Learning:** When making manual performance optimizations like enabling Astro link prefetching via attributes, it is extremely easy to accidentally document the _intent_ (e.g., adding a comment) but forget to implement the actual _execution_ (e.g., the `data-astro-prefetch` attribute itself), resulting in a "phantom optimization" that provides no actual performance benefit.
**Action:** Always verify that the physical HTML attributes or corresponding code changes are present in the final commit, rather than just relying on the presence of explanatory comments.

## 2026-05-05 - Array mapping cache optimization for redundant Astro components

**Learning:** Reusing a pre-mapped array of elements within Astro templates (e.g., for duplicated components like seamless marquees) is significantly more efficient than redundantly running `array.map()` multiple times for identical component output, improving generation speed during Astro SSG builds.
**Action:** When a template requires rendering duplicate items (like an infinite looping marquee that duplicates content), map the item to JSX components once and store it in a local variable, then interpolate that variable multiple times to eliminate redundant AST processing.

## 2026-05-08 - Font preloading optimization

**Learning:** When preloading specific font weights (like 700 bold), always explicitly import the corresponding CSS `@font-face` rule for that weight (e.g., `import '@fontsource/poppins/700.css'`) instead of relying on default bare imports (like `import '@fontsource/poppins'`), which typically only provide the 400 normal weight. Failing to do so causes the browser to download the preloaded font as dead weight and rely on expensive faux-bold synthesis.
**Action:** When preloading fonts, verify the imported font weight matches the preloaded font file weight exactly.

## 2026-05-09 - Caching URL objects for multiple meta tags

**Learning:** When multiple meta tags (e.g., `og:image`, `twitter:image`) share the exact same `URL` instantiated from a string (e.g., `new URL(image.src, Astro.site)`), doing so inline results in redundant parsing and object creation during each SSG render cycle.
**Action:** Hoist the URL instantiation to a local variable (`const imageUrl = new URL(image.src, Astro.site)`) and reference that variable in the meta tags to halve the instantiation overhead.

## 2026-05-12 - Date Formatter Optimization

**Learning:** Using `toLocaleDateString` in Astro components rendered in loops during SSG is ~94x slower than using a cached `Intl.DateTimeFormat`.
**Action:** Replaced `toLocaleDateString` with the existing `<FormattedDate />` component which encapsulates the cached formatter.

## 2026-05-14 - Replace toLocaleDateString with cached Intl.DateTimeFormat in components

**Learning:** Using `toLocaleDateString` inside a loop or mapped array forces the browser/Node to instantiate a new `Intl.DateTimeFormat` object each time, which is extremely slow. Benchmarks show that reusing a single cached `Intl.DateTimeFormat` instance is ~94x faster during Astro SSG builds.
**Action:** Whenever formatting dates in repeated components or lists, always use the `FormattedDate` component (or the cached `dateFormatter` utility) instead of calling `toLocaleDateString` directly.

## 2026-05-15 - Optimize setInterval with cached Intl.DateTimeFormat

**Learning:** Using `toLocaleString` with timezone options inside a high-frequency `setInterval` (like a 1-second clock) forces the browser to continually instantiate new `Intl.DateTimeFormat` and `Date` objects, creating unnecessary main thread overhead and GC pressure.
**Action:** Cache the `Intl.DateTimeFormat` instance outside the interval and use its `.format()` method to directly generate the required string, yielding an ~90x performance improvement in client-side execution time.

## 2026-05-16 - Optimize reading time calculation to eliminate massive array allocations

**Learning:** When calculating reading time for markdown documents directly from the `post.body` string during SSG, using `split(/\s+/)` causes massive memory allocations and garbage collection overhead because it creates an array containing every single word in the document.
**Action:** Always use a single-pass string scanner which increments a counter while traversing the string, avoiding arrays altogether. This custom utility resulted in a speedup from ~4.2s to ~1s in benchmarks without relying on heavy external dependencies.

## 2026-05-17 - Optimize mousemove tracking to prevent layout thrashing

**Learning:** Calling `querySelectorAll` and `getBoundingClientRect` on every `mousemove` event without throttling causes significant layout thrashing and forces layout recalcs. Doing this in page-level scripts also causes issues with Astro View Transitions.
**Action:** Always move high-frequency DOM event listeners to a global script (e.g. `BaseHead.astro`), use `getElementsByClassName` for a live HTMLCollection to avoid querying, and throttle layout reading using `requestAnimationFrame`. Remember to clean up event listeners using `astro:before-preparation`.

## 2026-05-21 - Concurrent Collection Fetching

**Learning:** Using sequential `await getCollection()` calls on Astro pages during SSG blocks execution, resulting in linear file I/O wait times.
**Action:** Always fetch multiple collections concurrently using `Promise.all()` to parallelize file reads and improve page build speed.

## 2026-05-25 - Debounce high-frequency DOM events on text inputs

**Learning:** Running expensive layout recalculations (like filtering large lists of DOM elements) synchronously on every `input` event keystroke causes layout thrashing and UI jank.
**Action:** Always debounce text input event listeners (e.g. `150ms`) when the handler performs DOM manipulation or searching to significantly reduce redundant processing and ensure a smooth typing experience.

## 2026-05-26 - Cache DOM extraction in client-side search to prevent redundant parsing

**Learning:** During client-side filtering on every keystroke, repeatedly reading textContent and dataset values from the DOM is an expensive operation that can cause layout thrashing and slow down search performance.
**Action:** When performing client-side filtering, extract the necessary data (textContent, dataset tags) once into an array during initialization and use this cached data during the `filterPosts` method instead of re-reading from the DOM elements on every keystroke.

## 2026-05-27 - Throttle mousemove with requestAnimationFrame to prevent layout thrashing

**Learning:** Unthrottled `mousemove` events can fire significantly faster than the browser's refresh rate (e.g., a 1000Hz gaming mouse vs a 60Hz screen). Updating CSS variables inside these callbacks causes wasted style recalculations and potential UI jank.
**Action:** When updating continuous visual effects via `mousemove` (like a flashlight or spotlight tracking the cursor), wrap the style updates inside a `requestAnimationFrame` callback to synchronize them with the browser's render cycle.

## 2026-06-01 - Throttling redundant layout recalcs

**Learning:** Using `getBoundingClientRect` inside an unthrottled `mousemove` event triggers synchronous layout recalcs and layout thrashing, severely degrading UI performance on pages with multiple active event listeners.
**Action:** Always throttle high-frequency layout-reading DOM events (like `mousemove` triggering `getBoundingClientRect`) using `requestAnimationFrame`, and ensure duplicated event listeners across multiple files are removed to maintain a single source of truth for global interactions.

## 2026-06-02 - Throttling mousemove with requestAnimationFrame

**Learning:** Unthrottled `mousemove` events for visual effects like parallax can fire significantly faster than the browser's refresh rate, causing layout thrashing and UI jank.
**Action:** Always throttle high-frequency DOM events that trigger style updates (like the reticle parallax) using `requestAnimationFrame`, and ensure they are cleaned up with `cancelAnimationFrame`.

## 2026-06-05 - Throttling high-frequency scroll events
**Learning:** Unthrottled `scroll` events that trigger style recalculations or DOM updates can fire synchronously and faster than the browser's frame rate, leading to severe layout thrashing and UI jank.
**Action:** Always throttle continuous `scroll` event listeners using `window.requestAnimationFrame()` combined with a ticking boolean flag, unless natively handled via CSS `animation-timeline`.

## 2026-06-06 - Caching layout rects on mousemove
**Learning:** Calling getBoundingClientRect() inside requestAnimationFrame for high-frequency events (like mousemove) still causes significant layout recalculations (layout thrashing) for every active element on the page.
**Action:** Always pre-calculate and cache document-relative coordinates (e.g. rect.left + window.scrollX) during initialization (and update via ResizeObserver) instead of querying the DOM layout during the continuous event loop.
