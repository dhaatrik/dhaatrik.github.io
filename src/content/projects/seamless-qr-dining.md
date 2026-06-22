---
title: 'Seamless QR Dining'
description: 'Scan a table QR, order from your phone, watch kitchen status update live — no waiter relay for every change.'
logo: '../../assets/seamless-qr-dining.png'
githubUrl: 'https://github.com/dhaatrik/seamless-qr-dining'
progress: 'Prototype complete, WebSocket integration verified'
order: 8
tags: ['React', 'WebSockets', 'Tailwind CSS', 'Node.js']
pain_level: 3
telemetry: 'STATUS: PROTOTYPE // SYNC: VERIFIED // PROD: PENDING'
fuckup_teaser: "I ignored WebSocket reconnection states entirely, meaning a customer's order would fail silently if the kitchen server suffered even a temporary connection drop."
---

## SYS.STATUS: Prototype done — table sockets verified, not production-hardened yet

Restaurant ordering still runs on paper tickets and shouted updates. Seamless QR Dining is my prototype for table-side digital ordering with a kitchen dashboard that actually stays in sync.

## Why I started this

I've watched orders get lost between the table and the kitchen — wrong items, delayed checks, menus that don't update. QR codes get a bad rap as gimmicks, but the underlying idea is sound: **join the customer and kitchen on one channel** without installing an app.

## What I tried (and what broke)

Scan a table QR → join a table-specific WebSocket channel. Customer submits from a mobile-first React UI; kitchen sees the order on a dashboard. Status changes ("In Prep", "Served") push back instantly — no polling loop burning battery.

Node.js coordinates the socket server; Tailwind keeps the customer view readable on small screens. Menu customization hooks exist in the data model — modifiers, quantities — even if the admin UI is still rough.

The verified part from the build: **bidirectional sync between ordering client and kitchen display**. The unverified part: peak-hour load, payment integration, multi-branch menu admin — all still out of scope for this prototype. I'm honest about that gap.

## Fuckups & learnings

- **WebSockets need room/session identity baked in early**, or you broadcast orders to the wrong table. Ask me how I know.
- **Kitchen UX is as important as customer UX.** A pretty menu means nothing if the expo screen is unreadable during rush.
- **Prototype ≠ deployable.** Socket proof is step one; auth, menu CMS, and ops tooling are the long road.
- **Reconnect handling matters at restaurants.** Wi-Fi in dining rooms is not laboratory conditions.

## Where it stands now

Core prototype is complete. Socket coordination between customer ordering screens and kitchen control displays is verified end-to-end. Real-time order tracking from submit to served status works in test runs; production hardening is the next chapter if this ever leaves the lab.

## Closing transmission

If you're exploring contactless dining infra, the repo shows the real-time spine. Everything else is homework I'm not pretending is done.
