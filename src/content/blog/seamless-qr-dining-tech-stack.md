---
title: 'Seamless QR Dining Tech Stack — Next.js 16, Context Order Bus, Component Architecture'
description: 'Why Seamless QR Dining v3.0.0 uses Next.js App Router and React Context for order sync — not WebSockets or a separate Node socket server.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['seamless-qr-dining', 'nextjs', 'react', 'context']
clearance: 'PUBLIC'
readingTime: '10 min'
hasMath: false
series: 'Seamless QR Dining'
seriesOrder: 2
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Seamless QR Dining tech stack (v3.0.0)
- REPO: github.com/dhaatrik/seamless-qr-dining
- FRAMEWORK: Next.js 16 App Router + React 19
- STATE: AuthContext, OrderContext, ToastContext
- TESTS: Jest 77 / 18 suites + GitHub Actions CI
- KEY LESSON: Context order bus suffices for demo; WebSockets needed for multi-instance production
====================================================================
```

### Mission Report: The Order Bus Lives in Context, Not a Socket Room

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Read [why this demo exists](/transmissions/seamless-qr-dining-why-and-what/) first. This transmission explains **how orders move** between customer and kitchen tabs in v3.0.0.

---

### Mission Report: Stack Choices

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 16 (App Router) | Customer + kitchen routes, API route for OTP verify |
| **UI** | React 19 + Tailwind 3 | Mobile-first menu, kitchen board layout |
| **Motion** | Framer Motion | Drawer/modal transitions, status animations |
| **State** | React Context | Global order list + auth + toasts without Redux weight |
| **Data** | Static menu in `src/data/` | Demo menu — not CMS-backed |
| **Tests** | Jest + RTL | 77 tests across contexts, components, API, benchmarks |
| **CI** | GitHub Actions | lint → test → build on push |

No `ws` package. No standalone Node socket server. "Real-time" = **shared in-memory Context** while one Next dev server runs.

---

### Mission Report: Order Flow Architecture

1. Customer at `/?table=N` adds items → `OrderContext` appends order with table id
2. Kitchen at `/kitchen` subscribes to same context provider tree
3. Status transitions: Pending → Preparing → Ready → Delivered (one-click on dashboard)
4. Audio alert fires on new orders (kitchen component)
5. OTP route: `src/app/api/auth/verify-otp/route.ts` — simulated verification

**Multi-tab demo works** when both views hit the same JS runtime. **Multi-device production** needs persistent store + pub/sub — not shipped.

---

### Mission Report: What I Rejected (For This Demo)

**WebSocket server early.** Faster to prove UX with Context; sockets add reconnect state, room identity, and deploy complexity before the menu UI is legible.

**Separate Node backend.** Next API routes cover simulated OTP; no second process required for demo.

**Database on day one.** Static menu + in-memory orders keep iteration speed high — at cost of restart fragility.

---

### Mission Report: Fuckups & Learnings

- **Table identity in URL is non-negotiable.** `?table=N` simulates QR join — skip it and orders bleed across tables in demos.
- **Context tests matter.** `OrderContext` and `AuthContext` suites catch lifecycle bugs before kitchen UI glitches.
- **Benchmark suites** (sort/render) signal performance intent even in a demo repo.
- **Portfolio "Node.js backend" tag was misleading.** Next.js **is** the server — not a generic Node socket layer.

---

### Mission Report: Closing Transmission

Next.js routes for surfaces. Context for the order bus. Jest for trust. WebSockets remain future homework.

Production honesty: [simulated vs real restaurant needs](/transmissions/seamless-qr-dining-prototype-honesty/).