---
title: 'Why DeltaV Lab Is Not Professional-Grade (Despite What the README Says)'
description: 'An honest audit: no published flight V&V, simplified 2D physics, browser 50Hz limits, and the gaps in path_to_perfection.md — implemented rigor is not industry trust.'
pubDate: 2026-06-30
tags: ['aerospace', 'deltav-lab', 'fuckups', 'simulation']
clearance: 'PUBLIC'
readingTime: '12 min'
hasMath: true
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: DeltaV Lab professional-grade gap analysis
- ROOT_CAUSE: Confusing implemented rigor with industry trust requirements
- EVIDENCE: verification/ folder, path_to_perfection.md, 2D browser limits
- KEY LESSON: RK4 + Vitest ≠ flight-telemetry V&V or range-safety certification
- STATUS: Teaching sandbox — not company-adoptable without V&V program
====================================================================
```

### Mission Report: The Uncomfortable Title

**SYS.STATUS:** HONESTY_MODE // README_MARKETING: OVERRIDE_DISABLED

I wrote the DeltaV Lab README. It calls the project "engineering-grade" and "hyper-realistic." Those words are not lies in every dimension — we did ship RK4 integration, a DSL flight computer, FTS, and Vitest checks against analytical orbits.

But if you are an aerospace engineer asking "can I bet a launch license on this?" the answer is **no**. Not today. Possibly not ever in the browser-only form. This transmission explains why, with specifics from my own repo so you can verify I am not performing false humility.

If you have not read [what DeltaV Lab is](/transmissions/deltav-lab-why-and-what/) or [what physics it implements](/transmissions/deltav-lab-science/), start there. This is the audit layer.

---

### Mission Report: Implemented Rigor vs. Industry Trust

| Implemented rigor (what we actually built) | Industry trust (what companies need) |
|-------------------------------------------|--------------------------------------|
| 50 Hz RK4 in an isolated Web Worker | Published V&V against flight telemetry (<2% error targets) |
| Vitest analytical checks (Keplerian, staging) | Automated regression that **fails CI** when accuracy drifts vs. Falcon 9 / Electron profiles |
| Deterministic reruns from same inputs | Monte Carlo dispersion (100–10,000 cases) with impact ellipses |
| DSL flight computer for teaching GNC shape | SIL/HIL with real avionics binaries and CCSDS telemetry |
| Simplified Cape-inspired wind layers | ECMWF/GFS GRIB wind import + NRLMSISE-00 atmosphere |

**Implemented rigor is necessary. It is not sufficient.** I confused the two when I wrote marketing copy. `path_to_perfection.md` in the repo says it bluntly: *"Zero published validation is the #1 reason no company will touch it yet."*

That document is my own roadmap. I am quoting myself against myself. Good.

---

### Mission Report: What the verification/ Folder Actually Contains

I checked the repo. The `verification/` directory holds:

- `playwright_script.spec.ts` — UI automation
- `test_dos.cjs` — stress/load script
- `verify_tooltips.py` + screenshot artifacts — VAB tooltip QA
- `wind_vectors.png` — visualization check

What it does **not** contain:

- Side-by-side altitude/velocity plots vs. Falcon 9, Electron, or Starship test flights
- Error tables on Max-Q, Mach, or downrange at milestone times
- A PDF Verification Report (the roadmap explicitly recommends NASA/ESA-style publication)
- Zenodo datasets with DOIs

So when the README implies aerodynamic integrity enforced by tests, read carefully: **integrity against analytical math**, not against flown trajectories. That is a massive gap for professional adoption.

---

### Mission Report: Physics and Environment Simplifications

Even when the integrator is honest, the **models** are teaching-grade:

| Model area | DeltaV Lab today | Professional-grade expectation |
|------------|------------------|--------------------------------|
| Degrees of freedom | **2D** flight plane | 6DOF quaternion attitude, slosh, flex modes |
| Atmosphere | Exponential $\rho(h)$, LUT to 200 km | NRLMSISE-00 / Jacchia-77 + space weather |
| Gravity | Inverse-square $g(h)$ | EGM2008 harmonics + third-body |
| Wind | Layered analytic profile + synthetic gusts | Balloon/ECMWF launch-day profiles |
| Aerodynamics | $C_D$ + CP/CoM stability | Tables vs. Mach, attitude, Reynolds; CFD validation |
| Timestep | Fixed 50 Hz in JavaScript worker | Adaptive RK, SIMD Rust/C++ core for batch runs |

The repo's `path_to_perfection.md` Phase 2–3 lists 6DOF, Monte Carlo, Rust/WASM rewrite, and benchmarking against RocketPy/OpenRocket/GMAT. **None of that is shipped.** It is a plan, not a product claim.

---

### Mission Report: Browser and Performance Ceilings

DeltaV Lab runs entirely client-side. That is a feature for accessibility and a blocker for professional workflows:

- **50 Hz fixed step** in a single worker cannot scale to overnight 10,000-run dispersion studies
- **No native cluster backend** — companies run ensembles on servers, not in Chrome tabs
- **No Hardware-in-the-Loop** — no UDP/CCSDS stream to real avionics or Speedgoat targets
- **No Python/MATLAB API** — professional toolchain integration is roadmap item #8, not code you can `pip install` today
- **SharedArrayBuffer** requires cross-origin isolation headers — deployment footguns for a public demo

The roadmap's first suggestion is literally "deploy a zero-install demo." As of this writing, you still clone and `npm run dev`. Busy engineers will not do that — and I cannot blame them.

---

### Mission Report: Software Engineering Trust Gaps

`path_to_perfection.md` Suggestion #7 lists practices aerospace orgs expect:

- Requirements traceability matrix (equation → documented source)
- >90% unit-test coverage with static analysis (Coverity/SonarQube)
- Version-controlled vehicle databases with digital signatures
- FMEA for every injected fault mode

We have Vitest, ESLint, CI — solid for an open-source teaching project. We do **not** have DO-178C-shaped evidence, MISRA-like rules on a physics core, or signed vehicle configs. The fault injector is a classroom tool, not a certified failure-mode library.

---

### Mission Report: The README Marketing Problem (My Fuckup)

**What went wrong:** I used "engineering-grade" because I was proud of RK4 and worker isolation. A friend could run it and see real elliptical orbits. I conflated that pride with professional certification language.

**Why it went wrong:** Games undersell their physics; I overcorrected. Also, nobody on the internet reads the limitations section first.

**What I learned:** Keep hype on GitHub if you must for stars — but your personal site must carry the audit. This transmission is that audit.

**What I'd do differently:** Rename README adjectives to "deterministic teaching simulator" until the V&V PDF exists. Publish the benchmark report _before_ the adjectives.

---

### Mission Report: What DeltaV Lab IS Good For

Honesty cuts both ways. This project **excels** at:

- Teaching staging, Δv budgets, and gravity turns without cartoon physics
- Letting students script guidance in a DSL and watch consequences
- Demonstrating Web Worker + SharedArrayBuffer architecture for heavy browser math
- Instructor scenarios: FTS, fault injection, checklist culture
- Open-source auditability — read `src/physics/` yourself

Pair it with my [scrollytelling demo](/transmissions/deltav-lab-scrollytelling-demo/) for sequential launch intuition. Use [the science transmission](/transmissions/deltav-lab-science/) for equation references.

Do **not** use it for range safety sign-off, launch-window dispersion, or replacing STK in a corporate study — until the gaps in `path_to_perfection.md` close with evidence, not promises.

---

### Mission Report: The Roadmap I Am Not Pretending Is Done

From `path_to_perfection.md`, ranked implementation order (abridged):

1. Hosted live demo — **not shipped**
2. Professional SW practices + documentation — **partial**
3. Flight telemetry V&V program — **not shipped**
4. Rust/WASM physics core for batch Monte Carlo — **not shipped**
5. 6DOF + slosh + TVC dynamics — **not shipped**
6. Industry atmosphere/wind models — **not shipped**
7. HIL + commercial licensing — **far future**

I am working on a browser teaching tool, not a funded space-grade program. The roadmap is aspirational. These transmissions document reality.

---

### Closing Transmission

DeltaV Lab is the most serious rocket sim I have built. It is also not professional-grade in the sense aerospace companies define that term: published validation, dispersion analysis, 6DOF fidelity, toolchain APIs, and HIL paths.

I would rather you hear that from me than discover it after pitching it to your chief engineer.

Repo: [github.com/dhaatrik/professional-rocket-launch-simulation](https://github.com/dhaatrik/professional-rocket-launch-simulation)

Context: [why and what](/transmissions/deltav-lab-why-and-what/) · [science](/transmissions/deltav-lab-science/) · [mission log](/transmissions/deltav-lab-mission-log/)

If you are building toward real V&V — or wrestling with the same README-hype regret — I would genuinely like to hear what validation gate you would insist on first. My answer today is flight-telemetry overlays, full stop.