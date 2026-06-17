# Site Improvement TODO

Prioritized backlog from the portfolio audit (Performance, SEO, Content, Mobile, Code Quality).

**Last reviewed:** 2026-06-17 — implementation rated **8.7 / 10** (13 of 14 original items done; 36 unit + 28 e2e tests passing).

---

## Score movement (audit → now)

| Area          | Before | Now   | Δ     |
|---------------|--------|-------|-------|
| Content       | ~6/10  | ~8/10 | +2.0  |
| Performance   | ~7/10  | ~8.5/10 | +1.5 |
| Mobile        | ~7.5/10| ~9/10 | +1.5  |
| SEO           | ~8/10  | ~9/10 | +1.0  |
| Code quality  | ~8.5/10| ~9/10 | +0.5  |

**Overall site score: ~7.6 → ~8.7**

---

## Gaps holding the score back

These are the main reasons the implementation is not at 9.5+ yet. Items marked with ⚠️ are reopened from the Done section (partial completion).

1. **Blog content still thin** — Only 4 transmissions. Content cannot reach 9+ without new posts. _(Tracked in P1 below.)_
2. **⚠️ `logo_light.svg` still heavy** — Down from ~997 KB to ~320 KB, but still large for a favicon/header logo.
3. **⚠️ Personnel photo JPEG fallback** — AVIF/WebP variants are 7–35 KB, but the largest JPEG fallback in `dist/_astro/` is still ~1.56 MB for legacy browsers.
4. **⚠️ A11y audit scope** — `accessibility.spec.ts` only scans `/`, `/personnel/`, `/pedagogy/`, `/transmissions/` and only fails on **critical** violations. `/projects/` routes are not covered.
5. **⚠️ Terminal themes Conductor track** — `conductor/tracks/terminal_themes_20260524/` is still open; "Complete Conductor tracks" was marked done with 4/5 tracks finished.

**Next highest-ROI move:** Publish 2–3 transmissions (DeltaV Lab, Vellor, teaching philosophy) — likely pushes Content to ~9 and overall to ~9.2.

---

## Suggested execution order

1. **Now** — P1: Publish more transmissions _(ongoing; content takes time)_
2. **Next sprint** — P2 remaining items (logo, a11y scope, OG images)
3. **When ready** — P3 polish (terminal themes, optional execSync removal)

---

## P1 — High impact

- [ ] **Publish more transmissions** _(Content)_
  - Only 4 blog posts — limits search surface, repeat visits, and LLM citation depth.
  - Prioritize 2–3 posts on: DeltaV Lab, Vellor, teaching philosophy.
  - Topics are already referenced in homepage FAQ schema but underrepresented in actual content.
  - Files: `src/content/blog/`
  - _This item stays in P1 — expect it to take time._

---

## P2 — Medium impact (reopened / remaining)

- [ ] **Further compress `logo_light.svg`** _(Performance)_
  - Current size: ~320 KB (was ~997 KB). `logo_dark.svg` is ~82 KB — use as reference target.
  - Run SVGO or simplify paths; consider a raster fallback for the light logo if SVG cannot shrink further.
  - Files: `public/logo_light.svg`, `src/components/Header.astro`, `src/pages/index.astro`

- [ ] **Shrink personnel photo JPEG fallback** _(Performance, Mobile)_
  - `astro:assets` `Picture` already serves AVIF/WebP (7–35 KB) with responsive `srcset`.
  - Largest JPEG fallback variant in dist is still ~1.56 MB — hurts legacy-browser LCP.
  - Re-export source `src/assets/me.jpeg` at lower resolution/quality, or cap max `widths` in `Picture`.
  - Files: `src/assets/me.jpeg`, `src/pages/personnel.astro`

- [ ] **Expand a11y audit coverage** _(Mobile, Code quality)_
  - Add `/projects/` and at least one project detail route (e.g. `/projects/deltav-lab/`) to `accessibility.spec.ts`.
  - Consider failing on `serious` impact violations, not only `critical`.
  - File: `test/e2e/accessibility.spec.ts`

- [ ] **Pass project `logo` as OG image on project pages** _(SEO)_
  - `CreativeWork` JSON-LD already includes `image`; `<BaseHead />` on project pages does not receive `logo`.
  - Add `image={logo}` to `<BaseHead />` in `src/pages/projects/[...slug].astro`.

