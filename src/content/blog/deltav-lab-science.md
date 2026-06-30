---
title: 'The Science Inside DeltaV Lab — Forces, Integration, and Flight Software'
description: 'What physics DeltaV Lab actually implements: 50Hz RK4, gravity, thrust, drag, atmosphere, Tsiolkovsky, DSL guidance, and Web Worker separation — sourced from the sim repo.'
pubDate: 2026-06-29
updatedDate: 2026-06-30
heroImage: '../../assets/og/deltav-lab-transmissions.jpg'
tags: ['aerospace', 'deltav-lab', 'physics', 'simulation']
clearance: 'PUBLIC'
readingTime: '14 min'
hasMath: true
series: 'DeltaV Lab'
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: DeltaV Lab physics & guidance stack
- INTEGRATION: RK4 at 50Hz (FIXED_DT = 0.02s) in Web Worker
- FORCES: inverse-square gravity, thrust (variable mass), drag, wind
- ENVIRONMENT: exponential atmosphere, layered wind, Dryden gusts
- GUIDANCE: WHEN/THEN DSL flight computer
- KEY LESSON: Real integrators in 2D — not a black-box game engine
====================================================================
```

### Mission Report: Status — Physics Loop Online

**SYS.STATUS:** RK4_50HZ_ACTIVE // WORKER: ISOLATED // MAIN_THREAD: PAINT_ONLY

This transmission is the technical counterpart to [why DeltaV Lab exists](/transmissions/deltav-lab-why-and-what/). Everything below is grounded in the **[professional-rocket-launch-simulation](https://github.com/dhaatrik/professional-rocket-launch-simulation)** repo — `src/physics/`, `src/core/PhysicsWorker.ts`, `src/config/Constants.ts`, `src/guidance/FlightScript.ts`. I am not inventing modules we did not ship.

If you want the "would I certify this?" answer, that lives in [the limitations transmission](/transmissions/deltav-lab-not-professional-grade/). Here I explain what the math _does_ do.

---

### Mission Report: Architecture — Why the Worker Owns Physics

The browser main thread has one job: paint UI and read input. Integration has a different job: advance state under thrust, drag, and gravity without stuttering the canvas.

DeltaV Lab offloads physics to a **dedicated Web Worker** (`PhysicsWorker.ts`). Each tick:

1. Environment updates (wind, gusts, density multiplier)
2. Manual controls or **flight computer** overrides apply to the tracked vessel
3. Every entity integrates with `applyPhysics(simDt)`
4. Fault injector modifies reliability state
5. State writes into a **SharedArrayBuffer** for zero-copy main-thread reads

The fixed timestep is **`FIXED_DT = 0.02` seconds → 50 Hz**. That is independent of display refresh; time-warp runs multiple substeps per frame when you hit `.` to speed up coast phases.

```
====================================================================
              MAIN THREAD              |     WEB WORKER
--------------------------------------------------------------------
  Canvas HUD, VAB UI, input            |  RK4 integration @ 50Hz
  Reads SharedArrayBuffer telemetry    |  Gravity, thrust, drag, aero
  Posts COMMAND / STEP messages        |  Environment, FTS, FC, faults
