---
name: dhaatrik-seo-legacy
description: >
    Use for SEO, AEO, GEO, and LLM visibility on dhaatrik.github.io — meta titles/descriptions,
    JSON-LD, Open Graph, llms.txt, llms-full.txt, robots.txt, sitemap/RSS, semantic HTML,
    FAQ schema, transmission discoverability, and honest long-term findability. Triggers: SEO,
    AEO, GEO, meta tags, structured data, llms.txt, LLM visibility, answer engine, generative
    search, robots.txt, JSON-LD, OG image, discoverability. Pair with dhaatrik-writing-style,
    dhaatrik-mission-report, dhaatrik-astro-site, dhaatrik-visual-system.
---

# Dhaatrik SEO Legacy Skill — Honest Discoverability (SEO + AEO + GEO + LLM)

**Core Purpose:** In 5–20 years, curious engineers should still find these honest transmissions via search engines _and_ AI answer systems. Prioritize authentic discoverability over vanity metrics. Canonical rules also lived in [`GEMINI.md`](../../../GEMINI.md) — this skill is the agent-executable version.

Skill routing: [`AGENTS.md`](../../../AGENTS.md).

## When to Activate

- Writing or updating meta titles/descriptions
- Adding or improving JSON-LD (WebSite, FAQPage, Article, BreadcrumbList, Person)
- Open Graph / Twitter cards
- `public/llms.txt` or `public/llms-full.txt`
- `public/robots.txt` AI crawler policy
- Sitemap, RSS, canonical URLs
- Semantic HTML, heading hierarchy, image `alt`
- Content tags/series strategy for long-term findability
- Any task mentioning SEO, AEO, GEO, LLM visibility, or discoverability

**Mandatory pairing:** `dhaatrik-writing-style` (honest voice in all meta/AEO copy), `dhaatrik-mission-report` (project pages), `dhaatrik-astro-site` (implementation), `dhaatrik-visual-system` (OG images).

---

## Core principles

1. **Honest over optimized** — Meta and schema describe reality, including struggles.
2. **Future-proof topics** — First-principles thinking, real failures, aerospace sims, offline tools, teaching philosophy.
3. **Layered discoverability** — Traditional SEO + structured data + LLM index files work together.
4. **Static GitHub Pages** — No SSR tricks; everything must survive `astro build`.
5. **Long-term archive > growth hacking** — No keyword stuffing or clickbait.

---

## 1. LLM visibility and crawlability

### `llms.txt` and `llms-full.txt` (required on content changes)

Whenever you add or modify a **page, section, blog post, or project**:

| File                                                    | Update                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------ |
| [`public/llms.txt`](../../../public/llms.txt)           | Short index entry (title + one-line honest description + URL)      |
| [`public/llms-full.txt`](../../../public/llms-full.txt) | Fuller summary: key sections, entities, learnings, technical notes |

**Checklist after any new route or transmission:**

- [ ] Entry in `llms.txt` under correct section (Core Pages / Transmissions / Projects)
- [ ] Matching expanded block in `llms-full.txt`
- [ ] Agent skills section still accurate if skills changed
- [ ] `npm run build` — files copy to `dist/`

### `robots.txt`

Location: [`public/robots.txt`](../../../public/robots.txt)

- Default: `User-agent: *` → `Allow: /`
- **Explicitly allow** AI crawlers: `Google-Extended`, `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`, `Applebot-Extended`, `CCBot`, `Bingbot`, etc.
- Include `Sitemap: https://dhaatrik.github.io/sitemap-index.xml`
- Do not block `/transmissions/` or `/projects/` for AI agents

### Global meta (via `BaseHead.astro`)

Every route must pass `title` and `description` to [`BaseHead`](../../../src/components/BaseHead.astro):

- `<meta name="author" content="Dhaatrik Chowdhury" />` — always set
- `<meta name="keywords" ... />` — pass relevant `keywords` prop per page
- `og:type` — `article` for blog posts/transmissions, `website` for static pages
- Canonical URL, OG image, Twitter cards — already in BaseHead; verify on new pages

---

## 2. AEO and GEO (answer / generative engine optimization)

### The heading rule (resolves Mission Report vs FAQ conflict)

| Layer                             | Format                          | Example                                           |
| --------------------------------- | ------------------------------- | ------------------------------------------------- |
| **Body prose (H2/H3)**            | Mission Report structure        | `## Why I started this`, `## Fuckups & learnings` |
| **JSON-LD / FAQPage / llms-full** | Natural-language Q&A            | "Why did DBS Classes stop uploading?"             |
| **Transmission metadata block**   | Terminal quick-reference at top | See `dhaatrik-mission-report`                     |

