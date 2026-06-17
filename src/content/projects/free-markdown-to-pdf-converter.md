---
title: 'MarkPDF'
description: 'Markdown to PDF in the browser — KaTeX math, syntax highlighting, custom themes, no Pandoc install.'
logo: '../../assets/markpdf.png'
githubUrl: 'https://github.com/dhaatrik/free-markdown-to-pdf-converter'
progress: 'v1.1.0 stable, full KaTeX and highlight.js support'
order: 11
tags: ['TypeScript', 'Remark', 'KaTeX', 'jsPDF']
pain_level: 2
fuckup_teaser: "KaTeX in a headless print context had silent fallback failures — math rendered on screen but vanished in the exported PDF."
---

## SYS.STATUS: v1.1.0 stable — Remark pipeline, KaTeX, highlight.js, PDF export all shipping

I didn't want to install half of TeX Live to turn lecture notes into a PDF. MarkPDF compiles markdown in the browser with math and code blocks handled properly.

## Why I started this

Students and engineers live in markdown. Formal submission wants PDF. The usual path — Pandoc, MacTeX, fighting templates — is heavy for a one-off report. I wanted **zero installation**, custom page sizing, and LaTeX math that actually renders.

## What I tried (and what broke)

Client-side pipeline: **Remark** parses markdown to an AST, **Rehype** traverses and compiles HTML. KaTeX intercepts math delimiters; highlight.js tokenizes code fences. Export applies a print stylesheet and outputs via jsPDF / browser print APIs.

v1.1.0 added full KaTeX and highlight.js coverage — before that, edge-case math macros and nested code blocks were where exports fell apart. TypeScript structured the compiler extensions so I wasn't patching strings in six places.

Theme customization was a late add but worth it — dark code blocks on white paper look wrong without an explicit print theme. I separated screen preview styling from export stylesheet so WYSIWYG is closer to honest.

## Fuckups & learnings

- **Math in markdown has too many delimiter conventions.** Pick sensible defaults, document the rest.
- **Browser PDF layout ≠ LaTeX layout.** Good enough for notes; not journal submission without manual tweaks.
- **AST pipeline beats regex.** Every regex "fix" became a future bug.
- **Large documents stress the browser.** Pagination and memory spike on 80-page thesis dumps — I document limits instead of pretending infinite scale.

## Where it stands now

v1.1.0 compiles custom markdown, renders LaTeX via KaTeX, highlights major languages, exports professional PDFs in seconds — all client-side. Custom page sizes and margins ship for lab reports and assignment templates that don't fit A4 defaults.

## Closing transmission

If your notes are in `.md` and your professor wants `.pdf`, try it before you apt-install the universe.