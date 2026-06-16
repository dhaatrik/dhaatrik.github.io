---
title: 'FinTrack'
description: 'An investment-first financial logger that visually distinguishes between depreciating expenses and wealth-generating investments.'
logo: '../../assets/fintrack.png'
githubUrl: 'https://github.com/dhaatrik/expense-vs-investment-tracker'
progress: 'v1.0.0 released, features interactive portfolio charts'
order: 7
tags: ['React', 'Chart.js', 'Zustand', 'Tailwind CSS']
---

## What is FinTrack and why was it built?

Standard budget and expense trackers group investments (mutual funds, stocks, real estate) into generic expense sheets, obscuring long-term asset accumulation and growth. Dhaatrik built FinTrack to visually decouple active liabilities and wealth-building assets, giving users a first-principles look at their real capital flows.

## How did Dhaatrik approach the implementation?

Dhaatrik designed a dual-ledger system. Users log entries categorized by liquidity and appreciation potential. Using a modular state container, FinTrack recalculates portfolio metrics client-side. The dashboard aggregates these data points into interactive visualizations, contrasting monthly expenses with long-term compound interest trajectories.

## What technologies were used in the stack?

- **React**: Powering the dynamic UI modules and forms.
- **Chart.js**: Generating responsive asset allocation and growth curves.
- **Zustand**: Managing the transaction ledger state with local storage persistence.
- **Tailwind CSS**: Providing a clean, premium dashboard layout.

## What is the current progress and outcome?

FinTrack is active at version 1.0.0. The application successfully renders asset-allocation pie charts, tracks investment-to-expense ratios, and projects net-worth curves entirely client-side.
