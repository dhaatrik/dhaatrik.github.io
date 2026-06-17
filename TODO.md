# Site Improvement TODO

Prioritized backlog from the portfolio audit (Performance, SEO, Content, Mobile, Code Quality).

**Last reviewed:** 2026-06-17 — implementation rated **9.2 / 10** (21 of 22 items done; 36 unit + 32 e2e tests passing).

---

## Score movement (audit → now)

| Area          | Before | Now    | Δ     |
|---------------|--------|--------|-------|
| Content       | ~6/10  | ~8/10  | +2.0  |
| Performance   | ~7/10  | ~9/10  | +2.0  |
| Mobile        | ~7.5/10| ~9/10  | +1.5  |
| SEO           | ~8/10  | ~9.5/10| +1.5  |
| Code quality  | ~8.5/10| ~9.5/10| +1.0  |

**Overall site score: ~7.6 → ~9.2**

---

## Gaps holding the score back

1. **Blog content still thin** — Only 4 transmissions. Content cannot reach 9+ without new posts. _(Tracked in P1 below.)_

**Next highest-ROI move:** Publish 2–3 transmissions (DeltaV Lab, Vellor, teaching philosophy) — likely pushes Content to ~9 and overall to ~9.5+.

---

## Suggested execution order

1. **Now** — P1: Publish more transmissions _(ongoing; content takes time)_

---

## P1 — High impact

- [ ] **Publish more transmissions** _(Content)_
  - Only 4 blog posts — limits search surface, repeat visits, and LLM citation depth.
  - Prioritize 2–3 posts on: DeltaV Lab, Vellor, teaching philosophy.
  - Topics are already referenced in homepage FAQ schema but underrepresented in actual content.
  - Files: `src/content/blog/`
  - _This item stays in P1 — expect it to take time._

---

## P2 — Medium impact

*(All items completed)*

---

## P3 — Polish

*(All items completed)*

---

## Quick reference — key files

| File | Status / notes |
|------|----------------|
| `src/styles/global.css` | Core Tailwind bundle ~105 KB on most routes ✓ |
| `src/styles/typography.css` | Route-scoped prose plugin ~102 KB (blog + project pages only) ✓ |
| `src/components/TypographyStyles.astro` | Loads typography.css on prose routes |
| `src/components/KatexStyles.astro` | Self-hosted KaTeX CSS (CSP-safe) |
| `src/assets/me.jpeg` | Optimized via `Picture`; source ~120 KB ✓ |
| `public/logo_light.svg` / `logo_dark.svg` | Both ~81 KB ✓ |
| `src/components/BaseHead.astro` | OG/Twitter meta; mouse JS extracted; latin font subset |
| `src/scripts/mouseTracker.ts` | Gated on `(hover: hover) and (pointer: fine)` |
| `src/scripts/registerHighlightStyles.ts` | Runtime `::highlight()` injection |
| `src/layouts/BlogPost.astro` | `heroImage` → OG; TypographyStyles + KatexStyles |
| `src/pages/projects/[...slug].astro` | Case-study pages; `image={logo}` OG passthrough ✓ |
| `src/components/Footer.astro` | Prefetch ✓; `PUBLIC_GIT_SHA` in CI; no execSync ✓ |
| `src/content/blog/` | **4 posts** — main content gap |
| `src/content/projects/` | **12 projects** with routes ✓ |
| `test/e2e/accessibility.spec.ts` | 6 routes; fails on critical + serious violations ✓ |
| `astro.config.mjs` | `unified()` migration ✓ |
| `conductor/tracks.md` | All 5 tracks completed and archived ✓ |
| `public/llms-full.txt` | Synced with all 12 projects ✓ |

---

## Done

- [x] **Split typography CSS into route-scoped bundle** — completed 2026-06-17 _(global `Header.*.css` 128 KB → 105 KB; typography ~102 KB loads only on blog/project pages)_
- [x] **Self-host KaTeX CSS (CSP-safe)** — completed 2026-06-17 _(→ `KatexStyles.astro`; fixes broken formulas blocked by CDN CSP)_
- [x] **Fix MDX math brace escaping** — completed 2026-06-17 _(→ `I_\{sp\}` pattern in `scrollytelling-demo.mdx`)_
- [x] **Expand a11y audit coverage** — completed 2026-06-17 _(6 routes incl. `/projects/`; critical + serious violations)_
- [x] **Add dedicated project pages** — completed 2026-06-16 _(12 projects, case-study structure, JSON-LD, breadcrumbs)_
- [x] **Further compress `logo_light.svg`** — completed 2026-06-17 _(~81 KB via SVGO)_
- [x] **Pass `heroImage` to `BaseHead` on blog posts** — completed 2026-06-17
- [x] **Pass project `logo` as OG image on project pages** — completed 2026-06-17 _(verified by `seo.spec.ts`)_
- [x] **Extract and defer global mouse-tracking JS** — completed 2026-06-17
- [x] **Complete link prefetch coverage** — completed 2026-06-17
- [x] **Add automated accessibility audits** — completed 2026-06-17
- [x] **Per-page SEO metadata** — completed 2026-06-17
- [x] **Reduce CSS payload** — completed 2026-06-17 _(font subsetting, dead CSS removed, typography split)_
- [x] **Gate decorative motion on mobile** — completed 2026-06-17
- [x] **Optimize hero images** — completed 2026-06-17 _(AVIF/WebP + responsive srcset; logos ~81 KB)_
- [x] **Shrink personnel photo JPEG fallback** — completed 2026-06-17 _(1.56 MB → ~115 KB in dist)_
- [x] **Fix `::highlight` CSS build warnings** — completed 2026-06-17
- [x] **Migrate deprecated markdown config** — completed 2026-06-17
- [x] **Replace `execSync` in Footer** — completed 2026-06-17 _(defaults to `LOCAL` / `PUBLIC_GIT_SHA`)_
- [x] **Keep `llms-full.txt` synced** — completed 2026-06-17
- [x] **Complete all Conductor tracks** — completed 2026-06-17 _(5/5 archived under `conductor/tracks/completed/`)_
- [x] **Complete Terminal Theme Customization track** — completed 2026-06-17