====================================================================
```

I chose RK4 over Euler because rocket acceleration changes fast — mass drops, thrust ramps, gravity weakens with altitude. First-order Euler lies about apoapsis timing in exactly the regimes where circularization burns matter.

---

### Mission Report: The Integration Step (RK4)

Each entity's `applyPhysics` advances position and velocity with **4th-order Runge-Kutta**. The orbit predictor in `OrbitalMechanics.ts` uses the same pattern — four derivative samples per step, combined with the classic $1/6$ weighting.

For a state vector $(\mathbf{r}, \mathbf{v})$ and acceleration $\mathbf{a}(\mathbf{r}, \mathbf{v}, t)$:

$$
\mathbf{k}_1 = \mathbf{f}(\mathbf{r}, \mathbf{v}), \quad
\mathbf{k}_2 = \mathbf{f}(\mathbf{r} + \tfrac{dt}{2}\mathbf{k}_1, \ldots), \quad \ldots
$$

$$
\mathbf{r}_{n+1} = \mathbf{r}_n + \frac{dt}{6}(\mathbf{k}_1 + 2\mathbf{k}_2 + 2\mathbf{k}_3 + \mathbf{k}_4)
$$

At 50 Hz, $dt = 0.02$ s. That is coarse for hypersonic transient aerodynamics — one honest limitation — but acceptable for smooth gravity and thrust-dominated ascent when validated against analytical cases (Vitest checks Keplerian motion and energy behavior).

---

### Mission Report: Gravity and Orbital Mechanics

Surface gravity uses $g_0 = 9.8\,\mathrm{m/s^2}$ with inverse-square attenuation:

$$
g(h) = g_0 \left(\frac{R_\oplus}{R_\oplus + h}\right)^2
$$

Earth radius $R_\oplus = 6{,}371{,}000\,\mathrm{m}$. Gravitational parameter $\mu = g_0 R_\oplus^2$ for orbital element math.

The `OrbitalMechanics.ts` module computes:

| Quantity | Method |
|----------|--------|
| Apoapsis / periapsis | Keplerian elements from $\mathbf{r}$, $\mathbf{v}$ |
| Circularization Δv | Vis-Viva: $v^2 = \mu\left(\frac{2}{r} - \frac{1}{a}\right)$ |
| Hohmann transfer | Two-burn plan with transfer time $T/2$ |
| Ground track | Spherical trig from downrange + Earth rotation ($\Omega_\oplus \approx 7.29\times10^{-5}\,\mathrm{rad/s}$) |

Launch site defaults to Cape Canaveral-ish coordinates in the module. The sim is **2D in the flight plane** — out-of-plane inclination is modeled through ground-track math, not full 3D attitude.

---

### Mission Report: Propulsion and Tsiolkovsky

Thrust comes from staged engines with sea-level and vacuum **specific impulse** values in `Constants.ts` (e.g. booster $I_{sp,\mathrm{vac}} = 311$ s, $I_{sp,\mathrm{SL}} = 282$ s). Mass decreases as propellant burns; thrust magnitude follows throttle and atmosphere pressure.

The rocket equation — the contract every staging event must respect:

$$ \Delta v = I_{sp} \cdot g_0 \cdot \ln \left( \frac{m_0}{m_f} \right) $$

The VAB computes Δv and TWR live so you see whether your stack can reach orbit **before** you ignite. When you launch, the sim integrates. If you come up 200 m/s short, you get an ellipse. No fake success banner.

---

### Mission Report: Atmosphere, Drag, and Max-Q

**Density** uses an exponential atmosphere with scale height $H = 7000\,\mathrm{m}$ and sea-level $\rho_0 = 1.225\,\mathrm{kg/m^3}$. For performance, `getAtmosphericDensity` uses a **precomputed LUT** with linear interpolation (50 m steps up to 200 km, then vacuum).

**Dynamic pressure:**

$$
q = \frac{1}{2}\rho v^2
$$

**Mach** uses a constant sea-level speed of sound $a_0 = 340\,\mathrm{m/s}$ — simplified, not altitude-varying.

Drag force ties to $C_D$, reference area, and relative wind (vehicle velocity minus atmosphere/wind velocity). The aerodynamics module also tracks **center of pressure vs. center of mass**, angle of attack, and stability margin — enough to teach why fins matter without full CFD.

---

### Mission Report: Environment — Wind and Go/No-Go

`Environment.ts` implements **altitude-layered wind profiles** (surface through stratosphere), **sinusoidal Dryden-style gusts**, optional **day/night density variation** ($\pm 2\%$), and **launch wind limits** (default 15 m/s surface).

Default layers are inspired by Cape Canaveral-ish shear — including a strong band around 5–15 km where **Max-Q wind warnings** trigger above 30 m/s. These are pedagogical models, not ECMWF GRIB imports. I say that plainly so you do not confuse them with range-safety wind towers.

---

### Mission Report: Thermal Protection

`ThermalProtection.ts` models **skin heating and heat-shield ablation** on re-entry — tied to shared-buffer telemetry fields (`SKIN_TEMP`, `HEAT_SHIELD`, `ABLATING`). This is thermodynamic flavor for teaching, not a material-science-grade TPS design tool.

---

### Mission Report: Flight Computer DSL

The guidance layer is a custom **domain-specific language** parsed in `FlightScript.ts`:

```text
WHEN ALTITUDE > 1000 THEN PITCH 80
WHEN ALTITUDE > 10000 THEN PITCH 60
WHEN APOGEE > 100000 THEN THROTTLE 0
WHEN VELOCITY > 2000 AND ALTITUDE > 50000 THEN STAGE
```

**Condition variables:** `ALTITUDE`, `VELOCITY`, `VERTICAL_VEL`, `HORIZONTAL_VEL`, `APOGEE`, `FUEL`, `TIME`, `THROTTLE`, `DYNAMIC_PRESSURE`

**Actions:** `PITCH`, `THROTTLE`, `STAGE`, `SAS` (OFF/STABILITY/PROGRADE/RETROGRADE), `ABORT`

The worker's `FlightComputer` evaluates scripts each tick; outputs override throttle, gimbal (via pitch error × P-gain), and can trigger staging callbacks. Press `F` to edit, `G` to arm. Full write-up: [flight computer transmission](/transmissions/deltav-lab-flight-computer/).

---

### Mission Report: Safety and Instructor Systems

These are not cosmetic — they exercise the same worker command bus:

| System | Role |
|--------|------|
| **Flight Termination System** | Corridor monitoring, arm timers, violation states |
| **Launch Checklist** | Pre-launch Go/No-Go gates |
| **Fault Injector** | Engine failures, leaks, sensor noise for training scenarios |
| **Black Box / CSV Export** | High-rate telemetry for `analysis.html` post-processing |

---

### Mission Report: What We Validate in Vitest

The repo enforces `npm run test` in CI. Tests cover analytical sanity — Keplerian orbits, staging math, parser edge cases — not side-by-side Falcon 9 flight telemetry. That distinction matters for professional-grade claims; see [limitations](/transmissions/deltav-lab-not-professional-grade/).

---

### Mission Report: Fuckups & Learnings

- **Constants.ts says `FPS = 60` but physics uses 50 Hz.** Display and simulation timesteps are not the same thing. Document both or people audit the wrong number.
- **2D physics simplifies the teaching story** but hides roll-yaw coupling, slosh, and TVC actuator dynamics — all listed in `path_to_perfection.md` as future 6DOF work.
- **Atmosphere LUT trades accuracy above 200 km for speed** — correct for a browser demo, wrong for exosphere drag analysis.

---

### Closing Transmission

DeltaV Lab's science stack is real: RK4 integration, variable-mass thrust, drag from dynamic pressure, layered wind, orbital element math, and a scriptable flight computer — all in a worker at 50 Hz.

It is also bounded: 2D, simplified atmosphere, no Monte Carlo, no published flight V&V. I would rather you know both truths than read my README badges and assume certification.

Next: [why it is not professional-grade](/transmissions/deltav-lab-not-professional-grade/). Previous: [why and what](/transmissions/deltav-lab-why-and-what/). Threading diary: [mission log](/transmissions/deltav-lab-mission-log/).