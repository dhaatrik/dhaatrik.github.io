---
title: 'DeltaV Lab Mission Log: RK4, Web Workers, and the KSP Problem'
description: 'An honest engineering transmission on building a browser-based orbital mechanics simulator — Kerbal Space Program motivation, 4th-order Runge-Kutta integration, and why I moved physics off the main thread.'
pubDate: 2026-06-17
tags: ['aerospace', 'deltav-lab']
clearance: 'PUBLIC'
hasMath: true
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: DeltaV Lab (Browser Orbital Mechanics Simulator)
- REPO: github.com/dhaatrik/professional-rocket-launch-simulation
- INTEGRATION: 50Hz deterministic RK4 (Runge-Kutta 4th-order)
- THREADING: Dedicated Web Worker physics loop
- MOTIVATION: Kerbal Space Program creative freedom + engineering rigor
- STATUS: VAB operational, orbit projection rendering live
====================================================================
```

### Mission Report: The Problem KSP Left Unsolved

I owe a significant fraction of my intuition for orbital mechanics to **Kerbal Space Program**. There is no shame in admitting that. KSP taught me what apoapsis and periapsis _feel_ like, what a bad gravity turn looks like, and why staging is not optional if you want to reach orbit with anything resembling fuel margin.

But KSP is a game. Its physics are "good enough" for play, not validation. When I wanted to test actual staging math, compare integrators, or verify that a trajectory matched analytical Keplerian predictions, I kept bouncing between overkill proprietary tools and underpowered classroom applets.

I wanted something in the middle: **the creative freedom of KSP with the mathematical honesty of a real simulation**. That gap is why I started building DeltaV Lab.

---

### Mission Report: Design Constraints

Before writing a single line of integration code, I set three non-negotiable constraints:

1. **Run entirely in the browser.** No install step, no backend dependency, no subscription gate. Open the page, assemble a vehicle, simulate.
2. **Deterministic integration.** Given the same initial conditions and timestep, the simulation must produce identical results every run. No frame-rate-dependent drift.
3. **Keep the UI responsive.** Orbital mechanics math is not lightweight. A naive implementation on the main thread would stutter the moment I added drag, thrust vectoring, or multi-body gravity.

The third constraint is what pushed me toward Web Workers.

---

### Mission Report: Why RK4, Not Euler

First-order Euler integration is seductive because it is simple: compute acceleration, update velocity, update position, repeat. It is also wrong in exactly the ways that matter for rocketry.

Euler accumulates error aggressively over long timesteps. Rockets change acceleration rapidly — thrust ramps, mass decreases as propellant burns, gravity weakens with altitude. A first-order method will systematically mis-predict apoapsis altitude and burn timing, which means your circularization maneuver will miss.

I chose **Runge-Kutta 4th-order (RK4)** integration because it balances accuracy and computational cost for smooth gravitational and thrust fields. RK4 samples the derivative at four points within each timestep and combines them with weighted averaging. For a fixed 50Hz tick, that gives me trajectory fidelity I can actually trust when I compare against analytical solutions.

The governing pattern for each simulation step looks like this:

```
====================================================================
                    RK4 INTEGRATION LOOP (50Hz)
--------------------------------------------------------------------
  INPUT:  position r, velocity v, forces F(r,v,t), mass m(t)
  STEP:   k1 = f(r, v)
          k2 = f(r + dt/2 * k1, v + dt/2 * k1v)
          k3 = f(r + dt/2 * k2, v + dt/2 * k2v)
          k4 = f(r + dt * k3,   v + dt * k3v)
  OUTPUT: r' = r + dt/6 * (k1 + 2*k2 + 2*k3 + k4)
          v' = v + dt/6 * (k1v + 2*k2v + 2*k3v + k4v)
  TICK:   20ms wall-clock target (50Hz deterministic)
====================================================================
```

I validate this loop with Vitest unit tests against known analytical cases — standard Keplerian orbits, simple ballistic arcs — because an integrator you cannot test is an integrator you cannot teach with.

---

### Mission Report: Web Workers and the 50Hz Contract

The browser's main thread has one job: paint the UI and respond to input. The physics loop has a different job: crunch vectors, update vehicle state, and advance the simulation clock. Mixing those responsibilities is how you get janky orbit renders and missed keystrokes in the Vehicle Assembly Building.

I offloaded the entire physics loop into a **dedicated Web Worker**. The main thread and worker communicate through a custom protocol that synchronizes UI state with the worker's simulation tick at a steady **50Hz**. The worker owns gravity equations, thrust application, atmospheric drag models, and the RK4 stepper. The main thread owns canvas rendering, telemetry displays, and user controls.

This separation is not premature optimization. It is architectural hygiene. When I add a new force model — say, a more realistic drag curve — I modify the worker without touching the render path. When I improve the VAB UI, I do not risk destabilizing the integrator.

```
====================================================================
                  MAIN THREAD  <-->  WEB WORKER
--------------------------------------------------------------------
  UI / Canvas render          |    RK4 physics integrator
  User input (throttle,       |    Gravity & thrust models
  staging commands)           |    State vector propagation
  Telemetry readout           |    50Hz tick clock
--------------------------------------------------------------------
  Protocol: structured state snapshots per tick (postMessage)
====================================================================
```

---

### Mission Report: The Vehicle Assembly Building

A simulation without a build interface is just a trajectory viewer. I wanted students and hobbyists to _compose_ a vehicle — stages, engines, propellant fractions — and immediately see whether their design could reach orbit.

The VAB (Vehicle Assembly Building) is intentionally minimal. No bloated part catalog from a AAA game. Just enough structure to define wet mass, dry mass, specific impulse, and staging events so the rocket equation has real numbers to work with.

When you ignite, DeltaV Lab does not fake the result. It integrates. If your upper stage runs out of propellant 200 m/s short of circularization velocity, you see an elliptical orbit — not a success banner. That honesty is the whole point.

---

### Mission Report: Stack Choices and Why They Matter

I kept the runtime lean on purpose:

- **TypeScript & Vanilla DOM** for the main page loop — zero external runtime dependencies in the render hot path.
- **Web Workers** for threaded orbital calculations.
- **esbuild** for fast bundling of worker modules.
- **Vitest** for integration tests that catch regressions before they corrupt a student's intuition.

Every dependency is a liability in a physics engine. I added libraries only when they solved a problem I could not solve cleanly myself.

---

### Mission Report: Current Status and What Comes Next

As of this transmission, DeltaV Lab implements:

- 50Hz deterministic RK4 integration
- A functional Vehicle Assembly Building for multi-stage vehicle design
- Orbit projection and trajectory vector rendering
- Worker-threaded physics with main-thread telemetry sync

What is still ahead: more force models, better atmospheric tables, maneuver node planning, and tighter validation against published launch vehicle data. The engine works. The product around it is what I am building now.

---

### Mission Report: Why I Am Logging This Publicly

I stopped uploading YouTube lectures because I failed to build sustainable systems around content production. DeltaV Lab is my attempt to apply the opposite lesson: build the system first, then teach from it.

If you are a student trying to understand why staging matters, run a simulation. Change the mass ratio. Watch the apoapsis move. The Tsiolkovsky equation is not a memorization exercise — it is a contract between propellant mass and velocity budget.

That is what KSP hinted at. DeltaV Lab is my attempt to make it provably true.

$$ \Delta v = I\_\{sp\} \cdot g_0 \cdot \ln \left( \frac{m_0}{m_f} \right) $$

The equation was never the hard part. Building a system that respects it — in a browser, at 50Hz, without lying — that is the mission.
