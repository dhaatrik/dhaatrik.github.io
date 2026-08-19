---
name: dhaatrik-visual-system
description: Use this skill for designing, implementing, or refactoring any visual elements on dhaatrik.github.io including glassmorphism, neon accents, blueprint grids, terminal-style components, typography, spacing, shadows, micro-interactions, animations, and overall sci-fi mission-control aesthetic. Always integrate with dhaatrik-astro-site, dhaatrik-mission-report, and dhaatrik-writing-style skills. Respect vanilla CSS + Tailwind v4 constraints and performance-first rules.
---

# Dhaatrik Visual System Skill — Sci-Fi Mission Control Aesthetic

**Core Purpose:** This skill maintains and evolves the premium sci-fi terminal / mission-control visual language of the site. It ensures every element feels like part of a cohesive, high-fidelity "engineering headquarters" while staying performant and true to the honest, brotherly diary tone.

## When to Activate This Skill

- Creating or updating any UI component (cards, drawers, headers, footers, status badges, search, telemetry)
- Implementing glassmorphism, neon glows, or blueprint effects
- Refining typography, spacing, or visual hierarchy
- Adding micro-interactions or subtle animations
- Updating design tokens or creating new component variants
- Any visual polish task (especially when following the 10 premium improvements)

**Mandatory Pairing:** Combine with:

- `dhaatrik-astro-site` for technical implementation
- `dhaatrik-mission-report` when styling project content
- `dhaatrik-writing-style` for tone-consistent microcopy in UI

Skill routing: [`AGENTS.md`](../../../AGENTS.md).

## Core Design Principles

1. **Sci-Fi Mission Control First** — Every screen should feel like part of a high-tech engineering cockpit.
2. **Glassmorphism as Foundation** — Semi-transparent backgrounds + backdrop-blur + subtle borders + soft inner glow.
3. **Neon Accents** — Cyan (#67e8f9) and blue-purple (#a5b4fc) glows on interactive elements, status, and highlights. Use sparingly for impact.
4. **Blueprint Grids** — Subtle grid overlays (SVG or CSS) in hero sections and backgrounds for technical depth.
5. **Terminal Flavor** — Monospace for status lines, telemetry, code, and "SYS.STATUS" elements. Human text stays in Nunito/Poppins.
6. **Premium but Restrained** — High visual quality without sacrificing performance or readability. Respect `prefers-reduced-motion`.
7. **Honest & Human** — Visuals support the transparent, brotherly voice — nothing feels corporate or overly polished.

## Design Tokens & Architecture (Tailwind v4 + CSS Properties)

Styles are organized modularly in `src/styles/`:

- `src/styles/tokens.css` — Animated CSS properties (`@property`) and color variables
- `src/styles/glass.css` — Canonical `.glass-surface`, `.glass-chrome`, `.bento-card` components
- `src/styles/motion.css` — Scroll cues, blueprint reveal, and keyframe animations
- `src/styles/typography.css` — Prose typography and code styling
- `src/styles/global.css` — Tailwind v4 imports (`@import 'tailwindcss'`), `@custom-variant dark`, and custom utilities

### CSS Custom Properties & Tokens

```css
/* Animated CSS properties in tokens.css */
@property --glass-bg-opacity {
    syntax: '<number>';
    inherits: true;
    initial-value: 0.35;
}
@property --glass-border-opacity {
    syntax: '<number>';
    inherits: true;
    initial-value: 0.08;
}
@property --neon-glow-opacity {
    syntax: '<number>';
    inherits: true;
    initial-value: 0;
}
@property --blueprint-opacity {
    syntax: '<number>';
    inherits: true;
    initial-value: 0.02;
}

/* Theme colors in global.css */
--neon-cyan: #67e8f9;
--neon-purple: #a5b4fc;
--status-running: #22c55e;
--status-dev: #eab308;
--status-shipped: #3b82f6;
```

### Tailwind v4 Custom GPU Utilities

Use these hardware-accelerated utilities from `global.css`:

- `transition-gpu` — 300ms cubic-bezier transition on transform, opacity, filter, backdrop-filter.
- `promote-gpu` — will-change: transform, opacity.
- `transition-bento` — 300ms cubic-bezier transition on transform, opacity, background, border, shadow.
- `transition-spring` — spring-bounce easing (`--ease-spring-bounce`) for tactile feedback.

**Dark/Light Mode:** Uses class-based dark mode (`@custom-variant dark (&:where(.dark, .dark *));`) toggled via `ThemeToggle.astro`.

## Component Patterns

### Glassmorphic Cards & Panels

- Base class: `.glass-surface` or `.bento-card`
- Header variant: `.glass-chrome`
- Drawer variant: `.glass-drawer`
- Background & Blur: driven by `--glass-bg-opacity` and `--glass-border-opacity` with backdrop-filter blur
- Blueprint grid overlay: injected automatically via `::after` pseudo-element with clip-path wipe
- Rounded corners: `rounded-2xl` or `rounded-3xl`

### Status Telemetry Badges

- Monospace font
- Small pulsing animation (CSS keyframes, respect reduced-motion)
- Color-coded by status (running = green, in-dev = yellow, shipped = blue)
- Example: `STATUS: V4_IN_DEV // DB: OFF_LINE_FIRST`

### Interactive Elements

- Subtle lift on hover (`transition-transform hover:-translate-y-0.5`)
- Neon glow on focus/active for primary actions
- Smooth color transitions

### Hero & Section Backgrounds

- Blueprint grid overlay (light SVG or CSS repeating-linear-gradient)
- Parallax or subtle movement only if performant
- Large centered logo watermark (low opacity)

### Mobile Drawer

- Same glassmorphism treatment as desktop panels
- Smooth slide + backdrop
- Clear close affordance with terminal-style text

## Animation & Micro-Interaction Rules

- **Preferred Method**: Pure CSS transitions + keyframes (fastest, most reliable on GitHub Pages)
- Use `transition-all`, `transition-colors`, `transition-transform`
- Subtle scale, lift, or glow changes on hover/focus
- For scroll-triggered reveals: IntersectionObserver + CSS classes (already partially implemented via Scrollytell)
- Always wrap animations in `@media (prefers-reduced-motion: no-preference)`
- Never use heavy libraries (Framer Motion etc.) unless absolutely necessary

## Typography & Hierarchy

- Headings: Poppins (bold, good weight range)
- Body: Nunito (excellent readability)
- Status / Terminal text: Monospace
- Generous line-height and spacing (especially on long-form Transmissions)
- Optical sizing and text-balance where supported

## Implementation Workflow

1. Define or extend tokens in CSS custom properties
2. Build component in `src/components/` using Tailwind + the tokens
3. Add subtle interactions with CSS
4. Test on mobile + desktop + reduced-motion
5. Update Storybook-like examples or document in comments if complex
6. Ensure it works inside Mission Reports and general pages

## Pro Tips for Agents

- When the user says “make it more premium”, default to deeper glassmorphism + better neon restraint + tighter spacing.
- Always ask: “Does this feel like Mission Control?” before finalizing visuals.
- Prioritize readability and emotional tone over pure aesthetics.
- For new components, provide both the visual description and the exact Tailwind + CSS implementation.
- Keep animations lightweight — the site must stay fast on GitHub Pages.

**Higher Purpose**: The visual system exists to make the honest engineering stories feel important and immersive. A beautiful, cohesive interface signals that these reflections are worth the reader’s time and attention — without ever feeling flashy or inauthentic.

Stay consistent. Stay premium. Keep transmitting. 🚀
