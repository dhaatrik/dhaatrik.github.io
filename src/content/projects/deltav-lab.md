---
title: 'DeltaV Lab'
description: 'Bridge the gap between spaceflight games and industry-standard aerospace software by providing an accessible, open-source, and uncompromisingly accurate 4th-order physics environment.'
logo: '../../assets/delta-v-lab.png'
githubUrl: 'https://github.com/dhaatrik/professional-rocket-launch-simulation'
progress: '50Hz deterministic RK4 integration, VAB'
order: 2
tags: ['TypeScript', 'Vanilla DOM', 'Web Workers', 'esbuild', 'Vitest']
---

## What is DeltaV Lab and why was it built?

Dhaatrik wanted to create a platform that combines the creative freedom of Kerbal Space Program with the rigorous mathematical validation required by real-world engineering. By moving simulation logic into dedicated Web Workers and using deterministic integration, DeltaV Lab provides a high-fidelity tool for researchers, students, and "solopreneur" space enthusiasts to test complex orbital maneuvers and vehicle designs without the cost of proprietary software.

## How did Dhaatrik approach the implementation?

The primary challenge was managing heavy mathematical calculations in a single-threaded browser environment. Dhaatrik offloaded the physics loop and gravity equations into a dedicated Web Worker thread. A custom communication protocol was established to synchronize the main UI state with the worker's simulation tick at a steady 50Hz, avoiding main-thread blocking and frame drops.

## What technologies were used in the stack?

- **TypeScript & Vanilla DOM**: Zero external runtime dependencies in the main page loop to optimize performance and paint operations.
- **Web Workers**: Threaded processing for deterministic orbital calculations.
- **esbuild**: Used for fast bundling of worker modules.
- **Vitest**: Rigorous unit tests to validate the integration algorithms against actual analytical formulas (e.g., standard Keplerian motion equations).

## What is the current progress and outcome?

Currently, the engine implements a 50Hz deterministic Runge-Kutta 4th-order (RK4) integration scheme. It features a basic Vehicle Assembly Building (VAB) to build stages, and successfully renders orbit projections and trajectory vectors.
