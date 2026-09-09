import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeAccessibleTable from './src/plugins/rehype-accessible-table.mjs';

const markdownRehypePlugins = [rehypeKatex, rehypeAccessibleTable];

// https://astro.build/config
export default defineConfig({
    site: 'https://dhaatrik.github.io',
    integrations: [
        sitemap({
            entryLimit: 10000,
        }),
        {
            name: 'dev-sitemap-server',
            hooks: {
                'astro:server:setup': ({ server }) => {
                    server.middlewares.use(async (req, res, next) => {
                        if (req.url === '/sitemap-index.xml') {
                            const distPath = resolve('./dist/sitemap-index.xml');
                            const xml = existsSync(distPath)
                                ? await readFile(distPath, 'utf-8')
                                : '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://dhaatrik.github.io/sitemap-0.xml</loc></sitemap></sitemapindex>';
                            res.setHeader('Content-Type', 'application/xml');
                            res.statusCode = 200;
                            res.end(xml);
                            return;
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

    // ⚡ Bolt: Enable Astro link prefetching for instant perceived page transitions
    // This will prefetch assets for linked pages automatically either on hover or visibility
    prefetch: true,

    vite: {
        plugins: [tailwindcss()],
    },
});
