---
title: 'Instant App Opener'
description: 'A tray-resident desktop launcher that opens your usual apps from a global hotkey — no browser tab circus.'
logo: '../../assets/instant-app-opener.png'
githubUrl: 'https://github.com/dhaatrik/instant-app-opener'
progress: 'v1.2.0 fully operational, local desktop application'
order: 5
tags: ['JavaScript', 'Electron', 'Node.js', 'CSS']
pain_level: 2
telemetry: 'STATUS: SHIPPED // VERSION: V1.2.0 // HOTKEYS: GLOBAL'
fuckup_teaser: "I wrote registry keys for Electron's startup behavior without testing clean Windows environments, immediately bricking the tray launcher for first-time users."
---

## SYS.STATUS: v1.2.0 — sub-150ms popup, global hotkeys registered, lives in the tray

I got tired of opening the same five tools through bookmarks and waiting on browser chrome. Instant App Opener is a small Electron utility that sits in the tray until you summon it.

## Why I started this

Browser bookmarks pretend to be launchers. They're not. DNS lookup, extension overhead, and twenty restored tabs sit between you and the app you actually wanted. I wanted **system-level shortcuts** to a configurable map of paths — local binaries, scripts, URLs — without a full productivity suite attached.

## What I tried (and what broke)

Electron wraps a minimal shell: boot to tray, register global keyboard listeners, read a local config, spawn the target. Node.js handles filesystem paths; the popup UI is vanilla JS and CSS — no framework tax on something that should appear instantly.

Early builds were slow because I over-rendered the popup. Stripping dependencies and caching static assets got cold open under **150ms**, which was the bar I cared about.

Global hotkey registration across platforms is finicky — conflicts with other tools, focus stealing, waking from sleep. v1.2.0 is where registration felt reliable enough to leave running all day.

## Fuckups & learnings

- **Electron for a launcher is heavy on disk, light on dev time.** Tradeoff I accepted for cross-platform tray + hotkeys without writing three native shells.
- **Config format should be human-editable JSON**, not buried in a settings UI nobody opens.
- **Speed is the feature.** If it hesitates, you'll just Alt-Tab back to the browser habit.

## Where it stands now

v1.2.0 is fully operational: custom app paths, global hotkeys, silent tray startup. It does one job and stays out of the way.

## Closing transmission

Small tool, honest scope. If you live in hotkeys, fork it and map your chaos.
