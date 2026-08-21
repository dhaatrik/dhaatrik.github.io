---
title: 'DeltaV Lab Native Physics Core — Escaping the React/TypeScript Ceiling'
description: 'Engineering plan to extract RK4, atmosphere, and guidance from the browser worker into Rust/C++/Python — WASM for the UI, native binaries for Monte Carlo, and why that split matters for commercial adoption.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
heroImage: '../../assets/og/delta-v-lab-transmissions.jpg'
tags: ['aerospace', 'deltav-lab', 'rust', 'wasm', 'simulation']
clearance: 'PUBLIC'
readingTime: '14 min'
hasMath: true
series: 'DeltaV Lab'
seriesOrder: 8
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: DeltaV Lab native physics core migration
- FOCUS: Split React/TS UI from Rust/C++/Python integrator + batch engine
- KEY LESSON: Keep the cockpit in TypeScript; move truth physics to native code
- SEE ALSO: deltav-lab-whats-next (trust ladder), deltav-lab-science (current TS physics)
====================================================================
```

## Mission Log: Same UI, Different Engine Room

**SYS.STATUS:** ARCHITECTURE_REVIEW // WORKER: TS_LEGACY // TARGET: RUST_CORE + WASM

Right now, every force evaluation and RK4 stage in DeltaV Lab runs inside `PhysicsWorker.ts` — TypeScript, 50 Hz, single trajectory, one browser tab. React renders Mission Control; it does not integrate orbits. But the **physics package and the UI repo are the same deployment unit**, and that coupling is what blocks professional workflows.

This transmission is the technical companion to [what is next for DeltaV Lab](/transmissions/deltav-lab-whats-next/). I explain **how** I would split the stack without throwing away the VAB, DSL editor, or instructor tooling we already shipped.

Read [the science transmission](/transmissions/deltav-lab-science/) first if you need the current equation set.

---

## What Stays in TypeScript / React

| Layer                        | Keep in TS?       | Why                                         |
| ---------------------------- | ----------------- | ------------------------------------------- |
| VAB drag-and-drop            | Yes               | DOM UX, asset loading, live Δv/TWR displays |
| Mission Control HUD          | Yes               | Canvas/WebGL, input, time-warp UI           |
| DSL editor + checklist       | Yes               | Instructor workflows                        |
| Telemetry export / black box | Yes               | CSV client download, `analysis.html`        |
| **RK4 integrator**           | **No** (move out) | Hot loop, batch scaling, numeric policy     |
| **Atmosphere / drag tables** | **No**            | Large LUTs, SIMD-friendly                   |
| **Monte Carlo orchestrator** | **No**            | Parallelism, cluster jobs                   |
| **6DOF state propagation**   | **No**            | Quaternion math, coupling stiffness         |

React was never the problem. **Co-locating cert-shaped physics with UI bundling** is the problem.

---

## Target Architecture

<div class="architecture-diagram my-8 overflow-hidden rounded-xl border border-slate-300 dark:border-slate-800 bg-[#0d1117] p-4 sm:p-6 shadow-xl transition-all">
<div class="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 font-mono text-xs text-slate-400">
<div class="flex items-center gap-2">
<span class="inline-block h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
<span class="font-bold tracking-widest text-slate-200 uppercase">SYS.ARCH // DELTAV LAB TARGET ARCHITECTURE</span>
</div>
<span class="text-[10px] tracking-wider text-slate-500">[ HYBRID WASM + RUST DUAL-CORE ]</span>
</div>
<div class="overflow-x-auto">
<svg viewBox="0 0 820 380" width="100%" height="auto" class="font-mono text-xs min-w-[700px] select-none" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#06b6d4" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05"/>
</linearGradient>
<linearGradient id="rust-grad" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#f97316" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#ef4444" stop-opacity="0.05"/>
</linearGradient>
<linearGradient id="ops-grad" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#10b981" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#06b6d4" stop-opacity="0.05"/>
</linearGradient>
<marker id="arrow-cyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4"/>
</marker>
<marker id="arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 1 L 8 5 L 0 9 z" fill="#f97316"/>
</marker>
<marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M 0 1 L 8 5 L 0 9 z" fill="#10b981"/>
</marker>
</defs>
<rect x="10" y="20" width="370" height="340" rx="8" fill="url(#cyan-grad)" stroke="#06b6d4" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 4"/>
<text x="30" y="48" fill="#06b6d4" font-weight="bold" font-size="13" letter-spacing="1">BROWSER // TYPESCRIPT &amp; REACT</text>
<rect x="30" y="70" width="330" height="70" rx="6" fill="#151a22" stroke="#334155" stroke-width="1.5"/>
<text x="45" y="98" fill="#f1f5f9" font-weight="bold" font-size="12">Mission Control HUD + VAB</text>
<text x="45" y="122" fill="#94a3b8" font-size="10">React 19, WebGL Canvas, Time-Warp Controls</text>
<path d="M 195 140 L 195 210" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow-cyan)" marker-start="url(#arrow-cyan)"/>
<rect x="80" y="165" width="230" height="22" rx="4" fill="#0b0e14" stroke="#06b6d4" stroke-opacity="0.4"/>
<text x="92" y="180" fill="#06b6d4" font-size="9.5" font-weight="600">SharedArrayBuffer / WASM Linear Memory</text>
<rect x="30" y="220" width="330" height="70" rx="6" fill="#151a22" stroke="#334155" stroke-width="1.5"/>
<text x="45" y="248" fill="#f1f5f9" font-weight="bold" font-size="12">deltav_core.wasm</text>
<text x="45" y="272" fill="#94a3b8" font-size="10">wasm-pack compiled target for Web Worker (50 Hz)</text>
<path d="M 440 105 C 390 105, 390 255, 370 255" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arrow-orange)"/>
<rect x="420" y="20" width="390" height="210" rx="8" fill="url(#rust-grad)" stroke="#f97316" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 4"/>
<text x="440" y="48" fill="#f97316" font-weight="bold" font-size="13" letter-spacing="1">NATIVE // RUST WORKSPACE (deltav-core)</text>
<rect x="440" y="70" width="350" height="60" rx="6" fill="#151a22" stroke="#f97316" stroke-width="1.5"/>
<text x="455" y="96" fill="#f1f5f9" font-weight="bold" font-size="12">deltav-core Integrator</text>
<text x="455" y="118" fill="#fdba74" font-size="10">RK4 Equations of Motion, NRLMSISE-00, Quaternion 6DOF</text>
<rect x="440" y="150" width="165" height="60" rx="6" fill="#151a22" stroke="#334155" stroke-width="1.5"/>
<text x="452" y="174" fill="#f1f5f9" font-weight="bold" font-size="11">Monte Carlo Runner</text>
<text x="452" y="196" fill="#94a3b8" font-size="9.5">Rayon Multi-Core Batch</text>
<path d="M 520 130 L 520 150" stroke="#f97316" stroke-width="1.5" marker-end="url(#arrow-orange)"/>
<rect x="625" y="150" width="165" height="60" rx="6" fill="#151a22" stroke="#334155" stroke-width="1.5"/>
<text x="637" y="174" fill="#f1f5f9" font-weight="bold" font-size="11">PyO3 Bindings</text>
<text x="637" y="196" fill="#94a3b8" font-size="9.5">Jupyter / ML Pipeline</text>
<path d="M 710 130 L 710 150" stroke="#f97316" stroke-width="1.5" marker-end="url(#arrow-orange)"/>
<rect x="420" y="250" width="390" height="110" rx="8" fill="url(#ops-grad)" stroke="#10b981" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="4 4"/>
<text x="440" y="278" fill="#10b981" font-weight="bold" font-size="13" letter-spacing="1">OPS &amp; HARDWARE IN THE LOOP (HIL)</text>
<rect x="440" y="295" width="165" height="50" rx="6" fill="#151a22" stroke="#334155" stroke-width="1.5"/>
<text x="452" y="318" fill="#f1f5f9" font-weight="bold" font-size="11">deltav-cli</text>
<text x="452" y="336" fill="#94a3b8" font-size="9.5">CLI Batch Runner</text>
<path d="M 605 320 L 625 320" stroke="#10b981" stroke-width="2" marker-end="url(#arrow-emerald)"/>
<rect x="625" y="295" width="165" height="50" rx="6" fill="#151a22" stroke="#10b981" stroke-width="1.5"/>
<text x="637" y="318" fill="#f1f5f9" font-weight="bold" font-size="11">UDP HIL Bridge</text>
<text x="637" y="336" fill="#6ee7b7" font-size="9.5">Avionics &amp; Speedgoat</text>
<path d="M 615 115 C 625 130, 625 240, 520 295" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#arrow-emerald)"/>
</svg>
</div>
</div>

**Three deliverables from one Rust workspace:**

1. **`deltav-core`** — `cdylib` + `rlib`: equations of motion, environment models, vehicle loader.
2. **`wasm-pack` artifact** — Loaded by existing Web Worker shell (thin TS stub replaces fat `PhysicsWorker.ts`).
3. **`deltav-cli` + Python wheel** — `deltavlab simulate --vehicle falcon9.yaml --wind gfs_2026-07-01.grib --runs 10000`.

---

## Language Split (Rust vs C++ vs Python)

| Role                  | Rust                                                  | C++                                 | Python                                 |
| --------------------- | ----------------------------------------------------- | ----------------------------------- | -------------------------------------- |
| Real-time integrator  | **Primary choice** — memory safety, Rayon, WASM story | Legacy GNC shops often expect C++17 | Too slow for inner loop                |
| Batch Monte Carlo     | **Rayon** parallelism                                 | OpenMP teams already on STK glue    | Orchestration layer only               |
| Optimization (CasADi) | FFI bridge                                            | Mature in aerospace grad labs       | **Primary** for mission design scripts |
| Legacy algorithm port | Rewrite with tests                                    | Import Fortran/C++ GMAT heritage    | Prototype only                         |

**Why I lean Rust over C++ for the core:** One codebase → WASM + native + Python via `pyo3`. `cargo fuzz` and `#[cfg(test)]` on the same functions that ship. C++ wins if you are hiring from a pool that already maintains a 200k-line GNC library — I am not there yet.

