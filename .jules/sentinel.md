## 2025-04-29 - GitHub Pages Static Site Security Headers Limitations

**Vulnerability:** `X-Frame-Options` and `X-Content-Type-Options` were defined using HTML `<meta>` tags.
**Learning:** Browsers completely ignore `X-Frame-Options` and `X-Content-Type-Options` when set via `<meta http-equiv="...">`. Since GitHub Pages does not support custom HTTP headers, these meta tags act purely as "security theater" and provide no actual protection against clickjacking or MIME-type sniffing. Additionally, the CSP `frame-ancestors` directive cannot be set via `<meta>` tag either.
**Prevention:** Avoid defining HTTP-only security headers in HTML `<meta>` tags. Focus instead on tightening the `Content-Security-Policy` via `<meta>` (such as `connect-src 'self'` and `form-action 'none'`).
