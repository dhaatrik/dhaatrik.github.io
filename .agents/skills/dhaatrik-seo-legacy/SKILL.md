---
name: dhaatrik-seo-legacy
description: Use this skill for honest, long-term SEO, structured data, meta descriptions, Open Graph images, sitemap/RSS optimization, and discoverability work on dhaatrik.github.io. Focus on future readers finding genuine engineering reflections rather than marketing. Always combine with dhaatrik-writing-style, dhaatrik-mission-report, dhaatrik-astro-site, and dhaatrik-visual-system skills.
---

# Dhaatrik SEO Legacy Skill — Honest Discoverability for Future Engineers

**Core Purpose:** This skill ensures that in 5, 10, or 20 years, curious people searching for real engineering stories, fuckups, first-principles thinking, or specific technical problems can still find your honest transmissions. It prioritizes authentic discoverability over vanity metrics.

## When to Activate This Skill
- Writing or updating meta titles/descriptions for pages and posts
- Adding or improving structured data (JSON-LD)
- Optimizing Open Graph / social sharing cards
- Working with sitemap, RSS, or robots.txt
- Improving semantic HTML and accessibility (which directly helps SEO)
- Planning content series or tag strategy for long-term findability
- Any task involving "SEO", "meta", "structured data", or "discoverability"

**Mandatory Pairing:** Always combine with:
- `dhaatrik-writing-style` (honest, brotherly meta copy)
- `dhaatrik-mission-report` (when optimizing project pages)
- `dhaatrik-astro-site` (technical implementation in Astro)
- `dhaatrik-visual-system` (OG image design)

Skill routing: [`AGENTS.md`](../../../AGENTS.md).

## Core Principles of "Legacy SEO"
1. **Honest Over Optimized** — Meta descriptions should accurately reflect the real story (including struggles), not bait clicks.
2. **Future-Proof Discoverability** — Focus on topics that will still matter: first-principles thinking, real engineering failures, aerospace simulations, offline tools, teaching philosophy, etc.
3. **Structured Data as Trust Signals** — Use JSON-LD to clearly describe what the content is (Person, TechArticle, FAQ, etc.).
4. **Semantic HTML Matters** — Proper headings, article tags, and ARIA help both accessibility and search engines.
5. **GitHub Pages Reality** — All solutions must work with static generation. No server-side rendering tricks.
6. **Long-Term Value > Short-Term Traffic** — We are building a public archive, not a growth engine.

## Structured Data Templates (JSON-LD)

### Person + WebSite (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dhaatrik Chowdhury",
  "description": "Engineer documenting honest building journeys, fuckups, and first-principles learnings.",
  "url": "https://dhaatrik.github.io",
  "sameAs": ["https://x.com/dhaatrik"]
}
```

### TechArticle / BlogPosting (Transmissions)
Use on individual blog posts and project pages. Include:
- `headline`
- `description` (match the honest meta description)
- `datePublished`
- `author` (Person)
- `keywords` (learning-focused tags)
- `articleSection` (e.g., "Fuckups & Learnings")

### FAQPage
Use on pages with clear Q&A sections (especially pedagogy or complex project explanations).

## Meta Description Guidelines
- Length: 150–160 characters ideal.
- Must sound like **you** talking to a friend.
- Should hint at the real story (including challenges).
- Examples:
  - Good: "How I completely broke the orbital simulator at 3 AM and what the crash taught me about deterministic physics."
  - Bad: "Learn how to build high-performance aerospace simulations in the browser."

Always write meta descriptions in the brotherly voice using the `dhaatrik-writing-style` skill.

## Open Graph & Social Cards
- Create custom OG images for major posts (use the visual-system skill).
- Recommended dimensions: 1200×630px.
- Include title + subtle status/telemetry line + your branding.
- Use Astro Image optimization for the final OG image.
- Set `og:type`, `og:title`, `og:description`, `og:image`, `og:url` properly in `BaseHead.astro`.

## Technical Implementation in Astro
- **Sitemap**: Already using `@astrojs/sitemap` — keep it updated. Add priority and changefreq thoughtfully.
- **RSS**: Already using `@astrojs/rss` — ensure new posts appear automatically.
- **Canonical URLs**: Set proper canonicals, especially if content ever moves.
- **robots.txt**: Keep simple and permissive for a personal archive.
- **Semantic Structure**: Use `<article>`, proper heading hierarchy (`h1` → `h2` → `h3`), and `role` attributes where helpful.
- **Internal Linking**: Link generously between related Mission Reports and Transmissions (helps discovery).

## Content Strategy for Legacy
- Use meaningful `series` and `tags` that reflect learnings (e.g., "first-principles", "fuckups", "deterministic-simulation").
- Create "hub" pages over time (e.g., "All Aerospace Missions", "Teaching Philosophy").
- Keep old content updated with `updatedDate` when meaningful changes occur.

## Workflow When Using This Skill
1. Write the actual content first (using writing-style + mission-report).
2. Craft an honest meta description.
3. Add appropriate structured data.
4. Design or update OG image (with visual-system).
5. Verify in `BaseHead.astro` or page head.
6. Test with Google Rich Results Test and social card validators.
7. Run `npm run build` and check the generated sitemap/RSS.

## Pro Tips for Agents
- When the user says "improve SEO", first ask: "Do we want short-term traffic or long-term discoverability for genuine readers?"
- Never suggest keyword stuffing or clickbait titles.
- For project pages, the strongest SEO signal is often the honest "fuckups & learnings" section — lean into that.
- Structured data should describe reality, not exaggerate it.
- In 20 years, the best thing we can do for discoverability is to have written clearly and honestly in the first place.

**Higher Purpose**: This is not about ranking. It is about making sure that when someone in the future searches for real stories of building, failing, and learning, they can still find these transmissions. We are planting seeds for future curious minds.

Stay honest. Stay findable. Keep transmitting. 🚀