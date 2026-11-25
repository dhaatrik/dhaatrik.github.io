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
        test(`should have zero critical or serious WCAG violations on route: ${route}`, async ({
            page,
        }) => {
            await page.goto(route, { waitUntil: 'domcontentloaded' });
            await page.waitForSelector('main, #main-content', { state: 'visible' });
            await page.evaluate(() => document.fonts.ready);
            await page.waitForTimeout(600);

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
                console.error(
                    `\n[A11Y ERROR] ${violations.length} critical/serious accessibility violation(s) found on route: ${route}`
                );
                violations.forEach((violation, index) => {
                    console.error(
                        `\nViolation #${index + 1}: [${violation.id}] (${violation.impact}) ${violation.help}`
                    );
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

    test('should enforce proper heading order without level skips on /projects/', async ({
        page,
    }) => {
        await page.goto('/projects/', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('main, #main-content', { state: 'visible' });

        const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
            elements.map((el) => ({
                tag: el.tagName.toLowerCase(),
                level: parseInt(el.tagName.replace('H', ''), 10),
                text: (el.textContent || '').trim().replace(/\s+/g, ' '),
            }))
        );

        expect(headings.length).toBeGreaterThan(0);
        expect(headings[0].level).toBe(1);

        // Verify that heading levels do not jump up by more than 1 level at a time (e.g. h1 -> h3 is invalid)
        let previousLevel = 0;
        for (const heading of headings) {
            if (previousLevel > 0) {
                expect(heading.level - previousLevel).toBeLessThanOrEqual(1);
            }
            previousLevel = heading.level;
        }

        // Verify that project cards are semantic h2 elements
        const projectCardHeadings = await page.$$eval('.mission-report-card h2', (elements) =>
            elements.map((el) => el.textContent?.trim())
        );
        expect(projectCardHeadings.length).toBe(12);
    });

    test('should provide descriptive alt, dimensions, and aria-hidden on /pedagogy/ thumbnails', async ({
        page,
    }) => {
        await page.goto('/pedagogy/', { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('#video-grid', { state: 'visible' });

        const thumbnails = await page.$$eval('#video-grid .video-card img', (elements) =>
            elements.map((img) => ({
                ariaHidden: img.getAttribute('aria-hidden'),
                alt: img.getAttribute('alt'),
                src: img.getAttribute('src'),
                width: img.getAttribute('width'),
                height: img.getAttribute('height'),
            }))
        );

        expect(thumbnails.length).toBeGreaterThan(0);
        for (const thumb of thumbnails) {
            expect(thumb.ariaHidden).toBe('true');
            expect(thumb.alt).toContain('Video tutorial thumbnail:');
            expect(thumb.width).toBe('320');
            expect(thumb.height).toBe('180');
            expect(thumb.src).toContain('img.youtube.com');
        }
    });

    test('should keep accessible names aligned with visible labels on key interactive controls', async ({
        page,
    }) => {
        await page.goto('/transmissions/deltav-lab-mission-log/', {
            waitUntil: 'domcontentloaded',
        });

        const headerBrandName = await page
            .locator('#header-brand')
            .evaluate((el) => el.textContent?.trim() || '');
        expect(headerBrandName.toUpperCase()).toContain('DHAATRIK');
        await expect(page.locator('#header-brand')).not.toHaveAttribute('aria-label');

        await expect(page.locator('#return-to-orbit-btn')).not.toHaveAttribute('aria-label');
        const orbitText = await page.locator('#return-to-orbit-btn').innerText();
        expect(orbitText.toUpperCase()).toContain('RETURN TO ORBIT');

        const toggleBtn = page.locator('#toggle-mode-btn');
        await expect(toggleBtn).toHaveAttribute('aria-label', /^RENDERED/i);
        await toggleBtn.click();
        await expect(toggleBtn).toHaveAttribute('aria-label', /^RAW MARKDOWN/i);

        await page.goto('/projects/deltav-lab/', { waitUntil: 'domcontentloaded' });
        const repoLink = page.getByRole('link', { name: /^Inspect Repository/i });
        await expect(repoLink).toBeVisible();
    });

    test('should render #books-popover without false aria-modal and support Escape dismissal', async ({
        page,
    }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' });

        const popover = page.locator('#books-popover');
        await expect(popover).not.toHaveAttribute('aria-modal', 'true');
        await expect(popover).not.toHaveAttribute('role', 'dialog');

        await page.locator('footer button[popovertarget="books-popover"]').first().click();
        await expect(popover).toBeVisible();

        await page.keyboard.press('Escape');
        await expect(popover).toBeHidden();
    });

    test('should use aria-pressed filter buttons without orphaned role=tab on /projects/', async ({
        page,
    }) => {
        await page.goto('/projects/', { waitUntil: 'domcontentloaded' });

        await expect(page.locator('[role="tab"]')).toHaveCount(0);
        const aiSimBtn = page.locator('.project-filter-btn[data-filter="ai-sim"]');
        await expect(aiSimBtn).toHaveAttribute('aria-pressed', 'false');

        await aiSimBtn.click();
        await expect(aiSimBtn).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('#projects-grid article:not(.hidden)')).toHaveCount(3);
    });
});
