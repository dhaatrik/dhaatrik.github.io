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

## 2026-05-14 - Replace toLocaleDateString with cached Intl.DateTimeFormat in components

**Learning:** Using `toLocaleDateString` inside a loop or mapped array forces the browser/Node to instantiate a new `Intl.DateTimeFormat` object each time, which is extremely slow. Benchmarks show that reusing a single cached `Intl.DateTimeFormat` instance is ~94x faster during Astro SSG builds.
**Action:** Whenever formatting dates in repeated components or lists, always use the `FormattedDate` component (or the cached `dateFormatter` utility) instead of calling `toLocaleDateString` directly.
