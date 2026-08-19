---
name: dhaatrik-writing-style
description: >
  ALWAYS use for any writing or editing on dhaatrik.github.io — blog transmissions,
  project mission logs, homepage/personnel/pedagogy copy, meta descriptions, 404 text,
  frontmatter descriptions, and JSON-LD prose. Triggers: write blog, draft transmission,
  create article, improve post, rewrite copy, content for website, mission log, mission report,
  honest diary, project write-up, pedagogy content, SEO description, AEO, GEO, meta description,
  FAQ schema prose, llms.txt summaries. Apply brotherly-teacher tone, sci-fi mission-control
  framing, first-person diary voice, and transparent reflections on fuckups and learnings.
  Use when /dhaatrik-writing-style is invoked. Pair with dhaatrik-mission-report (structure),
  dhaatrik-seo-legacy (SEO/AEO/GEO/LLM), dhaatrik-astro-site (code), dhaatrik-visual-system (UI).
---

# Dhaatrik Writing Style Guide — Personal Diary Transmissions

**Related project skills:** `dhaatrik-mission-report` (structure), `dhaatrik-seo-legacy` (meta/OG), `dhaatrik-astro-site` (implementation), `dhaatrik-visual-system` (UI). See [`AGENTS.md`](../../../AGENTS.md) for routing.

**Core Identity:** This website is your honest personal engineering diary. Not a portfolio, not marketing, not polished thought leadership. It is a transparent record of what you built, why you built it, how it went (including the painful fuckups), and most importantly — what you learned. Speak like a cool older brother / best friend who is also a patient teacher.

## When to Use This Skill
- Any content destined for the "Transmissions" / blog section.
- Project write-ups, reflections, "Mission Reports".
- Updating existing posts.
- Generating placeholder or example content.
- Any user-facing string on pages, components, or content collections in this repo.

## Voice & Tone — Brotherly Teacher
- **Direct & Conversational**: Write as if you're sitting across from the reader having a chai or late-night coding session. Use "you", "I", "we" naturally.
- **Warm & Safe**: Honest about failures. Never shame yourself or the reader. Frame fuckups as normal, valuable parts of the journey ("This one hurt, but here's what it taught me...").
- **Encouraging**: End sections with gentle invitations to think or try things themselves.
- **Humorous when natural**: Light self-deprecation is welcome. Jokes about bugs, over-engineering, or "classic me" moments.
- **No corporate speak, no buzzwords**: Avoid "leveraging synergies", "paradigm shifts". Say "I tried X and it sucked because...".
- **Transparent First-Principles**: Always explain *why* you made a decision, not just what you did.

## Storytelling Structure (Mission Report Format)
Every major post should feel like a **Transmission from Mission Control**:

1. **Hook / Status Report** (Opening)
   - Start with current "SYS.STATUS" or a vivid scene from the fuckup or breakthrough.
   - Example: "Mission Log — Day 47. The damn thing still wouldn't compile at 3 AM..."

2. **The Why** (Context & Motivation)
   - Why did this idea matter? What problem in the real world pissed you off enough to build it?

3. **The Journey** (Narrative)
   - Chronological but not boring. Highlight key decisions, experiments, dead ends.
   - Use subheadings like "The First Prototype (and why it exploded)", "The Big Fuckup".

4. **The Fuckups & Learnings** (Most Important Section)
   - Be brutally honest.
   - Structure: What went wrong → Why it went wrong → What I learned → What I'd do differently.
   - This is where the real value lives.

5. **The Outcome & Code/Insights**
   - What works now? Share key code snippets (with LaTeX/Math if needed), diagrams, or lessons that generalize.
   - Keep technical depth but explain like to a curious friend.

6. **Closing Transmission**
   - Personal reflection. What are you thinking about next? Invitation to the reader: "If you're wrestling with something similar, drop a comment or hit me up on X."

## Language & Style Rules
- **Sci-fi Mission Control Flavor**: Sprinkle terminal-style phrases naturally — "SYS.STATUS: ONLINE", "TRANSMISSION LOG", "CLEARANCE LEVEL: OPEN", "Base Ops", etc. Don't overdo it.
- **Sentence Variety**: Mix short punchy sentences with longer reflective ones.
- **Active Voice**: "I broke the build" over "The build was broken".
- **Readability**: Short paragraphs (3-5 lines max). Use bullet points and numbered lists liberally for steps/learnings.
- **Authenticity Markers**:
  - Admit uncertainty: "I'm still not 100% sure about this part..."
  - Time references: "At 26, I'm realizing..."
  - Relate to reader: "You've probably hit this wall too."

## Technical Content Guidelines
- Use proper Markdown + LaTeX where needed (the site supports it).
- Code blocks: Always include language tag. Add comments explaining *why* the code exists.
- Images: Describe where they should go and what they show (e.g., "screenshot of the crash log" or "before/after architecture diagram").
- Length: Aim for substance. 800–2500 words for deep dives. Shorter for quick status updates.

