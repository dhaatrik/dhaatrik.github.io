# Site Audit Report — dhaatrik.github.io

**Audit Date:** 2026-09-05 (Asia/Calcutta)  
**Site:** https://dhaatrik.github.io  
**Auditor:** Site Audit bot (first full baseline)  
**Engineering Verification & Codebase Review:** Antigravity Pair-Programming Agent (Deep Research & Ground Truth Verification)  
**Scope:** Public crawl (15 HTML pages) + Full static build verification (`dist/`, 53 HTML routes) + Test suite execution (`npm test`, `npm run test:e2e`).  
**Method:** HTML/header fetch (curl/urllib), sitemap/robots discovery, JSON-LD parse, curl TTFB timings, local AST & DOM code inspection, Playwright test suite execution. No invented lab/traffic metrics.

---

## Executive summary

Overall **80 / 100** (average of five measured dimensions; **Speed excluded** because PSI/Lighthouse could not be measured — API returned **429 Too Many Requests**).

The site is a high-performance, static personal engineering portfolio and mission log: HTTPS + HSTS, solid canonicals, unique titles/meta descriptions, rich first-principles copy, landmark structure, skip link, and mature structured data (Person, WebSite, FAQPage, Article, SoftwareSourceCode, BreadcrumbList).

### Codebase Verification Summary

A rigorous deep-dive into the Astro source code and the production build (`dist/`) confirmed that:
- **7 of the 10 actionable findings are 100% verified and correct** (F1, F2, F3, F7, F8, F9, F10).
- **2 findings had missing codebase context or were nuanced** (F4, F6).
- **1 finding is a confirmed tooling false positive** (F5): the site does **not** emit `"dateModified": null`. The crawler's extraction script confused a missing key in Python (`None`) with literal `null` in the HTML.

| Dimension | Score | Verification Notes |
|-----------|------:|--------------------|
| 1. SEO technical | **84** | **Verified.** Strong fundamentals; OG placeholder on top-level pages + short project titles + h1→h3 jump on `/projects/`. |
| 2. Content | **86** | **Verified.** Substantive, authentic engineering diary voice; verified duplicate H3 on homepage popover. |
| 3. Speed | **unmeasured** | **Verified.** PSI 429 quota block; payload weight verified across all built HTML documents (120–230 KB). |
| 4. Accessibility | **80** | **Verified with context.** Landmarks/skip/ARIA good; h1→h3 hierarchy jump confirmed on `/projects/`; empty alt on pedagogy thumbs is intentional to avoid double-announcements in links. |
| 5. CRO | **58** | **Verified.** Authentic engineering diary positioning; no `mailto:` or contact form; CSP `form-action 'none'` intentional. |
| 6. Schema / structured data | **90** | **Verified with correction.** JSON-LD parseable sitewide; WebSite lacks SearchAction (though search exists on `/transmissions/`); F5 (`dateModified: null`) was a false positive. |
| **Overall (excl. Speed)** | **80** | Equal weight of SEO, Content, A11y, CRO, Schema = (84+86+80+58+90)/5 |

---

## Per-dimension scores and top issues

### 1. SEO technical — 84/100

**Strengths**
- HTTPS with `strict-transport-security: max-age=31556952`.
- Unique `<title>` and meta description on all 15 crawled pages; single H1 each; `lang="en"`; mobile viewport present.
- Canonical URLs present and trailing-slash normalized (e.g. `/personnel` → `/personnel/`).
- `robots.txt` allows `/`, explicitly welcomes AI bots (`GPTBot`, `ClaudeBot`, `PerplexityBot`), points to sitemaps; Disallow `/404`; 404 response is HTTP 404 with `noindex` in HTML.
- Sitemap: 52 URLs in `sitemap.xml` / `sitemap-0.xml`; `sitemap-index.xml` present.
- Open Graph + Twitter tags present sitewide; Google site verification meta present.
- RSS + `llms.txt` + `llms-full.txt` for discovery.

**Top issues (Verified)**
- Top-level pages share fallback OG image `.../blog-placeholder-4.jpg` (`/`, `/personnel/`, `/projects/`, `/pedagogy/`, `/transmissions/`).
- `/projects/` heading order jumps `h1` → `h3` (no `h2`).
- Project detail titles short (e.g. `Vellor | Projects` 17 chars) vs fuller section titles.
- Twitter card tags mostly use `property="twitter:*"` (with `name=` only for site/creator); conventional Twitter specification requires `name=`.

