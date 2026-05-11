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

});
