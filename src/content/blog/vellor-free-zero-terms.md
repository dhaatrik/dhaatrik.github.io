---
title: 'Why Vellor Is Free — and What "Zero Terms" Actually Means'
description: 'MIT license, no subscriptions, no data harvesting — and the honest part: zero SaaS terms is not the same as zero legal text or zero maintenance burden.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['vellor', 'open-source', 'pedagogy', 'privacy']
clearance: 'PUBLIC'
readingTime: '10 min'
hasMath: false
series: 'Vellor'
seriesOrder: 3
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Vellor licensing and economics
- LICENSE: MIT (Copyright 2026 Dhaatrik Chowdhury)
- PRICING: $0 — no subscriptions, no freemium tier, no hosted lock-in
- DATA: Never leaves device unless teacher exports it
- "ZERO TERMS": No SaaS ToS / no account contract — NOT "no license at all"
- KEY LESSON: Free knowledge and free tooling still have maintainers and MIT notices
====================================================================
```

### Mission Report: Free Is a Design Choice, Not a Stunt

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

I keep two phrases close together:

<p align="center">
    <strong> "Education Is Not Free BUT KNOWLEDGE IS FREE"</strong>
</p>

DBS Classes, this website, and Vellor all drink from the same well. But "free" gets misunderstood — by users, by investors, and by past-me typing marketing words too fast.

This transmission is the dull-truth version: **why Vellor costs nothing**, what **"zero terms and conditions"** means in my mouth, and what it **does not** mean.

---

### Mission Report: The Why — Why Charge Nothing?

Three reasons — not one noble sentence.

1. **I am the user.** I tutor. I built Vellor because SaaS pricing for attendance tracking felt insulting. Charging myself rent for my own student roster would be absurd.

2. **Student data is not my monetization surface.** Edtech business models often harvest usage analytics, upsell tiers, or sell "insights." Vellor has no server to receive that data. The economic model is **donation-of-labor**, not **surveillance-and-subscribe**.

3. **Knowledge should be inspectable.** MIT license means you can read every line — crypto, PDF generation, gamification math — and fork it if I disappear tomorrow. That aligns with how I teach: show the derivation, not just the answer.

---

### Mission Report: What "Zero Terms and Conditions" Means Here

On DBS Classes and this site, I use "zero terms and conditions" to mean:

| Included | Excluded |
|----------|----------|
| No account contract | No "by using this SaaS you grant us..." |
| No subscription tier | No freemium bait-and-switch |
| No forced cloud sync | No "we store your roster for convenience" |
| No data harvesting | No analytics SDK phoning home |
| No lock-in | Export JSON anytime; leave with your data |

**What it does NOT mean:**

- **No license.** Vellor is **MIT licensed**. You can use, modify, merge, publish, distribute, sublicense, and sell copies — with the copyright notice preserved. That is a legal term. Read [LICENSE](https://github.com/dhaatrik/vellor/blob/main/LICENSE).
- **No responsibility disclaimer.** MIT includes "AS IS" — no warranty. If you bet your business on software, **you** own that risk. Same as any open-source tool.
- **No maintenance promise.** I maintain Vellor because I use it. I am not signing an SLA with the universe.

Zero SaaS terms ≠ legal nothingness. It means **no rent-seeking gate** between a tutor and their roster.

---

### Mission Report: The Journey — Pricing Paths I Refused

**The "freemium with Pro invoices" idea.** Tempting. PDF invoices are high-value. I killed it because tutors already distrust platforms that hold data hostage behind paywalls. If invoicing works in the free build, it stays in the free build.

**The "hosted Vellor Cloud" fantasy.** Recurring revenue. Automatic sync. Also: privacy betrayal the moment student records hit my server. Roadmap mentions optional sync via Firebase/Supabase — **opt-in**, teacher-controlled, not the default product.

**The "donation button only" guilt.** I may add a GitHub Sponsors link someday. That is support, not a tollbooth. The app remains fully functional without paying me.

---

### Mission Report: Fuckups & Learnings

- **"Free" confused people on storage.** Some assumed free = low quality or free = we sell your data. Vellor is free because the marginal cost of copying software is zero and the moral cost of charging tutors for privacy is high — not because I am laundering data.
- **I once implied IndexedDB and note-taking on this site.** Wrong facts undermine trust faster than a price tag. Corrected in [why-and-what](/transmissions/vellor-why-and-what/) and the [mission log](/transmissions/vellor-power-tutor-log/).
- **Open source needs tests.** MIT lets you fork; tests let you fork **safely**. 28 Vitest suites are part of the "free" promise — you can change payment math without guessing.

---

### Mission Report: Comparison — Vellor vs. Typical Tutoring SaaS

| Dimension | Typical tutoring SaaS | Vellor |
|-----------|----------------------|--------|
| **Price** | Monthly per seat | $0 (MIT) |
| **Data location** | Vendor cloud | Encrypted `localStorage` on your device |
| **Account required** | Yes | No |
| **Export** | Sometimes gated | JSON export built-in |
| **Terms of Service** | Long, vendor-favorable | MIT license only |
| **Offline** | Often broken | PWA-first |
| **Multi-device sync** | Usually yes | Not yet (manual export/import today) |

The trade is real: you get privacy and zero rent, you lose automatic sync until I ship it responsibly.

---

### Mission Report: Current State

- **License:** MIT, Copyright 2026 Dhaatrik Chowdhury
- **Repo:** [github.com/dhaatrik/vellor](https://github.com/dhaatrik/vellor)
- **Cost:** clone, npm install, run — no API keys, no Stripe, no login wall
- **Contributing:** CONTRIBUTING.md + Conventional Commits — community welcome, not corporate roadmap theater

---

### Mission Report: Closing Transmission

If you are waiting for permission to use free tooling without surrendering student records — you already have it. Clone Vellor. Read the MIT notice. Export backups. Fork if I vanish.

"Zero terms" is my promise that I will not build a tollbooth on trust. MIT is the world's promise about what you can do with the code. Both can be true.

More in series: [tech stack tradeoffs](/transmissions/vellor-tech-stack/), [local backup reality](/transmissions/vellor-local-backup-reality/), [gamification trap](/transmissions/vellor-gamification-trap/).