**Where Python is mandatory:** Range safety officers and mission designers script in Python/MATLAB. They will not rewrite tooling in Rust. Expose:

```python
import deltavlab as dv

vehicle = dv.Vehicle.load("vehicles/falcon9_block5.json")
env = dv.Environment.from_gfs("wind_20260701.grib")
result = dv.simulate(vehicle, env, guidance="scripts/gravity_turn.dsl")
dispersion = dv.monte_carlo(vehicle, env, n=5000, thrust_sigma=0.03)
```

That is the difference between "cool GitHub project" and "runs in our Jupyter pipeline."

---

## Migration Phases (Strangler Pattern)

Do **not** big-bang rewrite `src/physics/` over a weekend. Strangle the worker:

#### Step 1 — Golden fixtures (week 1–2)

Export 50 representative trajectories from current TS worker (pad launch, staging, orbit insert, re-entry). JSON state snapshots every 0.02 s. These become **parity tests** for the Rust core.

#### Step 2 — Rust RK4 + 2D forces (week 3–6)

Port `FIXED_DT = 0.02`, gravity, thrust, exponential atmosphere, drag — no new physics yet. `cargo test` asserts `<1e-9` drift vs golden JSON on analytical cases.

#### Step 3 — WASM drop-in (week 7–8)

Replace integration loop body in worker with WASM calls. TypeScript keeps message protocol + SharedArrayBuffer layout. User sees no UI change.

