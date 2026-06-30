---
title: 'Infinite Intelligence'
description: 'BYOK multi-agent council v4.0.0 — parallel/sequential/round-robin, HITL, branching, PDF export via gemma-4-31b-it. Client-only, no backend.'
logo: '../../assets/the-infinite-intelligence.png'
githubUrl: 'https://github.com/dhaatrik/the-infinite-intelligence'
progress: 'v4.0.0 — four-agent squad, Beta mode, HITL, session branching'
transmissionTag: 'infinite-intelligence'
order: 4
tags: ['React 19.2', 'TypeScript 5.8', 'Vite 6', '@google/genai', 'Motion']
pain_level: 3
telemetry: 'STATUS: OPERATIONAL // MODEL: GEMMA_4_31B // BACKEND: NONE'
fuckup_teaser: "I ran an unbounded multi-agent debate test without depth caps and woke up to a rate-limited API key — v4 adds token/cost visibility but you still own the guardrails."
---

## SYS.STATUS: v4.0.0 operational — council orchestration, HITL steering, executive export

[The Infinite Intelligence](https://github.com/dhaatrik/the-infinite-intelligence) is a **client-side multi-agent orchestration SPA**. You supply a Gemini API key; the app deploys a **four-agent default squad** (plus **Beta Mode** dynamic personas), runs **parallel**, **sequential**, or **round-robin** flows with critique rounds, optional **human-in-the-loop** steering, **session branching**, artifact extraction, and **PDF/Markdown** export.

Model per README: **`gemma-4-31b-it`** via `@google/genai`. No backend — prompts and keys stay in your browser session.

This page updates portfolio copy that undersold v4 as "three agents" and tagged Tailwind without a matching `package.json` dep.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **Modes** | Parallel, sequential, round-robin (up to 5 critique rounds) |
| **First principles** | Pre-phase deconstructs prompt into constraints |
| **Default squad** | Four configured expert personas |
| **Beta Mode** | Task-tailored dynamic agent generation |
| **HITL** | Thumbs up/down, steering comments mid-run |
| **Branching** | Fork history at any node |
| **Artifacts** | Side panel for code/JSON snippets |
| **Export** | PDF (html2canvas + jsPDF) + Markdown reports |
| **Metrics** | Token and estimated cost display |

Stack: React 19.2, TypeScript 5.8, Vite 6, `@google/genai`, react-markdown, remark-gfm, Motion, html2canvas, jsPDF, Vitest.

Requires **`VITE_GEMINI_API_KEY`**. MIT licensed.

## Who I built it for

- Skeptics of single-shot LLM certainty who want structured critique
- Developers studying client-side agent orchestration patterns
- Teams prototyping council-of-models UX before building server infra

**Not for:** free inference (you pay API usage), unattended infinite debate, or enterprise persistence without adding a backend.

## Fuckups & learnings

- **Undersold v4 on portfolio.** Four agents + Beta + HITL + branching beats "three debaters" fiction.
- **Unbounded loops cost real money.** Rate-limit bill fuckup — cap rounds, use HITL, watch metrics.
- **Debate amplifies noise** when Critic prompts are vague.
- **README vs package.json drift.** Tailwind mentioned in README; v4.0.0 deps are React/Vite/genai/export stack — verify before tagging.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **BYOK costs** | Token usage scales with agents × rounds × prompt size |
| **No server persistence** | Export reports; refresh clears in-tab session |
| **Model id drift** | Keep README and `constants.ts` aligned |
| **Latency** | Council modes are slower than single-shot chat |

## Deep-dive transmissions

Read in order:

1. [Why a council of models](/transmissions/infinite-intelligence-why-and-what/)
2. [Client orchestration tech stack](/transmissions/infinite-intelligence-tech-stack/)
3. [BYOK economics and guardrails](/transmissions/infinite-intelligence-byok-guardrails/)

## Run it locally

```bash
git clone https://github.com/dhaatrik/the-infinite-intelligence.git
cd the-infinite-intelligence
npm install
# .env: VITE_GEMINI_API_KEY=your_key
npm run dev
```

Tests: `npm run test` — Vitest.

## Closing transmission

Process over bravado. Clone it, cap your rounds, break a workflow, see if the council catches what one shot missed. Start with [why-and-what](/transmissions/infinite-intelligence-why-and-what/).