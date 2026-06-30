---
title: 'MarkPDF Tech Stack — react-markdown, Print CSS, and Syntax Highlighting Tradeoffs'
description: 'Why MarkPDF v1.0.0 uses react-markdown + remark-gfm + react-syntax-highlighter and exports via browser print — not jsPDF or KaTeX.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['markpdf', 'react', 'markdown', 'print-css']
clearance: 'PUBLIC'
readingTime: '10 min'
hasMath: false
series: 'MarkPDF'
seriesOrder: 2
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: MarkPDF tech stack (v1.0.0)
- REPO: github.com/dhaatrik/free-markdown-to-pdf-converter
- RENDER: react-markdown + remark-gfm + react-syntax-highlighter
- EXPORT: Browser native print engine (Save as PDF)
- REJECTED: jsPDF canvas layout, KaTeX math, server-side Pandoc
- KEY LESSON: Print CSS + GFM preview beats fighting PDF coordinate APIs for notes
====================================================================
```

### Mission Report: The Stack Serves the Export Path

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

MarkPDF is not impressive because it uses React 19. It is useful because the **render path** and **export path** agree: what you preview is what the print engine sees.

If you have not read [why MarkPDF exists](/transmissions/markpdf-why-and-what/), start there. This is the engineering appendix.

---

### Mission Report: Constraints Before Libraries

| Constraint | What it eliminated |
|------------|-------------------|
| **Zero server** | Cloud Pandoc APIs, headless Chrome farms, paid conversion SaaS |
| **Zero native installs** | Local TeX, wkhtmltopdf, groff pipelines |
| **Solo maintainer** | Custom unified/remark plugin zoo I cannot regression-test alone |
| **Privacy** | Uploading documents to third-party converters |
| **Good-enough PDF** | Journal submission quality — out of scope |

---

### Mission Report: What I Picked (and Why)

| Layer | Choice | Honest reason |
|-------|--------|---------------|
| **UI** | React 19.2 + Vite 6 | Fast HMR, familiar component model for split-pane editor |
| **Styling** | Tailwind CSS 4 + `@tailwindcss/typography` | Rapid prose styling for preview pane |
| **Markdown** | react-markdown + remark-gfm | Safe GFM rendering (tables, task lists) without hand-rolling AST walks |
| **Code blocks** | react-syntax-highlighter | Themeable highlighting; separate light/dark code themes for print |
| **Export** | `window.print()` + print CSS | Vector PDF via browser engine — no jsPDF page-break math |
| **Tests** | Vitest + React Testing Library | Component and settings flows stay honest in CI |

react-markdown already sits on remark under the hood. I did **not** add a separate Remark/Rehype pipeline in `package.json` because the component abstraction covers my scope.

---

### Mission Report: What I Rejected

**jsPDF for body content.** jsPDF excels at programmatic invoices and forms. Turning arbitrary HTML/markdown into multi-page prose means fighting coordinates, line wraps, and table splits. Browser print delegates that to the engine users already trust.

**KaTeX / MathJax.** Math rendering adds bundle weight, delimiter edge cases, and print CSS nightmares. No math deps ship in v1.0.0. If I add math later, it gets its own honest transmission — not a retroactive portfolio claim.

**Canvas screenshot PDFs.** html2canvas-style exports rasterize text. Print CSS keeps text vectorial when the browser cooperates.

**Server-side Pandoc.** Best quality, worst friction — violates zero-install promise.

---

### Mission Report: Print CSS — Where the Real Work Lives

The preview pane uses screen typography. Export applies `@media print` rules:

- Margin controls map to millimeter padding users set in Settings
- Background graphics must be enabled in the print dialog for custom colors
- Scale should stay at 100% — browser zoom tricks lie about page fit
- Code blocks need print-safe themes — dark-on-dark fails on paper

My honest fuckup category here is **pagination**: GFM tables and long code fences split across pages unpredictably. That is browser variance, not a missing npm package.

---

### Mission Report: Fuckups & Learnings

- **Do not describe the stack you wish you had.** KaTeX/jsPDF on the portfolio were aspirational ghosts.
- **Two theme tracks.** Screen dark mode ≠ print contrast requirements.
- **Syntax highlighter bundle size.** Acceptable for a dev tool; would hurt a landing-page widget.
- **Vitest catches settings regressions.** Margin and font family changes need tests — users notice PDF drift.

---

### Mission Report: Closing Transmission

react-markdown for GFM. Syntax highlighter for code. Print CSS for export. Boring on purpose.

Honest limits and MIT licensing: [free and browser-dependent output](/transmissions/markpdf-free-browser-limits/).