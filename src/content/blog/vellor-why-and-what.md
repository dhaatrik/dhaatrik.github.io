---
title: 'Why Vellor Exists — and What It Actually Is'
description: 'Honest origin story for my free tutoring-management PWA: nine years of watching teachers rent their own student data, and what v4.2 actually ships.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['pedagogy', 'vellor', 'pwa', 'offline-first']
clearance: 'PUBLIC'
readingTime: '12 min'
hasMath: false
series: 'Vellor'
seriesOrder: 1
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Vellor (github.com/dhaatrik/vellor)
- VERSION: v4.2.0 (Power-Tutor era from v4.0)
- SCOPE: Offline-first tutoring business management PWA
- MOTIVATION: Overpriced/invasive SaaS vs. spreadsheets not built for teaching
- AUDIENCE: Independent tutors, private teachers, solopreneur educators
- KEY LESSON: Build the OS you wished existed between Excel and edtech rent-seeking
====================================================================
```

### Mission Report: The Quiet Injustice in Tutoring Software

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. Remember when I described Vellor as a "note-taking app" on this site? Yeah — that was wrong. I am fixing it here.

I spent nine years tutoring physics and mathematics — school classrooms, coaching centers, one-on-one sessions, online groups for international students. Through all of it, I watched the people doing the most personal, high-trust work get the worst software.

Most tutoring tools I tried were **overpriced**, **overcomplicated**, or **invasive with data**. Student records on someone else's server. Subscription walls for basic attendance tracking. Dashboards designed for enterprise franchises, not a single Bhaiyaa running twenty students from a spare room.

I built **[Vellor](https://github.com/dhaatrik/vellor)** because I wanted an operating system for independent educators — something that runs instantly in a browser, requires zero setup, and keeps every student record on the teacher's own machine. No accounts to create. No data to surrender.

---

### Mission Report: The Why — What Problem Was I Actually Solving?

Three frustrations stacked:

1. **Renting your own student data.** A parent shares a phone number. A fee schedule reflects a family's budget. That is not marketing data — it is entrusted to you. SaaS platforms treat it as an asset on their balance sheet. I refused that trade.

2. **Spreadsheets are not an OS.** Excel works until you need lesson history, payment statuses, overdue alerts, PDF invoices, and a calendar that does not break when you add column Q. Tutors deserve tooling shaped around their weekly rhythm, not generic grids.

3. **Offline is not optional.** Teachers work in classrooms with unreliable Wi-Fi, on laptops that are not always online, in contexts where "sync to our cloud" is a reason to say no. I set one constraint early: **zero server dependency**.

Vellor is not a venture pitch. It is the tool I wanted when I was the tutor squinting at a ₹999/month dashboard to mark attendance.

---

### Mission Report: What Vellor Is — Concrete Scope

Vellor is a **free, open-source Progressive Web App** for managing a private tutoring business. As of **v4.2.0**, the README lists seven major capability areas from the v4 "Tutor OS" update plus Power-Tutor essentials.

| Surface | What you do there |
|---------|-------------------|
| **Dashboard** | Monthly income, unpaid fees, active students, overdue alerts, 6-month income charts |
| **Students** | Roster with contact info, parent details, rates, subjects, full lesson/payment history |
| **Transactions** | Log lessons, track Paid/Due/Partially Paid/Overpaid, bulk actions |
| **Calendar** | Drag-and-drop scheduling; smart reschedule prompts on absent/cancelled |
| **Achievements** | Points, ranks, 25+ badges — optional motivation (see [gamification trap](/transmissions/vellor-gamification-trap/)) |
| **Settings / Profile** | Theme, currency, white-label logo/accent, data export/import, secure reset |

Under the hood:

- **100% client-side** — no server, no database, no tracking
- **AES-GCM encryption** before data hits `localStorage` (`src/crypto.ts`)
- **PWA** — installable, offline after first load
- **MIT license** — free to use, modify, distribute ([licensing details](/transmissions/vellor-free-zero-terms/))

It is **not** a learning management system for schools. It is **not** a note-taking app. It is **not** a replacement for an accountant. It is a **tutor's daily operations console**.

---

### Mission Report: Who I Built It For (and Who Should Skip It)

**Built for:**

- Independent tutors running batches from home, coaching centers, or hybrid setups
- Private teachers who need invoices, payment tracking, and rosters without SaaS lock-in
- Educators who want data to stay on **their** device — encrypted, exportable, deletable

**Not built for:**

- Multi-teacher franchises needing centralized admin and payroll
- Anyone who needs automatic multi-device sync today (roadmap item, not shipped — see [local backup reality](/transmissions/vellor-local-backup-reality/))
- Teachers who want zero setup friction **and** zero backup responsibility — local-only means **you** own disaster recovery

---

### Mission Report: Fuckups & Learnings

- **I mislabeled Vellor on my own portfolio.** "Note-taking" and "IndexedDB" were lazy assumptions. The repo README is explicit: tutoring management, `localStorage`, AES-GCM. Lesson: read your README before your personal site quotes it.
- **Feature envy is real.** Every tutor asks for something different — WhatsApp bots, curriculum planners, tax integrations. Vellor must stay an OS, not a junk drawer. I ship workflows I personally repeat every week.
- **Trust is performance.** A roster that stutters on search feels broken even when the data model is fine. Power-Tutor optimizations (virtualized lists, O(N) filters) exist because parents watch you click.

---

### Mission Report: Current State & Key Artifacts

Vellor **v4.2.0** is functional and tested — **`vitest run` reports 64 test files** (478 cases) across store slices, pages, forms, crypto, PDF generation, hooks, and UI components. The README badge still says 33 — it lags the repo; I counted by running tests, not by reading shields.

```bash
git clone https://github.com/dhaatrik/vellor.git
cd vellor
npm install
npm run dev
# Opens http://localhost:5173
```

Stack summary (full rationale in [tech-stack transmission](/transmissions/vellor-tech-stack/)): React 19, TypeScript 5.7, Vite 6, Zustand 5, Tailwind CSS 3, Zod 4, React Hook Form 7, Framer Motion 11, jsPDF, Recharts 3, vite-plugin-pwa.

---

### Mission Report: Closing Transmission

If you are a solopreneur tutor tired of renting your own student data, clone the repo and run it locally. No account. No server bill. Open the tab and teach.

The series continues with [why I chose this tech stack](/transmissions/vellor-tech-stack/), [why it is free with zero SaaS terms](/transmissions/vellor-free-zero-terms/), and the [Power-Tutor mission log](/transmissions/vellor-power-tutor-log/) for operational war stories.

You've probably hit this wall too — great teaching, garbage tooling. Vellor is my dull-truth answer.