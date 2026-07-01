---
title: 'Seamless QR Dining — What''s Simulated vs What a Real Restaurant Would Need'
description: 'Honest limits of Seamless QR Dining v3.0.0: in-memory orders, simulated OTP, no payments — and what production contactless dining actually requires.'
pubDate: 2026-07-10
updatedDate: 2026-07-10
tags: ['seamless-qr-dining', 'demo', 'mit', 'restaurant']
clearance: 'PUBLIC'
readingTime: '9 min'
hasMath: false
series: 'Seamless QR Dining'
seriesOrder: 3
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Seamless QR Dining prototype limits
- LICENSE: MIT
- DEMO: In-memory Context sync, static menu, simulated OTP
- MISSING: Payments, multi-branch CMS, durable DB, distributed realtime
- TESTS: 77 Jest tests — maturity signal, not production certification
- KEY LESSON: Demo v3.0.0 proves UX spine; ops tooling is a different product
====================================================================
```

### Mission Report: Prototype Honesty Is a Feature

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Seamless QR Dining v3.0.0 is **demo v3** — not "production pending" in the sense of one config flag away. This transmission lists what is **simulated** and what a real restaurant stack would still need.

---

### Mission Report: What's Simulated Today

| Area | Demo behavior |
|------|---------------|
| **Table join** | URL param `?table=N` stands in for QR scan |
| **Orders** | In-memory via React Context — lost on server restart |
| **Menu** | Static data files — not admin CMS |
| **OTP auth** | Phone `1234567890`, OTP `1234` |
| **Payments** | UI selection only — no gateway |
| **Real-time** | Same-process Context — not WebSocket rooms across instances |

---

### Mission Report: What a Real Restaurant Would Need

| Capability | Why the demo stops short |
|------------|-------------------------|
| **Durable order store** | Postgres/Firestore + idempotent writes |
| **Multi-device sync** | WebSockets/SSE or poll with authoritative server |
| **Payments** | PCI, refunds, split bills, tips |
| **Menu CMS** | Branch-specific items, 86'd dishes, modifiers |
| **Staff roles** | AuthZ for kitchen vs manager vs corporate |
| **Uptime & monitoring** | Rush-hour Friday is not `npm run dev` |
| **Compliance** | Tax receipts, local regulations — locale-specific |

77 tests prove **the demo spine is tested** — not that Friday rush at scale is solved.

---

### Mission Report: Fuckups & Learnings

- **I once claimed WebSocket reconnect bugs** — the honest bug class is **wrong-table Context** or **stale kitchen tab** in dev.
- **"Production pending" telemetry lied.** Status should read **demo / not production-hardened**.
- **Tests are signal, not certificate.** 18 suites help refactors; they do not replace load testing.
- **MIT free demo helps learners** — does not include POS integrations or franchise admin.

---

### Mission Report: Closing Transmission

Use the repo to study customer + kitchen UX in one codebase. Do not point a live restaurant at in-memory orders and call it done.

Origin: [why-and-what](/transmissions/seamless-qr-dining-why-and-what/). Stack: [tech-stack](/transmissions/seamless-qr-dining-tech-stack/). [Project page](/projects/seamless-qr-dining/).