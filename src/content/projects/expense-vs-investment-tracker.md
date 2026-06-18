---
title: 'FinTrack'
description: "A client-side finance logger that splits everyday spending from actual investments — so your net worth isn't hiding in expenses."
logo: '../../assets/fintrack.png'
githubUrl: 'https://github.com/dhaatrik/expense-vs-investment-tracker'
progress: 'v1.0.0 released, features interactive portfolio charts'
order: 7
tags: ['React', 'Chart.js', 'Zustand', 'Tailwind CSS']
pain_level: 2
telemetry: 'STATUS: SHIPPED // VERSION: V1.0.0 // LEDGER: DUAL'
fuckup_teaser: "Chart.js re-rendered on every filter change — 200ms flickers on older phones I didn't test until after shipping."
---

## SYS.STATUS: v1.0.0 — dual ledger live, charts render, all client-side

Most budget apps treat your SIP and your coffee the same way: money out, done. FinTrack separates **depreciating spend** from **wealth-building positions** so you can see what you're actually accumulating.

## Why I started this

I was logging investments inside expense sheets because the app I used had one bucket. That made my portfolio invisible next to groceries. I wanted a first-principles view of capital flow — liabilities vs. assets — without exporting CSVs to a spreadsheet every month.

## What I tried (and what broke)

Dual-ledger design: entries tagged by liquidity and appreciation potential. Zustand holds the transaction state with localStorage persistence; Chart.js renders allocation pies and growth curves on the dashboard. Everything recalculates client-side when you add a row.

Chart responsiveness on mobile was the main friction — default Chart.js configs assume desktop width. Tailwind helped layout; tuning aspect ratios and legend placement fixed the rest.

The dashboard shows two stories side by side: what left your wallet this month as pure expense, and what's still working for you as investment principal. Net-worth projection curves are compound-interest math, not bank API magic — I kept assumptions visible so the chart doesn't lie quietly.

## Fuckups & learnings

- **Categories need opinionated defaults.** Too many buckets and people stop logging.
- **Client-side projection math must show assumptions**, or compound curves become wishful thinking.
- **Zustand + localStorage is simple until migration day.** Version your persisted shape early.
- **Investment tags need examples in the UI.** "Appreciation potential" is vague until you show SIP vs. rent vs. gadgets.

## Where it stands now

v1.0.0 tracks investment-to-expense ratios, renders asset allocation pie charts, and projects net-worth curves entirely in the browser. No backend, no bank sync — intentional scope for people who want clarity without linking their accounts to another fintech.

## Closing transmission

Not a fintech unicorn. A honest mirror for how you label your own money. Clone it if your budget app keeps swallowing your mutual funds.