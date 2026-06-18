import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Automated Accessibility (A11y) Audits', () => {
    test.describe.configure({ timeout: 60_000 });

    const routes = [
        '/',
        '/404',
        '/personnel/',
        '/pedagogy/',
        '/transmissions/',
        '/transmissions/deltav-lab-mission-log/',
        '/projects/',
        '/projects/deltav-lab/',
    ];

    for (const route of routes) {
        test(`should have zero critical or serious WCAG violations on route: ${route}`, async ({ page }) => {
            await page.goto(route, { waitUntil: 'load' });
            await page.locator('main, body').first().waitFor({ state: 'visible' });

            // Run the Axe accessibility scanner
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();

            // Filter for critical and serious accessibility violations
            const violations = results.violations.filter(
                (violation) => violation.impact === 'critical' || violation.impact === 'serious'
            );

            // Log details of violations if any exist
            if (violations.length > 0) {
                console.error(`\n[A11Y ERROR] ${violations.length} critical/serious accessibility violation(s) found on route: ${route}`);
                violations.forEach((violation, index) => {
                    console.error(`\nViolation #${index + 1}: [${violation.id}] (${violation.impact}) ${violation.help}`);
                    console.error(`Help URL: ${violation.helpUrl}`);
                    violation.nodes.forEach((node) => {
                        console.error(`- Target Element HTML: ${node.html}`);
                        console.error(`  Target Element Selectors: ${JSON.stringify(node.target)}`);
                    });
                });
            }

            // Assert that there are zero critical or serious violations
            expect(violations).toHaveLength(0);
        });
    }
});

