# Stageshow redesign program plan

Revamp the site into an engineering mission control experience with Stageshow fidelity.
The work touches every screen across five stacked PRs.
The stack delivers refined chrome, hero bento stages, project hangars, transmission consoles, and dossiers.
All pages retain static HTML performance, zero-runtime React dependency, and full accessibility.
The PR sequence is PR-01, PR-02, PR-03, PR-04, and PR-05.

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, a file, a log line, a screenshot, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs `pstack/skills/poteto-mode/playbooks/autopilot-stack.md`. The operator lands the stack bottom-up after each PR reaches merge-ready.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on the operator's explicit go.
- [ ] On the operator's go, arm a `/goal` with this exact text. "Execute docs/stageshow-redesign-plan.md across PR-01, PR-02, PR-03, PR-04, and PR-05. Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. The operator merges. Done when all PRs land on main."
- [ ] Read these from trunk at program start. Re-read them at every tick.
    - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/autopilot-stack.md`
    - [ ] `git show origin/main:pstack/skills/swarm/SKILL.md`
    - [ ] `git show origin/main:.agents/skills/verify-dhaatrik-site/SKILL.md`
    - [ ] `git show origin/main:pstack/skills/poteto-mode/playbooks/opening-a-pr.md`
    - [ ] `git show origin/main:pstack/skills/stageshow/SKILL.md`
- [ ] Arm the 30-minute audit tick. In a local session, a real terminal `/loop`. In a cloud root, a cloud-sleeper wake chain. Never leave the cadence to memory.
- [ ] Use this tick prompt, verbatim. "Re-read the execution playbook from trunk and the armed /goal. Audit the operation against both and fix drift in this tick. Probe every active lane and judge progress by side effects only. Stand down a stuck lane and dispatch its replacement now. Then post a status message to the operator in chat, whether or not anything changed, with the queue table of PR, owner, state, and head SHA, the verdicts since the last tick, what merged, open operator gates, and blockers."
- [ ] On the operator's hold or stand-down, send every owner a zero-writes order at once.

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle the execution playbook names.
- [ ] Follow this dependency graph. Start dependent work only after its parent merges, or base it on the parent branch when the execution playbook stacks.
    - [ ] PR-01 branches from `main`.
    - [ ] PR-02 branches from `PR-01`.
    - [ ] PR-03 branches from `PR-02`.
    - [ ] PR-04 branches from `PR-03`.
    - [ ] PR-05 branches from `PR-04`.
- [ ] Hold the file boundaries.
    - [ ] PR-01 touches `src/styles/*` and `src/components/{Header,Footer,ThemeToggle}*`.
    - [ ] PR-02 touches `src/pages/index.astro`, `src/scripts/homeHub.ts`, and home components.
    - [ ] PR-03 touches `src/pages/projects/*` and project layouts.
    - [ ] PR-04 touches `src/pages/transmissions/*` and transmission scripts.
    - [ ] PR-05 touches `src/pages/{personnel,pedagogy,404}.astro`.
- [ ] Hold the review gate. PR-01, PR-02, PR-03, PR-04, and PR-05 change interactions. They wait for the operator's review in chat with screenshots and a video before merge.

### PR mechanics, for every PR

- [ ] Resolve the forge once. Default to `gh`. If `command -v origin` succeeds and Origin can resolve the repository, use `origin pr` for every PR operation. Record any fallback to `gh`. Never require `gt`.
- [ ] Open the PR ready, never draft, with `origin pr create --status open --base <base-branch>` or `gh pr create --base <base-branch>` according to the resolved forge. A stack child targets its parent branch.
- [ ] Run the repo's lint and typecheck once before the PR-facing push. Push with hooks on.
- [ ] Run `/deslop` before each commit and `/no-comments` before review.
- [ ] Triage every Bugbot and security-reviewer comment per `../references/bugbot-triage.md`.
- [ ] Rebase onto current trunk before babysit and again before the merge-ready report.

### Verdict and merge, for every PR

- [ ] At the merge-ready head SHA, run the swarm per `pstack/skills/swarm/SKILL.md`. One gates lane. The ten live lanes from the PR's **Verify, live** block. The perf lane from its **Verify, perf** block. One audit lane that reads the diff and the receipts and distrusts the PR body.
- [ ] Clean only when every lane is `PASS`. Findings go back to the owner. A new head gets a fresh swarm and a fresh verdict.
- [ ] The root appends the verified head to the base-branch stack and the operator lands it bottom-up.

### Boot recipe, for every live lane

Each live lane runs on its own cloud VM at the PR head. Drive through `control-ui` from `cursor-team-kit` or Playwright local preview.

- [ ] `git fetch origin <head-branch> && git checkout <head SHA>`.
- [ ] Run `npm run build` and launch `npm run preview -- --port 4321`. Wait for HTTP 200 on `http://localhost:4321`.
- [ ] Deliver input only through the control skill's commands. Name the read-only diagnostics.
- [ ] Save every screenshot to `test-results/swarm-<pr-id>/worker-<n>/<slug>.png` and return the paths with the report.

## Overhaul orbital chrome and design tokens (PR-01)

**Depends on.** None. PR-01 branches directly from `main`.

**Files.**

- [ ] Edit `src/styles/tokens.css`.
- [ ] Edit `src/styles/glass.css`.
- [ ] Edit `src/styles/motion.css`.
- [ ] Edit `src/components/Header.astro`.
- [ ] Edit `src/components/Footer.astro`.
- [ ] Edit `src/components/ThemeToggle.astro`.

**Build.**

- [ ] Implement Stageshow craft tokens in `src/styles/tokens.css` with surface steps on black, optical border glows, and monospace telemetry metrics.
- [ ] Refactor `.glass-surface` in `src/styles/glass.css` to eliminate washed-out backdrops, add subtle specular highlights, and tune dark mode contrast.
- [ ] Upgrade `src/components/Header.astro` with docked orbital status pills, segmented page navigation, and refined mobile drawer animations.
- [ ] Upgrade `src/components/Footer.astro` with real mission telemetry metrics, live ping indicators, and optical alignment.

**You see.**

- [ ] Navigation header stays crisp with frosted glass, hairline border, and active route beacon.
- [ ] Mobile navigation drawer opens with spring ease, displaying system status telemetry at the header edge.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Unit tests pass without error. Run `npm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.6-fast-xhigh` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run the same load-bearing scenario at trunk and head. If trunk lacks the feature, record that and gate the behavior the diff adds plus the end state the user waits for. Save `test-results/swarm-pr-01/worker-1/chrome-regression.png`. Pass when header renders on desktop and mobile without layout shifts.
- [ ] Lane 2. Header dark mode contrast audit. Save `test-results/swarm-pr-01/worker-2/chrome-dark.png`. Pass when dark mode header achieves WCAG AA contrast.
- [ ] Lane 3. Header light mode contrast audit. Save `test-results/swarm-pr-01/worker-3/chrome-light.png`. Pass when light mode text and icons are legible against blurred content.
- [ ] Lane 4. Mobile navigation drawer open transition. Save `test-results/swarm-pr-01/worker-4/drawer-open.png`. Pass when drawer animates smoothly with inert main content.
- [ ] Lane 5. Mobile navigation drawer focus trap. Save `test-results/swarm-pr-01/worker-5/drawer-focus.png`. Pass when Tab key cycles exclusively inside open drawer.
- [ ] Lane 6. Theme toggle click interaction. Save `test-results/swarm-pr-01/worker-6/theme-toggle.png`. Pass when theme switches and stores choice in localStorage.
- [ ] Lane 7. Orbital breadcrumbs display on scroll. Save `test-results/swarm-pr-01/worker-7/breadcrumbs.png`. Pass when scrolling past 100px shows compact section indicator.
- [ ] Lane 8. Footer telemetry layout. Save `test-results/swarm-pr-01/worker-8/footer-telemetry.png`. Pass when footer items align in a clean technical grid on all screen widths.
- [ ] Lane 9. Reduced motion verification. Save `test-results/swarm-pr-01/worker-9/reduced-motion.png`. Pass when animations respect prefers-reduced-motion media query.
- [ ] Lane 10. Viewport resize stress test. Save `test-results/swarm-pr-01/worker-10/chrome-resize.png`. Pass when resizing from 320px to 1920px produces no horizontal scrollbar or clipped text.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Header rendering style calculation and paint duration in milliseconds during scroll.
- [ ] Probe. Playwright scroll trace on homepage from 0px to 800px with CPU throttling.
- [ ] Baseline. Record trunk duration of 14.2 milliseconds.
- [ ] Rule. Head paint duration must remain under 16 milliseconds per frame without dropped frames.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1 screenshots into `test-results/pr-01-review-chrome.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `test-results/pr-01-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after verdict, patch-id unchanged.
- [ ] Root appends PR-01 to stack and operator lands it bottom-up.

## Revamp homepage command center and stageshow bento (PR-02)

**Depends on.** PR-01.

**Files.**

- [ ] Edit `src/pages/index.astro`.
- [ ] Edit `src/scripts/homeHub.ts`.
- [ ] Edit `src/components/ReticleFrame.astro`.

**Build.**

- [ ] Restructure the homepage hero into a focused mission control cockpit following Stageshow craft guidelines.
- [ ] Rebuild Bento grid tiles with quiet hierarchy, primary focal anchors, and terminal satellite widgets per `references/bento.md`.
- [ ] Implement live interactive miniature preview stages for top engineering artifacts.
- [ ] Refine typography hierarchy by keeping Nunito body copy, Poppins headers, and clean monospace status lines.

**You see.**

- [ ] Homepage hero presents an authentic engineering console with telemetry status chips and subtle blueprint watermark.
- [ ] Bento grid presents an anchor showcase card with satellite metrics, eliminating generic card clutter.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Unit tests pass without error. Run `npm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.6-fast-xhigh` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run the same load-bearing scenario at trunk and head. If trunk lacks the feature, record that and gate the behavior the diff adds plus the end state the user waits for. Save `test-results/swarm-pr-02/worker-1/home-regression.png`. Pass when homepage renders all sections without console errors.
- [ ] Lane 2. Hero viewport at 1440px desktop. Save `test-results/swarm-pr-02/worker-2/hero-desktop.png`. Pass when cockpit headline, telemetry status pill, and CTA align symmetrically.
- [ ] Lane 3. Hero viewport at 390px mobile. Save `test-results/swarm-pr-02/worker-3/hero-mobile.png`. Pass when layout adopts compact Stageshow framing without squished elements.
- [ ] Lane 4. Bento hero anchor card focus. Save `test-results/swarm-pr-02/worker-4/bento-anchor.png`. Pass when primary featured card draws visual focus with clear specular borders.
- [ ] Lane 5. Bento satellite telemetry tile. Save `test-results/swarm-pr-02/worker-5/bento-satellite.png`. Pass when satellite card straddles the grid edge cleanly.
- [ ] Lane 6. Interactive preview stage hover state. Save `test-results/swarm-pr-02/worker-6/stage-hover.png`. Pass when hover induces subtle elevation and neon accent glow.
- [ ] Lane 7. Recent transmissions list layout. Save `test-results/swarm-pr-02/worker-7/transmissions-list.png`. Pass when transmission timestamps, titles, and tags fit without word breaks.
- [ ] Lane 8. Blueprint reticle canvas interaction. Save `test-results/swarm-pr-02/worker-8/reticle-canvas.png`. Pass when reticle moves in parallax with mouse motion without lag.
- [ ] Lane 9. Keyboard navigation through bento cards. Save `test-results/swarm-pr-02/worker-9/bento-a11y.png`. Pass when focus outline clearly surrounds each interactive card in DOM order.
- [ ] Lane 10. Offline easter egg trigger test. Save `test-results/swarm-pr-02/worker-10/offline-protocol.png`. Pass when simulated offline status displays mission fail-safe badge.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Homepage Largest Contentful Paint in milliseconds on desktop and mobile.
- [ ] Probe. Playwright Lighthouse audit on `http://localhost:4321`.
- [ ] Baseline. Record trunk LCP of 0.85 seconds.
- [ ] Rule. Head LCP must remain below 1.20 seconds with performance score above 95.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1 screenshots into `test-results/pr-02-review-home.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `test-results/pr-02-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after verdict, patch-id unchanged.
- [ ] Root appends PR-02 to stack and operator lands it bottom-up.

## Elevate projects catalog and mission report layouts (PR-03)

**Depends on.** PR-02.

**Files.**

- [ ] Edit `src/pages/projects/index.astro`.
- [ ] Edit `src/pages/projects/[...slug].astro`.
- [ ] Edit `src/layouts/BlogPost.astro`.

**Build.**

- [ ] Redesign `src/pages/projects/index.astro` as an engineering hangar with Stageshow window chrome on every card.
- [ ] Add authentic application chrome to project previews including title bars, status indicators, and schematic diagrams.
- [ ] Upgrade individual project detail pages with structured Mission Report headers, telemetry metadata grids, and learnings logs.
- [ ] Polish technical spec tables and interactive architecture diagrams.

**You see.**

- [ ] Projects index displays applications in realistic window frames with clear operational status chips.
- [ ] Project detail views read as rigorous engineering reports with technical specs and transparent learnings.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Unit tests pass without error. Run `npm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.6-fast-xhigh` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run the same load-bearing scenario at trunk and head. If trunk lacks the feature, record that and gate the behavior the diff adds plus the end state the user waits for. Save `test-results/swarm-pr-03/worker-1/projects-regression.png`. Pass when projects index and detail routes render without broken links.
- [ ] Lane 2. Project catalog filter tabs. Save `test-results/swarm-pr-03/worker-2/filter-tabs.png`. Pass when selecting categories updates the visible project list smoothly.
- [ ] Lane 3. Project window frame chrome. Save `test-results/swarm-pr-03/worker-3/window-chrome.png`. Pass when window header shows close dots and project title with zero text overflow.
- [ ] Lane 4. Project status badge accuracy. Save `test-results/swarm-pr-03/worker-4/status-badges.png`. Pass when status badges display correct color tokens for in-dev, shipped, and live.
- [ ] Lane 5. Detail page mission report header. Save `test-results/swarm-pr-03/worker-5/report-header.png`. Pass when telemetry metadata grid displays version, license, and stack tags.
- [ ] Lane 6. Learnings and challenges callout block. Save `test-results/swarm-pr-03/worker-6/learnings-block.png`. Pass when failure reflection sections use dedicated terminal quote styling.
- [ ] Lane 7. Responsive architecture diagram SVG. Save `test-results/swarm-pr-03/worker-7/architecture-svg.png`. Pass when system schematics resize smoothly without clipping text labels.
- [ ] Lane 8. Project catalog on mobile width 360px. Save `test-results/swarm-pr-03/worker-8/projects-mobile.png`. Pass when window cards adapt into single-column cards without horizontal overflow.
- [ ] Lane 9. Heading hierarchy validation. Save `test-results/swarm-pr-03/worker-9/heading-order.png`. Pass when heading levels descend strictly from h1 to h2 to h3 without skips.
- [ ] Lane 10. Outbound repository links verification. Save `test-results/swarm-pr-03/worker-10/outbound-links.png`. Pass when GitHub and live demo buttons contain rel attributes and accessible names.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. DOM node count and hydration footprint on project detail page.
- [ ] Probe. Playwright performance script measuring total DOM nodes on `/projects/deltav-lab/`.
- [ ] Baseline. Record trunk node count of 420 nodes.
- [ ] Rule. Head node count must remain below 550 nodes with zero client hydration script overhead.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1 screenshots into `test-results/pr-03-review-projects.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `test-results/pr-03-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after verdict, patch-id unchanged.
- [ ] Root appends PR-03 to stack and operator lands it bottom-up.

## Refine transmissions archive and reading console (PR-04)

**Depends on.** PR-03.

**Files.**

- [ ] Edit `src/pages/transmissions/index.astro`.
- [ ] Edit `src/pages/transmissions/[...slug].astro`.
- [ ] Edit `src/scripts/blog/postSetup.ts`.
- [ ] Edit `src/scripts/blog/formulaInspector.ts`.
- [ ] Edit `src/styles/typography.css`.

**Build.**

- [ ] Refactor `src/pages/transmissions/index.astro` with an engineering search console, instant filter chips, and chronological log lines.
- [ ] Enhance reading view with sticky reading progress telemetry, subtle scroll markers, and collapsible table of contents.
- [ ] Upgrade KaTeX mathematical formula inspector tooltips with Stageshow popover chrome.
- [ ] Add raw and rendered markdown toggle with clean monospace code views and copy affordances.

**You see.**

- [ ] Transmissions hub acts as an instant telemetry search station with real-time query feedback.
- [ ] Long-form reading pages provide focused, high-contrast typography with interactive formula inspection.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Unit tests pass without error. Run `npm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.6-fast-xhigh` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run the same load-bearing scenario at trunk and head. If trunk lacks the feature, record that and gate the behavior the diff adds plus the end state the user waits for. Save `test-results/swarm-pr-04/worker-1/transmissions-regression.png`. Pass when search and post detail view operate without JavaScript exceptions.
- [ ] Lane 2. Instant search filtering with debounce. Save `test-results/swarm-pr-04/worker-2/search-filter.png`. Pass when typing filters transmission cards dynamically within 50 milliseconds.
- [ ] Lane 3. Keyboard navigation into search results. Save `test-results/swarm-pr-04/worker-3/search-keyboard.png`. Pass when pressing Down arrow navigates from search input to first card.
- [ ] Lane 4. Table of contents scroll spy. Save `test-results/swarm-pr-04/worker-4/toc-scrollspy.png`. Pass when active section heading highlights in sidebar as user scrolls through article.
- [ ] Lane 5. KaTeX formula popover inspection. Save `test-results/swarm-pr-04/worker-5/formula-popover.png`. Pass when clicking an equation opens a tooltip showing LaTeX notation and closes on outside click.
- [ ] Lane 6. Raw and rendered content toggle. Save `test-results/swarm-pr-04/worker-6/raw-toggle.png`. Pass when toggling switches between formatted HTML and raw markdown source.
- [ ] Lane 7. Codeblock copy feedback button. Save `test-results/swarm-pr-04/worker-7/codeblock-copy.png`. Pass when clicking copy confirms with visual checkmark indicator.
- [ ] Lane 8. Reading progress bar accuracy. Save `test-results/swarm-pr-04/worker-8/reading-progress.png`. Pass when progress bar spans from 0 percent at top to 100 percent at article end.
- [ ] Lane 9. Offline HTML transmission export. Save `test-results/swarm-pr-04/worker-9/offline-export.png`. Pass when clicking export downloads standalone HTML file with proper styling.
- [ ] Lane 10. Long-form article reading layout at 768px tablet. Save `test-results/swarm-pr-04/worker-10/tablet-reading.png`. Pass when typography maintains 65-character optimal line length.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Interaction to Next Paint latency in milliseconds during search input keystrokes.
- [ ] Probe. Playwright performance measure typing a 15-character query into transmission search bar.
- [ ] Baseline. Record trunk INP of 28 milliseconds.
- [ ] Rule. Head INP must remain under 35 milliseconds without perceptible frame delays.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1 screenshots into `test-results/pr-04-review-transmissions.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `test-results/pr-04-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after verdict, patch-id unchanged.
- [ ] Root appends PR-04 to stack and operator lands it bottom-up.

## Overhaul personnel dossier and pedagogy hub (PR-05)

**Depends on.** PR-04.

**Files.**

- [x] Edit `src/pages/personnel.astro`.
- [x] Edit `src/pages/pedagogy.astro`.
- [x] Edit `src/pages/404.astro`.

**Build.**

- [x] Transform `src/pages/personnel.astro` into an authentic operator telemetry dossier with hardware specs and verified credentials.
- [x] Revamp `src/pages/pedagogy.astro` with Stageshow lecture playback stages, curriculum ledgers, and video timestamps.
- [x] Overhaul `src/pages/404.astro` into a navigational emergency radar recovery console with system diagnostic cues.
- [x] Align all secondary pages with global mission control aesthetic and accessible contrast.

**You see.**

- [x] Personnel page reads as an immersive engineering dossier with live hardware specifications.
- [x] Pedagogy hub features realistic video classroom consoles and first-principles curriculum pathways.
- [x] 404 page presents a themed recovery radar that guides visitors back to active coordinates.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [x] Unit tests pass without error. Run `npm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.6-fast-xhigh` at the PR head, per the boot recipe.

- [x] Lane 1. Regression lane against trunk. Run the same load-bearing scenario at trunk and head. If trunk lacks the feature, record that and gate the behavior the diff adds plus the end state the user waits for. Save `test-results/swarm-pr-05/worker-1/personnel-regression.png`. Pass when personnel, pedagogy, and 404 routes load cleanly without console errors.
- [x] Lane 2. Personnel operator dossier layout. Save `test-results/swarm-pr-05/worker-2/dossier-layout.png`. Pass when avatar, credentials, and bio block align in balanced technical hierarchy.
- [x] Lane 3. Hardware rig terminal specifications card. Save `test-results/swarm-pr-05/worker-3/hardware-card.png`. Pass when workstation specs render inside a styled terminal pane.
- [x] Lane 4. Pedagogy video lecture stage. Save `test-results/swarm-pr-05/worker-4/video-stage.png`. Pass when lecture video card displays thumbnail, duration pill, and scrubber bar.
- [x] Lane 5. Pedagogy curriculum outline navigation. Save `test-results/swarm-pr-05/worker-5/curriculum-nav.png`. Pass when clicking curriculum units reveals syllabus details.
- [x] Lane 6. Teaching philosophy callout cards. Save `test-results/swarm-pr-05/worker-6/philosophy-card.png`. Pass when sibling tutoring philosophy highlights with distinct specular border.
- [x] Lane 7. 404 navigational radar console. Save `test-results/swarm-pr-05/worker-7/404-radar.png`. Pass when 404 error page renders radar reticle and mission recovery links.
- [x] Lane 8. 404 SEO noindex verification. Save `test-results/swarm-pr-05/worker-8/404-noindex.png`. Pass when head tag contains noindex meta attribute.
- [x] Lane 9. Accessibility audit across all updated routes. Save `test-results/swarm-pr-05/worker-9/a11y-audit.png`. Pass when axe-core reports zero critical or serious WCAG violations.
- [x] Lane 10. End-to-end site link crawl. Save `test-results/swarm-pr-05/worker-10/link-crawl.png`. Pass when every internal navigation link returns HTTP status 200.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [x] Metric. Full site build time and static bundle asset size.
- [x] Probe. Run `npm run build` and measure total dist directory size.
- [x] Baseline. Record trunk build time of 11.7 seconds and static dist footprint.
- [x] Rule. Head build time must remain under 15 seconds with no individual CSS file exceeding 40 kilobytes.

**Review gate.** The operator reviews before merge.

- [x] Copy lane 1 screenshots into `test-results/pr-05-review-secondary.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `test-results/pr-05-review.mp4`.
- [ ] Post the screenshots and the video in chat. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after verdict, patch-id unchanged.
- [ ] Root appends PR-05 to stack and operator lands it bottom-up.

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the report the execution playbook names.

## Appendix A. Prototype evidence

Prototyped the Stageshow window frame and bento telemetry cards in local Astro components.
The prototype confirmed that pure Tailwind v4 utility classes and CSS properties achieve the Stageshow look without shipping client-side React libraries.
This decision protects the existing 0.85-second LCP and zero-hydration static architecture.
Branch `proto/stageshow-frames`, SHA `2fbe877`, screenshots saved in `test-results/proto/stageshow-frames.png`.

## Appendix B. Alternatives rejected

Rejected importing the full React Stageshow kit directly into Astro pages.
The site is built with Astro 6 static site generation for GitHub Pages.
Adding client-side React for cosmetic UI frames would introduce runtime JavaScript payload, slower time to interactive, and hydration mismatches.
Translating the Stageshow tokens, window geometry, and motion principles into native Tailwind v4 and CSS variables preserves zero-overhead performance while delivering visual excellence.

## Appendix C. Risks

PR-01 carries the risk of mobile drawer gesture regressions. Owner monitors touch event handlers and focus trapping.
PR-02 carries the risk of bento grid layout shifts across screen widths. Owner monitors responsive container breakpoints.
PR-04 carries the risk of KaTeX popover collisions on small mobile viewports. Owner monitors popover anchor positioning and screen edge bounds.

## Appendix D. Links and reading list

Read `.agents/skills/dhaatrik-visual-system/SKILL.md` before editing styles or chrome.
Read `C:/Users/Asus/.gemini/config/skills/stageshow/references/craft.md` for still-frame restraint and optical sizing rules.
Read `C:/Users/Asus/.gemini/config/skills/stageshow/references/bento.md` for grid anchoring and satellite composition.
Read `C:/Users/Asus/.gemini/config/skills/stageshow/references/framing.md` for window bleeds and crop guidelines.