### 2. Content — 86/100

**Strengths**
- Approximate word counts 1.2k–2.8k on crawled pages — deep, non-marketing technical prose.
- Distinct first-person voice; project pages honest about scope (demo vs production, simulated vs real).
- Freshness cues via transmission dates in Article schema and sitemap `lastmod`.
- `llms.txt` and `llms-full.txt` provide machine-readable site maps and entity overviews for LLM discovery.

**Top issues (Verified)**
- Homepage duplicate H3 text "Currently Exploring" (appears in bento card and again in the popover modal).
- Pedagogy page: 20 YouTube thumbnail `<img alt="">` (empty) — requires `aria-hidden="true"` to clarify decorative intent inside labeled links.
- Homepage H1 ("Hey! Buddy. First-Principles Thinker.") is conversational vs formal brand positioning — intentional design trade-off.

### 3. Speed — unmeasured

**Why unmeasured:** PageSpeed Insights API calls for `https://dhaatrik.github.io/` (mobile/desktop) returned **HTTP 429 Too Many Requests**. Lighthouse CLI was not run during the gentle public crawl.

**Secondary evidence (curl timings & verified `dist/` payload sizes):**

| URL | TTFB (s) | Total (s) | Curl Size (bytes) | Local `dist/` Size (bytes) | Payload Status |
|-----|----------|-----------|-------------------|----------------------------|----------------|
| `/` | 0.090 | 0.246 | 168,898 | 168,894 | Match (within 4 bytes) |
| `/personnel/` | 0.075 | 0.094 | 159,668 | 159,664 | Match (within 4 bytes) |
| `/projects/` | 0.075 | 0.240 | 180,235 | 180,231 | Match (within 4 bytes) |
| `/pedagogy/` | 0.067 | 0.095 | 165,915 | 165,911 | Match (within 4 bytes) |
| `/transmissions/` | 0.074 | 0.098 | 230,207 | 230,203 | Match (within 4 bytes) |
| `/projects/vellor/` | 0.096 | 0.241 | 120,189 | 120,185 | Match (within 4 bytes) |
| `/transmissions/vellor-why-and-what/` | 0.080 | 0.245 | 151,371 | 151,367 | Match (within 4 bytes) |

*Engineering Interpretation:* Origin/CDN TTFB is low (~70–100 ms). Document sizes are 120–230 KB due to rich inlined SVGs (e.g. workbench and reticle schematics), KaTeX equations, pre-rendered bento structures, and preloaded fonts.

### 4. Accessibility — 80/100

**Limits:** Initial crawl was heuristic only. Automated Axe-core pass executed in repo via Playwright test suite (`test/e2e/accessibility.spec.ts`: 39/39 passing for critical/serious WCAG).

**Strengths**
- `lang="en"`; header/nav/main/footer landmarks; `#main-content` + skip link (`sr-only` / focus-visible).
- Theme toggle, mobile nav, return-to-top use `aria-label`; project GitHub links labeled; social icons labeled.
- Focus-visible ring classes widely present across interactive elements.
- Clean keyboard navigation with focus trapping in mobile navigation drawer.

**Top issues (Verified)**
- Heading level skip on `/projects/` (`h1` → `h3`) violates WCAG 1.3.1 (Info and Relationships - Moderate impact in Axe).
- Pedagogy YouTube thumbnails: `alt=""` is used within links that already have `aria-label` and visible `<h3>`. Needs `aria-hidden="true"` so automated checkers recognize decorative intent.

### 5. CRO — 58/100

**Strengths**
- Clear above-fold identity as engineering diary / first-principles thinker; featured projects link to detail pages and repos.
- High credibility: transparent failure logs ("fuckups and learnings"), Person `sameAs` (GitHub, LinkedIn, X, Medium), teaching history.
- Terminal-style social connect affordance (`~ $ connect --x` on personnel).

**Top issues (Verified)**
- **Zero mailto links, contact forms, or direct contact capture** sitewide.
- Homepage Content Security Policy enforces `form-action 'none'` (intentional; prevents any form submissions).
- Conversion intent is strictly content exploration rather than inbound pipeline generation.

### 6. Schema / structured data — 90/100

