---
title: 'MarkPDF'
description: 'Browser markdown-to-PDF via react-markdown preview and native print export — GFM, syntax highlighting, no server. Not KaTeX, not jsPDF.'
logo: '../../assets/markpdf.png'
githubUrl: 'https://github.com/dhaatrik/free-markdown-to-pdf-converter'
progress: 'v1.0.0 — GFM editor, live preview, browser print Save as PDF'
transmissionTag: 'markpdf'
order: 11
tags: ['React 19.2', 'TypeScript 5.8', 'Vite 6', 'react-markdown', 'remark-gfm']
pain_level: 2
telemetry: 'STATUS: SHIPPED // EXPORT: BROWSER_PRINT // MATH: NOT_SHIPPED'
fuckup_teaser: "I described MarkPDF with KaTeX and jsPDF on this site — the repo exports through browser print and has no LaTeX math deps; my real pain was print CSS pagination, not vanished equations."
---

## SYS.STATUS: v1.0.0 shipped — GFM markdown preview, browser print to PDF

[MarkPDF](https://github.com/dhaatrik/free-markdown-to-pdf-converter) turns markdown into styled documents entirely in the browser: split-pane editor, live **react-markdown** preview with **remark-gfm**, **react-syntax-highlighter** for code blocks, and export via the **native print dialog** (Save as PDF).

This page replaces portfolio copy that wrongly claimed **KaTeX**, **Remark/Rehype pipeline**, **jsPDF**, and version **v1.1.0**.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **Editor** | Write GFM with toolbar inserts and line numbers |
| **Preview** | Live rendered markdown as you type |
| **Settings** | Typography, margins (mm), text/background colors, code theme |
| **Export** | Browser print → Save as PDF (enable background graphics, 100% scale) |

Stack: React 19.2, TypeScript 5.8, Vite 6, Tailwind CSS 4, react-markdown, remark-gfm, react-syntax-highlighter, Vitest.

MIT licensed. Static `dist/` deployable anywhere.

## Who I built it for

- Students and engineers who need PDF hand-ins without Pandoc/MacTeX installs
- Privacy-conscious writers who refuse cloud upload converters
- Quick lab reports with code blocks and GFM tables

**Not for:** LaTeX-heavy academic papers, guaranteed identical PDFs across all browsers, or 80-page thesis exports without browser memory limits.

## Fuckups & learnings

- **Wrong stack story on portfolio.** KaTeX, jsPDF, Remark/Rehype as primary narrative — stale fiction. Real stack is react-markdown + print CSS.
- **Print CSS pagination hurts.** GFM tables and long code fences split awkwardly across pages — browser engine variance, not a missing npm package.
- **Screen preview ≠ print output** without separate `@media print` rules and dialog settings.
- **Version drift.** Site said v1.1.0; `package.json` is **1.0.0**.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **No LaTeX math** | KaTeX not in dependencies |
| **Browser-dependent PDF** | Chrome/Firefox/Safari print margins differ |
| **Not Pandoc** | No bibtex, cross-refs, journal templates |
| **Large documents** | Very long markdown can stress preview memory |
| **Print settings required** | Background graphics and scale affect output |

## Deep-dive transmissions

Read in order for the full story:

1. [Why MarkPDF — browser print export, not jsPDF](/transmissions/markpdf-why-and-what/) — origin, scope, portfolio drift
2. [Tech stack — react-markdown, print CSS, syntax highlighting](/transmissions/markpdf-tech-stack/) — what I picked and rejected
3. [Free, MIT, and browser-dependent limits](/transmissions/markpdf-free-browser-limits/) — privacy model and honest PDF ceilings

## Run it locally

```bash
git clone https://github.com/dhaatrik/free-markdown-to-pdf-converter.git
cd free-markdown-to-pdf-converter
npm install
npm run dev
```

Tests: `npm run test` — Vitest. CI on push.

## Closing transmission

Write markdown. Preview it. Print to PDF. No server, no TeX install, no upload. If you need math or journal layout, MarkPDF will tell you the truth by what it does not ship. Start with [why-and-what](/transmissions/markpdf-why-and-what/).