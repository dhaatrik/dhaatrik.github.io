---
title: 'DeltaV Lab Mission Log: RK4, Web Workers, and the KSP Problem'
description: 'Engineering diary on threading — SharedArrayBuffer, the chatty postMessage fuckup, and why physics stays in the worker. Physics deep-dives live in separate transmissions.'
pubDate: 2026-06-17
updatedDate: 2026-06-30
heroImage: '../../assets/og/deltav-lab-transmissions.jpg'
tags: ['aerospace', 'deltav-lab']
clearance: 'PUBLIC'
readingTime: '9 min'
hasMath: true
series: 'DeltaV Lab'
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: DeltaV Lab threading & worker protocol
- FOCUS: Web Worker isolation, SharedArrayBuffer, 50Hz tick contract
- MOTIVATION: Main-thread physics stutter killed teachable sim loop
- KEY LESSON: Worker comms is protocol design — not plumbing
- SEE ALSO: deltav-lab-why-and-what, deltav-lab-science, deltav-lab-not-professional-grade
====================================================================
```

### Mission Report: Why This Log Exists (and What Moved Out)

**SYS.STATUS:** THREADING // WORKER_ISOLATED

I owe orbital intuition to **Kerbal Space Program**. I also wanted integrators I could test. That motivation story now lives in **[Why DeltaV Lab Exists](/transmissions/deltav-lab-why-and-what/)** — read that first for audience, scope, and repo links.

The RK4 derivations, atmosphere models, and Tsiolkovsky walkthrough moved to **[The Science Inside DeltaV Lab](/transmissions/deltav-lab-science/)**.

The uncomfortable professional-grade audit is in **[Why It Is Not Professional-Grade](/transmissions/deltav-lab-not-professional-grade/)**.

**This log stays focused on threading** — the architectural decision that made the sim usable, and the protocol fuckup that almost killed it.

---

### Mission Report: Design Constraints (Threading Edition)

Three constraints drove the worker split:

1. **Deterministic integration** — fixed 50 Hz timestep (`FIXED_DT = 0.02` s in `PhysicsWorker.ts`), not frame-rate dependent
2. **Responsive UI** — canvas paint and VAB input never block on force summation
3. **Browser-only** — no backend to offload compute

The main thread paints. The worker integrates. Anything else is how you get janky orbit lines and missed keystrokes in the VAB.

---

### Mission Report: The Big Fuckup — Chatty postMessage

Early builds sent **hundreds of small coordinate packets per frame** to the worker (and back). The serialization cost clogged both sides. Physics missed its 20 ms budget. The sim felt like a broken screensaver even when the math was correct.

**Root cause:** I treated the worker boundary like a remote API instead of a **shared memory contract**.

**Fix:** `PhysicsBuffer.ts` + **SharedArrayBuffer** layout — header (mission time, wind, entity count) plus fixed-strides per entity (position, velocity, fuel, apoapsis, thermal state, etc.). The worker writes; the main thread reads for HUD paint. Control messages (`STEP`, `COMMAND`) stay small.

```
====================================================================
                  MAIN THREAD  <-->  WEB WORKER
--------------------------------------------------------------------
  Read Float64Array HUD fields         |  RK4 @ 50Hz
  Send STEP { dt, controls }         |  Environment + FTS + FC
  Send COMMAND { FC_LOAD_SCRIPT }    |  Write entity strides
--------------------------------------------------------------------
  Hot path: SharedArrayBuffer (no per-tick postMessage for state)
====================================================================
```

That one refactor mattered more than tuning RK4 coefficients.

---

### Mission Report: Why RK4 (Short Version)

Euler lies about apoapsis when thrust and mass change fast. I chose **RK4** for smooth gravitational and thrust fields at 50 Hz. Full force breakdown: [science transmission](/transmissions/deltav-lab-science/).

Validation is Vitest against analytical Keplerian cases — not flight telemetry. [Limitations post](/transmissions/deltav-lab-not-professional-grade/) explains why that distinction blocks professional adoption.

---

### Mission Report: Stack Choices

- **TypeScript + vanilla DOM** on the main loop — no React in the paint hot path
- **esbuild** for fast worker bundles during iteration
- **Vitest** to catch integrator regressions before they corrupt student intuition

Every dependency is a liability in a physics engine. I added libraries only when I could not solve the problem cleanly myself.

---

### Mission Report: Fuckups & Learnings

| Fuckup | Learning |
|--------|----------|
| Chatty per-frame messages | Batch state in SharedArrayBuffer; strict 50 Hz contract |
| Mixing UI refactors with integrator edits | Worker boundary lets you change HUD without touching RK4 |
| README "engineering-grade" before V&V | Implemented rigor ≠ industry trust — [audit](/transmissions/deltav-lab-not-professional-grade/) |

---

### Mission Report: Current Status

Worker-threaded physics, VAB, DSL flight computer, FTS, telemetry export — live in [the repo](https://github.com/dhaatrik/professional-rocket-launch-simulation).

What is next for _me_: flight-telemetry validation (not more adjectives). What is next for _you_: clone it, break my worker protocol, open a PR.

---

### Closing Transmission

I stopped uploading YouTube lectures because I failed to build sustainable systems around content. DeltaV Lab is the opposite lesson — build the system first, then teach from it.

If staging math is what you care about, run a sim and watch apoapsis move when you change mass ratio:

$$ \Delta v = I_{sp} \cdot g_0 \cdot \ln \left( \frac{m_0}{m_f} \right) $$

If threading is what you care about, study `PhysicsWorker.ts` and `PhysicsBuffer.ts`.

Full map of transmissions:

- [Why and what](/transmissions/deltav-lab-why-and-what/)
- [Science](/transmissions/deltav-lab-science/)
- [Not professional-grade](/transmissions/deltav-lab-not-professional-grade/)
- [Flight computer DSL](/transmissions/deltav-lab-flight-computer/)
- [Scrollytelling demo](/transmissions/deltav-lab-scrollytelling-demo/)