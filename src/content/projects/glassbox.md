---
title: 'Glassbox'
description: 'A minimalist, high-transparency sandbox environment for executing and auditing untrusted JavaScript files locally.'
logo: '/glassbox_logo.png'
githubUrl: 'https://github.com/dhaatrik/glassbox'
progress: 'v2.1.0 stable release, secure sandbox API'
order: 6
tags: ['TypeScript', 'Node.js', 'VM2', 'Security']
---

## What is Glassbox and why was it built?

Running unverified npm packages, third-party scripts, or dynamic code snippets poses severe security risks to a developer's local machine, potentially exposing environment variables, credentials, and files. Dhaatrik built Glassbox to solve this isolation issue, providing a transparent sandbox to securely audit, execute, and monitor script actions.

## How did Dhaatrik approach the implementation?

Dhaatrik configured a secure context-isolation pipeline utilizing Node.js vm contexts and Proxy wrappers. Glassbox intercepts core system APIs (filesystem, network, process) and forces them to resolve inside a virtualized, read-only environment. By auditing API call telemetry, it generates a transparent behavior report detailing precisely what the script attempted to access.

## What technologies were used in the stack?

- **TypeScript**: Ensuring strict type safety and interface definitions across proxy boundaries.
- **Node.js VM Module**: Creating isolated execution contexts separate from the host process.
- **ES6 Proxies**: Intercepting and virtualization of globals and global namespace access.

## What is the current progress and outcome?

Glassbox is currently at version 2.1.0, offering a stable and highly secure sandbox API. It successfully shields the host system from unauthorized file and socket accesses while generating a clean diagnostic JSON log of script attempts.
