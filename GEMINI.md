# AI Assistant Rules for SEO, GEO, AEO, and LLM Visibility

When modifying code, writing content, or creating pages/sections, always adhere to the following optimization standards:

## 1. LLM Visibility & Crawlability
* **`llms.txt` and `llms-full.txt`**: Whenever you add/modify a page, section, or blog post, ensure that the index in `public/llms.txt` and the detailed content in `public/llms-full.txt` are updated to reflect the new addition.
* **`robots.txt`**: Ensure AI crawlers (e.g., GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, etc.) are allowed to crawl the site.
* **Global Meta Tags**:
  * Ensure `<meta name="author" content="Dhaatrik Chowdhury" />` is set.
  * Ensure `<meta name="keywords" ... />` is dynamically populated with relevant terms.
  * Ensure OpenGraph `og:type` is set dynamically (`article` for blog posts, `website` for others).

## 2. AEO (Answer Engine Optimization) & GEO (Generative Engine Optimization)
* **Semantic Headers**: Avoid generic subheadings (e.g., "About My Pedagogy"). Instead, use natural language questions that match real user search intent (e.g., "How does the DBS Pedagogy work?").
* **Transmission Metadata Blocks**: For all blog posts or transmissions, include a structured, clean quick-reference metadata block at the very top (specifying standard metadata like `Transmission ID`, `Author`, `Subject`, `Classification`).
* **First-Principles & Citation Authority**: Quote core philosophical principles, academic sources, or official documentation directly. Verification scores are highly weighted by LLM generative search engines.
* **Data Structuring**:
  * Use clear tables (e.g., comparison lists) instead of raw text.
  * Use structured diagrams (Mermaid or styled ASCII charts) to map pipelines/architectures.

## 3. Structured Data (JSON-LD Schemas)
* **Homepage**: Ensure the following schemas are injected inside `<head>`:
  * `WebSite` (defining name, URL, search, and publisher info).
  * `FAQPage` (using dynamic Q&A pairs matching key user queries).
* **Blog Posts**: Inject `Article` schema (defining title, description, pubDate, author, and image).
* **Astro-Specific Pattern**: In Astro files, construct the JSON object inside the frontmatter script and inject it safely in the template like this:
  ```astro
  ---
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    // ...
  };
  const jsonLd = JSON.stringify(schema);
  ---
  <script type="application/ld+json" set:html={jsonLd} />
  ```
  *(Do not use `define:vars` or inline string templates inside the `<script>` tag, as it breaks formatting).*

## 4. Traditional SEO Best Practices
* **HTML Semantic Structure**: Ensure proper hierarchical structure (exactly one `<h1>` per page, sequential `<h2>` to `<h6>` headings). Use semantic tags (`<article>`, `<section>`, `<nav>`, `<aside>`, `<main>`).
* **Image Optimization**: Ensure all image elements have descriptive `alt` tags.
* **Page-Specific Meta**: Ensure every route passes a relevant `title` and `description` to the `BaseHead` layout.
