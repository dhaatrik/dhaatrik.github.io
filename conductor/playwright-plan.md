# Playwright E2E UI Testing Implementation Plan

## Objective
Integrate Playwright to perform End-to-End (E2E) testing on the portfolio's critical UI interactions and DOM state, ensuring the "premium feel" remains intact across updates.

## Background & Motivation
Unit testing pure JavaScript is insufficient for validating the portfolio's visual and interactive elements. Playwright will allow us to simulate real user behavior and verify that client-side scripts (theme toggling, offline states, and smooth routing) function flawlessly in the browser.

## Scope & Impact
This plan covers the installation of Playwright, configuration for the Astro environment, and the implementation of specific test cases to validate client-side interactivity. It will add new dependencies but will run independently of the existing unit test suite.

## Proposed Solution
1. **Dependencies:** Install `@playwright/test` as a dev dependency.
2. **Configuration:** Create `playwright.config.ts` to automatically spin up the Astro dev server (`npm run dev`) before running tests.
3. **Test Implementation:** Create a new test suite at `test/e2e/ui.spec.ts` focusing on the requested interactions.
4. **NPM Scripts:** Add a `test:e2e` script to `package.json`.

## Alternatives Considered
- *Cypress:* Another strong E2E framework, but Playwright currently offers superior developer ergonomics, faster execution times, and excellent built-in auto-waiting features which are perfect for Astro's View Transitions (`<ClientRouter />`).

## Implementation Steps

### Phase 1: Setup & Configuration
- Install dependencies: `npm install -D @playwright/test`
- Install browsers: `npx playwright install chromium` (focusing on Chromium first for speed, can expand later).
- Create `playwright.config.ts` at the project root with a `webServer` block to launch `npm run dev` at `http://localhost:4321`.

### Phase 2: Test Suite Development (`test/e2e/ui.spec.ts`)
1. **Theme Toggle Test:**
   - Navigate to the homepage.
   - Click the theme toggle button.
   - Assert that the `<html>` element receives the `.dark` class.
   - Click again and assert the `.dark` class is removed.
2. **Offline Easter Egg (Vellor Protocol) Test:**
   - Navigate to the homepage.
   - Use Playwright's browser context to simulate an offline state: `await context.setOffline(true)`.
   - Assert that the "Vellor Protocol" toast/notification becomes visible in the DOM.
3. **Client-Side Routing Test (View Transitions):**
   - Navigate to the homepage.
   - Attach an event listener or check for a `window` property to ensure a full page reload does *not* happen.
   - Click a header link (e.g., "Blog").
   - Assert the URL changes and the new page content loads smoothly, validating Astro's `<ClientRouter />`.

### Phase 3: Package Scripts Update
- Update `package.json` to include `"test:e2e": "playwright test"`.

## Verification
Run `npm run test:e2e` to verify all Playwright tests pass against the local Astro server. Verify that the tests do not interfere with the existing `node:test` suite.

## Migration & Rollback
If Playwright causes issues in the CI pipeline, the `test:e2e` step can be isolated or removed until the tests are stabilized. The existing `npm test` command will remain untouched.