**Do not** turn entire posts into FAQ-style H3 question headings. Use question phrasing in **schema and LLM index files**, not as the main narrative structure.

### Transmission metadata blocks

Required at top of every transmission (blog post). See `dhaatrik-mission-report` for the fenced template (`TRANSMISSION METADATA`, entity, dates, root cause, key lesson).

### Citation authority (GEO)

- Quote core principles, academic sources, or official docs where relevant
- Link to primary sources (GitHub repos, specs, textbooks)
- Verification-weighted generative search favors **attributed, checkable** claims
- Write in `dhaatrik-writing-style` voice — not Wikipedia tone

### Data structuring for AI parsing

Prefer over walls of prose:

- Comparison **tables** (before/after, options considered, metrics)
- **Mermaid** or styled ASCII for pipelines/architectures
- Bulleted learnings with clear cause → effect

---

## 3. Structured data (JSON-LD)

### Homepage (`index.astro`)

Inject in `<head>`:

- `WebSite` — name, URL, publisher
- `FAQPage` — dynamic Q&A matching real user queries (third-person OK in schema only)

### Blog posts / transmissions (`BlogPost.astro`)

- `Article` / `BlogPosting` — headline, description, datePublished, author, image
- `BreadcrumbList` — Home → Transmissions → post title

### Project pages

- Article-style or `TechArticle` where appropriate
- Person as author

### Astro injection pattern (mandatory)

Build JSON in frontmatter script; inject safely — **never** use `define:vars` or broken inline templates:

```astro
---
const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dhaatrik Chowdhury',
    url: 'https://dhaatrik.github.io',
};
const jsonLd = JSON.stringify(schema).replace(/</g, '\\u003c');
---

<script type="application/ld+json" set:html={jsonLd} />
```

Implementation details: `dhaatrik-astro-site` skill.

### Schema copy voice

- JSON-LD descriptions: factual, warm, honest — can be third-person
- Visible meta descriptions: first-person per `dhaatrik-writing-style`

---

## 4. Traditional SEO

- **One `<h1>` per page**; sequential `h2` → `h6`
- Semantic tags: `<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`
- **Descriptive `alt` on every image** (Astro `<Image>` and `<Picture>`)
- Internal links between related transmissions and project mission logs
- Sitemap: `@astrojs/sitemap` — verify new routes appear after build
- RSS: [`src/pages/rss.xml.js`](../../../src/pages/rss.xml.js) — new posts auto-included
- Canonical URLs on all pages via BaseHead

### Meta description guidelines

- Length: ~150–160 characters ideal
- Must sound like **you** talking to a friend; hint at real struggle
- Good: "How I broke the orbital sim at 3 AM and what deterministic RK4 taught me."
- Bad: "Learn to build high-performance aerospace simulations in the browser."

---

## 5. Open Graph and social

- Dimensions: 1200×630px for major posts
- Title + subtle telemetry line + branding (`dhaatrik-visual-system`)
- Set `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Test with social card validators after changes

---

## 6. Content strategy for legacy findability

- Tags reflect **learnings**: `first-principles`, `fuckups`, `aerospace`, `pedagogy`
- Use `series` for related transmissions
- Set `updatedDate` when meaningful edits occur
- Project "fuckups & learnings" sections are high-value SEO/AEO signals — keep them prominent

---

## 7. Ship checklist

Run after SEO/AEO/GEO/LLM work:

1. [ ] Content written (`dhaatrik-writing-style` + `dhaatrik-mission-report`)
2. [ ] Honest meta title + description on every touched route
3. [ ] JSON-LD valid (no `define:vars` breakage)
4. [ ] `llms.txt` + `llms-full.txt` updated
5. [ ] `robots.txt` still permits AI crawlers
6. [ ] Images have `alt` text
7. [ ] `npm run build` — check `dist/sitemap-index.xml`, `dist/llms.txt`
8. [ ] Optional: Google Rich Results Test, social card preview

---

## Pro tips for agents

- When user says "improve SEO", clarify: short-term traffic vs long-term discoverability for genuine readers
- Never suggest keyword stuffing or clickbait
- AEO Q&A belongs in schema and `llms-full.txt`, not as FAQ headings throughout body copy
- In 20 years, clarity and honesty in the first draft is the best optimization

**Higher purpose:** Plant seeds for future curious minds searching for real stories of building, failing, and learning.

Stay honest. Stay findable. Keep transmitting.
