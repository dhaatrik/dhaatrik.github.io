---
title: 'Bill Express'
description: 'Full-stack India-GST POS — Express + SQLite, inventory, customers, B2B/B2C invoices. Not a browser-only jsPDF freelancer tool.'
logo: '../../assets/bill-express.png'
githubUrl: 'https://github.com/dhaatrik/bill-express'
progress: 'v1.0.0 — local retail POS with GST invoicing'
transmissionTag: 'bill-express'
order: 10
tags: ['React 19', 'TypeScript 5.8', 'Vite 6', 'Express', 'SQLite', 'GST']
pain_level: 3
telemetry: 'STATUS: SHIPPED // DB: SQLITE_LOCAL // TAX: GST_INTRA_INTER'
fuckup_teaser: "I described Bill Express as client-only jsPDF on this site while the repo ships Express + SQLite — and canceled invoices initially forgot to restore stock."
---

## SYS.STATUS: v1.0.0 shipped — local GST POS with inventory, customers, REST API

[Bill Express](https://github.com/dhaatrik/bill-express) is a **full-stack Point of Sale** for small retail: dashboard analytics, product inventory with **HSN codes and GST rates**, customer directory with **GSTIN**, and **B2B/B2C invoice generation** with SGST/CGST/IGST splits. Canceled invoices restore product stock.

This page replaces portfolio copy that wrongly described a **browser-only jsPDF freelancer invoice** with zero backend.

## What it is (scope)

| Surface | What you do there |
|---------|-------------------|
| **Dashboard** | Gross sales, top products, low-stock alerts (Recharts) |
| **Products** | CRUD — HSN, ex-GST pricing, GST %, stock levels |
| **Customers** | Directory with GSTIN, lifetime value metrics |
| **Invoices** | B2B/B2C billing, discounts, tax split, print/save |
| **REST API** | `/api/products`, `/api/dashboard/analytics`, and related routes |

Stack: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Express, `better-sqlite3`, react-hook-form, Recharts, Pino, express-rate-limit, Vitest + supertest.

`npm run dev` runs Express + Vite together on port 3000.

## Who I built it for

- Small retail shops in India needing local POS with honest GST modeling
- Developers wanting a forkable full-stack POS reference (MIT licensed)
- Single-location operators — not multi-branch cloud franchises

**Not for:** one-off freelancer PDF invoices in the browser, multi-store sync without custom infra, or production deploy with the dev auth bypass file still present.

## Fuckups & learnings

- **Wrong product story on my portfolio.** jsPDF, 50ms vector export, zero server — stale fiction. The repo has Express, SQLite, and REST endpoints.
- **`testingcredentials` is a deployment hazard.** Repo ships a dev auth bypass file for local evaluation. README requires deletion before production; use `ADMIN_USERNAME` / `ADMIN_PASSWORD` instead.
- **Stock restore on cancel was missing early.** POS inventory must roll back when invoices cancel — caught by API tests.
- **GST split needs automated tests.** Intra-state CGST+SGST vs inter-state IGST rounding errors show up in audits, not demos.

## Honest limitations

| Limitation | Reality |
|------------|---------|
| **Single-node SQLite** | One machine; no built-in multi-store cloud sync |
| **India-GST focus** | HSN/SGST/CGST/IGST modeled; not generic global tax |
| **Dev auth bypass file** | Delete `testingcredentials` before any real deployment |
| **Not jsPDF-in-browser** | Full-stack invoice flow, not a static PDF toy |

## Deep-dive transmissions

Read in order for the full story:

1. [Why Bill Express — local POS for small retail, not a freelancer PDF toy](/transmissions/bill-express-why-and-what/) — origin, scope, portfolio drift confession

## Run it locally

```bash
git clone https://github.com/dhaatrik/bill-express.git
cd bill-express
npm install
npm run dev
# http://localhost:3000 — delete testingcredentials before production
```

Tests: `npm run test` — Vitest + supertest. CI on push.

## Closing transmission

Products, customers, GST lines, stock movement — daily shop ops in one local stack. If you want the jsPDF lie I had to unwind, start with [why-and-what](/transmissions/bill-express-why-and-what/).