# AI Assistant Rules — SEO, GEO, AEO, and LLM Visibility

> **Canonical agent instructions:** [`AGENTS.md`](AGENTS.md) and [`.agents/skills/dhaatrik-seo-legacy/SKILL.md`](.agents/skills/dhaatrik-seo-legacy/SKILL.md)
>
> This file is a quick reference for Gemini / Antigravity. Executable checklists, workflows, and voice rules live in the project skills below.

## Skill map (GEMINI rules → agent skills)

| Topic                                                                   | Skill                                                                        |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| SEO, AEO, GEO, LLM visibility, `llms.txt`, robots, JSON-LD strategy     | [`dhaatrik-seo-legacy`](.agents/skills/dhaatrik-seo-legacy/SKILL.md)         |
| Astro JSON-LD injection, `BaseHead`, sitemap, static files              | [`dhaatrik-astro-site`](.agents/skills/dhaatrik-astro-site/SKILL.md)         |
| Transmission metadata blocks, Mission Report structure, tables/diagrams | [`dhaatrik-mission-report`](.agents/skills/dhaatrik-mission-report/SKILL.md) |
| Honest voice in meta, schema prose, llms summaries                      | [`dhaatrik-writing-style`](.agents/skills/dhaatrik-writing-style/SKILL.md)   |

## Quick rules (summary)

1. **LLM files** — Update `public/llms.txt` and `public/llms-full.txt` when pages/posts/projects change.
2. **robots.txt** — Keep AI crawlers allowed (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, etc.).
3. **Meta** — Every route: `title`, `description`, `keywords`, dynamic `og:type` via `BaseHead`.
4. **AEO/GEO** — Question-style phrasing in JSON-LD / `llms-full.txt`; Mission Report H2s in body prose.
5. **JSON-LD** — Homepage: `WebSite` + `FAQPage`; posts: `Article`; use `set:html` pattern in Astro.
6. **Semantics** — One `h1`, proper heading order, semantic HTML, descriptive image `alt`.

Full checklists and conflict resolution (FAQ headers vs Mission Report): see **`dhaatrik-seo-legacy`**.
