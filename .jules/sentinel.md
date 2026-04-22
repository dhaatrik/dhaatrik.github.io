## 2026-04-22 - Static Site XSS Defense-in-Depth

**Vulnerability:** Missing Content-Security-Policy (CSP) headers and unsanitized JSON-LD rendering could allow XSS attacks, particularly if data sources become dynamic in the future.
**Learning:** For static sites deployed without granular server header control (like basic GitHub Pages), CSP should be implemented via meta tags in the `<head>`. Additionally, React/Astro's `set:html={JSON.stringify(...)}` does not inherently escape `<` characters, creating a potential XSS vector if data contains `</script>`.
**Prevention:** Always include CSP and Referrer-Policy meta tags in the base layout for static sites. Always sanitize serialized JSON objects inside script tags using `.replace(/</g, '\\u003c')`.
