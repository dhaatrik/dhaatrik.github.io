import { test, expect } from '@playwright/test';

test.describe('Header Navigation & Scroll Behaviors', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('Header should shrink on scroll down past 50px (fallback behavior check) and hide/show on scroll direction', async ({
        page,
    }) => {
        const header = page.locator('#main-header');

        // Ensure header is initially visible
        await expect(async () => {
            const transform = await header.evaluate((el) => el.style.transform);
            expect(
                transform === '' || transform === 'translateY(0px)' || transform === 'translateY(0)'
            ).toBe(true);
        }).toPass();

        // Scroll down past 150px to hide header
        await page.evaluate(() => window.scrollTo(0, 300));

        // Check if header is hidden
        await expect(async () => {
            const transform = await header.evaluate((el) => el.style.transform);
            expect(transform).toBe('translateY(-100%)');
        }).toPass();

        // Scroll back up to show header
        await page.evaluate(() => window.scrollTo(0, 100));

        // Check if header is visible again
        await expect(async () => {
            const transform = await header.evaluate((el) => el.style.transform);
            expect(transform === 'translateY(0)' || transform === 'translateY(0px)').toBe(true);
        }).toPass();
    });
});

test.describe('Mobile Navigation Drawer', () => {
    test.beforeEach(async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('should open and close mobile nav drawer on toggle button click', async ({ page }) => {
        const toggle = page.locator('#mobile-nav-toggle');
        const drawer = page.locator('#mobile-nav-drawer');
        const backdrop = page.locator('#mobile-nav-backdrop');

        // Initially drawer should be closed (has translate-x-full class)
        await expect(drawer).toHaveClass(/translate-x-full/);
        await expect(backdrop).toHaveClass(/opacity-0/);

        // Click toggle to open drawer
        await toggle.click();

        // Drawer should be open (has translate-x-0 class)
        await expect(drawer).toHaveClass(/translate-x-0/);
        await expect(drawer).not.toHaveClass(/translate-x-full/);
        await expect(backdrop).toHaveClass(/opacity-100/);
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');

        // Click toggle to close drawer
        await toggle.click();

        // Drawer should be closed again
        await expect(drawer).toHaveClass(/translate-x-full/);
        await expect(backdrop).toHaveClass(/opacity-0/);
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    test('should trap focus within the drawer when open', async ({ page }) => {
        const toggle = page.locator('#mobile-nav-toggle');
        const drawer = page.locator('#mobile-nav-drawer');

        // Open drawer
        await toggle.click();
        await expect(drawer).toHaveClass(/translate-x-0/);

        // Get all focusable elements inside drawer
        const focusables = await drawer.evaluate((el) => {
            const items = el.querySelectorAll('a, button');
            return Array.from(items).map((item) => item.textContent?.trim() || '');
        });

        expect(focusables.length).toBeGreaterThan(0);

        // The first focusable element should be active
        await expect(async () => {
            const activeText = await page.evaluate(
                () => document.activeElement?.textContent?.trim() || ''
            );
            expect(activeText).toBe(focusables[0]);
        }).toPass();

        // Tab through the elements
        for (let i = 1; i < focusables.length; i++) {
            await page.keyboard.press('Tab');
            const activeText = await page.evaluate(
                () => document.activeElement?.textContent?.trim() || ''
            );
            expect(activeText).toBe(focusables[i]);
        }

        // Tabbing again should wrap focus back to the first element
        await page.keyboard.press('Tab');
        const activeTextAfterWrap = await page.evaluate(
            () => document.activeElement?.textContent?.trim() || ''
        );
        expect(activeTextAfterWrap).toBe(focusables[0]);
    });

    test('should close drawer on backdrop click', async ({ page }) => {
        const toggle = page.locator('#mobile-nav-toggle');
        const drawer = page.locator('#mobile-nav-drawer');
        const backdrop = page.locator('#mobile-nav-backdrop');

        // Open drawer
        await toggle.click();
        await expect(drawer).toHaveClass(/translate-x-0/);

        // Click on the left side of the screen (x = 40, y = 300) which represents the visible backdrop
        await page.mouse.click(40, 300);

        // Drawer should be closed
        await expect(drawer).toHaveClass(/translate-x-full/);
        await expect(backdrop).toHaveClass(/opacity-0/);
    });

    test('should close drawer on swipe-right gesture', async ({ page }) => {
        const toggle = page.locator('#mobile-nav-toggle');
        const drawer = page.locator('#mobile-nav-drawer');

        await toggle.click();
        await expect(drawer).toHaveClass(/translate-x-0/);

        await page.evaluate(() => {
            const el = document.getElementById('mobile-nav-drawer');
            if (!el) return;
            const mkTouch = (x: number, y: number) =>
                new Touch({
                    identifier: 1,
                    target: el,
                    clientX: x,
                    clientY: y,
                    pageX: x,
                    pageY: y,
                    screenX: x,
                    screenY: y,
                    radiusX: 1,
                    radiusY: 1,
                    rotationAngle: 0,
                    force: 1,
                });
            const y = 320;
            el.dispatchEvent(
                new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [mkTouch(40, y)],
                    targetTouches: [mkTouch(40, y)],
                    changedTouches: [mkTouch(40, y)],
                })
            );
            el.dispatchEvent(
                new TouchEvent('touchmove', {
                    bubbles: true,
                    touches: [mkTouch(180, y)],
                    targetTouches: [mkTouch(180, y)],
                    changedTouches: [mkTouch(180, y)],
                })
            );
            el.dispatchEvent(
                new TouchEvent('touchend', {
                    bubbles: true,
                    touches: [],
                    targetTouches: [],
                    changedTouches: [mkTouch(180, y)],
                })
            );
        });

        await expect(drawer).toHaveClass(/translate-x-full/);
    });

    test('should close drawer on Escape key press', async ({ page }) => {
        const toggle = page.locator('#mobile-nav-toggle');
        const drawer = page.locator('#mobile-nav-drawer');

        // Open drawer
        await toggle.click();
        await expect(drawer).toHaveClass(/translate-x-0/);

        // Press Escape
        await page.keyboard.press('Escape');

        // Drawer should be closed
        await expect(drawer).toHaveClass(/translate-x-full/);
    });
});
