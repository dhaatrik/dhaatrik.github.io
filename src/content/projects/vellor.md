---
title: 'Vellor'
description: 'Free MIT-licensed tutoring-management PWA — students, lessons, payments, invoices, offline on your device. Not note-taking; not SaaS.'
logo: '../../assets/vellor.png'
githubUrl: 'https://github.com/dhaatrik/vellor'
progress: "v4.2.0 — Power-Tutor era (Tutor OS from v4.0)"
transmissionTag: 'vellor'
order: 1
tags: ['React 19', 'TypeScript 5.7', 'Zustand 5', 'Vite 6', 'Tailwind CSS 3', 'PWA']
pain_level: 3
telemetry: 'STATUS: SHIPPED // DB: LOCAL_ENCRYPTED // SYNC: MANUAL_EXPORT'
fuckup_teaser: "I misdocumented Vellor as note-taking with IndexedDB on this site — the repo encrypts to localStorage with AES-GCM, and I nearly buried invoicing under RPG-style gamification chrome."
---

## SYS.STATUS: v4.2.0 shipped — offline-first tutoring OS, no backend, still my daily driver

[Vellor](https://github.com/dhaatrik/vellor) is my free, open-source answer for independent tutors squeezed between expensive SaaS platforms and spreadsheets that were never built for teaching. It runs in a browser, installs as a PWA, and keeps student records on **your** machine — encrypted, exportable, deletable.

This page is the honest counterweight to README marketing adjectives. Vellor is a **serious solo-tutor operations tool**, not a school LMS, not a note-taking app, and not a replacement for an accountant.

## What it is (scope)

Vellor manages the weekly rhythm of a private tutoring business:

| Surface | What you do there |
|---------|-------------------|
| **Dashboard** | Monthly income, unpaid fees, active students, overdue alerts, income charts |
| **Students** | Roster with parents, rates, subjects, lesson + payment history |
| **Transactions** | Quick-log lessons, payment statuses (Paid/Due/Partial/Overpaid), bulk actions |
| **Calendar** | Drag-and-drop scheduling; reschedule prompts on absent/cancelled |
| **Achievements** | Points, ranks, 25+ badges — optional motivation layer |
| **Settings** | White-label logo/accent, theme, currency, export/import, secure reset |

v4.0 was the **Tutor OS** pivot. **v4.2.0** adds WhatsApp payment reminders, PDF invoicing, client portals (read-only Base64 URLs), financial forecasting charts, CSV import, keyboard shortcuts (`Ctrl+K`, `Ctrl+L`, `Shift+P`), and proactive offline/backup UX.

## Privacy model (accurate)

- **No server** — zero accounts, zero data harvesting, zero subscription
- **AES-GCM encryption** before writes to `localStorage` (`src/crypto.ts`)
- **Recovery Key** fallback + JSON export/import
- **14-day backup reminders** — because local-only means **you** own disaster recovery

I previously claimed IndexedDB on this site. That was wrong. See the [Power-Tutor mission log](/transmissions/vellor-power-tutor-log/) for the correction.

## Who I built it for

- Independent tutors and private teachers who need rosters, payments, and invoices without SaaS lock-in
- Educators who work offline or on unreliable Wi-Fi
- Anyone who wants MIT-licensed code they can audit and fork

**Not for:** multi-teacher franchises needing centralized payroll, or anyone requiring automatic multi-device sync today (roadmap item — manual export/import is the current answer).

## Fuckups & learnings

- **Wrong storage story on my own portfolio.** IndexedDB sounded plausible; the repo uses encrypted `localStorage`. Dull truth beats gorgeous lies.
- **Gamification almost ate invoicing.** Confetti and rank chrome crowded the payment path until I demoted celebrations to the Achievements page. Full story: [gamification trap](/transmissions/vellor-gamification-trap/).
- **Performance is trust.** Virtualized rosters and O(N) filters exist because a stuttering search in front of a parent feels broken.
- **PWA cache versioning hurts** when schema migrations meet stale service workers — cold-start testing on slow devices is mandatory.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **Multi-device sync** | Not shipped — export/import or wait for opt-in cloud sync on roadmap |
| **localStorage size** | Large multi-year rosters need periodic export as archive |
| **Private browsing** | Storage may not persist — not fixable in-app |
| **Scope creep pressure** | Every tutor wants different features; OS discipline required |

## Deep-dive transmissions

Read these in order for the full story:

1. [Why Vellor exists and what it actually is](/transmissions/vellor-why-and-what/) — origin, scope, audience, repo link
2. [Tech stack rationale with honest tradeoffs](/transmissions/vellor-tech-stack/) — React/Zustand/Vite, localStorage + AES-GCM, what I refused to add
3. [Why it is free and what "zero terms" means](/transmissions/vellor-free-zero-terms/) — MIT license, no SaaS lock-in, not "no legal text"
4. [The gamification trap](/transmissions/vellor-gamification-trap/) — when RPG chrome almost buried core ops
5. [Local-only backup reality](/transmissions/vellor-local-backup-reality/) — no server means you own disaster recovery

Supporting log:

- [Power-Tutor mission log](/transmissions/vellor-power-tutor-log/) — operational diary, storage correction, performance/PWA fights

## Run it locally

```bash
git clone https://github.com/dhaatrik/vellor.git
cd vellor
npm install
npm run dev
# Opens http://localhost:5173
```

Tests: `npm run test` — **64 Vitest test files** at v4.2.0 (README badge still says 33; run `vitest run` to verify). CI: lint → test → build on every push.

## Closing transmission

Clone it. Export your backups. Tell me where gamification still gets in your way. That is the point — free tooling with inspectable code and no tollbooth on student trust.

If you want the origin story, start with [why-and-what](/transmissions/vellor-why-and-what/). If you want the uncomfortable "what happens if I lose my laptop?" answer, read [local backup reality](/transmissions/vellor-local-backup-reality/).