---
title: 'Read Aloud'
description: 'MV3 Chrome extension v4.0.0 — chrome.tts article reading, CSS Highlight API, skip controls, 59 tests. Not Web Speech API, not Web Store yet.'
logo: '../../assets/read-aloud.png'
githubUrl: 'https://github.com/dhaatrik/ReadAloud_ChromeExtension'
progress: 'v4.0.0 — MV3 shipped, CI zip artifact, unpack install'
transmissionTag: 'read-aloud'
order: 12
tags: ['Chrome Extension', 'Manifest V3', 'chrome.tts', 'JavaScript']
pain_level: 2
telemetry: 'STATUS: SHIPPED // MV3: COMPLIANT // TESTS: 59_141'
fuckup_teaser: "I tried memory-only state in an MV3 service worker until Chrome killed it mid-article — v4 backs playback up to chrome.storage.session and the test suite caught regressions."
---

## SYS.STATUS: v4.0.0 shipped — chrome.tts, smart extraction, highlight + skip, CI tested

[Read Aloud](https://github.com/dhaatrik/ReadAloud_ChromeExtension) converts web articles into offline audiobook-style playback. It extracts main content, speaks via **`chrome.tts`**, highlights the active sentence with the **CSS Custom Highlight API**, and supports keyboard skip controls — **no cloud TTS**, no signup.

This page corrects portfolio copy that said **Web Speech API**. The extension uses Chromium's **`chrome.tts`** engine and **Intl.Segmenter** for sentence boundaries.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **Extraction** | Article/main heuristics; read selected text only |
| **Playback** | Play/pause/stop; continues after popup closes |
| **Highlight** | Non-destructive sentence highlight (with fallback) |
| **Shortcuts** | Alt+Shift+P play/pause; Left/Right skip sentences |
| **Storage** | `chrome.storage.sync` preferences; `session` playback backup |

Stack: MV3 service worker, vanilla JS, QUnit + Playwright, ESLint 9, GitHub Actions CI.

**Tests:** 59 tests, 141 assertions — lint → test → versioned zip artifact.

## Who I built it for

- Long-form readers who want eyes-free article consumption
- Privacy-conscious users refusing cloud TTS uploads
- Developers studying MV3 TTS + extraction patterns

**Not for:** non-Chromium browsers, guaranteed CMS extraction on every site, or one-click Web Store install (not published yet).

## Fuckups & learnings

- **Wrong API name on portfolio.** `chrome.tts` ≠ generic Web Speech API in extension architecture.
- **MV3 worker kills broke playback.** Session storage backup + tests for persistence — v4 upgrade.
- **Segmentation quality matters.** Intl.Segmenter handles abbreviations better than naive splits.
- **Voice quality is OS-dependent.** Speed slider helps; voices vary by platform.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **Chromium-only** | Chrome extension APIs |
| **No Web Store yet** | Unpack install from repo / CI zip |
| **Heuristic extraction** | Odd CMS layouts can fool selectors |
| **Restricted pages** | `chrome://` and similar blocked with error UI |

## Deep-dive transmissions

1. [Why Read Aloud — article TTS without cloud APIs](/transmissions/read-aloud-why-and-what/)

## Run it locally

```bash
git clone https://github.com/dhaatrik/ReadAloud_ChromeExtension.git
cd ReadAloud_ChromeExtension
npm install && npm test
# chrome://extensions → Developer mode → Load unpacked (select repo folder)
```

## Closing transmission

Small utility, heavy test discipline. Load it, break extraction on a weird site, file an issue. Start with [why-and-what](/transmissions/read-aloud-why-and-what/).