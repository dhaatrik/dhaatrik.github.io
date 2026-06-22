---
name: dhaatrik-mission-report
description: >
    Use for Mission Reports, project write-ups, transmissions, Featured Engineering cards,
    transmission metadata blocks, tables, and Mermaid/ASCII diagrams. Triggers: mission log,
    mission report, project page, transmission, fuckups, learnings. Pair with
    dhaatrik-writing-style (voice) and dhaatrik-seo-legacy (llms.txt + AEO schema).
---

# Dhaatrik Mission Report Skill — Honest Engineering Diaries

**Core Purpose:** Every project story on this site is a **Mission Report** from your personal engineering headquarters. This skill ensures every report follows a consistent, honest, high-value structure that turns raw experiences into clear, teachable transmissions while staying true to your brotherly teacher voice.

## When to Activate This Skill

- Creating new project pages or transmissions
- Updating Featured Engineering cards on the homepage
- Refactoring or expanding existing project write-ups
- Generating structured content that fits the "what I built, why, how, fuckups, learnings" format
- Any task involving project storytelling

## Mandatory Integration

**Always combine with `dhaatrik-writing-style` skill** for tone, voice, and storytelling flow. This skill provides the **structural skeleton**; the writing-style skill provides the **soul and voice**. Skill routing: [`AGENTS.md`](../../../AGENTS.md).

## Transmission metadata block (required for blog posts)

Place at the **very top** of every transmission in `src/content/blog/` — before body prose. AEO/GEO quick-reference for humans and LLM parsers:

````markdown
```
====================================================================
// TRANSMISSION METADATA // QUICK REFERENCE (AEO/LLMO OBJECTS)
--------------------------------------------------------------------
- ENTITY: [What this transmission is about]
- DATE / STATUS: [Key dates or current state]
- ROOT_CAUSE or FOCUS: [Main problem or theme]
- KEY LESSON: [One-line takeaway]
====================================================================
```
````

Use Mission Report **H2 headings** in the body — not FAQ-style question headings throughout. Question phrasing belongs in JSON-LD/FAQPage and `llms-full.txt` (`dhaatrik-seo-legacy`).

## Standard Mission Report Structure

Every major report **must** follow this 6-part structure (use as **H2** headings):

### 1. Mission Log / Status Report (Opening Hook)

- Start with a vivid, terminal-style status or scene from the journey.
- Include current or historical `SYS.STATUS` style line.
- Make it immediate and human.

### 2. The Why — Mission Objective

- Explain the real-world problem or frustration that sparked the idea.
- Connect to first-principles thinking.
- Keep it personal and honest.

### 3. The Journey — Execution Log

- Narrative of decisions, experiments, dead-ends, and pivots.
- Use subheadings like:
    - The First Prototype (and why it exploded)
    - The Big Fuckup
    - Breakthrough Moment
- Chronological but engaging — focus on key turning points.

### 4. Fuckups & Learnings (The Heart of the Report)

- **Most important section.** Be brutally transparent.
- Structure each major fuckup as:
    - What went wrong
    - Why it went wrong (root cause)
    - What I learned
    - What I would do differently today
- End this section with generalized lessons that others can apply.

### 5. Current State & Key Artifacts

- What actually works now?
- Share the most valuable code snippets, architecture decisions, or tools.
- Use proper code blocks with language tags + explanatory comments.
- Recommend Astro `<Image>` or diagrams where visual understanding helps.
- Include performance notes, tech stack, and current status.

### 6. Closing Transmission

- Personal reflection on the journey.
- Forward-looking thoughts (what's next?).
- Gentle invitation to the reader: "If you're building something similar..." or "You've probably hit this wall too."

## Astro Frontmatter Template (Required)

Use this exact structure for every new `.md` / `.mdx` file in `src/content/projects/` or `src/content/blog/`:

```yaml
---
title: 'Clear, Honest Title — e.g. DeltaV Lab: Building a Deterministic Orbital Simulator'
description: 'Honest story of building a high-fidelity 4th-order physics engine in the browser. The crashes, the math, and what it taught me about deterministic simulation.'
pubDate: 2026-06-18
updatedDate: 2026-06-18
heroImage: '/images/deltav-hero.webp' # Use Astro Image optimization
readingTime: '12 min'
tags: ['rust', 'wasm', 'aerospace', 'simulation', 'fuckups']
series: 'Engineering Missions'
clearance: 'PUBLIC'
order: 2 # For projects collection sorting
---
```

**Rules:**

- `description` must hint at the honest story (not marketing copy).
- Always include `readingTime` (approximate).
- Use meaningful tags that reflect learnings.
- `clearance` defaults to PUBLIC for most content.

## Visual & Component Guidelines

- **Status Telemetry**: Use the living status style from the homepage (e.g., `STATUS: RUNNING // SIM: RK4_50HZ_ACTIVE`).
- **Project Cards**: When updating homepage cards, keep them concise but always include one honest line about a fuckup or key learning.
- **Images**:
    - Always recommend Astro `<Image>` component with proper widths.
    - Suggest before/after, architecture diagrams, or crash logs where helpful.
    - Place images with descriptive alt text.
- **Code Examples**: Always explain _why_ the code exists, not just show it.
- **LaTeX / Math**: Use when discussing physics, algorithms, or calculations.

## Content Rules Specific to Mission Reports

- Prioritize **emotional honesty** over technical perfection.
- Frame failures as normal and valuable.
- Use sci-fi terminal flavor naturally ("Mission Log", "Base Ops", "TRANSMISSION", "CLEARANCE LEVEL").
- End with forward momentum — the diary continues.
- Length guideline: 800–2500 words for deep reports. Shorter "status update" reports are fine for quick logs.

## AEO-friendly structuring (inside Mission Report sections)

- **Tables** — comparisons, before/after, metrics (preferred over dense prose for GEO)
- **Mermaid or ASCII** — pipelines, architectures, decision flows in Journey or Learnings
- **Citations** — quote principles, docs, or sources with links where checkable

## Workflow When Using This Skill

1. Read existing related content (if updating).
2. Add transmission metadata block (blog posts only).
3. Gather key facts: what, why, major fuckups, learnings, current state.
4. Draft using the 6-part structure + writing-style voice.
5. Suggest proper frontmatter and image placements.
6. Update `public/llms.txt` + `llms-full.txt` (`dhaatrik-seo-legacy`).
7. Validate against Astro content collection schema.

## Pro Tips for Agents

- Ground every report in **real events** — never fabricate stories.
- When suggesting code or architecture, explain the trade-offs and why certain paths were taken.
- If the project is still in progress, clearly mark it as such and focus on current learnings.
- Always leave the reader with something actionable or reflective.

**Remember the higher purpose**: These Mission Reports are building a public record of how real engineering actually happens — messy, iterative, and deeply human. Write like your future self (and curious strangers in 20 years) will thank you for the honesty.

Stay transparent. Keep transmitting. 🚀
