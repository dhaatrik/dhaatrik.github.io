---
name: dhaatrik-astro-site
description: Use this skill for any technical work on dhaatrik.github.io including Astro architecture, content collections, components, performance optimization, Tailwind v4 styling, MDX/LaTeX support, image optimization, GitHub Pages deployment, testing, and refactoring. Always respect the current stack (Astro 6 + Tailwind 4 + vanilla JS/CSS) and integrate with dhaatrik-writing-style and dhaatrik-mission-report skills.
---

# Dhaatrik Astro Site Technical Skill

**Core Purpose:** This skill encodes the exact architecture, patterns, constraints, and best practices for maintaining and evolving dhaatrik.github.io — a high-performance, static, sci-fi mission-control personal diary built with Astro.

## When to Activate This Skill
- Refactoring components, layouts, or pages
- Adding new content collections or updating schemas
- Optimizing performance, images, or Core Web Vitals
- Troubleshooting builds or GitHub Pages deployment
- Creating new interactive elements (terminal search, drawers, telemetry)
- Implementing design system updates (glassmorphism, neon accents, blueprint grids)
- Any task involving the Astro codebase, TypeScript, or Tailwind

**Mandatory Pairing:** Always combine with `dhaatrik-writing-style` (tone) and `dhaatrik-mission-report` (structure) when touching content. Skill routing: [`AGENTS.md`](../../../AGENTS.md).

## Current Site Architecture (Know This)
- **Framework**: Astro 6 (SSG with prefetch enabled)
- **Styling**: Tailwind CSS v4 + Vite plugin + custom CSS properties
- **Content**: Astro Content Collections (blog + projects) with Zod schemas + MDX + remark-math + rehype-katex
- **Images**: Astro `<Image>` component + sharp
- **Typography**: @fontsource/nunito + poppins
- **Testing**: Playwright (E2E) + Node native test runner
- **Deployment**: GitHub Pages via GitHub Actions (withastro/action recommended)
- **Key Folders**:
  - `src/pages/` — Routing (index.astro, personnel.astro, pedagogy.astro, transmissions/, 404.astro, rss.xml.js)
  - `src/content/` — Collections (blog/, projects/)
  - `src/components/` — Reusable UI (Header, Footer, ThemeToggle, Scrollytell, TechMarquee, etc.)
  - `src/layouts/` — Page shells (BlogPost.astro)
  - `src/styles/` — Global tokens, glassmorphism, custom scrollbars
  - `src/data/` — Tech stack, etc.
  - `src/utils/` — Helpers (readingTime, etc.)
- **Design Language**: Sci-fi terminal / mission-control with glassmorphism, neon accents, blueprint grids

## Core Rules for All Changes
1. **Performance First**: Zero unnecessary JS. Use Astro islands (`client:load`, `client:visible`) only when truly interactive. Prefer CSS transitions and vanilla IntersectionObserver.
2. **Static Only**: No server-side rendering unless absolutely required. GitHub Pages is static.
3. **Design System Consistency**: All new components must follow existing glassmorphism, neon, and terminal styling patterns.
4. **Content Schema Respect**: Never break existing Zod schemas in `src/content.config.ts`.
5. **Accessibility & Motion**: Respect `prefers-reduced-motion`. Good keyboard/focus states.
6. **GitHub Pages Quirks**: Handle base path correctly if ever needed. Use relative paths where possible.

## Common Workflows

### Adding a New Project / Mission Report
1. Create MD/MDX in `src/content/projects/`
2. Use the exact frontmatter template from `dhaatrik-mission-report` skill
3. Update homepage `index.astro` to include it in the sorted projects list
4. Optimize heroImage with Astro `<Image>`

### Creating New Interactive Components
- Place in `src/components/`
- Use Tailwind + custom CSS properties for glassmorphism/neon
- Export clean props interface in TypeScript
- Add to relevant pages with proper client directives only when needed
- Update Playwright tests if behavior changes

### Image Optimization
- Always use Astro `<Image>` component
- Provide `width`, `height`, and proper `alt`
- Place optimized images in `src/assets/` or `public/`
- For hero images, use high fetchpriority and eager loading where critical

### Performance & Lighthouse Work
- Audit with `npm run build` + Lighthouse
- Minimize client-side JS
- Use `prefetch: true` in astro.config (already enabled)
- Lazy load non-critical sections
- Optimize fonts (already using @fontsource)

### Updating Content Collections
- Edit `src/content.config.ts`
- Update Zod schema carefully
- Regenerate types if needed (`astro sync`)
- Update any pages that query the collection

### GitHub Pages Deployment
- Use official `withastro/action` in workflows when possible
- Ensure `site` in astro.config is set to `https://dhaatrik.github.io`
- Test builds locally with `npm run build && npm run preview`

## Design System Integration
- Glassmorphism: Use backdrop-blur + semi-transparent backgrounds + subtle borders
- Neon Accents: Cyan / blue-purple glows on interactive elements and status badges
- Blueprint Grids: Subtle SVG or CSS grid overlays in hero / section backgrounds
- Terminal Flavor: Use monospace for status lines, status badges, and code
- All new components must feel like part of "Mission Control"

## Troubleshooting Common Issues
- **Build fails on GitHub Pages**: Check base path, image paths, and environment variables
- **Tailwind not applying**: Verify `@tailwindcss/vite` plugin in astro.config
- **MDX/LaTeX broken**: Ensure remark-math and rehype-katex are in astro.config
- **Images not optimizing**: Use Astro Image component, not plain `<img>`
- **Slow performance**: Audit client islands and large dependencies

## Pro Tips for Agents
- Read `astro.config.mjs`, `src/content.config.ts`, and `package.json` first on any major task
- Prefer editing existing patterns over inventing new ones
- When suggesting refactors, always explain the performance and maintainability benefit
- Keep changes small and testable — run `npm run build` after major edits
- For visual changes, describe the intended sci-fi terminal / glassmorphism feel clearly

**Higher Purpose**: This site is a long-term personal engineering diary. Every technical decision should support clarity, performance, honesty, and the sci-fi mission-control aesthetic so that in 20 years the site still feels like a clean, trustworthy record of real engineering work.

Stay fast. Stay consistent. Keep the mission alive. 🚀