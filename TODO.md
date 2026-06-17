# Site Improvement TODO

Prioritized backlog from the portfolio audit (Performance, SEO, Content, Mobile, Code Quality).

**Last reviewed:** 2026-06-17 — implementation rated **9.3 / 10** (all 14 original items + terminal themes done; 36 unit + 32 e2e tests passing).

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

These are the main reasons the implementation is not at 9.5+ yet.

1. **Blog content still thin** — Only 4 transmissions. Content cannot reach 9+ without new posts. _(Tracked in P1 below.)_

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



---

## P3 — Polish

*(All polish items completed)*

---

## Quick reference — key files

| File | Status / notes |
|------|----------------|
| `src/assets/me.jpeg` | Optimized via `Picture`; fallback JPEG shrunk from 1.56 MB to 117 KB ✓ |
| `public/logo_light.svg` / `logo_dark.svg` | Both optimized to ~81 KB ✓ |
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

- [x] **Expand a11y audit coverage** — completed 2026-06-17 _(added /projects/ and /projects/deltav-lab/ routes to automated E2E audits, expanded check to fail on both critical and serious WCAG violations, and resolved all color contrast issues)_
- [x] **Add dedicated project pages** — completed 2026-06-16 _(12 projects, case-study structure, JSON-LD, breadcrumbs)_
- [x] **Further compress `logo_light.svg`** — completed 2026-06-17 _(matched size of logo_dark.svg at ~81 KB via path simplification and SVGO)_
- [x] **Pass `heroImage` to `BaseHead` on blog posts** — completed 2026-06-17 _(photo OG image + Article schema `image` field)_
- [x] **Extract and defer global mouse-tracking JS** — completed 2026-06-17 _(→ `mouseTracker.ts`, pointer-gated)_
- [x] **Complete link prefetch coverage** — completed 2026-06-17 _(Footer internal links)_
- [x] **Add automated accessibility audits** — completed 2026-06-17 _(partial: critical-only, 4 routes — see P2 for expansion)_
- [x] **Pass project `logo` as OG image on project pages** — completed 2026-06-17 _(passed project logo to BaseHead as the image prop, and verified with E2E tests)_
- [x] **Per-page SEO metadata** — completed 2026-06-17 _(fully complete; project OG images and blog OG images are now correctly populated)_
- [x] **Reduce CSS payload** — completed 2026-06-17 _(fully complete; gated KaTeX behind hasMath, subsetted Nunito and Poppins to latin-only specific weights, and removed unused hologram scanner keyframes and rules, shrinking bundle size)_
- [x] **Gate decorative motion on mobile** — completed 2026-06-17 _(CSS `pointer: coarse` + JS media query)_
- [x] **Optimize hero images** — completed 2026-06-16 _(partial: AVIF/WebP ✓; logo_light + JPEG fallback remain — see P2)_
- [x] **Shrink personnel photo JPEG fallback** — completed 2026-06-17 _(source me.jpeg resized to 800x800 square and quality optimized, shrinking fallback JPEG from 1.56 MB to 117 KB)_
- [x] **Fix `::highlight` CSS build warnings** — completed 2026-06-17 _(→ runtime injection via `registerHighlightStyles.ts`; build is clean)_
- [x] **Migrate deprecated markdown config** — completed 2026-06-17 _(→ `unified()` in `astro.config.mjs`)_
- [x] **Replace `execSync` in Footer with env var** — completed 2026-06-17 _(removed execSync child process execution entirely from Footer.astro and defaulted to LOCAL when PUBLIC_GIT_SHA is absent)_
- [x] **Keep `llms-full.txt` synced** — completed 2026-06-17
- [x] **Complete open Conductor tracks** — completed 2026-06-17 _(all 5/5 tracks fully completed and archived)_
- [x] **Complete Terminal Theme Customization track** — completed 2026-06-17 _(UX theme switcher with custom property overrides fully integrated and tested)_
