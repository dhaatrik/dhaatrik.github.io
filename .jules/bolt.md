## 2025-05-18 - [Optimize Path Segment Extraction in Astro SSG Components]

**Learning:** In Astro SSG where components like HeaderLink are rendered frequently, using regex (like `match(/[^\/]+/g)`) for simple path segment extraction is an unnecessary bottleneck. Benchmarks show string manipulations like `indexOf` and `substring` are approximately 3-4x faster than regex matching in Node.js for simple extraction tasks.
**Action:** When extracting segments from paths or simple formatted strings during component rendering, prefer native string methods (`indexOf`, `substring`, `split`) over regular expressions to reduce rendering overhead during static site generation.
