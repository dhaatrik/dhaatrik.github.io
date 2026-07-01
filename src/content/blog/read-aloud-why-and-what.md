---
title: 'Why Read Aloud — Article TTS Without Cloud APIs or Page Noise'
description: 'Honest origin story for Read Aloud v4.0.0: MV3 chrome.tts extension with article extraction, CSS Highlight API, 59 tests — not Web Speech API.'
pubDate: 2026-07-12
updatedDate: 2026-07-12
tags: ['read-aloud', 'chrome-extension', 'mv3', 'accessibility']
clearance: 'PUBLIC'
readingTime: '11 min'
hasMath: false
series: 'Read Aloud'
seriesOrder: 1
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Read Aloud (github.com/dhaatrik/ReadAloud_ChromeExtension)
- VERSION: v4.0.0
- SCOPE: MV3 extension — chrome.tts, article extraction, sentence highlight, skip controls
- MOTIVATION: Screen readers read nav/footer junk; cloud TTS rents privacy
- KEY LESSON: Portfolio said Web Speech API; repo uses chrome.tts + Intl.Segmenter
====================================================================
```

### Mission Report: Read the Article, Not the Chrome

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. My portfolio described Read Aloud as wrapping the **Web Speech API**. The repo at **v4.0.0** uses **`chrome.tts`** — Chromium's extension TTS engine — plus **`Intl.Segmenter`** for sentence boundaries and the **CSS Custom Highlight API** for non-destructive highlighting.

I am fixing that drift here, and giving v4 the credit it deserves: skip controls, session persistence across MV3 service worker kills, and **59 tests / 141 assertions** in CI.

---

### Mission Report: The Why — What Problem Was I Actually Solving?

Three frustrations stacked:

1. **Built-in screen readers read everything.** Cookie banners, sidebars, related posts — not the essay you wanted.

2. **Cloud TTS extensions rent your reading habit.** I wanted offline, private playback with **no API keys** and **no audio uploaded**.

3. **MV3 service workers die.** Chrome kills inactive background scripts. Playback state must survive restarts — v4 backs up to `chrome.storage.session`.

Read Aloud is minimal: extract primary content, speak sentences, highlight the active line, let you skip forward/back.

---

### Mission Report: What Read Aloud Ships — Concrete Scope

As of **v4.0.0**:

| Surface | What you do there |
|---------|-------------------|
| **Extraction** | `<article>`, `<main>`, role=main heuristics; selection override |
| **Playback** | Play/pause/stop via `chrome.tts`; survives popup close |
| **Highlight** | CSS Custom Highlight API (graceful fallback) |
| **Navigation** | Alt+Shift+Left/Right skip sentences; Alt+Shift+P toggle |
| **Settings** | Voice + speed (0.5×–2.0×) via `chrome.storage.sync` |
| **Resilience** | Session state backup for MV3 worker restarts |

Stack: Manifest V3, vanilla JavaScript, `chrome.tts`, Intl.Segmenter, QUnit + Playwright, ESLint 9, GitHub Actions (lint → test → zip artifact).

**Not shipped:** Chrome Web Store listing (unpack install); Firefox/Safari; perfect extraction on every CMS theme.

---

### Mission Report: Fuckups & Learnings

- **Web Speech API label was wrong.** Content scripts use extension TTS orchestration — different lifecycle, different voice lists.
- **MV3 memory-only state failed.** Service worker kills mid-article taught me **session storage backup** — upgraded from the old fuckup story.
- **Intl.Segmenter beats naive split.** "Dr." and "U.S.A." boundaries matter for listenable pacing.
- **Heuristic extraction fails on weird themes.** `<main>` is not always main — expect edge cases on news sites.

---

### Mission Report: Current State & Key Artifacts

```bash
git clone https://github.com/dhaatrik/ReadAloud_ChromeExtension.git
cd ReadAloud_ChromeExtension
# Load unpacked at chrome://extensions
npm install && npm test   # 59 tests, 141 assertions
```

CI builds `read-aloud-extension-v4.0.0.zip` artifact. MIT licensed.

---

### Mission Report: Closing Transmission

Load unpacked. Open a noisy news article. Press play. If it reads your footer, tell me — that is the heuristic game.

Project page: [Read Aloud](/projects/readaloud_chromeextension/).