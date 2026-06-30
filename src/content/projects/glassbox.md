---
title: 'Glassbox'
description: 'Cyberpunk internal feedback terminal — employee signals, Kanban neural grid, MoM metrics, Gemini sentiment. Not VM2, not a code sandbox.'
logo: '../../assets/glassbox.png'
githubUrl: 'https://github.com/dhaatrik/glassbox'
progress: 'v4.2.1 — organizational feedback terminal with AI insights'
transmissionTag: 'glassbox'
order: 6
tags: ['React 19', 'TypeScript 5.8', 'Vite 6', 'Gemini', 'Recharts', 'Kanban']
pain_level: 3
telemetry: 'STATUS: SHIPPED // AI: BYOK_GEMINI // PRODUCT: FEEDBACK_TERMINAL'
fuckup_teaser: "I described Glassbox as a VM2 sandbox on this site while the repo shipped a cyberpunk feedback terminal — and Gemini once labeled sarcastic 'mandatory fun' feedback as POSITIVE."
---

## SYS.STATUS: v4.2.1 shipped — feedback signals, neural grid, metrics, AI insights

[Glassbox](https://github.com/dhaatrik/glassbox) is an internal **organizational feedback terminal** wrapped in a cyberpunk aesthetic. Employees submit "signals," managers organize them on a drag-and-drop **neural grid**, and leadership views **month-over-month metrics** plus optional **Gemini-generated insight reports**.

This page replaces stale portfolio copy that wrongly described a **VM2-isolated Node.js code sandbox**. Glassbox is **not** a security product.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **New Signal** | Submit department feedback; AI classifies POSITIVE/NEGATIVE/NEUTRAL at intake |
| **Neural Grid** | Kanban board with drag-and-drop; filter by department, status, keyword |
| **Metrics** | MoM volume trends (Recharts); trigger AI insight synthesis |
| **Terminal UI** | Cyberpunk mission-control aesthetic with Motion animations |

Stack: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Recharts, `@hello-pangea/dnd`, `@google/genai`, Express, better-sqlite3, Vitest.

Requires **`VITE_GEMINI_API_KEY`** — BYOK inference costs apply.

## Who I built it for

- Teams prototyping internal sentiment workflows before enterprise HR tooling
- Developers exploring Gemini classification on short employee text
- Anyone wanting a distinctive Kanban + metrics demo to fork (MIT licensed)

**Not for:** running untrusted JavaScript in isolation, compliance-grade HRIS without your own hardening, or cultures where sarcasm-heavy feedback needs human-only review.

## Fuckups & learnings

- **Wrong product identity on my portfolio.** VM2, sandbox escapes, JSON fs/network audit logs — stale fiction from an abandoned direction.
- **Sentiment misclassification on sarcasm.** "Oh great, another mandatory fun Friday" scored POSITIVE once. AI labels are triage hints, not HR verdicts.
- **Kanban + live filters broke drag state.** Mid-drag filter changes dropped card metadata until state keys were tightened.
- **Cyberpunk chrome adds maintenance cost.** Motion layers and terminal UI increase bundle and test surface vs boring admin panels.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **Not a security sandbox** | No VM2, no untrusted script execution, no fs/network audit |
| **BYOK Gemini** | You supply API key and pay inference costs |
| **Demo/internal shape** | Not multi-tenant SaaS or production HRIS out of the box |
| **Sentiment trust limits** | Sarcasm, coded language, and cultural context can fool classifiers |

## Deep-dive transmissions

Read in order for the full story:

1. [Why Glassbox exists — org feedback terminal, not a code sandbox](/transmissions/glassbox-why-and-what/) — origin, scope, VM2 portfolio drift confession

## Run it locally

```bash
git clone https://github.com/dhaatrik/glassbox.git
cd glassbox
npm install
# .env: VITE_GEMINI_API_KEY=your_key
npm run dev
# Opens http://localhost:3000
```

Tests: `npm test` — Vitest + React Testing Library.

## Closing transmission

Submit signals. Drag the grid. Read the metrics. Glassbox turns qualitative employee input into structured, chartable data — with AI assist if you configure a key. Start with [why-and-what](/transmissions/glassbox-why-and-what/) if you want the full identity correction story.