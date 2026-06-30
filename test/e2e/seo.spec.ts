import { test, expect } from '@playwright/test';

test.describe('SEO and Metadata Verification', () => {
    test('homepage should contain valid global meta tags and website schema', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check meta title and description
        await expect(page).toHaveTitle(/Dhaatrik/);
        const description = page.locator('meta[name="description"]');
        await expect(description).toHaveAttribute('content', /.*/);

        // Check author
        const author = page.locator('meta[name="author"]');
        await expect(author).toHaveAttribute('content', 'Dhaatrik Chowdhury');

        // Check OpenGraph
        const ogType = page.locator('meta[property="og:type"]');
        await expect(ogType).toHaveAttribute('content', 'website');

        // Check schema.org JSON-LD
        const schemas = await page.locator('script[type="application/ld+json"]').all();
        expect(schemas.length).toBeGreaterThan(0);
        
        let foundPerson = false;
        for (const schema of schemas) {
            const content = await schema.innerText();
            if (content.includes('"@type":"Person"') || content.includes('"@type": "Person"')) {
                foundPerson = true;
                break;
            }
        }
        expect(foundPerson).toBe(true);
    });

    test('blog post page should contain article schema and open graph tags', async ({ page }) => {
        await page.goto('/transmissions/deltav-lab-scrollytelling-demo/');
        await page.waitForLoadState('networkidle');

        // Check og:type is article
        const ogType = page.locator('meta[property="og:type"]');
        await expect(ogType).toHaveAttribute('content', 'article');

        // Check schema.org JSON-LD has Article
        const schemas = await page.locator('script[type="application/ld+json"]').all();
        let foundArticle = false;
        for (const schema of schemas) {
            const content = await schema.innerText();
            if (content.includes('"@type":"Article"') || content.includes('"@type": "Article"')) {
                foundArticle = true;
                break;
            }
        }
        expect(foundArticle).toBe(true);

        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute('content', /delta-v-lab/);
    });

    test('DeltaV science post should use series hero in og:image and series navigation', async ({
        page,
    }) => {
        await page.goto('/transmissions/deltav-lab-science/');
        await page.waitForLoadState('networkidle');

        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute('content', /delta-v-lab/);

        await expect(page.locator('text=DeltaV Lab').first()).toBeVisible();
        await expect(page.getByRole('link', { name: /PREVIOUS IN SERIES/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /NEXT IN SERIES/i })).toBeVisible();
        await expect(
            page.getByRole('link', { name: /PREVIOUS IN SERIES/i })
        ).toHaveAttribute('href', '/transmissions/deltav-lab-why-and-what/');
        await expect(page.getByRole('link', { name: /NEXT IN SERIES/i })).toHaveAttribute(
            'href',
            '/transmissions/deltav-lab-not-professional-grade/'
        );
    });

    test('robots.txt and sitemap should be reachable and correctly structured', async ({ page }) => {
        const robotsResponse = await page.goto('/robots.txt');
        expect(robotsResponse?.status()).toBe(200);
        const robotsText = await robotsResponse?.text();
        expect(robotsText).toContain('User-agent: *');
        expect(robotsText).toContain('Sitemap:');

        // Check sitemap-index.xml is reachable (Astro sitemaps are build-time only, so we accept 200 in preview/prod, or 404 in dev mode)
        const sitemapResponse = await page.goto('/sitemap-index.xml');
        expect([200, 404]).toContain(sitemapResponse?.status());
        if (sitemapResponse?.status() === 200) {
            const sitemapText = await sitemapResponse?.text();
            expect(sitemapText).toContain('<sitemapindex');
        }
    });

    test('project detail page should contain project logo as OpenGraph and Twitter images', async ({ page }) => {
        await page.goto('/projects/deltav-lab/');
        await page.waitForLoadState('networkidle');

        // Check og:image and twitter:image contain the project logo image
        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute('content', /.*delta-v-lab.*/);

        const twitterImage = page.locator('meta[property="twitter:image"]');
        await expect(twitterImage).toHaveAttribute('content', /.*delta-v-lab.*/);
    });
});
