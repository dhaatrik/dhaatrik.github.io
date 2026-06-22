# Project agent skills — dhaatrik.github.io

Skills in this directory are **repo-scoped**: they apply only to this website. Committed to git so Grok, Antigravity CLI, and compatible agents load them automatically.

## Index

| Directory                                                                    | Slash command              | Use when                                                   |
| ---------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------- |
| [`skills/dhaatrik-writing-style/`](skills/dhaatrik-writing-style/SKILL.md)   | `/dhaatrik-writing-style`  | Tone, voice, any user-facing text                          |
| [`skills/dhaatrik-mission-report/`](skills/dhaatrik-mission-report/SKILL.md) | `/dhaatrik-mission-report` | Project/transmission structure and storytelling            |
| [`skills/dhaatrik-astro-site/`](skills/dhaatrik-astro-site/SKILL.md)         | `/dhaatrik-astro-site`     | Code, architecture, builds, tests                          |
| [`skills/dhaatrik-visual-system/`](skills/dhaatrik-visual-system/SKILL.md)   | `/dhaatrik-visual-system`  | UI, design tokens, mission-control aesthetic               |
| [`skills/dhaatrik-seo-legacy/`](skills/dhaatrik-seo-legacy/SKILL.md)         | `/dhaatrik-seo-legacy`     | SEO, AEO, GEO, LLM visibility, `llms.txt`, JSON-LD, robots |

[`GEMINI.md`](../GEMINI.md) is a short pointer — full rules live in `dhaatrik-seo-legacy`.

Entry point for agents: [`../AGENTS.md`](../AGENTS.md)

## Adding a new skill

```bash
mkdir -p .agents/skills/<skill-name>
# Create .agents/skills/<skill-name>/SKILL.md with YAML frontmatter (name, description)
```

Then add a row to this README and the routing table in `AGENTS.md`.

## Gitignore

Only `.agents/skills/**` is tracked. Other `.agents/*` paths (local config, hooks) stay ignored — see root `.gitignore`.