- [ ] **Reduce global CSS payload further** _(Performance)_ — _Partial; optional follow-up_
  - KaTeX is gated behind `hasMath` on blog posts and CDN-linked on personnel.
  - Global CSS bundle is still ~129 KB (`Header.*.css`). Audit unused Tailwind utilities if a meaningful reduction is possible.
  - Files: `src/styles/global.css`, build output under `dist/_astro/`

---

## P3 — Polish

- [ ] **Complete Terminal Theme Customization track** _(UX)_ ⚠️ _Reopened_
  - Track still open in `conductor/tracks.md`.
  - Link: `conductor/tracks/terminal_themes_20260524/`

- [ ] **Remove `execSync` fallback entirely** _(Code quality)_ — _Optional_
  - `PUBLIC_GIT_SHA` is injected in CI (`.github/workflows/deploy.yml`). Local fallback via `execSync` still exists in `Footer.astro`.
  - Remove fallback and default to `'UNKNOWN'` or `'LOCAL'` when env var is absent.
  - File: `src/components/Footer.astro`

---

## Quick reference — key files

| File | Status / notes |
|------|----------------|
| `src/assets/me.jpeg` | Optimized via `Picture`; JPEG fallback still large |
| `public/logo_light.svg` / `logo_dark.svg` | Dark OK (~82 KB); light still ~320 KB |
| `src/components/BaseHead.astro` | OG/Twitter meta done; mouse JS extracted |
| `src/scripts/mouseTracker.ts` | Gated on `(hover: hover) and (pointer: fine)` |
| `src/layouts/BlogPost.astro` | `heroImage` → OG + Article schema ✓ |
| `src/pages/projects/[...slug].astro` | Case-study pages ✓; OG image passthrough pending |
| `src/components/Footer.astro` | Prefetch ✓; `PUBLIC_GIT_SHA` ✓; execSync fallback remains |
| `src/content/blog/` | **4 posts** — main content gap |
| `src/content/projects/` | **12 projects** with routes ✓ |
| `src/styles/global.css` | Mobile motion gate ✓ |
| `src/scripts/registerHighlightStyles.ts` | Runtime `::highlight()` injection (bypasses Lightning CSS) |
| `test/e2e/accessibility.spec.ts` | Critical-only; missing `/projects/` routes |
| `astro.config.mjs` | `unified()` migration ✓ |
| `conductor/tracks.md` | Terminal themes track still open |
| `public/llms-full.txt` | Synced with all 12 projects ✓ |

---

## Done

_Move fully completed items here. Partial completions are noted; reopened items moved back to P2/P3._

- [x] **Add dedicated project pages** — completed 2026-06-16 _(12 projects, case-study structure, JSON-LD, breadcrumbs)_
- [x] **Pass `heroImage` to `BaseHead` on blog posts** — completed 2026-06-17 _(OG image + Article schema `image` field)_
- [x] **Extract and defer global mouse-tracking JS** — completed 2026-06-17 _(→ `mouseTracker.ts`, pointer-gated)_
- [x] **Complete link prefetch coverage** — completed 2026-06-17 _(Footer internal links)_
- [x] **Add automated accessibility audits** — completed 2026-06-17 _(partial: critical-only, 4 routes — see P2 for expansion)_
- [x] **Per-page SEO metadata** — completed 2026-06-17 _(partial: project OG images pending — see P2)_
- [x] **Reduce CSS payload** — completed 2026-06-17 _(partial: KaTeX gated; ~129 KB global CSS remains — see P2)_
- [x] **Gate decorative motion on mobile** — completed 2026-06-17 _(CSS `pointer: coarse` + JS media query)_
- [x] **Optimize hero images** — completed 2026-06-16 _(partial: AVIF/WebP ✓; logo_light + JPEG fallback remain — see P2)_
- [x] **Fix `::highlight` CSS build warnings** — completed 2026-06-17 _(→ runtime injection via `registerHighlightStyles.ts`; build is clean)_
- [x] **Migrate deprecated markdown config** — completed 2026-06-17 _(→ `unified()` in `astro.config.mjs`)_
- [x] **Replace `execSync` in Footer with env var** — completed 2026-06-17 _(partial: `PUBLIC_GIT_SHA` in CI; execSync fallback remains — see P3)_
- [x] **Keep `llms-full.txt` synced** — completed 2026-06-17
- [x] **Complete open Conductor tracks** — completed 2026-06-17 _(partial: 4/5 done; terminal themes reopened in P3)_