#### Step 4 — Native CLI + Python (month 3)

Same crate, no WASM, run 10k cases on a server. Prove throughput win before adding 6DOF complexity.

#### Step 5 — 6DOF + slosh (month 4+)

Extend state vector; TS UI gains attitude telemetry channels. Golden tests **re-baseline** only after flight V&V says the old 2D model was wrong anyway.

---

## Worker Memory Contract (Keep What Worked)

The [mission log](/transmissions/deltav-lab-mission-log/) documents why SharedArrayBuffer beat chatty `postMessage`. Keep that design:

| Offset | Field                             | Type    |
| ------ | --------------------------------- | ------- |
| 0      | `time`                            | f64     |
| 8      | `pos_x`, `pos_y`                  | f64 × 2 |
| 24     | `vel_x`, `vel_y`                  | f64 × 2 |
| …      | attitude quaternion (6DOF future) | f64 × 4 |
| …      | thrust, mass, q_bar               | f64     |

WASM writes into the same buffer the Canvas reads. **Only the writer changes** — TS integrator out, Rust in.

---

## What Commercial Teams Will Scrutinize

1. **Determinism** — Same seed → bit-identical results on Linux CI (WASM may differ slightly; native is source of truth).
2. **FP policy** — Document use of `f64`; flag known JS/WASM divergence points if any remain in browser path.
3. **Build reproducibility** — `cargo vendor`, locked toolchain, Docker image for sim version `v2.3.1`.
4. **Coverage** — `cargo llvm-cov` on `deltav-core`; no physics PR under 85% branch coverage on force models.

