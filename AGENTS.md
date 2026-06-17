# dhaatrik.github.io — Agent Instructions

This repo is an Astro static site. Project-scoped agent skills live in [`.agents/skills/`](.agents/skills/).

## Content and copy

When creating or editing **any user-facing text** — transmissions, project pages, homepage/personnel/pedagogy copy, meta descriptions, frontmatter, or component strings — read and follow:

**[`.agents/skills/dhaatrik-writing-style/SKILL.md`](.agents/skills/dhaatrik-writing-style/SKILL.md)**

Voice: first-person honest engineering diary, brotherly teacher, Mission Report structure. Not portfolio marketing.

Additional project skills will be added under `.agents/skills/` over time. Check that directory before starting domain-specific work.

## Engineering defaults

- Run `npm run build`, `npm test`, and `npm run test:e2e` before considering content or code changes done.
- Match existing patterns in `src/`; avoid drive-by refactors.
- Content schemas: [`src/content.config.ts`](src/content.config.ts).