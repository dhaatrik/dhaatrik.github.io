---
title: 'FuelDrop — Open Demo, Simulated OTP, Not Production Fuel Ops'
description: 'MIT-licensed FuelDrop v3.0.0 is a free UX demo — simulated auth, no payments, no live logistics. Honest scope for forkers and evaluators.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['fueldrop', 'open-source', 'mit', 'demo']
clearance: 'PUBLIC'
readingTime: '9 min'
hasMath: false
series: 'FuelDrop'
seriesOrder: 3
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: FuelDrop licensing and demo limits
- LICENSE: MIT
- PRICING: $0 — no SaaS, no hosted dispatch tier
- AUTH: Simulated OTP 1234 — not production SMS
- LIMITS: No payments, no WebSocket infra, captain earnings stub
- KEY LESSON: Free open demo ≠ licensed fuel transport operation
====================================================================
```

### Mission Report: Free to Fork, Not Free to Operate a Fuel Business

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

FuelDrop is MIT-licensed and costs nothing to clone. That means you can study the UX, fork the captain dashboard, and remix the neo-brutalist flows.

It does **not** mean you can operate real fuel delivery without backends, regulators, and payment rails this repo does not include.

---

### Mission Report: What MIT Free Covers

- Use, modify, distribute, commercial fork — with copyright notice preserved
- Self-host the static/Vite build on your own infra
- No account lock-in — there is no FuelDrop cloud

MIT is not zero legal text. Software provided as-is.

---

### Mission Report: Demo Scope — Simulated vs Real

| Feature | Demo reality |
|---------|--------------|
| **OTP login** | Test OTP `1234` — README documents it |
| **Tracking** | UI states + Leaflet — not live driver telematics |
| **Payments** | Not implemented |
| **Captain earnings** | README: "Coming Soon" |
| **Emergency surge** | UI pricing toggle — no settlement backend |
| **Promo codes** | Client-side validation (e.g., `FIRST50`) |

---

### Mission Report: Fuckups & Learnings

- **Do not ship demo OTP to production.** Replace with real auth before any public launch.
- **"High-concurrency" was portfolio poetry.** Concurrency here means React concurrent rendering — not 10k dispatch events/sec.
- **README superlatives need dull-truth footnotes.** "Cutting-edge platform" + no server = credibility debt.
- **Free demo helps learners; it does not replace compliance.** Fuel transport has real-world rules this repo does not model.

---

### Mission Report: Closing Transmission

Clone it. Run captain mode. Break the ETA UX. Just do not point a real fleet at mock state and call it shipped.

Back to [project page](/projects/fueldrop/) for scope tables. Origin story: [why-and-what](/transmissions/fueldrop-why-and-what/).