---
title: 'Why MarkPDF — Zero-Install Markdown to PDF via Browser Print, Not jsPDF'
description: 'Honest origin story for MarkPDF v1.0.0: react-markdown + GFM preview, browser print-to-PDF export — not KaTeX, not jsPDF, not Remark/Rehype pipeline.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['markpdf', 'markdown', 'print', 'privacy']
clearance: 'PUBLIC'
readingTime: '10 min'
hasMath: false
series: 'MarkPDF'
seriesOrder: 1
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: MarkPDF (github.com/dhaatrik/free-markdown-to-pdf-converter)
- VERSION: v1.0.0 (site previously claimed v1.1.0)
- SCOPE: Split-pane GFM editor → live preview → browser print Save as PDF
- MOTIVATION: Pandoc/MacTeX overhead for one-off markdown exports
- KEY LESSON: My portfolio described KaTeX/jsPDF; the repo uses print engine + react-markdown
====================================================================
```

### Mission Report: The PDF Path That Does Not Need TeX Live

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Hey. My portfolio described MarkPDF as a **Remark/Rehype pipeline with KaTeX math and jsPDF export** at v1.1.0. The GitHub repo at **v1.0.0** is simpler and, in my opinion, more honest: **react-markdown** + **remark-gfm** for GitHub Flavored Markdown, **react-syntax-highlighter** for code blocks, and export through the **browser's native print dialog** (Save as PDF).

No server. No Pandoc install. No jsPDF coordinate math. I am fixing the portfolio mismatch here.

---

### Mission Report: The Why — What Problem Was I Actually Solving?

Three frustrations stacked:

1. **Markdown lives everywhere; PDF submission still wants a file.** Students and engineers write in `.md`; professors and clients want `.pdf`. The usual path — Pandoc, MacTeX, template fights — is heavy for a lab report due tomorrow.

2. **Cloud converters rent your documents.** Uploading lecture notes to a random "MD to PDF" SaaS is a privacy trade I did not want. Everything should stay in the tab.

3. **I do not need journal-grade LaTeX for most exports.** Course notes, internal docs, assignment write-ups need **readable typography and code highlighting**, not perfect equation numbering. Browser print gets surprisingly close when print CSS is intentional.

MarkPDF is a **zero-install handoff tool**: write markdown, preview styled output, print to PDF.

---

### Mission Report: What MarkPDF Is — Concrete Scope

As of **v1.0.0**:

| Surface | What you do there |
|---------|-------------------|
| **Editor pane** | Write GFM with toolbar quick-inserts and line numbers |
| **Live preview** | react-markdown renders as you type |
| **Settings** | Typography, margins (mm), colors, code theme (light/dark) |
| **Export** | Triggers browser print → user selects "Save as PDF" |

Stack: React 19.2, TypeScript 5.8, Vite 6, Tailwind CSS 4, react-markdown, remark-gfm, react-syntax-highlighter, Vitest.

**Not in dependencies:** KaTeX, jsPDF, unified/remark/rehype as direct deps (react-markdown wraps the remark ecosystem internally).

It is **not** a Pandoc replacement. It is **not** a LaTeX math renderer today.

---

### Mission Report: Who I Built It For (and Who Should Skip It)

**Built for:**

- Anyone who wants markdown → PDF without installing TeX or Pandoc
- Privacy-conscious writers who refuse cloud upload converters
- Quick lab reports and internal docs with code blocks and GFM tables

**Not built for:**

- Academic papers with complex LaTeX equations — no KaTeX shipped
- Pixel-identical PDFs across every browser — print engines vary
- 80-page thesis dumps without memory pain — browser limits apply

---

### Mission Report: Fuckups & Learnings

- **My portfolio invented KaTeX and jsPDF.** I described equations vanishing in jsPDF exports — that story belonged to a different architecture. This repo never shipped KaTeX; the fuckup to document is **print CSS pagination**, not math macros.
- **Site version drift.** Portfolio said v1.1.0; `package.json` says **1.0.0**. Semver wins.
- **WYSIWYG means two stylesheets.** Screen preview and print output need separate CSS or margins lie to you.
- **GFM tables paginate badly in print.** Browser print engines split tables awkwardly — document the limit instead of promising journal layout.

---

### Mission Report: Current State & Key Artifacts

MarkPDF **v1.0.0** ships with Vitest coverage and CI.

```bash
git clone https://github.com/dhaatrik/free-markdown-to-pdf-converter.git
cd free-markdown-to-pdf-converter
npm install
npm run dev
# Typically http://localhost:3000
```

```bash
npm run test
npm run lint
npm run build
```

MIT licensed. Static `dist/` deployable to any host.

---

### Mission Report: Closing Transmission

Write markdown. Preview it. Hit Export PDF. Choose Save as PDF in the print dialog. That is MarkPDF — small, client-only, honest about browser variance.

Stack rationale: [tech-stack transmission](/transmissions/markpdf-tech-stack/). Honest limits and MIT terms: [free and browser-dependent output](/transmissions/markpdf-free-browser-limits/). Full scope tables: [MarkPDF project page](/projects/free-markdown-to-pdf-converter/).