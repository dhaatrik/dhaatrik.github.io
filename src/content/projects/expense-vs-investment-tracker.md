---
title: 'FinTrack'
description: 'Client-side dual-ledger finance v1.0.0 — expenses vs personal investments, Recharts dashboards, Zustand, JSON backup. Not Chart.js, not bank sync.'
logo: '../../assets/fintrack.png'
githubUrl: 'https://github.com/dhaatrik/expense-vs-investment-tracker'
progress: 'v1.0.0 — mindful expense vs investment dashboard'
transmissionTag: 'fintrack'
order: 7
tags: ['React 19', 'TypeScript 5.8', 'Vite 6', 'Zustand 5', 'Recharts', 'Tailwind CSS 4']
pain_level: 2
telemetry: 'STATUS: SHIPPED // LEDGER: DUAL // SYNC: JSON_EXPORT'
fuckup_teaser: "I tagged FinTrack with Chart.js on this site while the repo renders with Recharts — and unthrottled mobile filters once made the whole chart tear and lag 200ms on real phones."
---

## SYS.STATUS: v1.0.0 shipped — dual ledger, Recharts dashboards, local JSON backup

[FinTrack](https://github.com/dhaatrik/expense-vs-investment-tracker) separates everyday **expenses** from **personal investments** (courses, health, growth spending) and visualizes the ratio on a Recharts dashboard. Zustand holds app state; README emphasizes **local data ownership** with JSON export/import.

This page fixes portfolio drift: tags previously said **Chart.js**; the repo uses **Recharts**.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **Dashboard** | Expense/investment/income charts and ratios |
| **Transactions** | Log income and expenses by category |
| **Investments** | Track personal growth spending separately from burn |
| **Savings goals** | Visual progress toward financial targets |
| **Settings** | Currency, categories, themes, JSON backup/restore |

Stack: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Zustand 5, Recharts, Motion, Vitest.

Note: `package.json` includes `express` and `better-sqlite3` without README-documented server usage — shipped UX is client-side per upstream docs.

## Who I built it for

- People tired of guilt-based budgeting that lumps SIPs with takeout
- Users who want finance clarity **without** linking bank accounts
- Forkers wanting MIT-licensed local-first ledger patterns

**Not for:** automatic bank sync, shared household accounts, or tax filing automation.

## Fuckups & learnings

- **Chart.js tag was wrong.** Repo uses Recharts — portfolio hygiene matters.
- **Mobile chart lag from filter churn.** Recharts full re-renders hurt on older hardware until inputs were throttled.
- **Category defaults need opinion.** Too many buckets → people stop logging.
- **Persisted Zustand shape needs version keys** before schema migrations.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **No bank sync** | Manual entry + JSON import/export |
| **Local-only** | You own backup discipline |
| **Orphan server deps** | express/sqlite3 in package.json not documented as shipped |
| **Projection math** | Client-side assumptions — must stay visible in UI |

## Deep-dive transmissions

1. [Why FinTrack — expenses vs growth spending](/transmissions/fintrack-why-and-what/)

## Run it locally

```bash
git clone https://github.com/dhaatrik/expense-vs-investment-tracker.git
cd expense-vs-investment-tracker
npm install
npm run dev
```

Tests: `npm run test` — Vitest.

## Closing transmission

A honest mirror for how you label money — not a neobank. Start with [why-and-what](/transmissions/fintrack-why-and-what/).