import { existsSync } from 'node:fs';
import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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
            name: 'sitemap-fallback',
            hooks: {
                'astro:build:done': async ({ dir }) => {
                    const distDir = fileURLToPath(dir);
                    const sitemapIndexPath = resolve(distDir, 'sitemap-index.xml');
                    const sitemapFallbackPath = resolve(distDir, 'sitemap.xml');
                    if (existsSync(sitemapIndexPath)) {
                        await copyFile(sitemapIndexPath, sitemapFallbackPath);
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

    // Enable Astro link prefetching for instant perceived page transitions
    // This will prefetch assets for linked pages automatically either on hover or visibility
    prefetch: true,

    vite: {
        plugins: [tailwindcss()],
    },
});
