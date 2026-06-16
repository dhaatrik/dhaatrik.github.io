import { test, expect } from '@playwright/test';

test.describe('Portfolio UI Interactivity', () => {
    test('Theme toggle should switch between light and dark modes', async ({ page }) => {
        await page.goto('/');

        const html = page.locator('html');
        const toggle = page.locator('#theme-toggle');

        // Initial state check
        const isInitiallyDark = await html.evaluate((el) => el.classList.contains('dark'));

        await toggle.click();
        if (isInitiallyDark) {
            await expect(html).not.toHaveClass(/dark/);
        } else {
            await expect(html).toHaveClass(/dark/);
        }

        await toggle.click();
        if (isInitiallyDark) {
            await expect(html).toHaveClass(/dark/);
        } else {
            await expect(html).not.toHaveClass(/dark/);
        }
    });

    test('Vellor Protocol easter egg should trigger when offline', async ({ page }) => {
        // Navigating to personnel page where the logic resides
        await page.goto('/personnel');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        // Dispatch the offline event manually
        await page.evaluate(() => window.dispatchEvent(new Event('offline')));

        // Assert the toast appears - target the text itself which should span across the container
        await expect(page.getByText(/Vellor Protocol Engaged: You are offline/)).toBeVisible();
        await expect(
            page.getByText(
                'Vellor Protocol Engaged: You are offline, but this data remains accessible.'
            )
        ).toBeVisible();
    });

    test('Client-side routing should not perform a full page reload', async ({ page }) => {
        await page.goto('/');

        // Set a marker on the window object
        await page.evaluate(() => {
            (window as any).__SPA_MARKER__ = true;
        });

        // Navigate to the Blog page - using a selector that is likely to work
        const blogLink = page.locator('header a:has-text("Transmissions")').first();
        await blogLink.click();

        // Verify URL change
        await expect(page).toHaveURL(/\/transmissions/);

        // Check if the marker still exists
        const hasMarker = await page.evaluate(() => (window as any).__SPA_MARKER__);
        expect(hasMarker).toBe(true);
    });

    test('Page transition progress indicator should show up on navigation', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Click to navigate and immediately check for indicator elements
        const blogLink = page.locator('header a:has-text("Transmissions")').first();
        await blogLink.click();

        const progressBar = page.locator('#transition-progress-bar');
        const statusTag = page.locator('#transition-status-tag');

        await expect(progressBar).toBeAttached();
        await expect(statusTag).toBeAttached();

        // After page loads and timeout passes, elements should fade out
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);

        const pbOpacity = parseFloat(await progressBar.evaluate((el) => window.getComputedStyle(el).opacity));
        const stOpacity = parseFloat(await statusTag.evaluate((el) => window.getComputedStyle(el).opacity));
        expect(pbOpacity).toBeLessThan(0.01);
        expect(stOpacity).toBeLessThan(0.01);
    });

    test('Blog page search should retain queries and update URL/sessionStorage', async ({
        page,
    }) => {
        // 1. Check URL query param filtering
        await page.goto('/transmissions?q=mission');

        // The post card should be visible
        const postCard = page.locator('.blog-post-card[href*="/scrollytelling-demo/"]');
        await expect(postCard).toBeVisible();

        // 2. Test typing updates URL (debounced) and sessionStorage
        const searchInput = page.locator('#search-logs');
        await searchInput.fill('nonexistent');

        // Initially should not be updated yet (debouncing)
        expect(page.url()).toContain('q=mission');

        // Wait for debounce timeout (150ms debounce + 300ms replacestate + buffer)
        await page.waitForTimeout(600);
        expect(page.url()).toContain('q=nonexistent');

        // Check sessionStorage
        const sessionStorageVal = await page.evaluate(() =>
            sessionStorage.getItem('blog-search-term')
        );
        expect(sessionStorageVal).toBe('nonexistent');

        // 3. Verify Custom Highlight API is registered and matches are highlighted
        await searchInput.fill('teaching');
        await page.waitForTimeout(600);
        const highlightsSize = await page.evaluate(() => {
            return typeof CSS !== 'undefined' && (CSS as any).highlights
                ? (CSS as any).highlights.get('search-match')?.size || 0
                : -1;
        });
        // If Custom Highlight API is supported, assert ranges were registered
        if (highlightsSize !== -1) {
            expect(highlightsSize).toBeGreaterThan(0);
        }

        // Restore to nonexistent for the back navigation retention test
        await searchInput.fill('nonexistent');
        await page.waitForTimeout(600);

        // 4. Test back navigation retention
        await page.goto('/');
        await page.goBack();
        await expect(searchInput).toHaveValue('nonexistent');
    });

    test('BlogPost Table of Contents should highlight active sections on scroll', async ({
        page,
    }) => {
        // Set a desktop viewport size explicitly
        await page.setViewportSize({ width: 1440, height: 900 });

        // Navigate to a post with headings
        await page.goto('/transmissions/scrollytelling-demo/');

        // Disable smooth scrolling to make scrollIntoView instant
        await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' });
        await page.waitForLoadState('networkidle');

        const tocLink = page.locator('#toc a[href="#the-mathematical-principles-behind-staging"]');

        // Check initial state (should not have active classes if we are at the top)
        await expect(tocLink).not.toHaveClass(/!text-\(--accent\)/);

        // Scroll the headings section to be perfectly within the active region (Y = 200)
        const headingsHeader = page.locator('#the-mathematical-principles-behind-staging');
        await headingsHeader.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo({ top: scrollTop + rect.top - 200, behavior: 'auto' });
        });

        // Allow animation frame and scroll listener to fire
        await page.waitForTimeout(500);

        // Now it should be highlighted
        await expect(tocLink).toHaveClass(/!text-\(--accent\)/);
    });

    test('Recommended Books popover should open and close correctly', async ({ page }) => {
        await page.goto('/');

        const popover = page.locator('#books-popover');
        await expect(popover).toBeHidden();

        // Click recommended books in footer
        const footerLink = page.locator('footer button[popovertarget="books-popover"]').first();
        await footerLink.click();

        // Verify it is open
        await expect(popover).toBeVisible();

        // Click close button inside popover
        const closeBtn = popover.locator('button[popovertarget="books-popover"]').first();
        await closeBtn.click();

        // Verify it is hidden again
        await expect(popover).toBeHidden();
    });

    test('Codeblock copy button should copy text and update UI state', async ({
        page,
        context,
    }) => {
        // Grant clipboard permissions for reading
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);

        // Navigate to a post known to have a code block
        await page.goto('/transmissions/scrollytelling-demo/');

        // Select the first copy button and its corresponding pre element
        const copyBtn = page.locator('.copy-btn').first();
        const preElement = page.locator('pre').first();

        // Get the expected text to be copied
        const expectedText = await preElement.innerText();

        // Ensure it's visible so Playwright can interact with it
        await copyBtn.scrollIntoViewIfNeeded();

        // Click the copy button
        await copyBtn.click();

        // Verify it updates to "OK" and green state immediately
        await expect(copyBtn).toContainText('OK');
        await expect(copyBtn).toHaveClass(/!text-green-400/);

        // Verify clipboard content matches (normalize newlines, trailing spaces, and empty lines)
        const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
        const normalize = (str: string) =>
            str
                .replace(/\r\n/g, '\n')
                .split('\n')
                .map((line) => line.trimEnd())
                .filter(Boolean)
                .join('\n');
        expect(normalize(clipboardText)).toBe(normalize(expectedText));

        // Wait for the timeout defined in BlogPost.astro (2000ms + buffer)
        await page.waitForTimeout(2100);

        // Verify it resets back to "COPY" and normal state
        await expect(copyBtn).toContainText('COPY');
        await expect(copyBtn).not.toHaveClass(/!text-green-400/);
    });

    test('Currently Exploring popover should open and close correctly', async ({ page }) => {
        await page.goto('/');

        const popover = page.locator('#project-popover-currently-exploring');
        await expect(popover).toBeHidden();

        // Click "Currently Exploring" card
        const card = page
            .locator('article[data-popover-target="project-popover-currently-exploring"]')
            .first();
        await card.click();

        // Verify it is open
        await expect(popover).toBeVisible();

        // Click close button inside popover
        const closeBtn = popover
            .locator('button[popovertarget="project-popover-currently-exploring"]')
            .first();
        await closeBtn.click();

        // Verify it is hidden again
        await expect(popover).toBeHidden();
    });

    test('Dynamic greeting should render correct message based on time', async ({ page }) => {
        await page.goto('/');
        const greeting = page.locator('#dynamic-greeting');
        await expect(greeting).toBeVisible();
        const text = await greeting.innerText();
        expect(['Good morning,', 'Good afternoon,', 'Good evening,']).toContain(text);
    });

    test('Identity typewriter should rotate text dynamically', async ({ page }) => {
        await page.goto('/');
        const rotator = page.locator('#identity-rotator');
        await expect(rotator).toBeVisible();

        const initialText = await rotator.innerText();
        expect(initialText).toBe('First-Principles Thinker.');

        // Wait for rotation to occur (typewriter starts after 1.2s delay, deletes, pauses, and types next)
        await page.waitForTimeout(4500);

        const rotatedText = await rotator.innerText();
        expect(rotatedText).not.toBe(initialText);
        expect(rotatedText.length).toBeGreaterThan(0);
    });
});