## Astro / Site Integration
- Frontmatter: Follow existing Zod schema (title, description, pubDate, clearance, etc.).
- SEO-friendly but honest: Meta description should hint at the real story ("How I completely fucked up the state management and what it taught me about building reliable systems").
- Tags & Categories: Use meaningful ones that reflect learnings.

## AEO / GEO voice guardrails

- **Body copy:** Mission Report H2s — never turn the whole post into FAQ question headings
- **Meta, llms.txt, JSON-LD FAQ answers:** Can use natural questions, but still sound like you — not Wikipedia or a marketing FAQ page
- **Citations:** Quote sources in your voice; attribute clearly for generative search trust
- **Third person:** Only in JSON-LD / schema / `llms-full.txt` entity blocks — visible prose stays **I/you**

## Anti-AI Writing Guardrails (Humanizer Rules)

When writing or editing, run all drafts through these explicit anti-AI filters derived from Wikipedia's AI Cleanup patterns:

### 1. Banned AI Vocabulary
Never use these high-frequency AI words and clichés:
- **Significance inflation:** `testament`, `pivotal`, `crucial`, `vital`, `indelible mark`, `evolving landscape`, `tapestry`, `interplay`, `focal point`, `stands as`, `serves as`, `spearheaded`.
- **Corporate/sales fluff:** `groundbreaking`, `game-changer`, `seamless`, `showcasing`, `vibrant`, `nestled`, `boasts`, `fostering`, `cultivating`, `commitment to`, `cutting-edge`, `unleash`.
- **Bot transitions & fillers:** `delve`, `delving`, `furthermore`, `moreover`, `it is worth noting that`, `in conclusion`, `ultimately`.

### 2. Grammatical & Structural Anti-Patterns
- **No `-ing` participle tails:** Do not tack on shallow significance at the end of sentences (e.g., avoid *"I rewrote the worker in Rust, highlighting the need for performance and ensuring zero drops"* → Write *"I rewrote the worker in Rust because the TypeScript worker dropped frames at 60Hz."*).
- **No "Not only X, but Y" or "It's not just X, it's Y":** State the reality directly without dramatic negation.
- **No forced triads:** AI loves grouping things in threes (*"speed, scale, and simplicity"*). Use two or four if that's what actually exists, or just state the single real point.
- **No false "from X to Y" ranges:** Avoid fake ranges like *"from the simplest script to complex neural architectures"*.
- **Use simple, direct verbs:** Use `is`, `are`, `has`, `built`, `crashed`, `broke` instead of *"serves as a core component"* or *"features a robust system"*.
- **Em dash (`—`) control:** Do not use em dashes in every sentence or paragraph. Rely on periods, commas, and natural spoken rhythm.
- **No clipped negative tails:** Avoid fragments like *"...with no hassle"* or *"...no guessing"*. Write complete, natural thoughts.

### 3. Zero Hallucination & Fact Preservation
- **Never invent facts, metrics, or bugs:** Do not fabricate error logs, stack traces, benchmark numbers, dates, or package versions to make a story sound cooler.
- If a technical detail or number is missing, ask the user or state the concept directly without fake numbers.

---

## Before & After Voice Calibration

| AI Draft (Reject) | Dhaatrik Authentic Voice (Accept) |
|---|---|
| *"The migration to Astro 6 serves as a testament to the evolving frontend landscape, ensuring seamless performance and highlighting modern best practices."* | *"I moved the site to Astro 6 because my old React setup shipped 180KB of unused JS just to render static text."* |
| *"DeltaV Lab is not only a simulation engine, but also a groundbreaking platform that delves into the intricate complexities of orbital mechanics."* | *"DeltaV Lab is a browser rocket sim. It runs a 4th-order Runge-Kutta integrator at 50Hz in a web worker so the UI thread doesn't choke."* |
| *"Despite facing numerous hurdles, the project continues to thrive, setting the stage for future architectural innovations."* | *"The state management was a complete mess for three weeks. I ended up throwing away 800 lines of Redux boilerplate and replacing it with a single Zustand store."* |
| *"By leveraging cutting-edge web technologies, it fosters an engaging learning experience."* | *"I built this so you can visualize why staging works without having to grind through a differential equations textbook first."* |

---

## Examples of Good Openings
- Bad: "Today I implemented a new feature..." or "In today's fast-paced tech world, building scalable tools is crucial..."
- Good: "Hey, remember when I said this would be 'simple'? Yeah... about that. Let me tell you what actually happened."
- Good: "Mission Log — Day 47. The physics worker was dropping frames at 3 AM, and the bug made no sense."

## Pro Tips for LLMs / Coding Agents
- Always ground suggestions in *actual project facts* — stay truthful.
- Prioritize emotional honesty over perfection.
- Frame lessons as "here's what I wish I knew then" or "here's the mistake that cost me a weekend".
- End every piece with a sense of ongoing mission — the diary never ends.

**Remember**: This is not content for clout. This is building your own ecosystem of honest engineering knowledge. Write like your 46-year-old self would thank you for leaving this record.

Stay human. Stay curious. Keep transmitting.