---
title: 'FuelDrop'
description: 'A mobile-first fuel delivery app — order from your phone, track the driver live, skip the station detour.'
logo: '../../assets/fueldrop.png'
githubUrl: 'https://github.com/dhaatrik/fueldrop'
progress: 'v3.0.0 High-concurrency React 19 architecture'
order: 3
tags: ['React 19', 'TypeScript 5.8', 'Tailwind CSS 4', 'Vite 6']
pain_level: 4
telemetry: 'STATUS: SHIPPED // VERSION: V3.0.0 // CONCURRENCY: HIGH'
fuckup_teaser: 'I built a beautiful optimistic UI for orders but skipped the database rollback logic, which left users seeing successful orders that had failed on the server.'
---

## SYS.STATUS: v3.0.0 live — real-time tracking works, route logic still earns its scars

Refueling is still a destination problem in a world that ships everything else to your door. FuelDrop is my attempt to flip that: treat fuel as a service, coordinate drivers and customers on mobile, and make the wait visible instead of silent.

## Why I started this

I've wasted time circling stations, sitting in queues, and guessing when a delivery would show up for other services — while fuel stayed stuck in the "drive there yourself" era. For fleet operators it's worse: opaque scheduling, no live map, no shared truth between dispatcher and driver.

I didn't set out to "disrupt petroleum." I wanted a **transparent delivery flow** — order, assign, track, complete — with a UI that doesn't collapse the moment LTE gets flaky.

## What I tried (and what broke)

**v3.0.0** is built on a high-concurrency React 19 architecture with Vite 6 and TypeScript 5.8. The frontend bet is optimistic UI: when you tap an action, the interface moves immediately; the server catches up or rolls back. That matters on mobile networks where round-trips feel like centuries.

Live driver location runs over **WebSockets**. Getting this right meant more than opening a socket — I had to think about reconnect storms, stale coordinates, and what the map shows when the connection drops mid-route. Early versions either spammed the server or froze the marker; neither is acceptable when a user is staring at "where is my delivery?"

Route calculation and scheduling logic are typed strictly in TypeScript — mission-critical in the sense that a wrong ETA erodes trust fast. Tailwind CSS 4 handled responsive layout without me fighting breakpoint spaghetti on small screens.

The hardest product tension: **fleet scale vs. individual orders**. Same codebase, different concurrency patterns. React 19's concurrent features helped keep the UI responsive when multiple order states update in the same tick.

## Fuckups & learnings

- **Optimistic UI without a rollback story is just lying beautifully.** From the build, I learned to define failure states as carefully as success animations.
- **WebSockets are state machines.** Connect, auth, subscribe, heartbeat, reconnect — skip one step and you get ghost drivers on the map.
- **Mobile-first isn't a CSS prefix.** It's bandwidth assumptions, thumb reach, and what happens when the app resumes from background with a stale socket.
- **"High-concurrency architecture" is a maintenance commitment**, not a launch headline. v3.0.0 is a structure I can extend; it wasn't free to get here.

## Where it stands now

FuelDrop is at **version 3.0.0**. The platform coordinates real-time scheduling, location dispatch, and route optimization behind a mobile-first interface. Drivers can be tracked live; customers get a flow that feels immediate even when the network isn't.

Stack: React 19, TypeScript 5.8, Tailwind CSS 4, Vite 6. It's the most operationally ambitious app in my portfolio — closer to a real logistics product than a weekend utility.

## Closing transmission

FuelDrop is the project where product and infrastructure argue the loudest. If you care about real-time mobile logistics in the browser, dig into the repo — and tell me where the ETA logic breaks. I already have a list; yours is probably better.
