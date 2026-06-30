---
title: 'Vellor Mission Log: Power-Tutor Ops and the Storage Correction'
description: 'Engineering diary on Vellor v4.2 — roster performance, PWA cache fights, and admitting I wrote IndexedDB when the repo actually uses AES-GCM localStorage.'
pubDate: 2026-06-17
updatedDate: 2026-07-01
tags: ['pedagogy', 'vellor', 'pwa', 'offline-first']
clearance: 'PUBLIC'
readingTime: '9 min'
hasMath: true
series: 'Vellor'
seriesOrder: 6
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Vellor (Offline Tutoring Management PWA)
- VERSION: v4.2.0 (Power-Tutor era from v4.0)
- REPO: github.com/dhaatrik/vellor
- STORAGE: AES-GCM encrypted localStorage (100% client-side)
- STACK: React 19, TypeScript 5.7, Zustand 5, Vite 6, Tailwind CSS 3
- MISSION: Free, private, instant-load tutoring operations system
- KEY LESSON: Prior site copy said IndexedDB — the repo encrypts to localStorage
====================================================================
```

### Mission Report: Day 47 of Power-Tutor — and a Correction I Owe You

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. This log is the **operational diary** for Vellor's Power-Tutor era — not the origin story, not the stack lecture, not the licensing essay. Those live in the [Vellor transmission series](/transmissions/vellor-why-and-what/) in order. Start there if you are new.

I am writing this update because I need to correct something embarrassing: an earlier version of this very post — and my project page — claimed Vellor stored data in **IndexedDB**. The upstream repo does not. It encrypts with **AES-GCM** and persists to **`localStorage`** via `src/crypto.ts`, with a Recovery Key fallback and explicit JSON export/import. I wrote marketing-sounding storage words without re-reading my own code. Dull truth beats gorgeous lies, so here is the fix.

---

### Mission Report: What Power-Tutor Actually Shipped

Version 4.0 was the **Tutor OS** pivot — Vellor stopped being "a roster with vibes" and became daily ops tooling for private tutors. As of **v4.2.0**, that includes:

| Capability | What it does for a tutor |
|------------|--------------------------|
| Student roster + search | Names, parents, rates, subjects — filter in real time |
| Lesson + payment logging | Quick-log modal, floating action button, status badges |
| Calendar | Drag-and-drop scheduling with absent/cancelled reschedule prompts |
| Invoicing | PDF statements, WhatsApp share links, overdue reminders |
| Client portals | Read-only Base64 URL snapshots for parents |
| Gamification | Points, ranks, 25+ achievements — optional motivation layer |
| Offline PWA | Installable, works without network after first load |

The [why-and-what transmission](/transmissions/vellor-why-and-what/) explains who this is for. The [tech-stack transmission](/transmissions/vellor-tech-stack/) explains why React + Zustand + Vite instead of a heavier framework. This log is what broke while shipping.

---

### Mission Report: The Journey — Performance and Trust

**The roster stutter.** Early Power-Tutor builds re-rendered the entire student list on every keystroke in the search box. On a 200-student roster and a cheap Chromebook, that felt like the app was broken — even though the data model was fine. I profiled it, tightened Zustand selectors, leaned on `@tanstack/react-virtual` for long lists, and kept filter/sort passes at **O(N)**. Performance is trust for tutors showing the app to parents.

**The PWA cache ambush.** Service workers are wonderful until you ship a breaking schema change and half your testers are stuck on a stale bundle. I version caches aggressively now and cold-start test on slow devices — not just my dev laptop on fiber.

**The encryption path.** Moving sensitive student records into encrypted `localStorage` meant handling Recovery Keys, secure reset, and backup prompts every 14 days. No server means **you** own disaster recovery. I wrote more about that in [local backup reality](/transmissions/vellor-local-backup-reality/).

```
====================================================================
                    VELLOR DATA FLOW (v4.2)
--------------------------------------------------------------------
  Teacher opens PWA  -->  Zustand hydrates from encrypted localStorage
  Add/edit student   -->  AES-GCM write (no network call)
  Filter/sort roster -->  O(N) client-side pass + virtualized list
  Export backup      -->  Explicit teacher action (JSON file)
--------------------------------------------------------------------
  Network: optional. Server: none. Data ownership: teacher.
====================================================================
```

---

### Mission Report: Fuckups & Learnings

- **I misdocumented my own storage layer.** IndexedDB is a reasonable guess for an offline PWA — but it was wrong for Vellor. Lesson: before I publish architecture claims on this site, I grep the repo I am describing.
- **Gamification almost ate the product.** I wanted the UI to feel alive — progress cues, confetti on achievements — but early builds flirted with mobile-game chrome that buried the invoice button. Restraint took longer than Tailwind classes. Full story: [gamification trap](/transmissions/vellor-gamification-trap/).
- **Feature scope creep is constant.** Every tutor asks for something different — WhatsApp bots, curriculum planners, tax integrations. Vellor must stay an OS, not a junk drawer. I ship workflows I personally repeat every week as a tutor.
- **Multi-device sync is still unsolved.** Teachers have a phone and a laptop. Offline-first makes automatic sync hard. Roadmap lists optional cloud sync; I will not ship half-baked sync that silently forks rosters.

---

### Mission Report: Connection to DBS Classes

Vellor and DBS Classes share one root conviction:

<p align="center">
    <strong> "Education Is Not Free BUT KNOWLEDGE IS FREE"</strong>
</p>

DBS Classes was my attempt to share physics and mathematics freely on YouTube. Vellor is my attempt to give the _teachers_ doing that work every day — in person, offline, privately — a tool that respects them. The [free-and-zero-terms transmission](/transmissions/vellor-free-zero-terms/) explains what "zero terms" actually means (spoiler: MIT license still applies; SaaS lock-in does not).

I failed to maintain consistency on YouTube. I am not failing quietly on Vellor. **v4.2.0** is proof I am building systems this time, not just riding motivation spikes.

---

### Mission Report: Current Status

Vellor **v4.2.0** is live on GitHub. Independent educators can manage rosters, log lessons, track payments, generate invoices, and operate offline with data they own.

If you are a solopreneur tutor running batches from your living room — this tool is for you. Not for a venture-backed edtech platform. For you.

Open it. Add your first student. Close the laptop. Come back tomorrow. Your encrypted data will still be there.

That is the whole mission.