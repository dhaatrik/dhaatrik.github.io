---
title: 'DeltaV Lab'
description: 'Open-source browser rocket sim — VAB, Mission Control, RK4 physics in a Web Worker. Honest about what it teaches and what it cannot certify.'
logo: '../../assets/delta-v-lab.png'
githubUrl: 'https://github.com/dhaatrik/professional-rocket-launch-simulation'
progress: '50Hz RK4 worker, VAB, DSL flight computer, FTS, telemetry export'
transmissionTag: 'deltav-lab'
order: 2
tags: ['TypeScript', 'Web Workers', 'SharedArrayBuffer', 'esbuild', 'Vitest']
pain_level: 4
telemetry: 'STATUS: OPERATIONAL // SIM: RK4_50HZ // VAB: ONLINE'
fuckup_teaser: "I initially passed hundreds of small coordinates to the Web Worker every frame, which clogged the thread and destroyed the physics loop's real-time accuracy."
---

## SYS.STATUS: Browser sandbox with real integrators — not flight-certified software

[DeltaV Lab](https://github.com/dhaatrik/professional-rocket-launch-simulation) is my open-source attempt to sit between Kerbal Space Program and proprietary trajectory tools: build a staged rocket in a **Vehicle Assembly Building (VAB)**, launch it, watch telemetry update, and trust that the outcome came from integration — not a scripted success screen.

The repo README calls it "engineering-grade." I wrote that README. This project page is the honest counterweight: it is a **serious teaching sandbox**, not something I would hand to a range-safety officer without a validation program I have not built yet.

## What it is (scope)

DeltaV Lab splits into two primary experiences, matching the repo structure:

| Surface | What you do there |
|---------|-------------------|
| **VAB** | Stack engines (Merlin, Raptor, RL-10), tanks, avionics, fairings. Live **Δv** and **TWR** calculations as you build. |
| **Mission Control** | Fly the vehicle: throttle, steer, stage, time-warp, map view. Optional second monitor via `telemetry.html`. |

Under the hood, physics runs in a **Web Worker** at a fixed **50 Hz** timestep (`FIXED_DT = 0.02` s in `PhysicsWorker.ts`). State sync uses **SharedArrayBuffer** so the main thread paints without blocking integration.

Beyond raw flight, the repo ships instructor and ops tooling I rarely see in browser demos:

- **DSL flight computer** — `WHEN <condition> THEN <action>` scripts for pitch, throttle, staging, SAS modes
- **Pre-launch checklist** (`C`) — Go/No-Go validation panel
- **Flight Termination System** (`T`) — FTS arm/disarm interlock
- **Fault injector** (`Ctrl+I`) — engine flameouts, sensor glitches, fuel leaks for classroom scenarios
- **Black box + CSV export** (`R` / `E`) — high-frequency telemetry recording for post-flight analysis
- **Analysis view** (`analysis.html`) — parse exported flight data

Full keyboard map: [simulation_controls.md](https://github.com/dhaatrik/professional-rocket-launch-simulation/blob/main/simulation_controls.md) in the repo.

## Who I built it for

- **Students and hobbyists** who want KSP-style experimentation with math they can audit
- **Myself** when I need to sanity-check staging logic, Tsiolkovsky budgets, or guidance scripts without STK licensing
- **Anyone curious** about how browser threading, deterministic integrators, and flight-software-shaped tooling fit together

It is **not** aimed at replacing GMAT, FreeFlyer, or internal corporate dispersion analysis — and [I wrote a whole transmission about why](/transmissions/deltav-lab-not-professional-grade/).

## Physics snapshot (accurate, not marketing)

The simulation is **2D** with inverse-square gravity, exponential atmosphere (scale height 7 km, density LUT up to 200 km), altitude-varying wind layers, simplified Dryden gusts, drag from dynamic pressure, thrust from variable mass with sea-level/vacuum **Isp**, thermal ablation on re-entry, and CP-vs-CoM aerodynamic stability checks.

Integration is **RK4** at 50 Hz in the worker. Orbital elements use Vis-Viva and Keplerian math; orbit prediction reuses the same RK4 core.

That is real physics work. It is also **not** 6DOF attitude dynamics, NRLMSISE-00 atmospheres, or Monte Carlo dispersion. The gap is intentional honesty, not false modesty — see the limitations transmission.

## Fuckups & learnings

- **Worker communication is protocol design.** Early versions spammed `postMessage` with chatty per-frame coordinates. Moving to SharedArrayBuffer and batched state snapshots fixed the stutter.
- **README hype vs. repo reality.** Calling it "hyper-realistic" in marketing copy while `path_to_perfection.md` lists 16 missing professional features taught me to split **implemented rigor** from **industry trust requirements**.
- **2D is a feature and a ceiling.** It keeps the integrator teachable. It also means roll, yaw coupling, and slosh are out of scope until I do a quaternion rewrite I have not shipped.

## Deep-dive transmissions

Read these in order if you want the full story:

1. [Why DeltaV Lab exists and what it actually is](/transmissions/deltav-lab-why-and-what/) — motivation, audience, VAB + Mission Control scope, repo link
2. [The science inside DeltaV Lab](/transmissions/deltav-lab-science/) — RK4, forces, atmosphere, Tsiolkovsky, DSL, worker architecture (sourced from the sim repo)
3. [Why it is not professional-grade](/transmissions/deltav-lab-not-professional-grade/) — no published flight V&V, simplified environments, browser limits, gaps from `path_to_perfection.md`

Supporting logs:

- [RK4, Web Workers, and the worker-protocol fuckup](/transmissions/deltav-lab-mission-log/) — engineering diary focused on threading, not duplicated physics lectures
- [Flight computer DSL: teaching autopilot without faking physics](/transmissions/deltav-lab-flight-computer/) — the `WHEN/THEN` guidance language
- [Interactive Mission Logs: Orbital Insertion Dynamics](/transmissions/scrollytelling-demo/) — scroll-driven launch telemetry on this site

## Run it locally

```bash
git clone https://github.com/dhaatrik/professional-rocket-launch-simulation.git
cd professional-rocket-launch-simulation
npm install
npm run dev
# Open http://localhost:8080 — optional second screen at /telemetry.html
```

Tests: `npm run test` (Vitest). CI runs on every push.

## Closing transmission

Pull the repo. Break my drag model. Tell me where the 2D assumptions lie. That is the point — dull truth over gorgeous lies.

If you want the threading war stories, start with the [mission log](/transmissions/deltav-lab-mission-log/). If you want the physics derivations, read [the science transmission](/transmissions/deltav-lab-science/). If you want the uncomfortable "would I bet a real launch on this?" answer, that is [the limitations post](/transmissions/deltav-lab-not-professional-grade/).