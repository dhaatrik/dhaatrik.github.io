---
title: 'DeltaV Lab'
description: 'An open-source browser rocket sim with real RK4 orbital mechanics — Kerbal creativity, engineering-grade math, no proprietary license.'
logo: '../../assets/delta-v-lab.png'
githubUrl: 'https://github.com/dhaatrik/professional-rocket-launch-simulation'
progress: '50Hz deterministic RK4 integration, VAB'
order: 2
tags: ['TypeScript', 'Vanilla DOM', 'Web Workers', 'esbuild', 'Vitest']
pain_level: 4
fuckup_teaser: "Early worker message shapes were too chatty — batch comms killed determinism before I caught it."
---

## SYS.STATUS: Physics loop runs at 50Hz in a Web Worker — VAB works, orbit plots render, still not KSP

I love Kerbal Space Program. I also love checking math against analytical solutions. DeltaV Lab is where those two impulses collided: a browser-based launch simulator that doesn't hand-wave gravity or integration, built so students and hobbyists can experiment without STK-level licensing.

## Why I started this

Spaceflight games teach intuition. Industry aerospace software teaches rigor. The gap between them is huge — and mostly filled with price tags. I wanted a tool I could open in a tab, build a staged vehicle, fire it, and *trust* the trajectory because the integrator is deterministic and testable, not because it looks right.

The audience I had in mind: researchers prototyping maneuvers, students learning orbital mechanics, and the rest of us who just want to see if our ridiculous asparagus staging idea actually reaches orbit.

## What I tried (and what broke)

The core problem is simple and brutal: **heavy math on the browser's main thread kills the UI**. Frame drops during a 50Hz physics tick make the whole thing feel like a broken screensaver.

My fix was architectural — offload the entire physics loop to a dedicated Web Worker. The main thread owns the DOM and paint; the worker owns gravity models, RK4 steps, and state propagation. A custom message protocol syncs UI state to the simulation clock at a steady **50Hz**, so the main thread never blocks on integration.

I deliberately kept the main page loop dependency-light: **TypeScript + vanilla DOM**, no React in the hot path. Every framework kilobyte is a millisecond I don't have during orbit projection updates.

Validation mattered as much as rendering. I wired **Vitest** against analytical cases — standard Keplerian motion, known energy conservation checks — so I could catch integrator drift before it showed up as a pretty but wrong trajectory line. esbuild bundles the worker modules fast enough that iterating doesn't feel like punishment.

The Vehicle Assembly Building (VAB) was its own rabbit hole. Staging logic, mass properties, thrust curves — getting a vehicle from "stack of parts" to "inputs the integrator understands" took more refactoring than the gravity code.

## Fuckups & learnings

- **Worker communication is a protocol design problem, not a plumbing task.** Early message shapes were too chatty; I batch state updates and keep the tick cadence strict.
- **Determinism is a feature.** Same inputs, same outputs, every run — that's what makes debugging possible. Non-deterministic "close enough" physics is fine for games; it fails you when you're comparing against textbook equations.
- **Vanilla DOM scales until it doesn't.** For this scope it was the right call. The lesson from the build: put the framework where reactivity matters, not where you're painting SVG trajectories at fixed intervals.
- **Tests saved me from elegant wrong math.** An RK4 implementation can look perfect in a blog post and still leak energy. Unit tests against closed-form solutions aren't optional here.

## Where it stands now

DeltaV Lab runs a **50Hz deterministic Runge-Kutta 4th-order (RK4)** integration scheme in a worker thread. You can build stages in the VAB, launch, and see orbit projections and trajectory vectors on screen.

It's not a full game. There's no career mode, no explosions with personality. It's a **high-fidelity sandbox** for vehicle design and orbital maneuvers — open source, browser-native, and honest about what the math is doing.

## Closing transmission

If you've ever wanted KSP's "what if I strap more fuel to it" energy with integrators you can actually audit, pull the repo. Break my gravity model. Open a PR. That's the point.