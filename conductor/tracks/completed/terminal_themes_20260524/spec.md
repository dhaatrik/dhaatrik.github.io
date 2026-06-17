# Specification: Terminal Theme Customization

## Objective

Introduce terminal theme choices (Matrix Green, Amber Terminal, Cobalt Science, Classic Monospace) allowing the user to select their desired aesthetic theme. The settings will be handled entirely via CSS custom properties and persisted in `localStorage`.

## Scope

- Standardize CSS variables for accent and background theme tokens in `global.css`.
- Implement a theme selector control in the UI (header, footer, or setting panel).
- Persist user theme preference on transition cycles and across sessions.
- Graceful degradation when JavaScript is disabled.

## Technical Details

- Map themes to CSS classes (e.g. `.theme-amber`, `.theme-matrix`, `.theme-cobalt`) set on `<html>` or `<body>`.
- Apply variable overlays for `--accent`, `--accent-glow`, and basic background tones.
- Re-bind settings initialization logic during `astro:page-load`.
