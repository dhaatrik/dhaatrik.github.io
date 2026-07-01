---
title: 'Why Glassbox Exists — Org Feedback Terminal, Not a Code Sandbox'
description: 'Honest origin story for Glassbox v4.2.1: cyberpunk employee feedback terminal with Kanban, metrics, and Gemini sentiment — not VM2 sandbox security.'
pubDate: 2026-06-29
updatedDate: 2026-06-29
tags: ['glassbox', 'react', 'gemini', 'feedback', 'kanban']
clearance: 'PUBLIC'
readingTime: '11 min'
hasMath: false
series: 'Glassbox'
seriesOrder: 1
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Glassbox (github.com/dhaatrik/glassbox)
- VERSION: v4.2.1
- SCOPE: Internal feedback terminal — signals, neural grid, metrics, AI insights
- MOTIVATION: Employee feedback tools are dull and slow to interpret
- AUDIENCE: HR/ops teams evaluating internal sentiment tooling (demo shape)
- KEY LESSON: My portfolio described VM2 sandbox security; the repo pivoted to org feedback
====================================================================
```

### Mission Report: The Sandbox That Wasn't

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. My portfolio described Glassbox as a **VM2-isolated Node.js code sandbox** with JSON audit logs of filesystem and network calls. The GitHub repo at **v4.2.1** is something else entirely: a **cyberpunk employee feedback terminal** with Kanban, metrics charts, and Gemini-powered sentiment analysis.

I am fixing that mismatch here — starting with what Glassbox actually ships today.

Traditional employee feedback systems feel like homework: dull forms, delayed summaries, manual sentiment reading. I wanted a **single internal surface** where people submit honest "signals," managers drag tickets across a neural grid, and leadership sees month-over-month volume trends without waiting for a quarterly survey vendor.

---

### Mission Report: The Why — What Problem Was I Actually Solving?

Three frustrations stacked:

1. **Feedback arrives fragmented.** Slack threads, anonymous forms, hallway conversations — none of it rolls up into actionable structure without someone spending a weekend in spreadsheets.

2. **Qualitative input needs quantitative rails.** "Morale feels low" is not a dashboard metric. I wanted POSITIVE/NEGATIVE/NEUTRAL classification at intake, plus MoM charts, so patterns surface before they become resignations.

3. **Internal tools do not have to look like 2009 SharePoint.** The cyberpunk terminal aesthetic is deliberate — it signals "this is a live ops console," not another beige admin panel. Maintenance cost is real; the tradeoff is engagement.

Glassbox is **not** a security product. It does not run untrusted JavaScript in VM2. It does not audit `fs` or `net` calls. That story belonged to an old codebase direction I abandoned.

---

### Mission Report: What Glassbox Is — Concrete Scope

As of **v4.2.1**, Glassbox is a React + Vite internal feedback management demo:

| Surface | What you do there |
|---------|-------------------|
| **New Signal** | Submit feedback by department; Gemini classifies sentiment at intake |
| **Neural Grid** | Drag-and-drop Kanban (`@hello-pangea/dnd`); filter by department, status, keyword |
| **Metrics** | MoM volume trends via Recharts; AI Insight button for executive summaries |
| **Terminal UI** | Cyberpunk aesthetic with Motion animations |

Under the hood:

- **React 19 + Vite 6 + TypeScript 5.8 + Tailwind CSS 4**
- **Recharts** for metrics visualization
- **`@google/genai`** (README configures `gemma-4-31b-it`) for sentiment + insight reports
- **Express + better-sqlite3** in dependencies — local API/storage shape for the demo
- **Vitest** test suite

Requires **`VITE_GEMINI_API_KEY`** in `.env` for AI features. BYOK — you pay inference costs.

It is **not** production HRIS. It is **not** multi-tenant SaaS. It is **not** a code sandbox.

---

### Mission Report: Who I Built It For (and Who Should Skip It)

**Built for:**

- Teams prototyping internal feedback workflows before buying enterprise HR tooling
- Developers exploring Gemini sentiment on short employee text
- Anyone who wants a visually distinctive Kanban + metrics demo to fork

**Not built for:**

- Running untrusted third-party scripts in isolation — wrong product entirely
- Compliance-grade HR record-keeping without your own hardening pass
- Sarcasm-heavy cultures where POSITIVE/NEGATIVE labels will mislead (see fuckups)

---

### Mission Report: Fuckups & Learnings

- **My portfolio lied about VM2.** I described sandbox escapes and prototype pollution while the repo shipped a feedback terminal. Lesson: **read `package.json` dependencies** before tagging a project "Security."
- **Sentiment AI misreads sarcasm.** "Oh great, another mandatory fun Friday" scored POSITIVE once because Gemini latched onto "great." HR context needs human review — AI labels are triage hints, not verdicts.
- **Drag-and-drop state bugs hurt trust.** Early Kanban moves dropped card metadata when filters changed mid-drag. Fixed with stricter state keys; lesson: DnD + live filters need integration tests, not just unit tests.
- **Cyberpunk UI costs maintenance.** Custom terminal chrome and motion layers add bytes and test surface. Worth it for demos; painful for long-term admin ergonomics.

---

### Mission Report: Current State & Key Artifacts

Glassbox **v4.2.1** runs locally with Vitest coverage.

```bash
git clone https://github.com/dhaatrik/glassbox.git
cd glassbox
npm install
# Create .env with VITE_GEMINI_API_KEY=your_key
npm run dev
# Opens http://localhost:3000
```

```bash
npm test   # Vitest + React Testing Library
```

MIT licensed. AI features require your own Gemini API key.

---

### Mission Report: Closing Transmission

Submit a signal. Drag it on the grid. Watch metrics move. Generate an AI insight report if you have a key configured. That is Glassbox — org feedback terminal, not sandbox security.

If your portfolio has a similar identity drift, grep your site against upstream README before a visitor does. Full scope tables live on the [Glassbox project page](/projects/glassbox/).