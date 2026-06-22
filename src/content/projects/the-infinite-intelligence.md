---
title: 'Infinite Intelligence'
description: 'Multiple Gemini agents debate a problem before you get a final answer — not one model talking to itself in a mirror.'
logo: '../../assets/the-infinite-intelligence.png'
githubUrl: 'https://github.com/dhaatrik/the-infinite-intelligence'
progress: 'Parallel Collaboration, Sequential Workflows, and Round-Robin Debate'
order: 4
tags: ['React 19', 'TypeScript 5.8', 'Google Gemini AI', 'Vite 6']
pain_level: 3
telemetry: 'STATUS: OPERATIONAL // AGENTS: DEBATING // PARALLEL: TRUE'
fuckup_teaser: 'I kicked off a multi-agent debate test loop without a maximum recursion depth block, waking up to a rate-limited API key and a massive bill.'
---

## SYS.STATUS: Council-of-agents pipeline works — Creator, Critic, Synthesizer all shipping

One model giving you a confident wrong answer is still one model. The Infinite Intelligence is my experiment in making AI argue with itself before you trust the output.

## Why I started this

I kept hitting the same wall: single-shot LLM responses sound authoritative even when they're thin or biased. I wanted a workflow where specialized roles — generate, critique, refine — run in a structured loop, so the final answer survived at least one round of peer review.

Not magic. Not "superintelligence." Just **process** applied to models that otherwise skip self-checking.

## What I tried (and what broke)

I modeled the system as a **state machine**. Agents (Creator, Critic, Synthesizer) pass messages through typed transitions in TypeScript 5.8. Google Gemini handles the roleplay via system instructions — different personas, different jobs.

Three workflow modes shipped from the build:

- **Parallel collaboration** — agents work concurrently where independence helps
- **Sequential workflows** — strict ordering when each step depends on the last
- **Round-robin debate** — iterative critique until synthesis

React 19 + Vite 6 render the interaction canvas — watching agents talk in real time is half the point. Getting the UI to stay smooth while multiple async completions land out of order took careful state design.

## Fuckups & learnings

- **More agents ≠ better answers.** Extra rounds can amplify noise if the Critic isn't constrained. Role prompts matter more than agent count.
- **State machines pay off fast.** Ad-hoc promise chains became unmaintainable by week two.
- **Debate is expensive.** Latency and token cost are real; the UI should show progress, not a spinner pretending it's thinking.

## Where it stands now

All three workflow modes are implemented. You input a prompt and watch the council debate, critique, and refine live before the synthesized output lands.

## Closing transmission

If you're skeptical of single-model certainty — good, me too. Clone it, break a workflow, and see if the council catches what one shot missed.
