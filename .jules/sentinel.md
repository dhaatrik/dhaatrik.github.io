## 2026-04-22 - Static Site XSS Defense-in-Depth

**Vulnerability:** Missing Content-Security-Policy (CSP) headers and unsanitized JSON-LD rendering could allow XSS attacks, particularly if data sources become dynamic in the future.
**Learning:** For static sites deployed without granular server header control (like basic GitHub Pages), CSP should be implemented via meta tags in the `<head>`. Additionally, React/Astro's `set:html={JSON.stringify(...)}` does not inherently escape `<` characters, creating a potential XSS vector if data contains `</script>`.
**Prevention:** Always include CSP and Referrer-Policy meta tags in the base layout for static sites. Always sanitize serialized JSON objects inside script tags using `.replace(/</g, '\\u003c')`.

## 2026-04-21 - [Zod URL Validation XSS Risk]

**Vulnerability:** Zod's `z.string().url()` allows `javascript:` URIs by default. If a developer uses this validated URL in an `href` attribute (like `<a href={project.data.githubUrl}>`), it could lead to Cross-Site Scripting (XSS).
**Learning:** Even strict schema validation libraries like Zod have permissive defaults for things like URLs. Relying solely on `z.string().url()` is not sufficient to prevent XSS when rendering user-provided or external URLs in templates.
**Prevention:** Always use `.refine()` to explicitly restrict URLs to safe protocols (`http://` and `https://`) when using Zod to validate URLs that will be rendered in HTML attributes.

## 2026-04-23 - [CSP Vulnerability]

**Vulnerability:** [Content-Security-Policy meta tag included unsafe-eval in the script-src directive]
**Learning:** [This configuration allows execution of arbitrary strings as JavaScript, making the application vulnerable to XSS attacks]
**Prevention:** [Ensure all CSP configurations do not include unsafe-eval unless absolutely necessary for specific dependencies]
