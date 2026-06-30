---
title: 'Why FuelDrop — On-Demand Fuel UX Prototype vs Real Logistics'
description: 'Honest origin story for FuelDrop v3.0.0: frontend-only fuel delivery UX demo with customer + captain surfaces — not WebSocket production logistics.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['fueldrop', 'react', 'pwa', 'ux-demo']
clearance: 'PUBLIC'
readingTime: '11 min'
hasMath: false
series: 'FuelDrop'
seriesOrder: 1
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: FuelDrop (github.com/dhaatrik/fueldrop)
- VERSION: v3.0.0
- SCOPE: Frontend-only fuel delivery UX demo — customer app + captain dashboard
- NOT SHIPPED: Backend, WebSockets, payment gateway, live telematics GPS
- MOTIVATION: Refueling still feels like a destination errand in an on-demand world
- KEY LESSON: My portfolio claimed high-concurrency production logistics; repo is client demo
====================================================================
```

### Mission Report: Fuel to Your Door — UI First, Infrastructure Later

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. My portfolio described FuelDrop as **high-concurrency production logistics** with **WebSocket live driver tracking**. The GitHub repo at **v3.0.0** is a **frontend-only React demo**: mobile ordering flow, vehicle garage, captain dashboard at `/captain`, Leaflet map UI, simulated OTP `1234`, and neo-brutalist polish — **no backend in the repository**.

I am fixing that tone mismatch here.

---

### Mission Report: The Why — What Problem Was I Actually Solving?

Three frustrations stacked:

1. **Refueling is still a destination trip.** Everything else arrives at your door; fuel often does not. Even as a thought experiment, the UX for "order fuel like food delivery" is under-explored in my portfolio.

2. **Fleet operators need shared visibility.** Multiple vehicles, dispatch mental load, ETAs that live in someone's head — I wanted interfaces for **customer** and **captain** in one codebase.

3. **Mobile-first logistics UI is hard.** Order states, map markers, grace-period edits, promo sheets — lots of surfaces that break if you design desktop-first.

FuelDrop is a **UX prototype** for on-demand fuel flows — not a production dispatch platform.

---

### Mission Report: What FuelDrop Ships Today — Concrete Scope

As of **v3.0.0**:

| Surface | What you do there |
|---------|-------------------|
| **Customer app** | OTP login (simulated `1234`), vehicle garage, order by liters/rupees, promo codes, 60s edit grace period |
| **Captain dashboard** (`/captain`) | Accept orders, status pipeline, Google Maps deep link navigate |
| **Fleet mode** (`/fleet`) | Bulk multi-vehicle checkout demo |
| **Map UI** | Leaflet-based tracking presentation — client state, not live telematics |
| **PWA** | `vite-plugin-pwa` for installable demo |

Stack: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Leaflet, Motion, react-hook-form + Zod, Vitest.

**Not in repo:** Express/Firebase backend, WebSocket server, payment gateway, real GPS feeds, captain earnings backend ("Coming Soon" in README).

---

### Mission Report: Who I Built It For (and Who Should Skip It)

**Built for:**

- Developers exploring dual-surface delivery UX (customer + captain) in one SPA
- Designers studying neo-brutalist mobile flows and order-state choreography
- Anyone forking a MIT-licensed fuel-delivery **demo** as a UI starting point

**Not built for:**

- Production fuel logistics, compliance, or fleet telematics
- Real-time driver tracking over WebSockets — not implemented
- Payment processing or regulatory fuel-dispatch operations

---

### Mission Report: Fuckups & Learnings

- **Portfolio overstated infrastructure.** WebSockets, high-concurrency server architecture, database rollback — fiction for this repo. The honest fuckup is **optimistic UI on mock state** without clarifying there is no server to fail.
- **README marketing vs demo reality.** "Cutting-edge platform" copy sells ambition; `package.json` is a Vite SPA. Label the demo honestly.
- **Simulated OTP is fine for demos** — but must be loud (`1234` in README) so nobody ships it to production unchanged.
- **Captain earnings "Coming Soon"** is a feature honesty marker — I prefer that over fake numbers.

---

### Mission Report: Current State & Key Artifacts

```bash
git clone https://github.com/dhaatrik/fueldrop.git
cd fueldrop
npm install
npm run dev
# http://localhost:3000 — captain at /captain
```

```bash
npm test
npm run lint
npm run build
```

MIT licensed. PWA-capable via vite-plugin-pwa.

---

### Mission Report: Closing Transmission

Order fuel in the UI. Accept it on the captain screen. Watch demo map states move. That is FuelDrop today — polished **prototype**, not production ops.

Stack tradeoffs: [tech-stack transmission](/transmissions/fueldrop-tech-stack/). Demo limits and MIT scope: [open demo, simulated OTP](/transmissions/fueldrop-free-demo-scope/). Full tables: [FuelDrop project page](/projects/fueldrop/).