## 2026-04-30 - Remove dead remark plugin to eliminate redundant AST parsing

**Learning:** In Astro, if a previous optimization bypassed a Remark plugin (e.g., calculating reading time via `post.body` instead of AST), failing to remove the plugin itself means the expensive AST traversal still runs on every build, effectively nullifying the SSG performance gain.
**Action:** Always verify that the old expensive code path is completely removed from configuration (`astro.config.mjs`) when migrating to a faster alternative.
