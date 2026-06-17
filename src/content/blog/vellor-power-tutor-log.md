---
title: 'Vellor Mission Log: Building an Offline OS for Tutors'
description: 'An engineering diary on Vellor v4 Power-Tutor — why I built a free offline tutoring tool, how IndexedDB keeps student data private, and what solopreneur teachers actually need.'
pubDate: 2026-06-17
tags: ['pedagogy', 'vellor']
clearance: 'PUBLIC'
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Vellor (Offline Tutoring Management PWA)
- VERSION: v4.0.0 "Power-Tutor" Update
- REPO: github.com/dhaatrik/vellor
- STORAGE: IndexedDB (100% client-side, zero server dependency)
- STACK: React 19, TypeScript 5.7, Zustand 5, Tailwind CSS 3
- MISSION: Free, private, instant-load tutoring operations system
====================================================================
```

### Mission Report: Why I Built Vellor

I spent nine years tutoring physics and mathematics — school classrooms, coaching centers, one-on-one sessions, online groups for international students. Through all of it, I watched a quiet injustice play out: the teachers doing the most personal, high-trust work had the worst software.

Most tutoring tools I tried were either **overpriced**, **overcomplicated**, or **invasive with data**. Student records sitting on someone else's server. Subscription walls for basic attendance tracking. Dashboards designed for enterprise franchises, not a single Bhaiyaa running a batch of twenty students from a spare room.

I built **Vellor** because I wanted an operating system for independent educators — something that runs instantly in a browser, requires zero setup, and keeps every student record on the teacher's own machine. No accounts to create. No data to surrender.

---

### Mission Report: The Offline-First Contract

Trust is the foundation of tutoring. A student tells you they are struggling. A parent shares a phone number. A fee schedule reflects a family's budget. That information is not marketing data. It is entrusted to you.

Vellor's architecture reflects that trust model:

- **100% client-side storage** via IndexedDB. Nothing leaves the browser unless the teacher explicitly exports it.
- **Progressive Web App (PWA)** behavior — installable, works without a network connection after first load.
- **Zustand with persistence middleware** for instant state hydration on reload. Open the app, and your roster is already there.

I did not choose offline-first as a technical flex. I chose it because the teachers I know — including past versions of myself — work in classrooms with unreliable Wi-Fi, on laptops that are not always online, in contexts where "sync to our cloud" is a reason to say no.

---

### Mission Report: v4.0.0 Power-Tutor — What Changed

Version 4 is the **Power-Tutor** update, and the name is deliberate. Previous versions proved the storage model and basic roster management. v4 is about _daily operational power_ — the workflows a tutor actually repeats every week:

- **Student roster management** with fast filtering and sorting across large local datasets.
- **Session and attendance tracking** without navigating five nested menus.
- **Performance-optimized list operations** — every filter and sort runs in $O(N)$ time so the UI stays instant even when your dataset grows across years of batches.
- **Gamified UI polish** — because tutoring is hard enough without your tools feeling like tax software.

I wanted Vellor to feel less like "school administration" and more like a tool you are proud to open in front of a student.

```
====================================================================
                    VELLOR DATA FLOW (v4)
--------------------------------------------------------------------
  Teacher opens PWA  -->  Zustand hydrates from IndexedDB
  Add/edit student   -->  Local mutation (no network call)
  Filter/sort roster -->  O(N) client-side pass
  Export backup      -->  Explicit teacher action only
--------------------------------------------------------------------
  Network: optional. Server: none. Data ownership: teacher.
====================================================================
```

---

### Mission Report: Design Decisions I Stand By

**React 19 and Zustand 5** give me fine-grained reactivity without the ceremony of heavier state libraries. When a teacher updates one student's attendance flag, the UI should update immediately — not after a loading spinner.

**TypeScript 5.7** is non-negotiable for offline mutations. If a schema migration corrupts a student's record silently, I have failed the user. Strict types are how I sleep at night.

**Tailwind CSS 3** let me build a premium, game-like design system without shipping a component library the size of a small moon. Tutors do not need more bloat. They need clarity.

---

### Mission Report: Design Decisions I Am Still Questioning

Honesty matters in a mission log, so here is what I am still working through:

- **Multi-device sync.** Teachers often have a phone and a laptop. Offline-first makes sync hard. I am exploring optional, teacher-controlled export/import before I touch any automatic sync.
- **Onboarding friction.** Zero setup is the goal, but "open a PWA" is still unfamiliar to many educators. I need a gentler first-run experience without adding account creation.
- **Feature scope creep.** Every tutor asks for something different — invoicing, WhatsApp reminders, curriculum planners. Vellor must stay an OS, not a junk drawer.

---

### Mission Report: Connection to DBS Classes

Vellor and DBS Classes come from the same root conviction:

<p align="center">
    <strong> "Education Is Not Free BUT KNOWLEDGE IS FREE"</strong>
</p>

DBS Classes was my attempt to share physics and mathematics freely on YouTube. Vellor is my attempt to give the _teachers_ who do that work every day — in person, offline, privately — a tool that respects them the way they respect their students.

I failed to maintain consistency on YouTube. I am not failing quietly on Vellor. The v4 Power-Tutor release is proof that I am building systems this time, not just riding motivation spikes.

---

### Mission Report: Current Status

Vellor v4.0.0 is live and functional. Independent educators can manage rosters, track sessions, and operate entirely offline with data they own.

If you are a solopreneur tutor — a Bhaiyaa or Behen running batches from your living room — this tool is for you. Not for a venture-backed edtech platform. For you.

Open it. Add your first student. Close the laptop. Come back tomorrow. Your data will still be there.

That is the whole mission.