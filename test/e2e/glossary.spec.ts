import { test, expect } from '@playwright/test';

test.describe('Glossary Popover Functionality', () => {
    test('handles empty or null text nodes without throwing errors', async ({ page }) => {
        // Navigate to a blog post to test the glossary initialization
        await page.goto('/blog/using-mdx/');

        // Wait for the page to fully load
        await page.waitForLoadState('networkidle');

        // Create an array to catch page errors
        const errors: string[] = [];
        page.on('pageerror', (err) => {
            errors.push(err.message);
        });

        // We simulate the edge case by creating text nodes with empty string content,
        // appending them to the prose container, and then re-triggering the glossary script.
        await page.evaluate(() => {
            const proseContainer = document.querySelector('.prose');
            if (proseContainer) {
                // Create nodes with empty text
                const emptyNode1 = document.createTextNode('');
                const emptyNode2 = document.createTextNode('   ');

                // Technically text nodes always return strings for nodeValue, but we are testing
                // the `if (!content) return;` condition which handles empty strings gracefully.
                emptyNode2.nodeValue = '';

                proseContainer.appendChild(emptyNode1);
                proseContainer.appendChild(emptyNode2);

                // Re-trigger the script that handles glossary
                document.dispatchEvent(new Event('astro:page-load'));
            }
        });

        // Wait a bit to ensure requestIdleCallback/setTimeout for glossary initialization finishes
        await page.waitForTimeout(1000);

        // There should be no unhandled errors thrown from the glossary script
        expect(errors).toHaveLength(0);

        // Verify that the prose section is still intact
        const hasProse = await page.locator('.prose').isVisible();
        expect(hasProse).toBe(true);
    });
});
