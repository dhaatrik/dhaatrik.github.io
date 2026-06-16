# Site Improvement TODO

Prioritized backlog from the portfolio audit (Performance, SEO, Content, Mobile, Code Quality).

**Score recap at time of audit**

| Area          | Score  | Main drag                                              |
|---------------|--------|--------------------------------------------------------|
| Content       | ~6/10  | Thin depth — 4 posts, no project pages                 |
| Performance   | ~7/10  | Heavy unoptimized assets + global inline JS            |
| Mobile        | ~7.5/10| Responsive layout, but assets and hover-only FX hurt   |
| SEO           | ~8/10  | Strong foundation; per-page metadata gaps remain       |
| Code quality  | ~8.5/10| Solid patterns; monolith scripts and missing a11y CI   |

**Suggested execution order**

1. Week 1 — P0 image optimization + blog OG images (Performance + SEO quick wins)
2. Week 2 — Project pages + new blog content (Content score jump)
3. Week 3 — JS extraction, prefetch coverage, a11y CI (Mobile + code quality)
4. Ongoing — P2/P3 polish items

---

## P0 — Critical

- _No active items in this category._

---

## P1 — High impact

- [ ] **Publish more transmissions** _(Content)_
  - Only 4 blog posts — limits search surface, repeat visits, and LLM citation depth.
  - Prioritize 2–3 posts on: DeltaV Lab, Vellor, teaching philosophy.
  - Topics are already referenced in homepage FAQ schema but underrepresented in content.
  - Files: `src/content/blog/`


---

## P2 — Medium impact

- _No active items in this category._

---

## P3 — Polish

- _No active items in this category._

---

## Quick reference — key files

| File | Why it matters |
|------|----------------|
| `public/me.jpeg` | 1.7 MB LCP bottleneck |
| `public/logo_light.svg` / `logo_dark.svg` | Oversized logo assets |
| `src/components/BaseHead.astro` | Global meta, OG tags, inline mouse JS |
| `src/layouts/BlogPost.astro` | Missing `heroImage` → OG image passthrough |
| `src/components/Footer.astro` | Missing prefetch, `execSync` git SHA |
| `src/content/projects/` | Content exists, no routes |
| `src/content/blog/` | Only 4 posts |
| `astro.config.mjs` | Prefetch enabled, deprecated markdown config |
| `conductor/tracks.md` | Open feature tracks index |

---

## Done

_Move completed items here with date when finished._

- [x] **Complete open Conductor tracks** — completed 2026-06-17
- [x] **Keep `llms-full.txt` synced** — completed 2026-06-17
- [x] **Replace `execSync` in Footer** — completed 2026-06-17
- [x] **Fix build warnings** — completed 2026-06-17
- [x] **Optimize hero images** — completed 2026-06-16
- [x] **Add dedicated project pages** — completed 2026-06-16
- [x] **Pass `heroImage` to `BaseHead` on blog posts** — completed 2026-06-17
- [x] **Extract and defer global mouse-tracking JS** — completed 2026-06-17
- [x] **Complete link prefetch coverage** — completed 2026-06-17
- [x] **Add automated accessibility audits** — completed 2026-06-17
- [x] **Per-page SEO metadata** — completed 2026-06-17
- [x] **Reduce CSS payload** — completed 2026-06-17
- [x] **Gate decorative motion on mobile** — completed 2026-06-17