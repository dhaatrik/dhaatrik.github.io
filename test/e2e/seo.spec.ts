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

        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute('content', /home-og/);
    });

    test('top-level hub routes should serve unique custom OpenGraph and Twitter images', async ({
        page,
    }) => {
        const hubs = [
            { path: '/', pattern: /home-og/ },
            { path: '/personnel/', pattern: /personnel-og/ },
            { path: '/projects/', pattern: /projects-og/ },
            { path: '/pedagogy/', pattern: /pedagogy-transmissions/ },
            { path: '/transmissions/', pattern: /transmissions-og/ },
        ];

        for (const hub of hubs) {
            await page.goto(hub.path);
            await page.waitForLoadState('domcontentloaded');
            const ogImage = page.locator('meta[property="og:image"]');
            await expect(ogImage).toHaveAttribute('content', hub.pattern);
            const twitterImage = page.locator('meta[name="twitter:image"]');
            await expect(twitterImage).toHaveAttribute('content', hub.pattern);
        }
    });

    test('blog post page should contain article schema and open graph tags', async ({ page }) => {
        await page.goto('/transmissions/deltav-lab-flight-computer/');
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
        await expect(page.getByRole('link', { name: /PREVIOUS IN SERIES/i })).toHaveAttribute(
            'href',
            '/transmissions/deltav-lab-why-and-what/'
        );
        await expect(page.getByRole('link', { name: /NEXT IN SERIES/i })).toHaveAttribute(
            'href',
            '/transmissions/deltav-lab-not-professional-grade/'
        );
    });

    test('robots.txt and sitemaps should be reachable and correctly structured', async ({
        page,
    }) => {
        const robotsResponse = await page.goto('/robots.txt');
        expect(robotsResponse?.status()).toBe(200);
        const robotsText = await robotsResponse?.text();
        expect(robotsText).toContain('User-agent: *');
        expect(robotsText).toContain('Sitemap: https://dhaatrik.github.io/sitemap.xml');
        expect(robotsText).toContain('Sitemap: https://dhaatrik.github.io/sitemap-index.xml');

        // Check direct flat sitemap.xml is reachable (Astro sitemaps are build-time only, so we accept 200 in preview/prod, or 404 in dev mode)
        const flatSitemapResponse = await page.goto('/sitemap.xml');
        expect([200, 404]).toContain(flatSitemapResponse?.status());
        if (flatSitemapResponse?.status() === 200) {
            const flatSitemapText = await flatSitemapResponse?.text();
            expect(flatSitemapText).toContain('<urlset');
            expect(flatSitemapText).toContain('https://dhaatrik.github.io/');
        }

        // Check sitemap-index.xml is reachable (Astro sitemaps are build-time only, so we accept 200 in preview/prod, or 404 in dev mode)
        const sitemapIndexResponse = await page.goto('/sitemap-index.xml');
        expect([200, 404]).toContain(sitemapIndexResponse?.status());
        if (sitemapIndexResponse?.status() === 200) {
            const sitemapIndexText = await sitemapIndexResponse?.text();
            expect(sitemapIndexText).toContain('<sitemapindex');
        }
    });

    test('project detail page should contain project logo as OpenGraph and Twitter images', async ({
        page,
    }) => {
        await page.goto('/projects/deltav-lab/');
        await page.waitForLoadState('networkidle');

        // Check og:image and twitter:image contain the project logo image
        const ogImage = page.locator('meta[property="og:image"]');
        await expect(ogImage).toHaveAttribute('content', /.*delta-v-lab.*/);

        const twitterImage = page.locator('meta[name="twitter:image"]');
        await expect(twitterImage).toHaveAttribute('content', /.*delta-v-lab.*/);
    });

    test('404 page should have noindex robots tag and no canonical or og:url pointing to 404', async ({
        page,
    }) => {
        await page.goto('/404');
        await page.waitForLoadState('networkidle');

        // Robots tag must be noindex, nofollow
        const robots = page.locator('meta[name="robots"]');
        await expect(robots).toHaveAttribute('content', 'noindex, nofollow');

        // Should not have a canonical link tag
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveCount(0);

        // Should not have og:url or twitter:url pointing to 404
        const ogUrl = page.locator('meta[property="og:url"]');
        await expect(ogUrl).toHaveCount(0);

        const twitterUrl = page.locator('meta[name="twitter:url"]');
        await expect(twitterUrl).toHaveCount(0);
    });
});
