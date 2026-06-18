# dhaatrik.github.io — Agent Instructions

Astro 6 static site (GitHub Pages). Project-scoped skills live in [`.agents/skills/`](.agents/skills/). **Read the relevant skill(s) before starting work** — Grok, Antigravity, and Cursor-compatible harnesses discover them automatically when not gitignored.

Quick reference for SEO/AEO/GEO/LLM rules: [`GEMINI.md`](GEMINI.md) → canonical detail in **`dhaatrik-seo-legacy`**.

## Skill routing

| Task | Skill(s) to load |
|------|------------------|
| Any user-facing copy (tone, voice, microcopy) | [`dhaatrik-writing-style`](.agents/skills/dhaatrik-writing-style/SKILL.md) |
| Project pages, transmissions, Mission Report structure | [`dhaatrik-mission-report`](.agents/skills/dhaatrik-mission-report/SKILL.md) + `dhaatrik-writing-style` |
| Astro code, components, builds, tests, performance | [`dhaatrik-astro-site`](.agents/skills/dhaatrik-astro-site/SKILL.md) |
| UI polish, glassmorphism, tokens, animations | [`dhaatrik-visual-system`](.agents/skills/dhaatrik-visual-system/SKILL.md) + `dhaatrik-astro-site` |
| SEO, AEO, GEO, LLM visibility, meta, JSON-LD, `llms.txt` | [`dhaatrik-seo-legacy`](.agents/skills/dhaatrik-seo-legacy/SKILL.md) + `dhaatrik-writing-style` |

### Combined workflows

- **New transmission or project write-up:** `dhaatrik-writing-style` → `dhaatrik-mission-report` → `dhaatrik-seo-legacy` (meta + `llms.txt` + schema)
- **New page or component:** `dhaatrik-astro-site` → `dhaatrik-visual-system` → `dhaatrik-writing-style` (copy) → `dhaatrik-seo-legacy` (meta + llms index)
- **Homepage / personnel / pedagogy copy pass:** `dhaatrik-writing-style` + `dhaatrik-seo-legacy`
- **Design refresh or bento card:** `dhaatrik-visual-system` + `dhaatrik-astro-site`
- **SEO/AEO/GEO audit:** `dhaatrik-seo-legacy` → `dhaatrik-astro-site` (verify BaseHead, JSON-LD, robots)

Slash commands (Grok): `/dhaatrik-writing-style`, `/dhaatrik-mission-report`, `/dhaatrik-astro-site`, `/dhaatrik-visual-system`, `/dhaatrik-seo-legacy`

## Project skills (all)

| Skill | Purpose |
|-------|---------|
| [`dhaatrik-writing-style`](.agents/skills/dhaatrik-writing-style/SKILL.md) | Brotherly-teacher voice, first-person diary, AEO voice guardrails |
| [`dhaatrik-mission-report`](.agents/skills/dhaatrik-mission-report/SKILL.md) | Mission Report structure, metadata blocks, tables/diagrams |
| [`dhaatrik-astro-site`](.agents/skills/dhaatrik-astro-site/SKILL.md) | Astro 6 architecture, JSON-LD injection, BaseHead, testing |
| [`dhaatrik-visual-system`](.agents/skills/dhaatrik-visual-system/SKILL.md) | Sci-fi mission-control aesthetic, tokens, OG image design |
| [`dhaatrik-seo-legacy`](.agents/skills/dhaatrik-seo-legacy/SKILL.md) | SEO + AEO + GEO + LLM visibility (`llms.txt`, robots, schema) |

Index: [`.agents/README.md`](.agents/README.md)

## Engineering defaults

- Run `npm run build`, `npm test`, and `npm run test:e2e` before considering work done.
- Match existing patterns in `src/`; avoid drive-by refactors.
- Content schemas: [`src/content.config.ts`](src/content.config.ts).
- Stack: Astro 6 SSG, Tailwind v4, vanilla JS where possible, Playwright E2E + Node test runner.

## Voice reminder

This site is an **honest engineering diary**, not a marketing portfolio. Default to **I/you**, Mission Report structure, and transparent learnings — never third-person case-study prose in body copy (JSON-LD / `llms-full.txt` entity blocks excepted).