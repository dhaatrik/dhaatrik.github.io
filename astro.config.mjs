import { existsSync } from 'node:fs';
import { readFile, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeAccessibleTable from './src/plugins/rehype-accessible-table.mjs';
import { syncVersions } from './scripts/sync-versions.mjs';

const markdownRehypePlugins = [rehypeKatex, rehypeAccessibleTable];

// https://astro.build/config
export default defineConfig({
    site: 'https://dhaatrik.github.io',
    integrations: [
        sitemap({
            entryLimit: 10000,
        }),
        {
            name: 'sitemap-fallback-and-version-sync',
            hooks: {
                'astro:config:setup': () => {
                    syncVersions();
                },
                'astro:build:done': async ({ dir }) => {
                    const distDir = fileURLToPath(dir);
                    const sitemapIndexPath = resolve(distDir, 'sitemap-index.xml');
                    const sitemapFallbackPath = resolve(distDir, 'sitemap.xml');
                    if (existsSync(sitemapIndexPath)) {
                        await copyFile(sitemapIndexPath, sitemapFallbackPath);
                    } else if (existsSync(sitemapFallbackPath)) {
                        await copyFile(sitemapFallbackPath, sitemapIndexPath);
                    }
                    syncVersions(false, distDir);
                },
                'astro:server:setup': ({ server }) => {
                    syncVersions();
                    server.middlewares.use(async (req, res, next) => {
                        const rawUrl = req.url || '';
                        const pathname = rawUrl.split('?')[0];

                        if (pathname === '/sitemap-index.xml' || pathname === '/sitemap.xml') {
                            const distPath = resolve('./dist/sitemap-index.xml');
                            const xml = existsSync(distPath)
                                ? await readFile(distPath, 'utf-8')
                                : '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://dhaatrik.github.io/sitemap-0.xml</loc></sitemap></sitemapindex>';
                            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                            res.statusCode = 200;
                            if (req.method === 'HEAD') {
                                res.end();
                                return;
                            }
                            res.end(xml);
                            return;
                        }

                        if (/^\/sitemap-\d+\.xml$/.test(pathname)) {
                            const subfilePath = resolve(`./dist${pathname}`);
                            if (existsSync(subfilePath)) {
                                const xml = await readFile(subfilePath, 'utf-8');
                                res.setHeader('Content-Type', 'application/xml; charset=utf-8');
                                res.statusCode = 200;
                                if (req.method === 'HEAD') {
                                    res.end();
                                    return;
                                }
                                res.end(xml);
                                return;
                            }
                        }

                        next();
                    });
                },
            },
        },
    ],
    markdown: {
        // Migrated from deprecated top-level remarkPlugins/rehypePlugins keys
        // (removed in Astro 8.0) to the unified() processor pattern (Astro 6.4+)
        processor: unified({
            remarkPlugins: [remarkMath],
            rehypePlugins: markdownRehypePlugins,
        }),
    },

    // Enable Astro link prefetching for instant perceived page transitions
    // This will prefetch assets for linked pages automatically either on hover or visibility
    prefetch: true,

    vite: {
        plugins: [tailwindcss()],
    },
});
