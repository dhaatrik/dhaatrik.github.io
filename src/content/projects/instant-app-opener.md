---
title: 'Instant App Opener'
description: 'Next.js web app that converts social URLs into mobile deep links — copy, Web Share, or QR handoff. Not Electron, not a tray launcher.'
logo: '../../assets/instant-app-opener.png'
githubUrl: 'https://github.com/dhaatrik/instant-app-opener'
progress: 'v0.2.0 — README "V2" deep-link handoff (Next.js 15)'
transmissionTag: 'instant-app-opener'
order: 5
tags: ['Next.js 15', 'React 19', 'TypeScript 5.9', 'Tailwind CSS 4', 'Vitest']
pain_level: 2
telemetry: 'STATUS: SHIPPED // PLATFORM: WEB // HANDOFF: DEEP_LINK_QR_SHARE'
fuckup_teaser: "My portfolio still described an Electron tray launcher with registry hotkeys while the repo had pivoted to a Next.js deep-link converter — and I learned deep links are hints, not OS guarantees."
---

## SYS.STATUS: v0.2.0 shipped — social URL → deep link + QR + share, web-only

[Instant App Opener](https://github.com/dhaatrik/instant-app-opener) is a Next.js web utility that turns standard social media URLs into **mobile app deep-link URIs**. Paste a YouTube, X, LinkedIn, Instagram, Facebook, TikTok, or Spotify link; copy the generated scheme, trigger **Web Share**, or show a **QR code** for desktop→phone handoff.

This page is the honest counterweight to my old portfolio copy, which wrongly described an **Electron tray launcher**. The repo is a **web app**, not Raycast/Alfred.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **URL input** | Paste a standard `https://` social link |
| **Platform detection** | Auto-identify YouTube, X, LinkedIn, Instagram, Facebook, TikTok, Spotify |
| **Deep-link output** | Generate platform-specific mobile URI scheme |
| **Copy / Share / QR** | Clipboard copy, native Web Share API, scannable QR for another device |

Stack: Next.js 15.4, React 19, TypeScript 5.9, Tailwind CSS 4, Motion, `qrcode.react`, Cheerio, Vitest.

## Who I built it for

- Anyone tired of social links opening in the mobile browser instead of the native app
- Desktop users who want a quick QR handoff to their phone
- Developers exploring URI scheme mapping — not power users needing a local app launcher

**Not for:** system-tray hotkey workflows, guaranteed deep-link success when the target app is missing, or enterprise link analytics.

## Fuckups & learnings

- **Portfolio drift hurt credibility.** Electron v1.2.0, global hotkeys, Windows registry keys — stale fiction. The repo README calls it "V2" as a Next.js converter at semver **0.2.0**.
- **Deep links are not guarantees.** iOS vs Android behavior differs; app-not-installed fallbacks are OS-dependent.
- **URL parsers need maintenance.** Platforms change path formats; Cheerio extraction breaks when redirects shuffle.
- **Web Share is optional on desktop.** Copy + QR are the reliable paths.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **Web-only** | No Electron, no tray, no global hotkeys |
| **Deep-link reliability** | Target app must exist; OS may still open browser |
| **Platform variance** | iOS/Android URI rules differ; semver 0.2.0 = early |
| **Not a native launcher** | Does not spawn local binaries or replace Raycast |

## Deep-dive transmissions

Read in order for the full story:

1. [Why I built a deep-link handoff tool — and what it actually is](/transmissions/instant-app-opener-why-and-what/) — origin, scope, portfolio drift confession

## Run it locally

```bash
git clone https://github.com/dhaatrik/instant-app-opener.git
cd instant-app-opener
npm install
npm run dev
# Opens http://localhost:3000
```

Tests: `npm run test` — Vitest + React Testing Library. CI on every push.

## Closing transmission

Small tool, honest scope. Paste a link, get a deep link, hand it off. If you want the origin story and the Electron lie I had to unwind, start with [why-and-what](/transmissions/instant-app-opener-why-and-what/).