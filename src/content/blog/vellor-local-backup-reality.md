---
title: 'Local-Only Backup Reality — No Server Means You Own Disaster Recovery'
description: 'AES-GCM localStorage, 14-day backup nudges, and JSON export — the unglamorous truth about privacy without a safety net.'
pubDate: 2026-07-01
updatedDate: 2026-07-01
tags: ['vellor', 'privacy', 'offline-first', 'pwa']
clearance: 'PUBLIC'
readingTime: '9 min'
hasMath: false
series: 'Vellor'
seriesOrder: 5
---

```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: Vellor data ownership model
- STORAGE: AES-GCM encrypted localStorage + Recovery Key
- BACKUP: JSON export/import, 14-day reminder modal, reconnect nudge
- TRADEOFF: No server = no vendor safety net
- KEY LESSON: Privacy and convenience are often enemies — pick consciously
====================================================================
```

### Mission Report: The Safety Net You Do Not Get

**SYS.STATUS:** TRANSMISSION LIVE // CLEARANCE: PUBLIC

Vellor's privacy pitch is simple: **your student data never leaves your device unless you export it.**

The corollary nobody markets: **if you lose the device and never exported, the data is gone.** I will not pretend otherwise.

---

### Mission Report: The Why — Why Accept That Trade?

Because the alternative is student rosters on a vendor server under terms you did not write, recoverable by support tickets you do not control.

For independent tutors, that trade often makes sense:

- One primary laptop or phone
- High sensitivity, low IT budget
- Willingness to click "Export Data" monthly if it means no subscription

If you need automatic multi-device sync today, Vellor is **incomplete** for you — roadmap lists cloud sync; manual export/import is the honest current answer.

---

### Mission Report: The Journey — Building Backup UX

The repo ships:

| Mechanism | Purpose |
|-----------|---------|
| **AES-GCM encryption** (`src/crypto.ts`) | Data at rest in `localStorage` is not plain text |
| **Recovery Key** | Fallback if encryption envelope needs recovery |
| **JSON export/import** | Profile & Settings → Data Management |
| **14-day backup alerts** | `BackupPromptModal` — gentle, not ransomware vibes |
| **Reconnect reminder** | Offline engine nudges backup after network returns |
| **Secure reset** | One-click wipe — scary, necessary |

I treat export/import as **first-class**, not v2. That was a lesson from early builds where I assumed tutors would "figure out backups." They will not. Neither would I.

---

### Mission Report: Fuckups & Learnings

- **localStorage limits exist.** Years of transactions across hundreds of students can get heavy. Export also serves as archive — not just disaster recovery.
- **Private browsing modes.** Storage can evaporate between sessions. Vellor cannot fix browser policy; I can warn in onboarding.
- **PWA reinstall ≠ data loss** — usually — but OS cleans and browser resets happen. Backups are religion.
- **Encryption without backup is performance theater.** AES-GCM protects against casual snooping on a shared laptop; it does not protect against a drowned phone.

---

### Mission Report: What I Tell Tutors (and You)

1. Export JSON after your first real roster import.
2. Export again on the 1st of every month — put it next to tax folders.
3. Store exports somewhere else: Google Drive, USB, email-to-self — your choice, not mine.
4. Test import on a second browser profile once so you trust restore.

---

### Mission Report: Closing Transmission

Privacy without a server is **freedom with responsibility**. I built Vellor for tutors who want that deal explicitly — not for teachers who assumed Google would save them.

Series links: [why-and-what](/transmissions/vellor-why-and-what/) · [free/zero terms](/transmissions/vellor-free-zero-terms/) · [Power-Tutor mission log](/transmissions/vellor-power-tutor-log/).