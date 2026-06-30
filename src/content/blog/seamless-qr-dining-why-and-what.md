---
title: 'Why QR Table Ordering — Customer + Kitchen Surfaces in One Demo'
description: 'Honest origin story for Seamless QR Dining v3.0.0: Next.js 16 demo with customer menu and kitchen dashboard — real-time via React Context, not WebSockets.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['seamless-qr-dining', 'nextjs', 'restaurant', 'demo']
clearance: 'PUBLIC'
readingTime: '11 min'
hasMath: false
series: 'Seamless QR Dining'
seriesOrder: 1
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Seamless QR Dining (github.com/dhaatrik/seamless-qr-dining)
- VERSION: v3.0.0
- SCOPE: Next.js 16 demo — QR table join, customer ordering, kitchen dashboard
- SYNC: React Context order bus in one process — not distributed WebSockets
- MOTIVATION: Paper tickets and shouted kitchen updates lose orders
- KEY LESSON: Portfolio claimed WebSocket + Node backend; repo uses Context sync
====================================================================
```

### Mission Report: One Channel for Table and Kitchen — Demo Spine

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. My portfolio described Seamless QR Dining as a **WebSocket prototype with a Node.js socket server** and production-pending sync. The GitHub repo at **v3.0.0** is a **Next.js 16 full-stack demo**: customer view (`?table=N`), kitchen dashboard at `/kitchen`, static menu data, simulated OTP — with **real-time** meaning **React Context** in a single Next process, not socket fan-out across tables.

I am fixing that here.

---

### Mission Report: The Why — What Problem Was I Actually Solving?

Three frustrations stacked:

1. **Orders die in translation.** Table → waiter → kitchen → expo screen. Each hop adds latency and mistakes.

2. **QR codes are not gimmicks if the UX is good.** Join a table-specific session, browse a menu on your phone, submit without installing an app — the idea is sound even when restaurants over-market it.

3. **Kitchen UX matters as much as customer UX.** A pretty menu fails if the expo board is unreadable during rush. I built **both surfaces** in one repo.

Seamless QR Dining is a **restaurant ordering demo** — proof that customer and kitchen can share one order bus in the browser.

---

### Mission Report: What Ships Today — Concrete Scope

As of **v3.0.0**:

| Surface | What you do there |
|---------|-------------------|
| **Customer** (`/?table=1`) | Guest menu, cart, customization, virtual waiter, order tracking |
| **Kitchen** (`/kitchen`) | Three-column pipeline (New → Active → Completed), audio alerts |
| **Auth** | Optional simulated OTP (phone `1234567890`, OTP `1234`) |
| **Order bus** | `OrderContext` + `AuthContext` — in-memory sync |

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 3, Framer Motion, Jest (77 tests, 18 suites), GitHub Actions CI.

**Not shipped:** Production database, payments, multi-branch CMS, distributed WebSocket rooms, multi-instance order replication.

---

### Mission Report: Fuckups & Learnings

- **WebSocket story was portfolio fiction.** I described reconnect drops killing orders; the repo never shipped a socket server. Real lesson: **Context sync works for single-tab demos** but wrong-table identity must be designed early (`?table=N`).
- **"Prototype complete, sync verified"** meant **kitchen tab sees customer orders in dev** — not production-hardened real-time infra.
- **77 tests are a maturity signal** — contexts, components, OTP API route, benchmarks — even when the backend is in-memory.
- **Kitchen audio alerts** help rush-mode testing — small detail, real ops value in demos.

---

### Mission Report: Current State & Key Artifacts

```bash
git clone https://github.com/dhaatrik/seamless-qr-dining.git
cd seamless-qr-dining
npm install
npm run dev
# Customer: http://localhost:3000/?table=1 — Kitchen: /kitchen
```

```bash
npm run test   # 77 tests, 18 suites
npm run lint
npm run build
```

MIT licensed.

---

### Mission Report: Closing Transmission

Scan table QR (simulated via URL). Order from your phone. Watch the kitchen board update. That is the demo spine — honest about Context, not sockets.

Tech depth: [Next.js 16 and Context order bus](/transmissions/seamless-qr-dining-tech-stack/). Production gaps: [what's simulated vs what restaurants need](/transmissions/seamless-qr-dining-prototype-honesty/). Project page: [Seamless QR Dining](/projects/seamless-qr-dining/).