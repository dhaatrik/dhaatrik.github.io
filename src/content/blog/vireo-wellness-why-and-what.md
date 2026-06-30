---
title: 'Why Vireo — Wellness UI Today vs the Private Journal I Advertised'
description: 'Honest origin story for Vireo Wellness v2.0.0: a mock-data wellness UI demo with meals, glucose charts, and simulated devices — not an offline PWA journal yet.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['vireo-wellness', 'react', 'wellness', 'ui-demo']
clearance: 'PUBLIC'
readingTime: '11 min'
hasMath: false
series: 'Vireo Wellness'
seriesOrder: 1
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Vireo Wellness (github.com/dhaatrik/vireo-wellness)
- VERSION: v2.0.0
- SHIPPED: Wellness UI demo with mock data — meals, glucose chart, simulated Bluetooth
- NOT SHIPPED: PWA plugin, IndexedDB persistence, meditation timer, real health backend
- MOTIVATION: Fragmented wellness UIs vs. a calm single-page health surface
- KEY LESSON: Privacy intent is real; persistence claims on my portfolio were ahead of the repo
====================================================================
```

### Mission Report: The Journal I Promised vs the Demo I Shipped

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. My portfolio described Vireo Wellness as an **offline-first PWA** with **IndexedDB persistence** and a **meditation timer**. The GitHub repo at **v2.0.0** is honest about something different: a **wellness UI demo powered by comprehensive mock data** — dashboard nutrition stats, meal logging from a built-in food database, blood glucose charts, and **simulated** Bluetooth device pairing.

I am fixing that gap here. The vision is not fake; the **shipped scope** was mislabeled on this site.

---

### Mission Report: The Why — What Problem Was I Actually Solving?

Three frustrations stacked:

1. **Health tracking UIs feel fragmented.** Calories in one app, glucose in another, device pairing screens that look like afterthoughts. I wanted one calm, mobile-optimized surface that *feels* like a native wellness app.

2. **Privacy matters for health data.** I still believe sensitive notes belong on **your** device, not my server. That intent shaped the design — dark theme, no accounts in the demo, no analytics pipeline. But intent without persistence wiring is **vision**, not **shipped product**.

3. **Charts need data before backends exist.** Mock data lets me tune Recharts layouts, meal flows, and device pairing animations without waiting for a CGM API or food database service. The README says it plainly: mock data demonstrates a **frontend architecture ready for backend integration**.

Vireo today is a **UI prototype**, not the private offline journal I advertised.

---

### Mission Report: What Vireo Ships Today — Concrete Scope

As of **v2.0.0**, the repo delivers:

| Surface | What you do there |
|---------|-------------------|
| **Dashboard** | Nutrition "Eaten" stats, interactive blood glucose chart (mock-populated) |
| **Daily Meals** | Log Breakfast/Lunch/Dinner/Snack from built-in food DB with macros |
| **Devices** | Simulated Bluetooth scan, pairing animation, battery/status UI |
| **Timeline** | Date picker to navigate past logs and future goals |
| **Theme** | Permanent dark mode via Tailwind CSS v4 |

Stack: React 19.1, TypeScript 5.8, Vite 6, Tailwind 4, Recharts, Framer Motion, React Router 7, Vitest + Playwright in devDependencies.

**Not in `package.json`:** `vite-plugin-pwa`, IndexedDB libraries, meditation timer modules, Web Bluetooth API usage.

---

### Mission Report: Vision vs Shipped (Be Explicit)

| Vision (why I care) | Shipped (what the repo proves today) |
|---------------------|--------------------------------------|
| Offline-first private journal | Client-side SPA; **no PWA install path wired** |
| Data stays on your device | **Mock data** — nothing persists across refresh unless you add storage |
| Meditation timer | **Not implemented** in this repo |
| Real device pairing | **Simulated** pairing UX only |
| IndexedDB persistence | **Not shipped** — my portfolio claimed it; README does not |

I am not abandoning the vision. I am stopping the lie that v2.0.0 already is the journal.

---

### Mission Report: Fuckups & Learnings

- **I marketed persistence I had not built.** IndexedDB, 100% offline, meditation timer — portfolio copy from an earlier mental model. The upstream README correctly leads with mock data. Lesson: **grep `package.json` before claiming PWA or storage**.
- **Mock data vs privacy marketing is a credibility trap.** Saying "your data never leaves your device" sounds great until users realize entries do not survive a reload. Honest label: **UI demo**.
- **Simulated Bluetooth is useful anyway.** Pairing animations and status chips teach layout before Web Bluetooth permissions get involved.
- **Wellness UI should stay calm.** I avoided streak guilt and gamification noise — that design choice survives whether data is mock or real.

---

### Mission Report: Current State & Key Artifacts

Vireo Wellness **v2.0.0** runs locally with Vitest and Playwright available.

```bash
git clone https://github.com/dhaatrik/vireo-wellness.git
cd vireo-wellness
npm install
npm run dev
# Typically http://localhost:3000
```

```bash
npm run test
npm run lint
npm run build
```

MIT licensed. No backend required — because there is no backend yet.

---

### Mission Report: Closing Transmission

Explore the dashboard. Log a mock meal. Watch the glucose chart animate. Pair a simulated device. That is Vireo today — a polished wellness **surface** waiting for persistence and real data pipes.

If you are building health UI before your backend exists, mock data is fine — just do not let your portfolio pretend the journal already shipped. Full Vision vs Shipped tables live on the [Vireo project page](/projects/vireo-wellness/).