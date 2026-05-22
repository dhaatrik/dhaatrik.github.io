import { test, expect } from '@playwright/test';

test.describe('Portfolio UI Interactivity', () => {

  test('Theme toggle should switch between light and dark modes', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    const toggle = page.locator('#theme-toggle');

    // Initial state check
    const isInitiallyDark = await html.evaluate(el => el.classList.contains('dark'));
    
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

  test('Vellor Protocol easter egg should trigger when offline', async ({ page, context }) => {
    // Navigating to about page where the logic resides
    await page.goto('/about');

    // Simulate going offline
    await context.setOffline(true);

    // Assert the toast appears - target the text itself which should span across the container
    await expect(page.getByText(/Vellor Protocol Engaged: You are offline/)).toBeVisible();
    await expect(page.getByText('Vellor Protocol Engaged: You are offline, but this data remains accessible.')).toBeVisible();

    // Cleanup
    await context.setOffline(false);
  });

  test('Client-side routing should not perform a full page reload', async ({ page }) => {
    await page.goto('/');

    // Set a marker on the window object
    await page.evaluate(() => {
      (window as any).__SPA_MARKER__ = true;
    });

    // Navigate to the Blog page - using a selector that is likely to work
    const blogLink = page.locator('header a:has-text("Transmissions")');
    await blogLink.click();

    // Verify URL change
    await expect(page).toHaveURL(/\/blog/);

    // Check if the marker still exists
    const hasMarker = await page.evaluate(() => (window as any).__SPA_MARKER__);
    expect(hasMarker).toBe(true);
  });

  test('Blog page search should retain queries and update URL/sessionStorage', async ({ page }) => {
    // 1. Check URL query param filtering
    await page.goto('/blog?q=second');
    
    // The second post should be visible, others should be hidden
    const secondPostCard = page.locator('a[href*="/second-post/"]');
    const firstPostCard = page.locator('a[href*="/first-post/"]');
    
    await expect(secondPostCard).toBeVisible();
    await expect(firstPostCard).toBeHidden();

    // 2. Test typing updates URL (debounced) and sessionStorage
    const searchInput = page.locator('#search-logs');
    await searchInput.fill('first');
    
    // Initially should not be updated yet (debouncing)
    expect(page.url()).toContain('q=second');

    // Wait for debounce timeout (300ms + buffer)
    await page.waitForTimeout(400);
    expect(page.url()).toContain('q=first');

    // Check sessionStorage
    const sessionStorageVal = await page.evaluate(() => sessionStorage.getItem('blog-search-term'));
    expect(sessionStorageVal).toBe('first');

    // 3. Test back navigation retention
    await page.goto('/');
    await page.goBack();
    await expect(searchInput).toHaveValue('first');
  });

  test('BlogPost Table of Contents should highlight active sections on scroll', async ({ page }) => {
    // Navigate to a post with headings
    await page.goto('/blog/using-mdx/');
    
    const tocLink = page.locator('#toc a[href="#why-mdx"]');
    
    // Check initial state (should not have active classes if we are at the top)
    await expect(tocLink).not.toHaveClass(/!text-\(--accent\)/);

    // Scroll to the headings section
    const headingsHeader = page.locator('#why-mdx');
    await headingsHeader.evaluate(el => el.scrollIntoView({ block: 'start' }));
    
    // Allow animation frame and scroll listener to fire
    await page.waitForTimeout(200);

    // Now it should be highlighted
    await expect(tocLink).toHaveClass(/!text-\(--accent\)/);
  });

});
