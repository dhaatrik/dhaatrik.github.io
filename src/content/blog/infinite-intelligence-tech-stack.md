---
title: 'Infinite Intelligence Tech Stack — Client Orchestration, @google/genai, Export, Zero Backend'
description: 'Why v4.0.0 uses React 19 + Vite 6 + @google/genai with html2canvas/jsPDF export — no server, BYOK Gemini calls from the browser.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['infinite-intelligence', 'react', 'vite', 'genai']
clearance: 'PUBLIC'
readingTime: '10 min'
hasMath: false
series: 'Infinite Intelligence'
seriesOrder: 2
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Infinite Intelligence tech stack (v4.0.0)
- REPO: github.com/dhaatrik/the-infinite-intelligence
- RUNTIME: React 19.2 + TypeScript 5.8 + Vite 6 — client-only SPA
- AI: @google/genai → gemma-4-31b-it
- EXPORT: html2canvas + jsPDF, react-markdown + remark-gfm
- KEY LESSON: State machine orchestration beats ad-hoc promise chains for multi-agent UI
====================================================================
```

### Mission Report: Orchestration in the Browser Tab

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Read [why the council exists](/transmissions/infinite-intelligence-why-and-what/) first. This is how v4.0.0 runs multiple agents without a backend.

---

### Mission Report: Stack Table (from package.json)

| Layer | Choice | Role |
|-------|--------|------|
| **UI** | React 19.2 + Vite 6 | Streaming agent panels, sidebars, modals |
| **Types** | TypeScript 5.8 | Agent configs, transitions, HITL events |
| **AI** | `@google/genai` | Streaming completions, system instructions per agent |
| **Markdown** | react-markdown + remark-gfm | Synthesizer reports in UI |
| **Motion** | Motion 12 | Panel transitions without jank during parallel streams |
| **Export** | html2canvas + jsPDF | Client-side PDF executive reports |
| **Tests** | Vitest + RTL | Settings, sidebars, constants |

No Express. No WebSocket fan-out server. API key in `.env` as `VITE_GEMINI_API_KEY`.

Note: upstream README mentions Tailwind CSS; **v4.0.0 `package.json` does not list Tailwind** — styling is handled in-app (glassmorphism layout per README prose). Portfolio Tailwind tags were stale.

---

### Mission Report: Orchestration Shape

1. **State machine** — typed phases: first principles → squad deploy → topology run → critique → HITL checkpoints → synthesis
2. **Parallel mode** — independent agent calls with out-of-order completion handling in React state
3. **Sequential mode** — chained handoffs when each step depends on prior output
4. **Round-robin** — iterative critique cycles (capped — see BYOK transmission)
5. **Branching** — fork graph stored client-side per session

Async completion landing out of order was the UI fight — concurrent React updates + explicit phase guards.

---

### Mission Report: Fuckups & Learnings

- **Promise-chain orchestration collapsed by week two.** State machine paid back immediately.
- **Export stack is heavy.** html2canvas + jsPDF bundles matter — acceptable for executive export feature, not for landing page weight.
- **Model string drift risk.** `gemma-4-31b-it` in README must stay aligned with `constants.ts` — document when Google renames models.
- **Vitest mocks streaming** — test agent UI states, not live API in CI.

---

### Mission Report: Closing Transmission

Client-only council. Direct API calls. Export in-tab. Backend is intentionally absent.

BYOK economics: [API keys and recursion guardrails](/transmissions/infinite-intelligence-byok-guardrails/).