**Present & Parseable JSON-LD (Verified in `dist/`)**
- Home: `Person`, `FAQPage`, `WebSite`
- Section pages: `Person` + `BreadcrumbList` (+ `WebPage` on projects index)
- Project detail: `SoftwareSourceCode` + `BreadcrumbList`
- Transmissions: `Article` + `BreadcrumbList`
- Global author: `<link rel="author" href="/personnel/" />` and `Person` schema in `BaseHead.astro`

**Gaps & Corrections**
- `WebSite` lacks `potentialAction` / `SearchAction`. (Note: The site *does* have search on `/transmissions/` which can be linked via `SearchAction`).
- **Correction on F5:** Articles do **not** emit `"dateModified": null`. The property is cleanly omitted if unassigned.
- Optional schemas missing: `VideoObject` for pedagogy embeds, `ItemList` for project and transmission directories.

---

## Validated Findings Matrix

### P0 — Critical

*None.* Site is fully reachable over HTTPS, indexable, returns valid HTML, and executes 100% clean unit and E2E suites.

### P1 — High

| ID | Dim | Page(s) | Audit Evidence | Codebase Verification Status | Ground Truth & Implementation Rationale | Recommended Fix |
|:---|:---:|:--------|:---------------|:----------------------------:|:----------------------------------------|:----------------|
| **F1** | SEO | `/`, `/personnel/`, `/projects/`, `/pedagogy/`, `/transmissions/` | `og:image` = `.../blog-placeholder-4.jpg` | **VERIFIED (100% True)** | `BaseHead.astro` line 35 defaults to `FallbackImage`. The top 5 route templates don't pass an `image` prop. Bespoke graphics exist in `src/assets/og/` (e.g. `pedagogy-transmissions.jpg`) but were never connected. | Pass route-specific OG images into `<BaseHead image={...} />` for all hub routes. |
| **F2** | CRO | Sitewide (esp. `/`, `/personnel/`) | No `mailto:`, no contact form; CSP `form-action 'none'` | **VERIFIED (100% True)** | Grep across `src/` confirms 0 `mailto:` links. `BaseHead.astro` line 79 has `form-action 'none'`. Personnel page only offers `~ $ connect --x`. | Add direct contact channel (e.g. `mailto:` or contact page); update CSP if forms are ever used. |
| **F3** | SEO / A11y | `/projects/` | Heading jumps `h1` "Project Workbench & Archive" directly to `h3` project titles | **VERIFIED (100% True)** | In `src/pages/projects/index.astro`, line 379 is `<h1>` and line 424 is `<h3>`. No `<h2>` exists in the DOM. Violates WCAG 1.3.1. | Promote card titles to `<h2>` or add an `<h2>` section heading (e.g. "Active & Archived Projects"). |
| **F4** | A11y | `/pedagogy/` | 20× `<img ... alt="">` YouTube `mqdefault.jpg` thumbnails | **NUANCED (Context Missing)** | The `<img>` is nested inside an `<a>` with `aria-label={`${video.title}`}` and an adjacent visible `<h3>`. Setting duplicate `alt` causes screen readers to read the title twice. | Add `aria-hidden="true"` to `<img alt="" />` to explicitly mark it decorative for automated scanners. |
| **F5** | Schema | Some transmissions e.g. `/transmissions/my-ways-of-teaching/` | Claimed Article JSON-LD emits `"dateModified": null` | **FALSE POSITIVE (100% False)** | In `BlogPost.astro` line 49: `...(updatedDate && { dateModified: updatedDate.toISOString() })`. If `updatedDate` is undefined, the key is omitted entirely. `dist/` HTML has no nulls. The auditor's Python crawler returned `None` on `.get()` and misreported it. | No fix needed for nulls. Optionally set `dateModified = updatedDate || pubDate` if search engines request explicit modified dates. |

### P2 — Medium / Low

