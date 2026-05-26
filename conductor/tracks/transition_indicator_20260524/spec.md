# Specification: Monospace Transition Progress Indicator

## Objective

Implement a zero-dependency, terminal-styled page transition progress indicator at the top of the viewport (or as a status line) that hooks into Astro's View Transition events, providing dynamic visual feedback during client-side navigation.

## Scope

- Viewport-top loading bar with monospace digital aesthetics.
- Hook into Astro events (`astro:before-preparation`, `astro:after-preparation`, `astro:after-swap`).
- Custom telemetry status display (e.g., `[CONNECTING...]`, `[SWAPPING...]`, `[READY]`).
- Smooth transitions and styling that fits the dark mode/laboratory aesthetic.

## Technical Details

- Utilize pure CSS custom properties and transitions for loading animations.
- Integrate event listeners natively inside a global script.
- Ensure proper cleaning of timeouts and elements on transition swaps.
