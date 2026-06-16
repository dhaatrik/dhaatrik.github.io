# SEO, GEO, AEO, and LLM Visibility Style Guide

This document outlines standard guidelines for ensuring all content and pages are optimized for traditional SEO, Generative Engine Optimization (GEO), Answer Engine Optimization (AEO), Large Language Model Optimization (LLMO), and AI crawlability.

## 1. Traditional SEO
* **Semantic HTML**: Use proper tag hierarchy (`<main>`, `<nav>`, `<article>`, `<header>`, `<footer>`).
* **Title & Description**: Every page must have a descriptive, unique title and meta description.
* **Alt Attributes**: All image tags must contain detailed descriptive `alt` tags.
* **Headings**: Ensure there is only one `<h1>` per page, and header tags flow sequentially (`<h2>` -> `<h3>` -> `<h4>`).

## 2. LLM Visibility & Crawlability (LLMO)
* **`llms.txt`**: Keep the site map/index in `public/llms.txt` updated whenever new pages or articles are added.
* **`llms-full.txt`**: Add full-text content of new pages or articles to `public/llms-full.txt` to serve as a comprehensive raw reading source for LLMs.
* **`robots.txt`**: Ensure that AI crawlers are explicitly allowed to crawl the site. The standard allowed bots include:
  * `GPTBot` (OpenAI)
  * `ClaudeBot` (Anthropic)
  * `PerplexityBot` (Perplexity)
  * `Applebot-Extended` (Apple)
  * `Google-Extended` (Google Gemini)
  * `cohere-ai` (Cohere)

## 3. Generative Engine Optimization (GEO) & Answer Engine Optimization (AEO)
* **Natural Language Headers**: Phrase subheadings as questions matching search intent (e.g. *"How does DBS classes teach physics?"* instead of *"Teaching Pedagogy"*).
* **Transmission Metadata Blocks**: Start blog posts/transmissions with a clean, structured quick-reference block.
* **Diagrams and Visualizations**: Use tables and charts (like Mermaid or styled ASCII diagrams) to represent workflows and pipelines. LLMs excel at parsing structured layouts.
* **Authority Citations**: Incorporate verified facts, definitions, or citations of core philosophies to maximize authenticity scores.

## 4. Structured Data (JSON-LD)
* **Article Schema**: Add JSON-LD `Article` schema to all blog posts/transmissions.
* **FAQPage Schema**: Add FAQ schemas on main query landing pages.
* **WebSite Schema**: Implement on the homepage.
* **Astro Syntax**:
  ```astro
  ---
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://dhaatrik.github.io"
  };
  const jsonLd = JSON.stringify(schema);
  ---
  <script type="application/ld+json" set:html={jsonLd} />
  ```
