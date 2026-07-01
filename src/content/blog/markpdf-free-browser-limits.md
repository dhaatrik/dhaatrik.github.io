---
title: 'MarkPDF — No Server, No Math (Yet), Browser-Dependent PDF Output'
description: 'MIT-licensed, client-only MarkPDF v1.0.0: free to use and fork, with honest limits on LaTeX math, print variance, and large documents.'
pubDate: 2026-07-04
updatedDate: 2026-07-04
tags: ['markpdf', 'open-source', 'mit', 'privacy']
clearance: 'PUBLIC'
readingTime: '9 min'
hasMath: false
series: 'MarkPDF'
seriesOrder: 3
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: MarkPDF licensing and honest limits
- LICENSE: MIT (Copyright 2026 Dhaatrik Chowdhury)
- PRICING: $0 — no accounts, no upload SaaS, no watermark tier
- DATA: Never leaves browser tab during normal use
- LIMITS: No LaTeX math, browser print variance, large-doc memory
- KEY LESSON: Free + private + zero-install still means "good enough PDF," not journal submission
====================================================================
```

### Mission Report: Free, Private, and Not Magic

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

MarkPDF costs nothing, runs client-side, and never asks you to upload a document. That trio is deliberate.

This transmission is the dull-truth companion to [why-and-what](/transmissions/markpdf-why-and-what/) and [tech stack](/transmissions/markpdf-tech-stack/): **what MIT free means**, and **what browser PDF export does not guarantee**.

---

### Mission Report: Why It Is Free (MIT)

1. **I am the user.** I write markdown notes and occasionally need PDFs. Renting a converter for my own homework felt silly.

2. **No server means no SaaS margin.** There is no hosted conversion tier to fund. The economics are **donated labor**, not freemium upsell.

3. **MIT keeps fork paths open.** Teachers, students, and teams can self-host `dist/` on GitHub Pages or internal static hosting without asking permission.

MIT is not "no legal text." You keep copyright notices. You accept software as-is. Standard open-source hygiene.

---

### Mission Report: Privacy Model (Accurate)

- **No backend** in the repo — static Vite build
- **No accounts** — nothing to breach
- **No upload step** — markdown stays in memory/local tab until you print
- **Print dialog is OS/browser territory** — saving PDF is local; I do not receive the file

If you self-host, you control the host. If you use a demo deployment, treat it like any other static site — do not paste secrets you would not paste elsewhere.

---

### Mission Report: Honest PDF Limits (Read Before You Submit)

| Limitation | Reality |
|------------|---------|
| **No LaTeX math** | KaTeX not in `package.json` — equations do not render |
| **Browser variance** | Chrome vs Firefox vs Safari print margins differ |
| **Tables and code fences** | Page breaks can split awkwardly — manual edits may be needed |
| **Large documents** | Very long markdown stresses preview memory |
| **Not Pandoc** | No bibtex, cross-refs, or journal templates |
| **Print settings matter** | Background graphics, scale 100%, correct destination |

MarkPDF targets **notes, lab reports, internal docs** — not camera-ready conference proceedings.

---

### Mission Report: Fuckups & Learnings

- **Portfolio KaTeX story was wrong.** The real pain is print CSS — margins that look fine on screen but clip in Save as PDF.
- **"Professional PDF" is user-dependent.** Identical markdown can export differently based on print dialog choices.
- **Free does not mean maintained forever.** MIT grants rights; it does not guarantee I merge your PR Tuesday night.
- **Version honesty matters.** Site claimed v1.1.0; repo ships **1.0.0** until semver says otherwise.

---

### Mission Report: Closing Transmission

Clone it. Host it. Fork it. Export your notes. Just do not expect LaTeX journals or pixel-perfect parity across every browser.

If MarkPDF is too limited for your paper, that is the tool telling the truth — not failing secretly. Back to [project page](/projects/free-markdown-to-pdf-converter/) for scope tables and run instructions.