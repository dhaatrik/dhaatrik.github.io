## 2025-02-24 - [Zod URL Validation XSS Risk]
**Vulnerability:** Zod's `z.string().url()` allows `javascript:` URIs by default. If a developer uses this validated URL in an `href` attribute (like `<a href={project.data.githubUrl}>`), it could lead to Cross-Site Scripting (XSS).
**Learning:** Even strict schema validation libraries like Zod have permissive defaults for things like URLs. Relying solely on `z.string().url()` is not sufficient to prevent XSS when rendering user-provided or external URLs in templates.
**Prevention:** Always use `.refine()` to explicitly restrict URLs to safe protocols (`http://` and `https://`) when using Zod to validate URLs that will be rendered in HTML attributes.
