---
title: 'Why I Chose This Tech Stack for Vellor — Honest Tradeoffs'
description: 'React 19, Zustand 5, Vite 6, localStorage + AES-GCM — not because they are trendy, but because a solo tutor app has different enemies than a SaaS unicorn.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['vellor', 'react', 'typescript', 'pwa', 'offline-first']
clearance: 'PUBLIC'
readingTime: '11 min'
hasMath: false
series: 'Vellor'
seriesOrder: 2
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Vellor tech stack (v4.2.0)
- REPO: github.com/dhaatrik/vellor
- CONSTRAINT: Zero server, solo-maintainer, offline-first PWA
- STACK: React 19, TS 5.7, Vite 6, Zustand 5, Tailwind 3, Vitest 4
- STORAGE: AES-GCM encrypted localStorage (not IndexedDB, not a backend DB)
- KEY LESSON: Pick tools that fail gracefully offline, not tools that scale to 10M users you will never have
====================================================================
```

### Mission Report: The Stack Is Not the Product

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Nobody opens Vellor because I picked Zustand over Redux. They open it because they need to log a lesson, see who owes money, and generate a PDF invoice before the parent leaves.

But stack choices **shape** what you can ship alone, what breaks offline, and what you are stuck maintaining at 11 PM. This transmission is the honest tradeoff log — what I picked, what I rejected, and what I would rethink.

If you have not read [why Vellor exists](/transmissions/vellor-why-and-what/), start there. This is the engineering appendix.

---

### Mission Report: The Constraints That Picked the Stack

Before naming libraries, I wrote non-negotiables on a sticky note:

| Constraint | What it eliminated |
|------------|-------------------|
| **Zero server** | Firebase/Supabase as primary store, auth providers, hosted APIs |
| **Offline-first PWA** | Frameworks that assume SSR hydration, always-online data fetching |
| **Solo maintainer** | Heavy micro-frontend architectures, exotic build pipelines |
| **Tutor trust** | Analytics SDKs, third-party session replay, "helpful" cloud backups |
| **Free forever** | Paid BaaS tiers that become rent later |

Vellor's enemies are **complexity**, **data leakage**, and **maintenance burden** — not horizontal scaling.

---

### Mission Report: The Journey — What I Considered

**The "just use Next.js" phase.** Tempting. Great DX, huge community. But Vellor does not need SSR, edge functions, or API routes. Adding a server-shaped framework to a client-only app felt like buying a cargo plane to deliver a letter.

**The "IndexedDB + Dexie" assumption.** Many offline apps live here. I initially *described* Vellor that way on this site — incorrectly. The shipped repo encrypts to **`localStorage`** with **AES-GCM** (`src/crypto.ts`). Simpler mental model for tutors exporting JSON backups; tradeoff is storage size limits and synchronous-feeling writes wrapped in async crypto. I should have verified before publishing.

**The "Electron desktop app" detour.** Local-first purists love it. I rejected it for Vellor because tutors already have browsers, PWA install covers "app icon on home screen," and Electron updates are a second release pipeline I did not want.

---

### Mission Report: What I Shipped — Stack Table

From the repo README and `package.json` at **v4.2.0**:

| Technology | Role | Why I kept it |
|-----------|------|---------------|
| **React 19** | UI | Component model I know cold; hooks for forms, modals, dashboards |
| **TypeScript 5.7** | Language | Catches nullable student fields and botched payment merges before tutors see them |
| **Vite 6** | Build | Fast HMR, sane PWA plugin integration, production bundles without webpack grief |
| **Zustand 5** | State | Slice-based store (`createStudentSlice`, `createTransactionSlice`, …) without Redux boilerplate |
| **Zod 4** | Validation | Runtime schemas for store actions and forms — offline apps cannot rely on server-side validation |
| **React Hook Form 7** | Forms | Minimal re-renders on student/transaction forms with many fields |
| **Tailwind CSS 3** | Styling | Utility speed for white-label accent theming and dark/light mode |
| **React Router 6** | Routing | Client-side pages: Dashboard, Students, Calendar, Achievements, Portal |
| **Framer Motion 11** | Motion | Page transitions and micro-interactions — restrained after [gamification overreach](/transmissions/vellor-gamification-trap/) |
| **Radix UI** | Primitives | Accessible dialogs, selects, accordions without shipping a monolithic UI kit |
| **Recharts 3** | Charts | Income trends and forecasting visuals on the dashboard |
| **jsPDF + autotable** | PDFs | Client-side invoices — no server render farm |
| **@tanstack/react-virtual** | Lists | Long rosters without mounting 300 DOM nodes |
| **Vitest 4 + RTL** | Tests | 28 suites — store slices, crypto, PDF, pages — CI runs lint → test → build |
| **vite-plugin-pwa** | Offline | Service worker + install prompt; cache versioning is still a footgun |

---

### Mission Report: Fuckups & Learnings

- **localStorage is not infinite.** Large rosters + transaction history + achievement state must be watched. Export reminders every 14 days are not UX decoration — they are disaster-awareness.
- **PWA cache invalidation hurts.** `vite-plugin-pwa` is great until a schema migration meets a stale service worker. I version caches aggressively and test cold starts on slow Android browsers.
- **Zustand slices saved my sanity** until they did not — cross-slice dependencies (gamification points on payment clear) need explicit tests. The `store/tests/` folder exists because I got burned.
- **Framer Motion + PDF + charts = bundle weight.** Acceptable for a tutor laptop; painful on old phones. I have not solved this perfectly — honesty clause.

---

### Mission Report: What I Would Not Add (Yet)

| Temptation | Why I am waiting |
|------------|------------------|
| **Firebase sync** | On the roadmap, but half-baked sync that forks rosters is worse than manual export/import |
| **Prisma + SQLite WASM** | Interesting for structured queries; adds migration complexity tutors never asked for |
| **tRPC / GraphQL** | There is no server. These solve problems Vellor does not have. |
| **Heavy component libraries** | Radix primitives + Tailwind keep bundle and style ownership mine |

---

### Mission Report: Current State

The CI pipeline in `.github/workflows/ci.yml` is boring on purpose:

```
Checkout → Node 20 → npm ci → tsc --noEmit → vitest → vite build
```

That is the stack proving it works — not a architecture diagram in a slide deck.

---

### Mission Report: Closing Transmission

Pick tools that match the **actual** threat model: offline tutors, local encryption, solo maintenance, zero rent-seeking infrastructure.

If you are building a similar client-only ops tool, steal the pattern: **Zustand slices + Zod validation + explicit export/import + tests on crypto and money math**. Skip the server until users beg for sync — and even then, make it opt-in.

Next in series: [why Vellor is free and what "zero terms" really means](/transmissions/vellor-free-zero-terms/).