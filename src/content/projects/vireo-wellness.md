---
title: 'Vireo Wellness'
description: 'Wellness UI demo v2.0.0 — mock meals, glucose charts, simulated devices. Vision is private offline journal; shipped scope is frontend prototype.'
logo: '../../assets/vireo-wellness.png'
githubUrl: 'https://github.com/dhaatrik/vireo-wellness'
progress: 'v2.0.0 — UI demo with mock data (not offline PWA yet)'
transmissionTag: 'vireo-wellness'
order: 9
tags: ['React 19.1', 'TypeScript 5.8', 'Vite 6', 'Tailwind CSS 4', 'Recharts']
pain_level: 2
telemetry: 'STATUS: DEMO // DATA: MOCK // PERSISTENCE: NOT_SHIPPED'
fuckup_teaser: "I described Vireo as an offline PWA with IndexedDB and a meditation timer on this site — the repo ships mock-data UI with simulated Bluetooth and no persistence layer."
---

## SYS.STATUS: v2.0.0 demo — polished wellness UI, mock data, simulated devices

[Vireo Wellness](https://github.com/dhaatrik/vireo-wellness) is a React SPA that demonstrates a calm, mobile-optimized health tracking interface: dashboard nutrition stats, meal logging from a built-in food database, blood glucose charts, and **simulated** Bluetooth device pairing. The upstream README states it is **currently powered by comprehensive mock data**.

This page splits **vision** from **shipped** because my portfolio previously claimed IndexedDB, PWA install, and meditation features that are not in the repo.

## What it is (scope)

### Vision (where I want this to go)

- Private health journal with data on **your** device — no cloud rent on sensitive notes
- Offline-first PWA after persistence is wired
- Real device integrations when APIs exist
- Calm UX without streak-guilt gamification

### Shipped today (what v2.0.0 proves)

| Surface | What you do there |
|---------|-------------------|
| **Dashboard** | "Eaten" nutrition summary, interactive blood glucose chart (mock-populated) |
| **Daily Meals** | Log meals by category; search built-in food DB; view macros |
| **Devices** | Simulated Bluetooth scan, pairing animation, battery/status display |
| **Timeline** | Date picker for navigating logs and goals |
| **Theme** | Permanent dark mode (Tailwind CSS v4) |

Stack: React 19.1, TypeScript 5.8, Vite 6, Tailwind 4, Recharts, Framer Motion, React Router 7, Vitest + Playwright.

**Not shipped:** `vite-plugin-pwa`, IndexedDB/local persistence, meditation timer, Web Bluetooth, real health backend.

## Who I built it for

- Developers prototyping wellness UI before backend integration
- Anyone evaluating meal-logging and chart layouts with realistic mock flows
- Future-me when persistence and PWA plugins get wired

**Not for:** users expecting offline journal persistence today, real CGM/device data, or meditation timer functionality.

## Fuckups & learnings

- **Portfolio ahead of repo.** IndexedDB, 100% offline, meditation timer — marketing fiction at v2.0.0. README correctly leads with mock data.
- **Mock data is a design tool, not a privacy product.** Entries do not survive refresh until storage ships.
- **Simulated Bluetooth teaches UX early.** Pairing flows and status chips without permission dialogs.
- **Calm UI over streak hell.** Wellness surfaces should not punish broken habits.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **Mock data** | Charts and meals demonstrate UI — not your real health records |
| **No persistence** | No IndexedDB/localStorage journal in shipped deps |
| **No PWA** | No `vite-plugin-pwa` in `package.json` |
| **Simulated devices** | Bluetooth pairing is UI simulation, not Web Bluetooth |
| **No meditation timer** | Not implemented in this repo |

## Deep-dive transmissions

Read in order for the full story:

1. [Why Vireo — wellness UI today vs the private journal I advertised](/transmissions/vireo-wellness-why-and-what/) — vision vs shipped, mock-data honesty

## Run it locally

```bash
git clone https://github.com/dhaatrik/vireo-wellness.git
cd vireo-wellness
npm install
npm run dev
```

Tests: `npm run test` — Vitest. CI: lint → test → build.

## Closing transmission

Polished surface, honest mock data, simulated devices. The journal I want is coming; the demo I have is already useful for UI iteration. Start with [why-and-what](/transmissions/vireo-wellness-why-and-what/) if you want the full vision-vs-shipped confession.