---
title: 'Why DeltaV Lab Exists — and What It Actually Is'
description: 'Honest origin story for my browser rocket simulator: KSP intuition, STK price tags, VAB + Mission Control scope, and who should (and should not) trust it.'
pubDate: 2026-06-28
tags: ['aerospace', 'deltav-lab', 'simulation']
clearance: 'PUBLIC'
readingTime: '11 min'
hasMath: false
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: DeltaV Lab (professional-rocket-launch-simulation)
- REPO: github.com/dhaatrik/professional-rocket-launch-simulation
- SCOPE: VAB vehicle assembly + Mission Control flight sim (browser)
- MOTIVATION: KSP teaching intuition + engineering-grade auditability
- AUDIENCE: students, hobbyists, self — not range-safety certification
- KEY LESSON: Build the sandbox you wished existed between games and STK
====================================================================
```

### Mission Report: The Gap Between KSP and a $50k License

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. Remember when I said orbital mechanics would be "a weekend side project"? Yeah — about that.

I learned apoapsis from **Kerbal Space Program**. I am not embarrassed. KSP taught me what a bad gravity turn _feels_ like, why asparagus staging is ridiculous, and why running out of fuel 200 m/s short of circularization hurts in a way a chalkboard never replicated.

But KSP is a game. Its physics are tuned for fun. When I wanted to check staging math against the rocket equation, compare integrators, or script a gravity-turn profile and _know_ the result came from integration — I kept bouncing between:

- **Overkill proprietary tools** (STK, internal corporate sims) with license walls I could not share with students
- **Underpowered classroom applets** that hand-waved drag or faked orbits

I wanted something in the middle. That itch became **[DeltaV Lab](https://github.com/dhaatrik/professional-rocket-launch-simulation)**.

---

### Mission Report: The Why — What Problem Was I Actually Solving?

Three frustrations stacked on top of each other:

1. **Teaching without lying.** I run DBS Classes and tutor siblings in physics. I refuse to tell students "trust the equation" when the demo behind me is cartoon physics. I needed a demo where failure modes are real — elliptical orbit when you run short on Δv, not a participation trophy.

2. **Personal auditability.** I am the kind of engineer who re-derives things at 2 AM. I wanted a sandbox where I could change mass ratio, re-run, and compare against analytical Keplerian checks — same inputs, same outputs, every time.

3. **Accessibility.** No install wizard. No backend. Open a tab, clone the repo, `npm run dev`, fly. MIT license so a student in Guwahati and a researcher in Munich hit the same code path.

The repo's `conductor/product.md` states the audience plainly: aerospace students, space enthusiasts who want realistic orbital mechanics, and developers curious about deterministic physics in Web Workers. That is accurate. What it does **not** say — and I will say it here — is that DeltaV Lab is **not** a replacement for flight-certified trajectory analysis. I wrote a separate transmission on [why it is not professional-grade](/transmissions/deltav-lab-not-professional-grade/). Read that before you quote my README marketing adjectives to your manager.

---

### Mission Report: What DeltaV Lab Is — Concrete Scope

DeltaV Lab is a **browser-native launch simulation** split into two primary experiences, exactly as the README describes:

| Experience | URL (local dev) | What you do |
|------------|-----------------|-------------|
| **Vehicle Assembly Building** | `http://localhost:8080` | Stack engines (Merlin, Raptor, RL-10), tanks, avionics, fairings. Live **Δv** and **TWR** as you build. |
| **Mission Control** | Same page + optional `telemetry.html` on a second monitor | Launch, throttle, steer, stage, time-warp, map view, export telemetry. |

Under the hood:

- **TypeScript 5.3**, **esbuild** bundling, **Vitest** tests, **vanilla DOM + Canvas** rendering
- Physics in a **Web Worker** at **50 Hz** (`FIXED_DT = 0.02` s)
- State sync via **SharedArrayBuffer** (not chatty per-frame `postMessage` — I learned that the hard way in the [mission log](/transmissions/deltav-lab-mission-log/))

