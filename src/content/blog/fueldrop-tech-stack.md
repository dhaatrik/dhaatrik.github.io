---
title: 'FuelDrop Tech Stack — React 19, Leaflet, PWA, and What Needs a Backend'
description: 'Why FuelDrop v3.0.0 is a Vite SPA with Leaflet and vite-plugin-pwa — and what client-only cannot ship for real fuel logistics.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['fueldrop', 'react', 'leaflet', 'pwa']
clearance: 'PUBLIC'
readingTime: '10 min'
hasMath: false
series: 'FuelDrop'
seriesOrder: 2
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: FuelDrop tech stack (v3.0.0)
- REPO: github.com/dhaatrik/fueldrop
- CLIENT: React 19 + Vite 6 + Tailwind 4 + Leaflet + vite-plugin-pwa
- MISSING: WebSocket server, payment API, auth backend, telematics ingest
- KEY LESSON: Client-only can demo logistics UX; it cannot dispatch real fuel
====================================================================
```

### Mission Report: The Stack Serves the Demo, Not the Fleet

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

FuelDrop's stack is chosen to **move pixels fast** on mobile — not to run a dispatch center. Read [why FuelDrop exists](/transmissions/fueldrop-why-and-what/) first; this is the engineering appendix.

---

### Mission Report: What I Picked (Client-Side)

| Layer | Choice | Why |
|-------|--------|-----|
| **UI** | React 19 + Vite 6 | Concurrent-friendly UI for multi-step order flows |
| **Forms** | react-hook-form + Zod | Typed checkout, fleet mode, promo validation |
| **Maps** | Leaflet + react-leaflet | Familiar map tiles for tracking **presentation** |
| **Motion** | Motion | Status transitions, sheets, neo-brutalist delight |
| **Routing** | react-router-dom | Customer routes + `/captain` + `/fleet` |
| **PWA** | vite-plugin-pwa | Installable demo on phones |
| **Tests** | Vitest + RTL | Order flow and component regressions |

No Express. No Socket.io. No database driver. That is the point.

---

### Mission Report: What Needs a Backend (Not Shipped)

| Capability | Why client-only is not enough |
|------------|------------------------------|
| **Real dispatch** | Captain assignment must be authoritative server-side |
| **Live GPS** | Telematics ingest + fan-out to customers |
| **Payments** | PCI, refunds, surge pricing settlement |
| **Auth** | Real OTP via SMS gateway — demo uses hardcoded `1234` |
| **Order persistence** | Multi-device truth, audit logs, dispute resolution |
| **WebSockets** | Stale marker problem needs server-coordinated state |

My portfolio claimed WebSocket tracking. The repo demonstrates **map UI states** — different layer.

---

### Mission Report: Fuckups & Learnings

- **Leaflet without telematics is theater** — useful theater for UX iteration, not operations.
- **PWA helps demos, not compliance.** Installable ≠ regulated fuel transport.
- **Zod schemas front-run backend contracts.** Good for later API design; dangerous if mistaken for shipped APIs.
- **Vitest catches UI lies early.** Grace-period countdowns and promo math need tests even in mock mode.

---

### Mission Report: Closing Transmission

React for surfaces. Leaflet for map chrome. PWA for pocket demos. Backend is homework.

MIT demo honesty: [open demo, simulated OTP](/transmissions/fueldrop-free-demo-scope/).