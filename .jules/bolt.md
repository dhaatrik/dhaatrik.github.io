## 2026-04-30 - Remove dead remark plugin to eliminate redundant AST parsing

**Learning:** In Astro, if a previous optimization bypassed a Remark plugin (e.g., calculating reading time via `post.body` instead of AST), failing to remove the plugin itself means the expensive AST traversal still runs on every build, effectively nullifying the SSG performance gain.
**Action:** Always verify that the old expensive code path is completely removed from configuration (`astro.config.mjs`) when migrating to a faster alternative.

## 2026-05-01 - Astro link prefetching

**Learning:** Setting `prefetch: true` in `astro.config.mjs` enables prefetch support but doesn't prefetch any links by default. Links must manually include the `data-astro-prefetch` attribute (e.g. `data-astro-prefetch="hover"`) for the actual prefetching to take place.
**Action:** When enabling prefetch in Astro config, remember to also update the link components to apply the `data-astro-prefetch` attribute to ensure it works.
