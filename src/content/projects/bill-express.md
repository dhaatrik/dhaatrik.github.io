---
title: 'Bill Express'
description: 'Browser invoice builder with instant PDF export — no signup, no backend, your line items never leave the tab.'
logo: '../../assets/bill-express.png'
githubUrl: 'https://github.com/dhaatrik/bill-express'
progress: 'Production build deployed, instant PDF export'
order: 10
tags: ['JavaScript', 'HTML5', 'Tailwind CSS', 'jsPDF']
pain_level: 2
telemetry: 'STATUS: SHIPPED // DEPLOY: LIVE // PDF: VECTOR'
fuckup_teaser: "Print layout diverged between Firefox and Chrome after a CSS update — PDFs had surprise blank pages I only found after deploying."
---

## SYS.STATUS: Deployed — vector PDF export in under 50ms, zero server round-trips

Freelancers shouldn't need a SaaS account to invoice a client once. Bill Express is a single-page editor that compiles a clean PDF entirely in the browser.

## Why I started this

Every invoice tool I tried wanted an email, a trial, or a watermark until you paid. I needed **fill form → preview → PDF** in one sitting. Client-side only — merchant data is sensitive enough without me operating a storage layer.

## What I tried (and what broke)

Interactive document editor: form fields update a live layout preview. Export reads the DOM structure and feeds **jsPDF** for vector output — not a screenshot, an actual PDF page. Vanilla JS + HTML5 keep the bundle light; Tailwind handles print-friendly grids.

Early exports looked wrong on multi-page invoices because I underestimated line-item pagination. Tuning print CSS and jsPDF page breaks fixed the ugly splits. Tax line formatting and currency alignment were another round of pain — jsPDF doesn't forgive sloppy coordinate math.

I also tested whether I needed a backend "for convenience." I didn't. Storing invoices server-side would make support easier and privacy worse. For freelancers invoicing five clients a month, browser-local is the right trade.

## Fuckups & learnings

- **DOM-to-PDF is fiddly.** Pixel-perfect preview ≠ perfect PDF without testing real printers.
- **No backend is a privacy feature and a support limit.** No accounts also means no "we lost your invoice" — because we never had it.
- **50ms export is achievable** if you don't round-trip through a server "for analytics."
- **Form UX matters for repeat users.** Saved defaults in localStorage beat retyping your GST number every time.

## Where it stands now

Production build is live. Print-accurate vector PDFs, no login, no tracking pixel on export. Tailwind grids keep the form and preview aligned on desktop; mobile is usable for quick edits before you email the PDF yourself.

## Closing transmission

One page, one job. Open it, invoice someone, close the tab. That's the whole product.