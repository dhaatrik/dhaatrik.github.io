import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Automated Accessibility (A11y) Audits', () => {
    const routes = [
        '/',
        '/personnel/',
        '/pedagogy/',
        '/transmissions/'
    ];

    for (const route of routes) {
        test(`should have zero critical WCAG violations on route: ${route}`, async ({ page }) => {
            await page.goto(route);
            
            // Wait for the page and network to be completely idle
            await page.waitForLoadState('networkidle');

            // Run the Axe accessibility scanner
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();

            // Filter for critical accessibility violations
            const criticalViolations = results.violations.filter(
                (violation) => violation.impact === 'critical'
            );

            // Log details of violations if any exist
            if (criticalViolations.length > 0) {
                console.error(`\n[A11Y ERROR] ${criticalViolations.length} critical accessibility violation(s) found on route: ${route}`);
                criticalViolations.forEach((violation, index) => {
                    console.error(`\nViolation #${index + 1}: [${violation.id}] ${violation.help}`);
                    console.error(`Help URL: ${violation.helpUrl}`);
                    violation.nodes.forEach((node) => {
                        console.error(`- Target Element HTML: ${node.html}`);
                        console.error(`  Target Element Selectors: ${JSON.stringify(node.target)}`);
                    });
                });
            }

            // Assert that there are zero critical violations
            expect(criticalViolations).toHaveLength(0);
        });
    }
});
