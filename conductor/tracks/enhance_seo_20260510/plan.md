# Implementation Plan: Enhance SEO and social sharing metadata

## Phase 1: Base SEO Component Implementation
- [ ] Task: Create or update `SEO.astro` (or `BaseHead.astro`) component to accept dynamic props (title, description, image).
    - [ ] Write Tests
    - [ ] Implement Feature
- [ ] Task: Integrate `SEO.astro` into the main layouts with sensible defaults.
    - [ ] Write Tests
    - [ ] Implement Feature
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Base SEO Component Implementation' (Protocol in workflow.md)

## Phase 2: Dynamic Blog Post SEO
- [ ] Task: Extract frontmatter data (title, excerpt, hero image) in the blog post layout.
    - [ ] Write Tests
    - [ ] Implement Feature: Pass extracted data to the SEO component.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Dynamic Blog Post SEO' (Protocol in workflow.md)

## Phase 3: Final Validation
- [ ] Task: Verify sitemap and `robots.txt` configuration.
    - [ ] Write Tests
    - [ ] Implement Feature
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Validation' (Protocol in workflow.md)