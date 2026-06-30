---
title: 'DeltaV Lab Flight Computer — Teaching Autopilot Without Faking Physics'
description: 'How the WHEN/THEN DSL guides real launches in DeltaV Lab — parser design, condition variables, and why scriptable GNC beats cinematic autopilot.'
pubDate: 2026-06-27
updatedDate: 2026-06-30
heroImage: '../../assets/og/deltav-lab-transmissions.jpg'
tags: ['aerospace', 'deltav-lab', 'guidance']
clearance: 'PUBLIC'
readingTime: '8 min'
hasMath: false
series: 'DeltaV Lab'
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: DeltaV Lab programmable flight computer (DSL)
- SYNTAX: WHEN <condition> THEN <action>
- MODULES: FlightScript.ts, FlightComputer.ts, PhysicsWorker.ts
- KEY LESSON: Autopilot should read telemetry and command thrust — not teleport
====================================================================
```

### Mission Report: Why a DSL Instead of a Magic "Go to Orbit" Button

**SYS.STATUS:** FC_MODULE: ONLINE // SCRIPT_PARSER: ARMED

Kerbal Space Program has MechJeb. Real launch vehicles have flight software. The gap between them is not just code volume — it is **accountability**. A good autopilot reads sensors, compares against thresholds, and commands actuators. A bad autopilot teleports you to success.

DeltaV Lab's flight computer is my attempt to teach the good pattern in a browser. It is implemented in `src/guidance/FlightScript.ts` (parser) and `FlightComputer.ts` (runtime), executing inside the same Web Worker as RK4 physics so guidance and integration share one clock.

Context: [why DeltaV Lab exists](/transmissions/deltav-lab-why-and-what/) · [physics stack](/transmissions/deltav-lab-science/) · [limitations](/transmissions/deltav-lab-not-professional-grade/)

---

### Mission Report: The Language

Scripts use one command per line:

```text
WHEN ALTITUDE > 1000 THEN PITCH 80
WHEN ALTITUDE > 10000 THEN PITCH 60
WHEN ALTITUDE > 30000 THEN PITCH 45
WHEN APOGEE > 100000 THEN THROTTLE 0
WHEN VELOCITY > 2000 AND ALTITUDE > 50000 THEN STAGE
```

**Conditions** can chain with `AND` / `OR`. Variables include `ALTITUDE`, `VELOCITY`, `VERTICAL_VEL`, `HORIZONTAL_VEL`, `APOGEE`, `FUEL`, `TIME`, `THROTTLE`, `DYNAMIC_PRESSURE`.

**Actions:** `PITCH <deg>`, `THROTTLE <0-100>`, `STAGE`, `SAS <mode>`, `ABORT`.

Press **`F`** to open the script editor, **`G`** to arm the computer before liftoff. The worker handles `FC_LOAD_SCRIPT`, `FC_START`, `FC_STOP`, and `FC_PAUSE` commands.

---

### Mission Report: What Happens Each Tick

When the flight computer is active (`PhysicsWorker.ts`):

1. `flightComputer.update(vessel, simDt)` evaluates pending `WHEN` clauses against live telemetry
2. Matched actions set throttle, target pitch (converted to gimbal via a simple P-controller), or trigger staging
3. `ABORT` cuts thrust and posts an event to the main thread

There is no separate physics path for autopilot. If your script stages too early, you lose altitude. If you throttle to zero before apoapsis is high enough, you re-enter. The integrator does not care who wrote the script.

---

### Mission Report: SAS Modes

`SAS OFF | STABILITY | PROGRADE | RETROGRADE` gives students a taste of attitude-hold logic without implementing full 6DOF — another scope honesty moment. SAS modes inform gimbal targeting; they do not replace the [2D limitations](/transmissions/deltav-lab-not-professional-grade/) of the sim.

---

### Mission Report: Fuckups & Learnings

- **Parser strictness is a feature.** Invalid lines return line-numbered errors at load time — better than silent failure at Max-Q.
- **One-shot commands** (`STAGE`, `ABORT`) prevent infinite restaging loops. Obvious in hindsight; painful before I added state flags.
- **This is not SIL.** Real flight software runs the same binary on hardware-in-the-loop. Our DSL is educational shape, not certifiable GNC.

---

### Closing Transmission

The flight computer exists so you can _program_ a gravity turn, watch it fail, fix the script, and rerun — same deterministic physics every time.

Try the README example, then break it on purpose. That is cheaper than breaking a real upper-stage burn.

Controls reference: [simulation_controls.md](https://github.com/dhaatrik/professional-rocket-launch-simulation/blob/main/simulation_controls.md)