| ID | Dim | Page(s) | Audit Evidence | Codebase Verification Status | Ground Truth & Implementation Rationale | Recommended Fix |
|:---|:---:|:--------|:---------------|:----------------------------:|:----------------------------------------|:----------------|
| **F6** | Schema | `/` | WebSite JSON-LD missing `potentialAction` / `SearchAction` | **CLARIFIED** | Auditor noted "no on-site search UI observed". However, an interactive search UI exists on `/transmissions/` supporting `?q=` queries. | Add `potentialAction` to `WebSite` targeting `https://dhaatrik.github.io/transmissions/?q={search_term_string}`. |
| **F7** | SEO | Project detail pages | Titles like `Vellor \| Projects` (17 chars) | **VERIFIED (100% True)** | In `projects/[...slug].astro` line 99, `<BaseHead title={`${title} \| Projects`} />` produces truncated, unbranded titles. | Update to `${title} — ${subtitle} \| Dhaatrik Chowdhury` matching canonical SEO conventions. |
| **F8** | SEO | Sitewide Twitter tags | Uses `property="twitter:card"` instead of `name="twitter:card"` | **VERIFIED (100% True)** | `BaseHead.astro` lines 151–155 use OpenGraph `property=` syntax for Twitter cards. | Change `property="twitter:*"` to `name="twitter:*"` per Twitter developer guidelines. |
| **F9** | Content | `/` | Two identical H3s "Currently Exploring" in heading list | **VERIFIED (100% True)** | In `index.astro`, line 454 (bento card) and line 497 (popover modal) both declare `<h3>Currently Exploring</h3>`. | Change the popover heading to `<h3>Active Exploration Dossier</h3>` or similar. |
| **F10** | Speed | Multiple routes | HTML document size 120–230 KB | **VERIFIED (100% True)** | Measured sizes in `dist/` match curl transfer timings within 4 bytes. Driven by inline SVGs, KaTeX, and bento markup. | Optimize or externalize large inline SVGs where suitable; verify with PageSpeed Insights once unblocked. |
| **F11** | SEO | `/ai.txt` | Returns HTTP 404 | **VERIFIED (Benign)** | `/ai.txt` is an optional proposed standard. Site already has `llms.txt`, `llms-full.txt`, and crawler directives in `robots.txt`. | Optional; add `/ai.txt` pointing to `llms.txt` if desired. |
| **F12** | A11y | Unmeasured | No automated axe run in audit | **VERIFIED (Resolved Locally)** | The auditor lacked tooling. We ran `@axe-core/playwright` across 8 key routes via `npm run test:e2e` — 39 tests passed with 0 critical/serious violations. | Expand axe tests to cover `moderate` rules like `heading-order`. |

---

## Codebase Deep Research & Verification Details

