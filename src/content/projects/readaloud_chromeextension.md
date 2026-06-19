---
title: 'Read Aloud'
description: 'Manifest V3 chrome extension that reads the main article text via Web Speech API — skips nav junk, adjustable speed.'
logo: '../../assets/read-aloud.png'
githubUrl: 'https://github.com/dhaatrik/ReadAloud_ChromeExtension'
progress: 'Manifest V3 extension, published locally'
order: 12
tags: ['JavaScript', 'Web Speech API', 'Chrome Extension']
pain_level: 2
telemetry: 'STATUS: SHIPPED // MV3: COMPLIANT // TTS: NATIVE'
fuckup_teaser: "MV3's service worker lifecycle killed my persistent state — took three rewrites to understand it's not a background page."
---

## SYS.STATUS: MV3 compliant — article parsing works, native TTS, no external API calls

Built-in screen readers on web pages often read everything: menus, footers, cookie banners. I wanted one click to read **the actual article**.

## Why I started this

Long-form reading tires my eyes before my interest. Existing read-aloud tools felt bloated or grabbed the wrong DOM nodes. I needed something minimal: detect primary content, pipe it to the browser's **Web Speech API**, control speed, stay local.

## What I tried (and what broke)

Manifest V3 architecture — service worker, content script on demand. Trigger fires parsing logic that targets `<article>`, `<main>`, or density-scored containers and skips nav/sidebar noise. Vanilla JS keeps parsing fast on large pages; frame drops were real before I trimmed the walker.

MV3 migration broke my old background script assumptions. Moving to service workers meant rethinking lifecycle and message passing — standard extension pain in 2024–2025.

Speed control was non-negotiable. Web Speech API exposes rate on the utterance object; wiring a simple slider in the popup let me tune playback without re-parsing the page. Pause/resume meant tracking utterance boundaries — another place where reading nav text would have ruined the experience.

## Fuckups & learnings

- **Heuristic article detection fails on weird CMS themes.** `<main>` isn't always main.
- **Web Speech API voices vary by OS.** Speed control helps; voice quality doesn't.
- **MV3 is the right default now**, but debugging service workers is still annoying.
- **Large pages need chunked utterances.** One 40k-character string can choke the synthesizer mid-paragraph.

## Where it stands now

Extension is Manifest V3 compliant: primary content parsing, real-time speed adjustment, audio via native synthesizer — no external TTS servers, no audio sent to a cloud API.

Published locally; Chrome Web Store packaging is a separate chore I haven't finished. Unpacked load is fine for personal use and for anyone who wants to fork the content-detection heuristics.

## Closing transmission

Small accessibility-adjacent utility. Load it unpacked, test on a noisy news site, tell me what it read that it shouldn't have.