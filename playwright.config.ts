import { defineConfig, devices } from '@playwright/test';

/** Dedicated port so e2e does not collide with `npm run dev` / `preview` on 4321. */
const E2E_PORT = 4325;
const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

export default defineConfig({
    testDir: './test/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: E2E_BASE_URL,
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: `npm run build && npm run preview -- --port ${E2E_PORT}`,
        url: E2E_BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});
