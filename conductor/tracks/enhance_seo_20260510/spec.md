# Specification: Enhance SEO and social sharing metadata

## Objective
Implement dynamic and robust Search Engine Optimization (SEO) and social sharing metadata (Open Graph, Twitter Cards) across all pages and blog posts to improve discoverability and link previews.

## Scope
- Base template metadata (Title, Description, Canonical URL).
- Open Graph tags for Facebook, LinkedIn, etc.
- Twitter Card tags for Twitter/X.
- Dynamic metadata generation for blog posts (using frontmatter data).
- Sitemap and robots.txt validation.

## Technical Details
- Utilize Astro's `<head>` injection capabilities.
- Integrate with existing Astro Content Collections for blog metadata.
- Ensure all meta tags fall back to sensible defaults.
