# Implementation Plan: Terminal Theme Customization

## Phase 1: CSS Variables Refactoring
- [ ] Task: Define theme variable sets (Matrix Green, Amber, Cobalt) in `global.css`.
    - [ ] Write Tests
    - [ ] Implement Feature: Set up root and class-level theme overrides.

## Phase 2: Theme Selector Component
- [ ] Task: Build an interactive theme selector component.
    - [ ] Write Tests
    - [ ] Implement Feature: Create UI component with clean interactive states.
- [ ] Task: Add client-side initialization script to resolve selected theme.
    - [ ] Write Tests
    - [ ] Implement Feature: Load from localStorage on page-load and inline script in head to prevent flashes.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Theme Selector Component' (Protocol in workflow.md)

## Phase 3: Final Integration & Tests
- [ ] Task: Ensure transition updates themes smoothly.
    - [ ] Write Tests: Playwright tests asserting class toggles and persistence.
    - [ ] Implement Feature
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Integration & Tests' (Protocol in workflow.md)
