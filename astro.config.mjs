// @ts-check

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
            serialize(item) {
                // Set lastmod to current build date for all pages.
                // Signals freshness to Googlebot on each deploy.
                item.lastmod = new Date().toISOString();
                return item;
            },
        }),
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
