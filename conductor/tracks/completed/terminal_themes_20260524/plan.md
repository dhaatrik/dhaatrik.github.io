# Implementation Plan: Terminal Theme Customization

## Phase 1: CSS Variables Refactoring

- [x] Task: Define theme variable sets (Matrix Green, Amber, Cobalt) in `global.css`.
    - [x] Write Tests
    - [x] Implement Feature: Set up root and class-level theme overrides.

## Phase 2: Theme Selector Component

- [x] Task: Build an interactive theme selector component.
    - [x] Write Tests
    - [x] Implement Feature: Create UI component with clean interactive states.
- [x] Task: Add client-side initialization script to resolve selected theme.
    - [x] Write Tests
    - [x] Implement Feature: Load from localStorage on page-load and inline script in head to prevent flashes.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Theme Selector Component' (Protocol in workflow.md)

## Phase 3: Final Integration & Tests

- [x] Task: Ensure transition updates themes smoothly.
    - [x] Write Tests: Playwright tests asserting class toggles and persistence.
    - [x] Implement Feature
- [x] Task: Conductor - User Manual Verification 'Phase 3: Final Integration & Tests' (Protocol in workflow.md)
