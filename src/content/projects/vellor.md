---
title: 'Vellor'
description: "Empowering independent educators with a completely free, open-source 'Operating System' that makes managing a tutoring business effortless while keeping student data 100% private and offline."
logo: '../../assets/vellor.png'
githubUrl: 'https://github.com/dhaatrik/vellor'
progress: "v4.0.0 'Power-Tutor' Update"
order: 1
tags: ['React 19', 'TypeScript 5.7', 'Zustand 5', 'Tailwind CSS 3']
---

## What is Vellor and why was it built?

Dhaatrik noticed that most tutoring tools were either overpriced, overly complex, or invasive with data. He built Vellor to solve this—giving "solopreneur" teachers a professional tool that runs instantly in a browser with zero setup, ensuring they own their data while enjoying a gamified experience.

## How did Dhaatrik approach the implementation?

To guarantee 100% data privacy and offline access, Dhaatrik designed Vellor as an offline-first progressive web application (PWA). All data is stored in the user's browser using IndexedDB. State synchronization and updates are handled via Zustand with local persistence middleware, ensuring instant load times and zero network overhead.

## What technologies were used in the stack?

- **React 19 & Zustand 5**: Modern state management with extremely fine-grained reactivity.
- **TypeScript 5.7**: Ensuring safe type definitions across offline mutations.
- **Tailwind CSS 3**: Creating a premium, game-like design system.

## What is the current progress and outcome?

Vellor is currently at version 4.0.0 (the "Power-Tutor" update), providing independent educators with a fully functional tools suite. Every filter and sorting operation is optimized to be $O(N)$ for instantaneous feel even under large local datasets.
