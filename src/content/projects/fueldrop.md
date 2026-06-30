---
title: 'FuelDrop'
description: 'Frontend-only fuel delivery UX demo v3.0.0 — customer ordering, captain dashboard, Leaflet map UI, PWA. Not WebSocket production logistics.'
logo: '../../assets/fueldrop.png'
githubUrl: 'https://github.com/dhaatrik/fueldrop'
progress: 'v3.0.0 — polished client demo (customer + captain), no backend'
transmissionTag: 'fueldrop'
order: 3
tags: ['React 19', 'TypeScript 5.8', 'Vite 6', 'Tailwind CSS 4', 'Leaflet', 'PWA']
pain_level: 3
telemetry: 'STATUS: DEMO // BACKEND: NONE // OTP: SIMULATED_1234'
fuckup_teaser: "I described WebSocket live tracking and server rollbacks on this site — the repo is a frontend-only demo where optimistic UI runs on mock state with no database to fail."
---

## SYS.STATUS: v3.0.0 demo — dual-surface fuel UX, simulated auth, no dispatch backend

[FuelDrop](https://github.com/dhaatrik/fueldrop) is a **frontend-only** React SPA that prototypes on-demand fuel delivery: customer ordering (vehicle garage, liters/rupees, promos, 60s edit grace), **captain dashboard** at `/captain`, fleet mode at `/fleet`, and Leaflet map **presentation** — not live telematics.

This page tones down portfolio copy that implied **WebSocket production logistics** and **high-concurrency server architecture**. The README markets boldly; `package.json` is a Vite client with `vite-plugin-pwa`.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **Customer app** | Simulated OTP (`1234`), garage, order flow, promos, emergency surge UI, favorites |
| **Captain dashboard** | Accept orders, status pipeline, Google Maps navigate link |
| **Fleet mode** | Bulk multi-vehicle checkout demo |
| **Map UI** | Leaflet tracking states — client-side demo, not GPS ingest |
| **PWA** | Installable via vite-plugin-pwa |

Stack: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Leaflet, Motion, react-hook-form, Zod, Vitest.

## Who I built it for

- Developers studying customer + captain delivery UX in one repo
- Designers exploring neo-brutalist mobile order flows
- Forkers wanting MIT-licensed fuel-delivery **UI** starter code

**Not for:** production fuel dispatch, WebSocket driver tracking, payments, or regulatory logistics operations.

## Fuckups & learnings

- **Infrastructure fiction on portfolio.** WebSockets, DB rollback, high-concurrency ops — not in repo. Honest pain: optimistic UI on **mock state** without saying "demo."
- **README vs reality gap.** "Cutting-edge platform" copy outruns the no-backend truth.
- **Simulated OTP must stay labeled.** `1234` is documented — do not ship unchanged to production.
- **Captain earnings stub.** README says "Coming Soon" — better than fake ledgers.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **No backend** | No server, WebSocket, or database in repository |
| **Simulated auth** | OTP `1234` — not SMS gateway |
| **No payments** | Checkout UI only |
| **Map is demo-grade** | Leaflet UI states, not live telematics |
| **Captain earnings** | Not implemented ("Coming Soon") |

## Deep-dive transmissions

Read in order:

1. [Why FuelDrop — UX prototype vs real logistics](/transmissions/fueldrop-why-and-what/)
2. [Tech stack — client-only vs what needs a backend](/transmissions/fueldrop-tech-stack/)
3. [Open demo, simulated OTP, MIT scope](/transmissions/fueldrop-free-demo-scope/)

## Run it locally

```bash
git clone https://github.com/dhaatrik/fueldrop.git
cd fueldrop
npm install
npm run dev
# Customer: http://localhost:3000 — Captain: /captain
```

Tests: `npm run test` — Vitest. CI on push.

## Closing transmission

Polished fuel-delivery **interfaces**, honest mock backend. If you want the WebSocket story I used to tell, read [why-and-what](/transmissions/fueldrop-why-and-what/) for the correction.