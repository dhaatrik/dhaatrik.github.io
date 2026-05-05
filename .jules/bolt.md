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

## 2025-05-04 - Eliminate Redundant Array Mapping in Loops
**Learning:** Mapping a dataset to JSX/Astro elements multiple times (e.g., for marquee clones) is inefficient as it recreates identical virtual nodes and props objects repeatedly during the build process.
**Action:** Store the result of the map operation in a variable and reuse it when the same set of elements needs to be rendered multiple times in the template.