It is a **2D** simulation. You fly in a plane. That is a deliberate scope choice for a browser teaching tool, and also a hard ceiling on realism. More in [the science transmission](/transmissions/deltav-lab-science/).

---

### Mission Report: Features I Am Proud Of (Because They Teach Real Ops)

Beyond "press space to launch," the repo ships tooling that mirrors how flight software teams think — scaled down for a laptop:

- **Programmable flight computer** — DSL scripts: `WHEN ALTITUDE > 10000 THEN PITCH 60`. Editor on `F`, arm on `G`. [Deep dive here](/transmissions/deltav-lab-flight-computer/).
- **Pre-launch checklist** (`C`) — Go/No-Go panel
- **Flight Termination System** (`T`) — arm/disarm interlock
- **Instructor fault injector** (`Ctrl+I`) — flameouts, sensor glitches, fuel leaks
- **Black box recorder + CSV export** (`R` / `E`) — post-flight analysis in `analysis.html`
- **Wind layers, gusts, Go/No-Go wind limits** — environment system inspired by Cape Canaveral profiles (simplified, not ECMWF)

Full key map: [simulation_controls.md](https://github.com/dhaatrik/professional-rocket-launch-simulation/blob/main/simulation_controls.md).

---

### Mission Report: Fuckups & Learnings

**What went wrong:** I let the README call DeltaV Lab "hyper-realistic" and "engineering-grade" before I had published validation against real flight telemetry. The repo's own `path_to_perfection.md` lists sixteen gaps to reach "space-grade credibility," starting with "zero published validation is the #1 reason no company will touch it yet."

**Why it went wrong:** I was excited about RK4 and worker threading and conflated **implemented rigor** with **industry trust**. They are not the same thing.

**What I learned:** Marketing copy on GitHub is not the same contract as honest diary copy on my site. This website is where I say the dull truth. The README can keep its badges; these transmissions carry the caveat.

**What I'd do differently:** Ship the V&V folder _before_ the adjectives. The `verification/` directory today has Playwright UI checks and tooltip scripts — not Falcon 9 altitude-velocity overlays.

---

### Mission Report: Who Should Use This

| You are… | DeltaV Lab is… |
|----------|----------------|
| A student learning staging and Δv budgets | A great sandbox — pair it with [scrollytelling demo](/transmissions/scrollytelling-demo/) on this site |
| A hobbyist who loves KSP but wants auditability | Pull the repo and break my drag model |
| A flight dynamics engineer needing dispersion analysis | Wrong tool — read [limitations post](/transmissions/deltav-lab-not-professional-grade/) |
| Me, at 2 AM, checking a guidance script | Exactly what I built it for |

---

### Mission Report: Current State

As of this transmission (June 2026):

- VAB, flight controls, DSL flight computer, FTS, fault injector, telemetry export — **implemented in repo**
- Hosted zero-install demo on `deltavlab.space` — **not shipped** (listed as Phase 1 in `path_to_perfection.md`)
- Published flight-data V&V report — **not shipped**

The engine works for teaching. The trust layer for industry adoption does not — and I will not pretend otherwise.

---

### Closing Transmission

DeltaV Lab exists because I wanted KSP's "what if I strap more fuel to it" energy with integrators I can actually test in Vitest. It is open source, browser-native, and honest about what the math is doing — as long as you read the right docs.

Start here: [github.com/dhaatrik/professional-rocket-launch-simulation](https://github.com/dhaatrik/professional-rocket-launch-simulation)

Then read [the science](/transmissions/deltav-lab-science/) if you want equations, and [the limitations](/transmissions/deltav-lab-not-professional-grade/) if you want the uncomfortable audit.

If you are building something similar — especially the worker protocol part — the [mission log](/transmissions/deltav-lab-mission-log/) is where I kept the threading war stories.