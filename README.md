<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/logo_light.svg" />
    <source media="(prefers-color-scheme: light)" srcset="public/logo_dark.svg" />
    <img alt="Dhaatrik Logo" src="public/logo_dark.svg" width="120" />
  </picture>
</p>

<h1 align="center">DHAATRIK // MISSION_CONTROL</h1>

<p align="center">
  <strong>The Digital Headquarters & Technical Research Database of Dhaatrik Chowdhury.</strong><br>
  A high-performance, offline-capable portfolio built on first-principles engineering.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/built%20with-Astro%20v6-ff5e00?style=flat-square" alt="Built with Astro" />
  <img src="https://img.shields.io/badge/styling-Tailwind%20v4-06b6d4?style=flat-square" alt="Styled with Tailwind" />
  <img src="https://img.shields.io/badge/tests-Node%20%26%20Playwright-3178c6?style=flat-square" alt="E2E & Unit Tests" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <a href="https://dhaatrik.github.io">View Live Site</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-installation--requirements">Installation</a> •
  <a href="#-codebase-architecture">Architecture</a> •
  <a href="#-testing-instructions">Testing</a>
</p>

---

## 🛰️ Project Overview

**Mission Control** is a bespoke, high-science personal website and technical blog representing Dhaatrik Chowdhury's professional work, startups, and research. 

It is designed to act as an interactive "Engineering Journal" for zero-to-one startups, AI systems engineering (focused on AgTech solutions), and orbital mechanics/aerospace simulation research. By departing from standard flat portfolio templates, this codebase acts as a **virtual storefront** showcasing clean code practices, responsive animations, and strict frontend performance optimization.

### Why this stack?
* **Astro 6:** Delivers zero-JS-by-default output for exceptional core web vitals and fast initial load speeds.
* **Tailwind CSS v4 (with Vite integration):** Keeps style weight minimal while providing custom design tokens for glassmorphism, responsive grid layouts, and custom theme switches.
* **Node.js Native Runner:** Keeps unit testing lightweight, using native TypeScript stripping loaders without heavy third-party runners.
* **Playwright E2E:** Ensures that interactive elements (client routing, theme toggling, search indexers) remain error-free across major updates.

---

## 📑 Table of Contents

1. [Key Features](#-key-features)
2. [Technologies Used](#-technologies-used)
3. [Codebase Architecture](#-codebase-architecture)
4. [Installation & Requirements](#-installation--requirements)
5. [Developer Commands](#-developer-commands)
6. [Testing Instructions](#-testing-instructions)
7. [Contribution Guidelines](#-contribution-guidelines)
8. [License Information](#-license-information)

---

## ⚡ Key Features

* **Premium Glassmorphic Aesthetics**: Modern dark mode/light mode themes integrated with smooth gradients, blueprint frames, custom mouse spotlights, and custom scrollbars.
* **Science-Ready Blog Layouts**: Complete LaTeX inline and block math support (`$$ \Delta v $$`) rendered locally via rehype-katex to ensure seamless rendering for technical articles.
* **Smart Mobile Hamburger Drawer**: Positioned outside the header context to prevent layout clipping, featuring glassmorphism, dynamic path logging, and full touch-swipe gesture support to close.
* **Recent Transmissions Footer**: Displays the 4 most recently published research logs, integrated with client-side script trackers that automatically show human-readable relative time (e.g. `// 3d ago`).
* **Interactive Terminal Search**: An instant search utility under "Mission Logs" featuring:
  - Client-side fuzzy query matches and tag filters.
  - Session and history routing state synchronization.
  - Dynamic accessibility announcers.
  - Global hotkey support (Press `/` on your keyboard to instantly focus search).

---

## 🛠 Technologies Used

- **Framework**: [Astro v6](https://astro.build/) (Static Site Generation / SSG)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Properties
- **Markup/Markdown**: Astro Content Collections with MDX support & Zod schemas
- **Typography**: [Google Fonts](https://fonts.google.com/) (Nunito for Sans-Serif, Poppins for Headings)
- **Image Processing**: Astro `<Image />` component powered by `sharp`
- **Testing Suites**: [Playwright](https://playwright.dev/) for E2E tests, Node's `--test` runner for unit tests
- **Formatter**: Prettier with Prettier Astro & Tailwind plugins

---

## 📁 Codebase Architecture

```text
dhaatrik.github.io/
├── .github/workflows/   # Automated CI/CD deployment pipelines
├── public/              # Global static assets (logos, fallback images)
├── src/
│   ├── assets/          # Optimized graphic assets and images
│   ├── components/      # Reusable UI nodes (Header, Footer, ThemeToggle)
│   ├── content/         # Structured Markdown/MDX content collections
│   │   ├── blog/        # Technical publications and logs
│   │   └── projects/    # Homepage project grid definitions
│   ├── layouts/         # Page shell wrappers (BlogPost layout)
│   ├── pages/           # Routing endpoints (Home, About, Blog index, RSS)
│   └── styles/          # Global CSS tokens and custom scrollbars
├── test/
│   ├── data/            # Data integrity unit tests
│   ├── e2e/             # Playwright integration specs
│   └── loaders/         # Custom Node.js TS stripping test loaders
├── astro.config.mjs     # Astro compiler and prefetch configuration
├── package.json         # Scripts and project dependencies
└── playwright.config.ts # E2E testing browser configurations
```

---

## 🚀 Installation & Requirements

### Prerequisites
- **Node.js**: `>= 22.12.0` (LTS version is recommended)
- **npm**: Built-in with Node

### Local setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/dhaatrik/dhaatrik.github.io.git
   cd dhaatrik.github.io
   ```

2. **Install node dependencies:**
   ```bash
   npm install
   ```

3. **Launch local dev environment:**
   ```bash
   npm run dev
   ```
   *The server runs locally at `http://localhost:4321/`.*

---

## 💻 Developer Commands

Use the following npm scripts to work on the project:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Spin up local Astro dev server with hot reload |
| `npm run build` | Build static production assets under the `dist/` folder |
| `npm run preview` | Run a local static server previewing the built files |
| `npm run test` | Run local unit test suites via Node |
| `npm run test:e2e` | Run Playwright E2E browser tests |
| `npm run format` | Run Prettier formatter across the codebase |

---

## 🧪 Testing Instructions

This codebase has robust testing coverage divided into unit and integration boundaries to prevent build failures during deployment.

### 1. Data Unit Tests
We test static data configurations and schema layouts using Node's native test module:
```bash
npm run test
```

### 2. Integration / E2E Tests
We verify visual features, search accessibility, theme toggling, routing, and mobile drawers across Chrome, Firefox, and WebKit layout engines:
```bash
# If running for the first time, install browser dependencies
npx playwright install

# Run E2E specs
npm run test:e2e
```

---

## 🤝 Contribution Guidelines

Feedback, bug reports, and optimizations are welcome!

Please check [CONTRIBUTING.md](CONTRIBUTING.md) to review guidelines for committing changes, formatting rules, and how to verify pull requests.

We require all contributors to adhere to the high standard of conduct defined in our code of conduct, prioritizing mutual respect and technical integrity.

---

## 📄 License Information

This repository is released under the terms of the **MIT License**.

You are free to fork this codebase, make changes, and use it for your own personal websites or research journals, provided you include Dhaatrik's copyright notice and attribution.

---
*End of Transmission. System is fully operational.*
