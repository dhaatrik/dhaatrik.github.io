---
title: 'Read Aloud Chrome Extension'
description: 'A lightweight browser extension that reads web page text aloud using native text-to-speech synthesis with speed control.'
logo: '../../assets/read-aloud.png'
githubUrl: 'https://github.com/dhaatrik/ReadAloud_ChromeExtension'
progress: 'Manifest V3 extension, published locally'
order: 12
tags: ['JavaScript', 'Web Speech API', 'Chrome Extension']
---

## What is Read Aloud Chrome Extension and why was it built?

Standard page screen readers are often bloated, capture screen focuses, or read out irrelevant header/footer navigation lists, disrupting content comprehension. Dhaatrik built this Chrome Extension to provide a single-click text-to-speech companion that parses and reads only the primary page text context.

## How did Dhaatrik approach the implementation?

Dhaatrik structured the extension using the Manifest V3 architecture. A content script executes upon trigger, identifying and parsing primary article nodes (e.g., `<article>`, `<main>`, or density-analyzed containers) while skipping navigation links and sidebars. The parsed text is processed using the browser's native Web Speech API synthesizer.

## What technologies were used in the stack?

- **Chrome Extension Manifest V3**: Utilizing service workers and secure content scripts.
- **Web Speech API**: Interfacing with the browser's native text-to-speech synthesizer engine.
- **Vanilla JavaScript**: Writing highly optimized parsing logic to prevent browser frame-drops on large pages.

## What is the current progress and outcome?

The extension is fully compliant with Chrome Manifest V3. It parses primary page content, supports real-time speed adjustments, and plays audio streams locally without communicating with external TTS servers.
