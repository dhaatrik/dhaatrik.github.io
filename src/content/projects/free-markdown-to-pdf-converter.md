---
title: 'MarkPDF'
description: 'A markdown-to-PDF compiler that runs entirely in the browser, supporting math rendering, code highlighting, and theme customization.'
logo: '../../assets/markpdf.png'
githubUrl: 'https://github.com/dhaatrik/free-markdown-to-pdf-converter'
progress: 'v1.1.0 stable, full KaTeX and highlight.js support'
order: 11
tags: ['TypeScript', 'Remark', 'KaTeX', 'jsPDF']
---

## What is MarkPDF and why was it built?

Compiling markdown notes into formal reports typically requires installing heavy command-line dependencies (like Pandoc or MacTeX). Dhaatrik built MarkPDF to give students, researchers, and engineers a browser-based, zero-installation markdown compiler that formats formulas, code blocks, and custom page sizes.

## How did Dhaatrik approach the implementation?

Dhaatrik created a client-side parsing pipeline. Raw markdown input is processed via the Remark parser into HTML. Equations are intercepted and compiled into HTML/SVG nodes using KaTeX, and codeblocks are tokensied via highlight.js. When the user exports, a custom print sheet is applied to output a highly formatted vector PDF.

## What technologies were used in the stack?

- **TypeScript**: Structuring the compiler pipeline and markdown extensions.
- **Remark & Rehype**: Parsing, compiling, and traversing markdown ASTs.
- **KaTeX**: Fast, math-accurate rendering of LaTeX formulas.
- **jsPDF / Browser Print APIs**: Outputting print-accurate vector layouts.

## What is the current progress and outcome?

MarkPDF is active at version 1.1.0. It compiles custom markdown, processes LaTeX math equations, highlights syntax for major languages, and exports professional PDFs in seconds.
