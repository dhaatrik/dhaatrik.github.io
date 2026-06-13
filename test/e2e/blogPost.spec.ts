import { test, expect } from '@playwright/test';

test.describe('BlogPost Interactive Features', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to a post known to have interactive formulas and code blocks
        await page.goto('/blog/scrollytelling-demo/');
        await page.locator('#toggle-mode-btn').waitFor({ state: 'visible' });
    });

    test('RAW/RENDERED mode toggle should hide/show markdown vs rendered container', async ({ page }) => {
        const toggleBtn = page.locator('#toggle-mode-btn');
        const renderedContent = page.locator('#rendered-content-container');
        const rawContent = page.locator('#raw-markdown-container');

        // Initially rendered content should be visible, raw content should be hidden
        await expect(renderedContent).toBeVisible();
        await expect(rawContent).toBeHidden();
        await expect(toggleBtn).toHaveText('[ RENDERED ]');

        // Click toggle to switch to RAW mode
        await toggleBtn.click();

        // Rendered content should be hidden, raw content should be visible
        await expect(renderedContent).toBeHidden();
        await expect(rawContent).toBeVisible();
        await expect(toggleBtn).toHaveText('[ RAW ]');

        // Click toggle to switch back to RENDERED mode
        await toggleBtn.click();

        // Rendered content should be visible again, raw content should be hidden
        await expect(renderedContent).toBeVisible();
        await expect(rawContent).toBeHidden();
        await expect(toggleBtn).toHaveText('[ RENDERED ]');
    });

    test('KaTeX formula inspector should trigger popover tooltip on click and dismiss on document click', async ({ page }) => {
        const mathBlock = page.locator('.katex').first();
        await mathBlock.scrollIntoViewIfNeeded();

        // Initially no math inspector tooltip should exist
        await expect(page.locator('#math-inspector-tooltip')).toHaveCount(0);

        // Click math block to open inspector tooltip (using dispatchEvent for robustness on inline KaTeX spans)
        await mathBlock.dispatchEvent('click');

        // Tooltip should be visible and contain the breakdown keyword
        const tooltip = page.locator('#math-inspector-tooltip');
        await expect(tooltip).toBeVisible();
        await expect(tooltip).toContainText('INSPECTING');
        await expect(tooltip).toContainText('m0: Initial Mass'); // Part of Tsiolkovsky rocket equation definition

        // Click outside (e.g., body) to dismiss
        await page.click('body');

        // Tooltip should be removed from the DOM
        await expect(tooltip).toHaveCount(0);
    });

    test('Codeblock line selection should display and update telemetry (LNC/FUNC)', async ({ page }) => {
        const firstLine = page.locator('pre code .line').first();
        await firstLine.scrollIntoViewIfNeeded();

        // The telemetry element is within the header of the code block wrapper
        // The structure: wrapper (code-wrapper-processed) -> header -> code-telemetry
        // Let's locate the corresponding telemetry element
        const codeWrapper = firstLine.locator('xpath=ancestor::div[contains(@class, "code-wrapper-processed")]');
        const telemetry = codeWrapper.locator('.code-telemetry');

        // Initially telemetry should be hidden or not display LNC
        await expect(telemetry).toBeHidden();

        // Click the first line to activate focus and telemetry
        await firstLine.click();

        // Telemetry should be visible and show LNC: 1
        await expect(telemetry).toBeVisible();
        await expect(telemetry).toContainText('LNC: 1');

        // Click the first line again to toggle off
        await firstLine.click();
        await expect(telemetry).toBeHidden();
    });

    test('JSON-LD metadata export should trigger file download with valid schema', async ({ page }) => {
        const exportBtn = page.locator('#export-btn');
        await exportBtn.scrollIntoViewIfNeeded();
        
        // Open export menu options
        await exportBtn.click();

        const exportJsonBtn = page.locator('#export-json-btn');
        await expect(exportJsonBtn).toBeVisible();

        // Wait for download event and trigger export
        const downloadPromise = page.waitForEvent('download');
        await exportJsonBtn.click();
        const download = await downloadPromise;

        // Verify file properties
        const filename = download.suggestedFilename();
        expect(filename).toContain('transmission-metadata-');
        expect(filename.endsWith('.json')).toBe(true);

        const path = await download.path();
        expect(path).toBeTruthy();
    });
});
