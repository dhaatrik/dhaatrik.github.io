---
title: 'Glassbox'
description: 'Run untrusted JavaScript in an isolated Node sandbox and get a JSON audit log of what it tried to touch.'
logo: '../../assets/glassbox.png'
githubUrl: 'https://github.com/dhaatrik/glassbox'
progress: 'v2.1.0 stable release, secure sandbox API'
order: 6
tags: ['TypeScript', 'Node.js', 'VM2', 'Security']
pain_level: 3
telemetry: 'STATUS: SHIPPED // VERSION: V2.1.0 // SANDBOX: ISOLATED'
fuckup_teaser: "Sandbox escape research is humbling — I shipped boundaries I was sure were solid, then found edge cases."
---

## SYS.STATUS: v2.1.0 stable — scripts run isolated, host stays clean, telemetry logs ship

I needed to execute sketchy scripts without letting them read my `.env`. Glassbox is a transparent sandbox: run code, watch what it attempts, block what shouldn't leave the box.

## Why I started this

`npm install` and random GitHub gists are trust exercises. Running unverified JavaScript on your main Node process is how credentials leak. I wanted **isolation plus visibility** — not just "it didn't crash," but "here's every fs and network call it tried."

## What I tried (and what broke)

The pipeline uses Node's VM contexts with Proxy wrappers around sensitive globals. Filesystem, network, and process APIs resolve inside a virtualized, read-only environment. Calls get logged into a diagnostic JSON report.

VM2 is in the stack tags; getting proxy boundaries typed cleanly in TypeScript took iteration. Early versions either over-blocked (scripts couldn't run at all) or under-logged (silent failures). v2.1.0 is the balance: stable API, consistent telemetry.

The transparency angle matters: after a run you get a JSON report listing filesystem paths touched, network hosts attempted, and process calls intercepted. That report is what makes Glassbox useful for auditing — you're not guessing whether a script behaved, you're reading its attempt log.

## Fuckups & learnings

- **Sandbox escape research is humbling.** You ship boundaries; you don't assume perfection.
- **Audit logs need structure**, not `console.log` soup — otherwise you can't diff two script runs.
- **Security tools need boring APIs.** Fancy DSLs don't get adopted; `run(code) -> report` does.
- **Read-only virtual FS still leaks intent.** Even blocked reads tell you what the script was hunting for.

## Where it stands now

Glassbox v2.1.0 exposes a stable sandbox API. Unauthorized file and socket access gets blocked; script behavior returns as clean JSON you can diff across runs or feed into CI checks before you trust a new dependency.

## Closing transmission

If you audit dependencies or run untrusted snippets, use it as a preflight check. Your main process will thank you.