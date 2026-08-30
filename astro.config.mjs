// @ts-check

import { existsSync } from 'node:fs';
import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mdx from '@astrojs/mdx';
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
        mdx(),
        sitemap({
            entryLimit: 10000,
            serialize(item) {
                // Set lastmod to current build date for all pages.
                // Signals freshness to Googlebot on each deploy.
                item.lastmod = new Date().toISOString();
                return item;
            },
        }),
        {
            name: 'sitemap-flatten',
            hooks: {
                'astro:build:done': async ({ dir, logger }) => {
                    const destDir = fileURLToPath(dir);
                    const sitemap0Path = resolve(destDir, 'sitemap-0.xml');
                    const sitemapPath = resolve(destDir, 'sitemap.xml');
                    if (existsSync(sitemap0Path)) {
                        await copyFile(sitemap0Path, sitemapPath);
                        logger.info('`sitemap.xml` flattened from `sitemap-0.xml` at `dist`');
                    }
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
