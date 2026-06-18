---
title: 'Vellor'
description: "A free, open-source tutoring tool that runs in the browser, stores everything locally, and doesn't need a server or a subscription."
logo: '../../assets/vellor.png'
githubUrl: 'https://github.com/dhaatrik/vellor'
progress: "v4.0.0 'Power-Tutor' Update"
order: 1
tags: ['React 19', 'TypeScript 5.7', 'Zustand 5', 'Tailwind CSS 3']
pain_level: 3
telemetry: 'STATUS: V4_0_0_SHIPPED // DB: OFF_LINE_FIRST // SYNC: LOCAL'
fuckup_teaser: "Gamification nearly ate the product — I almost shipped a mobile-game UI for a productivity tool."
---

## SYS.STATUS: v4.0.0 shipped — offline-first, no backend, still my daily driver for tutoring ops

I kept watching independent tutors get squeezed between expensive SaaS platforms and spreadsheets that weren't built for teaching. Vellor is my answer: a browser-based operating system for running a tutoring business without handing student data to someone else's cloud.

## Why I started this

I tutor. I've done it for years. The tools I kept reaching for were either overpriced, bloated with features I'd never use, or quietly shipping student records to remote servers I couldn't audit. I wanted something I could open in any browser, use immediately, and trust with names, grades, and session notes — without a signup wall or a monthly invoice.

The constraint I set early: **zero server dependency**. If the network dies mid-session, the app should still work. If a tutor wants to run it on a cheap laptop with no internet, that should be fine too.

## What I tried (and what broke)

I went offline-first from day one. All persistence lives in IndexedDB; state flows through Zustand with local persistence middleware so the UI feels instant on reload.

The first pain point was **syncing UI state with local writes without jank**. Early versions re-rendered too aggressively when filters or sorts ran on larger student lists. I profiled it, realized I was doing unnecessary work on every keystroke, and tightened the update path so filtering and sorting stay O(N) — which sounds obvious until you're watching a 200-student roster stutter on an old Chromebook.

The PWA layer was another fight. Service worker caching is great until you ship a breaking schema change and tutors are stuck on a stale bundle. I learned to version the cache aggressively and test cold-start behavior on slow devices, not just my dev machine.

React 19 + Zustand 5 gave me fine-grained reactivity without dragging in a heavy data layer. TypeScript 5.7 caught a lot of offline mutation edge cases early — nullable fields that only surface when you're merging partial records from IndexedDB.

## Fuckups & learnings

- **I underestimated how much tutors care about *feel*.** A tool can be technically offline-first and still feel broken if a sort takes 800ms. Performance isn't vanity here; it's trust.
- **Gamification is easy to overdo.** I wanted the UI to feel alive — progress cues, satisfying micro-interactions — but not like a mobile game. Tailwind let me iterate fast; restraint took longer.
- **Local-only means *you* own backups.** No server also means no safety net. From the build, I learned to treat export/restore as a first-class feature, not a v2 afterthought.
- **IndexedDB is powerful and annoying.** Transactions, schema migrations, and error handling in private browsing modes — I hit all of it. The lesson: wrap storage in one layer and never let components talk to the DB directly.

## Where it stands now

Vellor is at **v4.0.0 — the "Power-Tutor" update**. It's a fully usable suite for independent educators: student roster, session tracking, filtering, sorting — all running client-side with no network overhead for core workflows.

Stack in production: React 19, Zustand 5, TypeScript 5.7, Tailwind CSS 3. It installs as a PWA, boots fast, and keeps data in the browser where the tutor controls it.

I'm still iterating on polish and edge cases, but the core bet — **free, private, offline-capable tutoring OS** — holds up.

## Closing transmission

If you're a solopreneur teacher tired of renting your own student data, clone the repo and run it locally. No account. No server bill. Just open the tab and teach.