---
title: 'Vireo Wellness'
description: 'An offline-first health journal and meditation timer — your habits stay in your browser, not on my server.'
logo: '../../assets/vireo-wellness.png'
githubUrl: 'https://github.com/dhaatrik/vireo-wellness'
progress: 'PWA ready, works offline with database caching'
order: 9
tags: ['React', 'PWA', 'IndexedDB', 'Tailwind CSS']
---

## SYS.STATUS: PWA installable — 100% offline, IndexedDB persistence, export works

Wellness apps want your sleep data on their cloud. Vireo is the opposite: a private journal and meditation timer that never phones home.

## Why I started this

I wanted to track habits and meditation without creating another account full of sensitive health notes. **Data sovereignty** wasn't a marketing angle — it was the requirement. If I'm logging mood and routines, that stays on my device.

## What I tried (and what broke)

Built as a PWA with service workers caching assets for instant load. Entries persist in IndexedDB through a thin transactional wrapper — same offline-first muscle memory as Vellor, applied to wellness instead of grades.

Dark-mode-first Tailwind UI; meditation timers and log modules as React components. Offline install works; airplane-mode sessions work. Local backup export exists because **no server means you own disaster recovery**.

IndexedDB schema changes mid-development broke early installs until I treated migrations seriously — lesson imported from other local-first projects.

Meditation timer logic sounds trivial until you handle background tabs, missed intervals, and "I locked my phone mid-session." I kept timer state in memory with periodic IndexedDB checkpoints so a refresh doesn't erase a 20-minute sit.

## Fuckups & learnings

- **Wellness UI should be calm, not gamified streak hell.** I biased toward simple logs over dopamine traps.
- **PWAs still fight iOS quirks.** Test on real devices, not just Chrome desktop.
- **Export isn't optional** for local-only apps. Users will clear site data eventually.
- **Habit streaks can guilt-trip.** I logged patterns without punishing broken streaks — wellness apps don't need rage-quit energy.

## Where it stands now

Vireo Wellness is PWA-ready: offline entry, cached assets, local database wrappers, backup export. Habit journal and meditation timer modules both run without network. No accounts, no sync service, no analytics pipeline on sensitive health notes.

## Closing transmission

Small, private, intentional. If you want a health journal that doesn't rent your data back to you, it's on GitHub.