This is the same bar described in [limitations](/transmissions/deltav-lab-not-professional-grade/) and the [full roadmap](/transmissions/deltav-lab-whats-next/) — I am repeating it because language migration without these gates is resume-driven development.

---

## C++ Interop (When You Must)

Some labs will hand you a C++ guidance kernel or legacy aerodynamic table generator. Plan for:

- **`cxx` bridge** or `bindgen` for a narrow FFI surface (`compute_forces(state*, env*) -> ForceTorque`).
- Rust owns integration and state; C++ owns **plug-in models** loaded as `.so` / `.dll` with explicit version pins.
- Never let C++ allocate into Rust memory without a written ABI doc.

I prefer minimizing this surface. But pretending aerospace is Rust-only is fantasy.

---

## Fuckups & Learnings: What I Am Preparing For

**Big-bang rewrite:** I will be tempted to rewrite VAB in Rust too. Wrong. UI stays TS until physics parity is proven.

**WASM-only dogma:** Browser WASM cannot host overnight 10k dispersion. Native binaries are not optional.

**Skipping golden tests:** Without TS→Rust parity fixtures, you will not know whether the new core regressed staging timing or just "looks similar."

**Python as inner loop:** Monte Carlo orchestration in Python, integration in Rust. Never the reverse.

---

## Closing Transmission

The professional version of DeltaV Lab is **not** "rewrite everything in Rust because Rust is cool." It is:

- **Rust/C++** for integration, environments, dispersion, HIL clocks.
- **Python** for glue, optimization, notebooks.
- **TypeScript/React** for the cockpit and classroom.

That split is how you get from [today's honest sandbox](/transmissions/deltav-lab-not-professional-grade/) toward something a commercial trajectory team could **pilot** — still not adopt on faith — while I publish the V&V reports that actually earn trust.

Repo: [github.com/dhaatrik/professional-rocket-launch-simulation](https://github.com/dhaatrik/professional-rocket-launch-simulation)

Roadmap context: [what is next](/transmissions/deltav-lab-whats-next/) · [science](/transmissions/deltav-lab-science/) · [`path_to_perfection.md`](https://github.com/dhaatrik/professional-rocket-launch-simulation/blob/main/path_to_perfection.md)

If you have shipped a WASM + native dual-target sim before, I would genuinely like to know whether you kept one state struct or maintained two. That decision haunts me at 2 AM.