### 1. Verification of F1 (OG Image Fallback)
Inspected [`src/components/BaseHead.astro`](file:///e:/E%20Drive%20Projects/00%20Github/dhaatrik.github.io/src/components/BaseHead.astro#L35):
```astro
const {
    title,
    description,
    image = FallbackImage, // blog-placeholder-4.jpg
...
```
None of `src/pages/index.astro`, `src/pages/personnel.astro`, `src/pages/projects/index.astro`, `src/pages/pedagogy.astro`, or `src/pages/transmissions/index.astro` pass an `image` prop to `<BaseHead />`. Consequently, all 5 primary hubs render `blog-placeholder-4.jpg` in their Open Graph and Twitter card meta tags.

### 2. Verification of F3 (Heading Hierarchy Skip)
Inspected [`src/pages/projects/index.astro`](file:///e:/E%20Drive%20Projects/00%20Github/dhaatrik.github.io/src/pages/projects/index.astro#L379-L424):
```astro
379: <h1 class="type-page-title mb-4 text-slate-900 dark:text-white">
380:     Project Workbench <span class="text-slate-400 dark:text-slate-600">& Archive</span>
381: </h1>
...
424: <h3 class="text-2xl leading-tight font-bold text-slate-900 transition-colors dark:text-white">
425:     <a href={`/projects/${projectIdClean}`}>
426:         {project.data.title}
427:     </a>
428: </h3>
```
There is no `<h2>` anywhere on the page. The heading tree skips level 2 completely.

### 3. Investigation & Refutation of F5 (`dateModified: null`)
Inspected [`src/layouts/BlogPost.astro`](file:///e:/E%20Drive%20Projects/00%20Github/dhaatrik.github.io/src/layouts/BlogPost.astro#L48-L50):
```typescript
datePublished: pubDate.toISOString(),
...(updatedDate && { dateModified: updatedDate.toISOString() }),
```
Inspected compiled production output in `dist/transmissions/my-ways-of-teaching/index.html`:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How I Teach: Bus Wheels, Kitchen Labs, and Open Skies",
  "description": "A mission log on my non-traditional teaching philosophy — sibling-centric tutoring, everyday observations, and why I stopped lecturing from a raised podium.",
  "image": "https://dhaatrik.github.io/_astro/pedagogy-transmissions.IIcQbmnC.jpg",
  "datePublished": "2026-06-16T00:00:00.000Z",
  "author": { "@type": "Person", "name": "Dhaatrik Chowdhury", "url": "https://dhaatrik.github.io" },
  "publisher": { "@type": "Person", "name": "Dhaatrik Chowdhury" },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://dhaatrik.github.io/transmissions/my-ways-of-teaching/" },
  "keywords": "pedagogy"
}
```
`dateModified` is **completely absent**, not `null`. A sitewide regex search for `"dateModified": null` returned 0 matches across both `src/` and `dist/`.

### 4. Investigation of F6 (On-site Search)
Inspected [`src/pages/transmissions/index.astro`](file:///e:/E%20Drive%20Projects/00%20Github/dhaatrik.github.io/src/pages/transmissions/index.astro#L436-L472):
The transmissions hub has a terminal search component with:
- `<input type="search" id="search-logs" ... />`
- Full client-side query matching with `history.replaceState` synchronizing `?q={query}`.
- Web CSS Custom Highlight API rendering on matches.
Thus, `SearchAction` is viable and can point directly to `/transmissions/?q={search_term_string}`.

---

## Prioritized Implementation Roadmap

### Phase 1: High-Impact SEO & Meta Refinements (Fast Wins)
1. **Fix F8 (Twitter Meta Attributes):** Change `<meta property="twitter:*">` to `<meta name="twitter:*">` in `src/components/BaseHead.astro`.
2. **Fix F7 (Enrich Project Titles):** In `src/pages/projects/[...slug].astro`, update `<BaseHead title="...">` to use descriptive, branded titles (`${title} — ${description_snippet} | Dhaatrik Chowdhury`).
3. **Fix F1 (Hub Open Graph Images):** Connect existing dedicated OG cards from `src/assets/og/` to `/`, `/personnel/`, `/projects/`, `/pedagogy/`, and `/transmissions/`.
4. **Fix F9 (Deduplicate H3):** Rename the popover modal heading on `src/pages/index.astro` to "Exploration Dossier".

### Phase 2: Accessibility & Structure Alignment
5. **Fix F3 (Projects Heading Hierarchy):** Promote project titles in `src/pages/projects/index.astro` from `<h3>` to `<h2>`, or insert descriptive `<h2>` section dividers.
6. **Polish F4 (Pedagogy Video Thumbs A11y):** Add `aria-hidden="true"` to `<img alt="" />` on `src/pages/pedagogy.astro` so automated a11y checkers recognize the thumbnail as intentionally decorative within the labeled link.

### Phase 3: Schema & Discovery Enhancements
7. **Address F6 (WebSite SearchAction):** Add `potentialAction` with `SearchAction` targeting `/transmissions/?q={search_term_string}` to `webSiteSchema` in `src/pages/index.astro`.
8. **Article Schema Fallback:** In `BlogPost.astro`, explicitly set `dateModified: (updatedDate || pubDate).toISOString()` to satisfy search engines that prefer an explicit last modification date on Articles.
9. **Conversion Affordance (F2):** Decide on a contact path (e.g. `mailto:` link in personnel header/footer) and adjust CSP if forms are ever introduced.

---

## Evidence & Verification Index

- **Source Code Files Analyzed:**
  - `src/components/BaseHead.astro`
  - `src/pages/index.astro`
  - `src/pages/personnel.astro`
  - `src/pages/projects/index.astro`
  - `src/pages/projects/[...slug].astro`
  - `src/pages/pedagogy.astro`
  - `src/pages/transmissions/index.astro`
  - `src/layouts/BlogPost.astro`
  - `src/content.config.ts`
  - `public/robots.txt`, `public/llms.txt`, `public/llms-full.txt`
- **Build Output Verification:** `dist/` (53 pages generated via `astro build` in 9.23s).
- **Test Suite Results:**
  - `npm test`: 122/122 passing (Node test runner).
  - `npm run test:e2e`: 39/39 passing (Playwright + Axe-core).
