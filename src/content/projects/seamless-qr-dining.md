---
title: 'Seamless QR Dining'
description: 'Next.js 16 restaurant demo v3.0.0 — QR table join, customer ordering, kitchen dashboard. Context sync, not WebSocket production infra.'
logo: '../../assets/seamless-qr-dining.png'
githubUrl: 'https://github.com/dhaatrik/seamless-qr-dining'
progress: 'v3.0.0 — demo complete, 77 Jest tests, not production-hardened'
transmissionTag: 'seamless-qr-dining'
order: 8
tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 3', 'Framer Motion']
pain_level: 3
telemetry: 'STATUS: DEMO // SYNC: CONTEXT_IN_MEMORY // TESTS: 77'
fuckup_teaser: "I described WebSocket reconnect failures on this site — the repo syncs orders via React Context in one Next process, and the real demo bug class is wrong-table identity, not socket drops."
---

## SYS.STATUS: v3.0.0 demo — customer + kitchen surfaces, Context order bus, 77 tests

[Seamless QR Dining](https://github.com/dhaatrik/seamless-qr-dining) is a **Next.js 16 demo** for contactless table ordering: customers join via `?table=N`, browse a digital menu, customize items, and track order status; kitchen staff use `/kitchen` with a three-column board and audio alerts on new orders.

**Real-time** here means **React Context** (`OrderContext`, `AuthContext`) in a single Next process — not a distributed WebSocket server. My portfolio previously claimed WebSockets and a generic Node.js backend; the repo is Next.js end-to-end.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **Customer** | Guest menu, cart, item customization, virtual waiter, order tracking |
| **Kitchen** | New → Active → Completed pipeline, status transitions, audio alerts |
| **Auth** | Simulated OTP (phone `1234567890`, OTP `1234`) |
| **Menu** | Static categorized data (starters, mains, desserts, drinks) |
| **API** | `verify-otp` route for demo authentication |

Stack: Next.js 16, React 19, TypeScript, Tailwind CSS 3, Framer Motion, Jest (**77 tests, 18 suites**), GitHub Actions CI.

## Who I built it for

- Developers exploring dual-surface restaurant UX (customer + kitchen) in one repo
- Teams evaluating QR table-order flows before investing in socket infra
- Forkers wanting MIT-licensed ordering **demo** with test coverage

**Not for:** production restaurant ops, payments, multi-branch menu CMS, or multi-instance realtime without additional backend work.

## Fuckups & learnings

- **WebSocket fiction on portfolio.** Reconnect-drop story did not match repo — Context sync replaced sockets for the demo spine.
- **Table identity matters early.** `?table=N` simulates QR join; without it, orders bleed across tables in demos.
- **Kitchen UX equals customer UX.** Expo readability during rush is part of the product, not an afterthought.
- **77 tests ≠ production certification.** They help refactors; they do not replace durable storage or load testing.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **In-memory orders** | Context state — not production database |
| **No payments** | Checkout UI only |
| **Static menu** | No admin CMS for branches |
| **Single-instance sync** | Not distributed WebSocket rooms |
| **Simulated OTP** | Documented test credentials only |

## Deep-dive transmissions

Read in order:

1. [Why QR table ordering — customer + kitchen in one demo](/transmissions/seamless-qr-dining-why-and-what/)
2. [Tech stack — Next.js 16 and Context order bus](/transmissions/seamless-qr-dining-tech-stack/)
3. [Prototype honesty — simulated vs real restaurant needs](/transmissions/seamless-qr-dining-prototype-honesty/)

## Run it locally

```bash
git clone https://github.com/dhaatrik/seamless-qr-dining.git
cd seamless-qr-dining
npm install
npm run dev
# Customer: http://localhost:3000/?table=1 — Kitchen: /kitchen
```

Tests: `npm run test` — **77 tests, 18 suites**. CI: lint → test → build.

## Closing transmission

The demo proves the UX spine — table join, order, kitchen board. Everything ops-heavy is homework I am not pretending is done. Start with [why-and-what](/transmissions/seamless-qr-dining-why-and-what/).