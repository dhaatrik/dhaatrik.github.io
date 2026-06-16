---
title: 'Seamless QR Dining'
description: 'A contactless digital ordering system for restaurants featuring QR scanning, menu customization, and real-time order tracking.'
logo: '../../assets/seamless-qr-dining.png'
githubUrl: 'https://github.com/dhaatrik/seamless-qr-dining'
progress: 'Prototype complete, WebSocket integration verified'
order: 8
tags: ['React', 'WebSockets', 'Tailwind CSS', 'Node.js']
---

## What is Seamless QR Dining and why was it built?

Traditional restaurant table service suffers from order delays, miscommunications, and physical menu bottlenecks. Dhaatrik built Seamless QR Dining to create a zero-friction table ordering system where customers scan a QR code, view menus, submit orders, and track order stages immediately.

## How did Dhaatrik approach the implementation?

Dhaatrik structured a bi-directional messaging pipeline. When a customer scans a table QR, they are joined to a table-specific WebSocket channel. Orders are dispatched to a kitchen dashboard. State synchronization ensures any status changes (e.g., "In Prep", "Served") reflect immediately on the customer's phone without polling.

## What technologies were used in the stack?

- **React**: Constructing the fast-loading, mobile-first customer menu interface.
- **WebSockets (ws)**: Enabling real-time, low-latency communication between table sessions and kitchen dashboards.
- **Tailwind CSS**: Providing a premium, responsive layout optimized for mobile browsers.
- **Node.js**: Powering the high-performance centralized socket coordinator.

## What is the current progress and outcome?

The core prototype is complete, and socket coordination between client ordering screens and kitchen control displays is fully verified.
