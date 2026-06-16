---
title: 'Vireo Wellness'
description: 'A privacy-centric health journal and meditation timer that tracks habit patterns offline.'
logo: '../../assets/vireo-wellness.png'
githubUrl: 'https://github.com/dhaatrik/vireo-wellness'
progress: 'PWA ready, works offline with database caching'
order: 9
tags: ['React', 'PWA', 'IndexedDB', 'Tailwind CSS']
---

## What is Vireo Wellness and why was it built?

Most modern fitness and wellness applications harvest sensitive biological and emotional telemetry, hosting it on centralized servers. Dhaatrik built Vireo Wellness to prove that self-tracking does not require sacrificing data sovereignty. It provides a health companion that keeps all personal logs exclusively in the user's browser.

## How did Dhaatrik approach the implementation?

Dhaatrik structured Vireo Wellness as a Progressive Web Application (PWA) with a local-first offline architecture. To ensure data safety, all entries are stored locally inside the browser's IndexedDB using a lightweight transactional layer. Service Workers cache assets for instant loading, allowing the application to remain functional without a network connection.

## What technologies were used in the stack?

- **React**: Powering the modular components of the meditation log and timers.
- **Service Workers & PWA Manifest**: Enabling offline installs and instant asset caching.
- **IndexedDB**: The underlying browser database providing persistent, local storage.
- **Tailwind CSS**: Styling a soothing, dark mode-first user interface.

## What is the current progress and outcome?

Vireo Wellness is fully PWA-compliant. It functions 100% offline, handles entries safely through local database wrappers, and supports local-first backup export.
