# dhaatrik.github.io — Agent Instructions

Astro 6 static site (GitHub Pages). Project-scoped skills live in [`.agents/skills/`](.agents/skills/). **Read the relevant skill(s) before starting work** — Grok, Antigravity, and Cursor-compatible harnesses discover them automatically when not gitignored.

Canonical detail for SEO/AEO/GEO/LLM rules lives in **[`dhaatrik-seo-legacy`](.agents/skills/dhaatrik-seo-legacy/SKILL.md)**.

## Skill routing

| Task                                                     | Skill(s) to load                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Any user-facing copy (tone, voice, microcopy)            | [`dhaatrik-writing-style`](.agents/skills/dhaatrik-writing-style/SKILL.md)                              |
| Project pages, transmissions, Mission Report structure   | [`dhaatrik-mission-report`](.agents/skills/dhaatrik-mission-report/SKILL.md) + `dhaatrik-writing-style` |
| Astro code, components, builds, tests, performance       | [`dhaatrik-astro-site`](.agents/skills/dhaatrik-astro-site/SKILL.md)                                    |
| UI polish, glassmorphism, tokens, animations             | [`dhaatrik-visual-system`](.agents/skills/dhaatrik-visual-system/SKILL.md) + `dhaatrik-astro-site`      |
| SEO, AEO, GEO, LLM visibility, meta, JSON-LD, `llms.txt` | [`dhaatrik-seo-legacy`](.agents/skills/dhaatrik-seo-legacy/SKILL.md) + `dhaatrik-writing-style`         |

### Combined workflows

- **New transmission or project write-up:** `dhaatrik-writing-style` → `dhaatrik-mission-report` → `dhaatrik-seo-legacy` (meta + `llms.txt` + schema)
- **New page or component:** `dhaatrik-astro-site` → `dhaatrik-visual-system` → `dhaatrik-writing-style` (copy) → `dhaatrik-seo-legacy` (meta + llms index)
- **Homepage / personnel / pedagogy copy pass:** `dhaatrik-writing-style` + `dhaatrik-seo-legacy`
- **Design refresh or bento card:** `dhaatrik-visual-system` + `dhaatrik-astro-site`
- **SEO/AEO/GEO audit:** `dhaatrik-seo-legacy` → `dhaatrik-astro-site` (verify BaseHead, JSON-LD, robots)

Slash commands (Grok): `/dhaatrik-writing-style`, `/dhaatrik-mission-report`, `/dhaatrik-astro-site`, `/dhaatrik-visual-system`, `/dhaatrik-seo-legacy`

## Project skills (all)

| Skill                                                                        | Purpose                                                           |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`dhaatrik-writing-style`](.agents/skills/dhaatrik-writing-style/SKILL.md)   | Brotherly-teacher voice, first-person diary, AEO voice guardrails |
| [`dhaatrik-mission-report`](.agents/skills/dhaatrik-mission-report/SKILL.md) | Mission Report structure, metadata blocks, tables/diagrams        |
| [`dhaatrik-astro-site`](.agents/skills/dhaatrik-astro-site/SKILL.md)         | Astro 6 architecture, JSON-LD injection, BaseHead, testing        |
| [`dhaatrik-visual-system`](.agents/skills/dhaatrik-visual-system/SKILL.md)   | Sci-fi mission-control aesthetic, tokens, OG image design         |
| [`dhaatrik-seo-legacy`](.agents/skills/dhaatrik-seo-legacy/SKILL.md)         | SEO + AEO + GEO + LLM visibility (`llms.txt`, robots, schema)     |

Index: [`.agents/README.md`](.agents/README.md)

## SEO, GEO, AEO & LLM Visibility Defaults

1. **LLM files** — Update `public/llms.txt` and `public/llms-full.txt` when pages, posts, or projects change.
2. **robots.txt** — Keep AI crawlers allowed (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, etc.).
3. **Meta** — Every route: `title`, `description`, `keywords`, dynamic `og:type` via `BaseHead`.
4. **AEO/GEO** — Question-style phrasing in JSON-LD / `llms-full.txt`; Mission Report H2s in body prose.
5. **JSON-LD** — Homepage: `WebSite` + `FAQPage`; posts: `Article` + `BreadcrumbList`; projects: `SoftwareSourceCode` + `BreadcrumbList`; hub pages: `BreadcrumbList`; global: `Person` (with avatar image + `rel="author"`).
6. **Sitemap & Icons** — `@astrojs/sitemap` with `<lastmod>` timestamps; PNG favicons (`48x48`, `192x192`) + `apple-touch-icon.png` in `BaseHead`.
7. **Semantics** — One `h1`, proper heading order, semantic HTML, descriptive image `alt`.

## Commit Guidelines & Conventions

All automated and pair-programming agents MUST make regular, small, atomic commits with clear messages without waiting to be prompted. Commit messages directly inform project logs and changelogs.

- **Message Format**: Follow the **Conventional Commits** specification:
    ```
    <type>(<scope>): <short description in lowercase, imperative mood>
    ```
- **Types**:
    - `feat`: A new feature, component, or functional capability (e.g., `feat(header): add orbital telemetry breadcrumbs`)
    - `fix`: A bug, layout breakage, or visual regression fix (e.g., `fix(drawer): correct swipe gesture velocity threshold`)
    - `style`: Visual refinements, CSS glassmorphism, token styling, micro-animations (e.g., `style(home): remove redundant hero scroll cue`)
    - `refactor`: Structural or architectural code improvements without changing behavior (e.g., `refactor(nav): extract breadcrumb helper function`)
    - `perf`: Performance tuning, CWV, asset optimization, GPU layers (e.g., `perf(marquee): optimize hardware-accelerated transforms`)
    - `docs`: Documentation, SKILL files, markdown content, or instruction updates (e.g., `docs(agents): add conventional commit guidelines`)
    - `test`: Adding, updating, or fixing unit and E2E test suites (e.g., `test(a11y): add keyboard trap validation`)
    - `chore`: Tooling, configs, dependency bumps, or pipeline maintenance (e.g., `chore(deps): update astro to latest patch`)

- **Scopes**: Always specify the component or module in parentheses:
    - Common scopes: `header`, `home`, `personnel`, `projects`, `pedagogy`, `transmissions`, `ui`, `nav`, `drawer`, `a11y`, `seo`, `tokens`, `skills`, `deps`, `ci`.

- **Style Rules**:
    - Write in the **imperative mood** ("add", "fix", "remove", not "added" or "fixes").
    - Keep the first line concise (under 72 characters where possible).
    - Make **frequent, incremental commits** rather than giant multi-file dumps so changelogs remain granular and readable.

## Engineering defaults

- Run `npm run build`, `npm test`, and `npm run test:e2e` before considering work done.
- Match existing patterns in `src/`; avoid drive-by refactors.
- Content schemas: [`src/content.config.ts`](src/content.config.ts).
- Stack: Astro 6 SSG, Tailwind v4, vanilla JS where possible, Playwright E2E + Node test runner.

## Voice reminder

This site is an **honest engineering diary**, not a marketing portfolio. Default to **I/you**, Mission Report structure, and transparent learnings — never third-person case-study prose in body copy (JSON-LD / `llms-full.txt` entity blocks excepted).
