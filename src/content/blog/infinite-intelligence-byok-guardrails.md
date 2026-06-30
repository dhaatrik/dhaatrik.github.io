---
title: 'Infinite Intelligence — API Keys, Rate Limits, and Recursion Depth Guardrails'
description: 'MIT-licensed BYOK multi-agent tool v4.0.0: you supply Gemini API keys, pay per token, and must cap debate depth — honest economics and limits.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['infinite-intelligence', 'byok', 'mit', 'gemini']
clearance: 'PUBLIC'
readingTime: '9 min'
hasMath: false
series: 'Infinite Intelligence'
seriesOrder: 3
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Infinite Intelligence BYOK economics
- LICENSE: MIT
- PRICING: $0 app — you pay Google API usage directly
- RISK: Unbounded critique rounds → rate limits and surprise bills
- GUARDRAILS: Round caps, token/cost UI, HITL steering before synthesis
- KEY LESSON: Free OSS orchestration ≠ free inference
====================================================================
```

### Mission Report: Your Key, Your Bill, Your Guardrails

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

The Infinite Intelligence costs **$0** to clone. Inference does not. BYOK means **you** bring `VITE_GEMINI_API_KEY` and **you** eat token usage on `gemma-4-31b-it`.

This transmission is the dull-truth companion to [why-and-what](/transmissions/infinite-intelligence-why-and-what/) and [tech stack](/transmissions/infinite-intelligence-tech-stack/).

---

### Mission Report: What MIT Free Means Here

- Use, modify, distribute the orchestration UI — MIT terms apply
- No hosted SaaS margin — I do not bill per debate
- No server sees your prompts — calls go from browser to Google with your key
- MIT ≠ "Google API is free" — check current Gemini pricing

---

### Mission Report: Cost Drivers

| Knob | Effect |
|------|--------|
| **Agent count** | Four defaults (+ Beta-generated squad) multiplies calls |
| **Topology** | Parallel fires simultaneously; round-robin iterates |
| **Critique rounds** | Up to 5 configured — each round re-spends tokens |
| **Prompt size** | First-principles + synthesis context grows fast |
| **Export** | PDF generation is local; API cost already sunk |

v4 shows **token and cost metrics** in UI — visibility, not automatic caps.

---

### Mission Report: The Rate-Limit Bill Fuckup (Real)

I kicked off a multi-agent test loop **without a maximum recursion depth block**. Woke up to a **rate-limited API key** and a bill I could have predicted.

Lessons baked into how I talk about v4:

- Cap critique rounds in settings — do not trust "just one more debate"
- HITL steering stops runaway agents before synthesis
- Beta Mode generates more personas — treat as **expensive mode**
- No server-side spend fuse exists — **you** are the circuit breaker

---

### Mission Report: Honest Limitations

| Limitation | Reality |
|------------|---------|
| **No persistence server** | Refresh loses in-tab session unless you export |
| **Debate can amplify noise** | Bad Critic prompts worsen answers |
| **Model string drift** | README model id must match code config |
| **Latency stacks** | Council feels slow — honesty in UI progress matters |

---

### Mission Report: Closing Transmission

Clone free. Debate carefully. Export the report. Sleep with your API dashboard open if you leave round-robin unattended.

[Project page](/projects/the-infinite-intelligence/) for scope tables.