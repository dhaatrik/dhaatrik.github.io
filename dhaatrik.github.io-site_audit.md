# Site Audit Report — dhaatrik.github.io

**Date:** 2026-09-05 (Asia/Calcutta)  
**Site:** https://dhaatrik.github.io  
**Auditor:** Site Audit bot (first full baseline)  
**Scope:** Gentle public crawl — homepage, nav tops, one example of each public template (15 HTML pages). Cap 30.  
**Method:** HTML/header fetch (curl/urllib), sitemap/robots discovery, JSON-LD parse, curl TTFB timings. PageSpeed Insights API attempted (HTTP 429). No live site changes. No invented lab/traffic metrics.

---

## Executive summary

Overall **80 / 100** (average of five measured dimensions; **Speed excluded** because PSI/Lighthouse could not be measured — API returned **429 Too Many Requests**).

The site is a strong personal engineering portfolio/blog: HTTPS + HSTS, solid canonicals, unique titles/meta descriptions, rich unique copy, good landmark structure, skip link, and mature structured data (Person, WebSite, FAQPage, Article, SoftwareSourceCode, BreadcrumbList). Main gaps: **no measurable lab speed scores this run**, **weak conversion path** (no mailto/contact form; CSP `form-action 'none'`), **generic Open Graph image on top-level pages**, **heading-level skip on /projects/**, **empty alt on pedagogy YouTube thumbnails**, and some **Article `dateModified: null`**.

| Dimension | Score | Notes |
|-----------|------:|-------|
| 1. SEO technical | **84** | Strong fundamentals; OG placeholder + short project titles + h1→h3 on projects |
| 2. Content | **86** | Unique, substantive; minor duplicate H3 / alt quality on pedagogy thumbs |
| 3. Speed | **unmeasured** | PSI 429; curl TTFB only (secondary) |
| 4. Accessibility | **80** | Landmarks/skip/lang/ARIA good; heuristic only (no axe); empty alts on thumbs |
| 5. CRO | **58** | Clear diary positioning; weak primary CTA / no contact capture |
| 6. Schema / structured data | **90** | Broad valid JSON-LD; SearchAction missing; some null dateModified |
| **Overall (excl. Speed)** | **80** | Equal weight of SEO, Content, A11y, CRO, Schema = (84+86+80+58+90)/5 |

---

## Per-dimension scores and top issues

### 1. SEO technical — 84/100

**Strengths**
- HTTPS with `strict-transport-security: max-age=31556952` (evidence: `evidence/2026-09-05/homepage-headers.txt`).
- Unique `<title>` and meta description on all 15 crawled pages; single H1 each; `lang="en"`; mobile viewport present.
- Canonical URLs present and trailing-slash normalized (e.g. `/personnel` → `/personnel/`).
- `robots.txt` allows `/`, points to sitemaps; Disallow `/404`; 404 response is HTTP 404 with `noindex` in HTML.
- Sitemap: 52 URLs in `sitemap.xml` / `sitemap-0.xml`; `sitemap-index.xml` present.
- Open Graph + Twitter tags present sitewide; Google site verification meta present.
- RSS + `llms.txt` for discovery.

**Top issues**
- Top-level pages share OG/Twitter image `.../blog-placeholder-4.gLBdjEDe.jpg` (homepage, personnel, projects, pedagogy, transmissions).
- `/projects/` heading order jumps h1 → h3 (no h2).
- Project detail titles short (e.g. `Vellor | Projects` 17 chars) vs fuller section titles.
- Twitter card tags mostly use `property="twitter:*"` (with `name=` only for site/creator); usually accepted but `name=` is the conventional Twitter form.

### 2. Content — 86/100

**Strengths**
- Approximate word counts 1.2k–2.8k on crawled pages — not thin.
- Distinct voice; project pages honest about scope (demo vs production).
- Freshness cues via transmission dates in Article schema and sitemap `lastmod` (2026-08-30).
- `llms.txt` provides machine-readable site map of content.

**Top issues**
- Pedagogy page: **20** YouTube thumbnail `<img alt="">` (empty) — weak alternative text if not fully described by adjacent link text.
- Homepage duplicate H3 text "Currently Exploring" (appears twice in heading list).
- Homepage H1 ("Hey! Buddy. First-Principles Thinker.") is conversational vs title/brand positioning — clarity tradeoff, not necessarily wrong.

### 3. Speed — unmeasured

**Why unmeasured:** PageSpeed Insights API calls for `https://dhaatrik.github.io/` (mobile/desktop) returned **HTTP 429 Too Many Requests** (see `evidence/2026-09-05/psi-error.txt`, `psi-links.txt`). Lighthouse CLI / Chromium not run in this environment. **No Performance/LCP/CLS scores are reported.**

**Secondary evidence only (curl transfer timings — NOT Lighthouse):** `evidence/2026-09-05/curl-timings.txt`

| URL | TTFB (s) | Total (s) | Size (bytes) |
|-----|----------|-----------|--------------|
| / | 0.090 | 0.246 | 168898 |
| /personnel/ | 0.075 | 0.094 | 159668 |
| /projects/ | 0.075 | 0.240 | 180235 |
| /pedagogy/ | 0.067 | 0.095 | 165915 |
| /transmissions/ | 0.074 | 0.098 | 230207 |
| /projects/vellor/ | 0.096 | 0.241 | 120189 |
| /transmissions/vellor-why-and-what/ | 0.080 | 0.245 | 151371 |

Interpretation limited to: origin/CDN TTFB is low (~70–100 ms from this audit host); HTML documents are relatively large (120–230 KB). **Do not treat as Core Web Vitals.**

### 4. Accessibility — 80/100

**Limits:** HTML/heuristic audit only. **axe / Lighthouse accessibility category not run** (PSI 429; no axe CLI). Contrast not instrumented.

**Strengths**
- `lang="en"`; header/nav/main/footer landmarks; `#main-content` + skip link ("Skip to content", `sr-only` / focus-visible).
- Theme toggle, mobile nav, return-to-top use `aria-label`; project GitHub links labeled; social icons labeled (e.g. `Follow on X (Twitter) (opens in a new tab)`).
- Focus-visible ring classes widely present in markup.
- Empty `alt=""` on logos likely decorative (paired light/dark).

**Top issues**
- Pedagogy: 20 empty-alt YouTube thumbnails (`img.youtube.com/.../mqdefault.jpg`).
- Heading level skip on `/projects/` (h1→h3) affects outline.
- Contrast, keyboard trap, and live region behavior not verified without browser tooling. No screenshots (no browser MCP in executor).

### 5. CRO — 58/100

**Strengths**
- Clear above-fold identity as engineering diary / first-principles thinker; featured projects with paths to detail + GitHub.
- Trust: honest project scope, Person sameAs (GitHub, LinkedIn, X, Medium), teaching pedigree on personnel/pedagogy, FAQ schema on home.
- Social connect affordances (`~ $ connect --x` etc. on personnel).

**Top issues**
- **No mailto, contact form, Calendly, or "hire/contact" CTA** on crawled pages. Homepage CSP includes `form-action 'none'` (intentional; blocks forms).
- Primary conversion intent ambiguous (follow vs hire vs try apps) — strongest CTAs are "Explore More Projects" / "Inspect Repository", not lead capture.
- No email capture / newsletter beyond RSS.

### 6. Schema / structured data — 90/100

**Present & parseable JSON-LD (samples validated)**
- Home: `Person`, `FAQPage`, `WebSite`
- Section pages: `Person` + `BreadcrumbList` (+ `WebPage` on projects index)
- Project templates: `SoftwareSourceCode` (name, codeRepository, license, etc.)
- Transmissions: `Article` (headline, datePublished, author, image, mainEntityOfPage)

**Gaps**
- `WebSite` lacks recommended `potentialAction` / `SearchAction` (site has no on-site search UI observed).
- Some Articles emit `"dateModified": null` (e.g. my-ways-of-teaching, why-i-started-dbs-classes).
- Optional types not present: `Organization`, `ItemList` for project/transmission indexes, `VideoObject` for pedagogy embeds.

---

## Findings

### P0 — Critical

_None._ Site is reachable over HTTPS, indexable, and returns coherent HTML for primary routes. No P0 indexing or security breakage found in crawl scope.

### P1 — High

| ID | Dim | Page(s) | Evidence | Recommended fix |
|----|-----|---------|----------|-----------------|
| F1 | SEO | `/`, `/personnel/`, `/projects/`, `/pedagogy/`, `/transmissions/` | `og:image` / `twitter:image` = `https://dhaatrik.github.io/_astro/blog-placeholder-4.gLBdjEDe.jpg` (homepage HTML head) | Replace with page-specific share images (photo / brand card); keep ≥1200×630. |
| F2 | CRO | Sitewide (esp. `/`, `/personnel/`) | No `mailto:` / contact form; CSP `form-action 'none'` in homepage `<meta http-equiv="Content-Security-Policy">`; no Hire/Contact CTA strings | Add explicit contact path (email link or external form) and a single primary CTA above the fold if lead-gen matters; adjust CSP if forms added. |
| F3 | SEO / A11y | `/projects/` | Headings: h1 "Project Workbench & Archive" then h3 project names (no h2) | Insert h2 section labels (e.g. Active / Archive) or promote project titles to h2. |
| F4 | A11y | `/pedagogy/` | 20× `<img ... alt="">` YouTube `mqdefault.jpg` thumbs | Set meaningful `alt` (video title) or ensure adjacent text is the accessible name and mark decorative only when redundant. |
| F5 | Schema | Some transmissions e.g. `/transmissions/my-ways-of-teaching/` | Article JSON-LD `"dateModified": null` | Omit `dateModified` when unknown, or set equal to `datePublished` / real modified date. |

### P2 — Medium / low

| ID | Dim | Page(s) | Evidence | Recommended fix |
|----|-----|---------|----------|-----------------|
| F6 | Schema | `/` | WebSite JSON-LD missing `potentialAction` | Add SearchAction only if search exists; else document as N/A. |
| F7 | SEO | Project detail pages | Titles like `Vellor \| Projects` (17 chars) | Align with pattern `Vellor — tutoring PWA \| Dhaatrik Chowdhury`. |
| F8 | SEO | Sitewide Twitter tags | `property="twitter:card"` etc. (homepage head); `name=` used for site/creator only | Prefer `name="twitter:card|title|description|image"` for consistency. |
| F9 | Content | `/` | Two H3s "Currently Exploring" in heading extract | Deduplicate heading or differentiate labels. |
| F10 | Speed (secondary) | Multiple | HTML 120–230 KB (`curl-timings.txt`) | After PSI works: check unused CSS/JS, image weight; not scored this run. |
| F11 | Content / SEO | `/ai.txt` | HTTP 404 | Optional; add or remove references if any. |
| F12 | A11y | Unmeasured | No axe/Lighthouse a11y run | Re-run PSI or axe when rate limit clears; verify contrast in dark/light themes. |

---

## Page inventory crawled (15 HTML)

1. https://dhaatrik.github.io/  
2. https://dhaatrik.github.io/personnel/  
3. https://dhaatrik.github.io/projects/  
4. https://dhaatrik.github.io/pedagogy/  
5. https://dhaatrik.github.io/transmissions/  
6. https://dhaatrik.github.io/projects/vellor/  
7. https://dhaatrik.github.io/projects/deltav-lab/  
8. https://dhaatrik.github.io/projects/fueldrop/  
9. https://dhaatrik.github.io/projects/the-infinite-intelligence/  
10. https://dhaatrik.github.io/projects/bill-express/  
11. https://dhaatrik.github.io/projects/glassbox/  
12. https://dhaatrik.github.io/transmissions/infinite-intelligence-why-and-what/  
13. https://dhaatrik.github.io/transmissions/my-ways-of-teaching/  
14. https://dhaatrik.github.io/transmissions/why-i-started-dbs-classes/  
15. https://dhaatrik.github.io/transmissions/vellor-why-and-what/  

**Also fetched:** robots.txt, sitemap.xml, sitemap-index.xml, sitemap-0.xml, rss.xml, llms.txt, `/ai.txt` (404), synthetic 404 URL.  
**Sitemap declares 52 URLs** — not all fetched (scope cap / template sampling).

Baseline metadata: `baseline/page-inventory.json`, `baseline/titles-meta.json`, `baseline/page-hashes.json`, `baseline/sitemap-urls.json`, `baseline/deep-signals.json`, `baseline/homepage-head-truncated.html`.

---

## Unmeasured items

| Item | Why |
|------|-----|
| Speed / Lighthouse / PSI category scores | PSI API HTTP **429**; no Lighthouse CLI run |
| axe-core / automated a11y violations | Tool not available; PSI a11y category also blocked |
| Screenshots | No browser/computerUse MCP in this executor |
| Real-user CWV, Search Console, traffic, rankings, conversion rates | Not in scope / not available — **not invented** |
| Full 52-URL sitemap crawl | Scope: ~15 pages + template samples |

---

## Next actions (recommendations only — not applied)

1. Re-run PageSpeed Insights (mobile + desktop) when quota allows; save JSON under `evidence/`.
2. Ship unique OG images for home + four nav hubs.
3. Decide CRO goal: if leads matter, add one clear Contact CTA + email or external form (and CSP update).
4. Fix `/projects/` heading hierarchy; enrich project `<title>` tags.
5. Fill pedagogy YouTube thumbnail `alt` text; clean Article `dateModified: null`.
6. Optional: axe + keyboard pass on home, personnel, pedagogy, one article.

---

## Evidence index

- `evidence/2026-09-05/homepage.html`, `homepage-headers.txt`
- `evidence/2026-09-05/curl-timings.txt`
- `evidence/2026-09-05/psi-error.txt`, `psi-links.txt`
- `evidence/2026-09-05/robots.txt`, `sitemap.xml`
- `evidence/2026-09-05/page-*.html` (truncated per-URL snapshots)
- `evidence/2026-09-05/screenshots-note.txt`

*Read-only audit. No fixes were applied to the live site.*
