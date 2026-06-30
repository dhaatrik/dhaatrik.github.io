// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import remarkMermaid from './src/plugins/remark-mermaid.mjs';
import rehypeKatex from 'rehype-katex';

const markdownRehypePlugins = [rehypeKatex];

// https://astro.build/config
export default defineConfig({
    site: 'https://dhaatrik.github.io',
    redirects: {
        '/transmissions/scrollytelling-demo': '/transmissions/deltav-lab-scrollytelling-demo/',
    },
    integrations: [mdx(), sitemap()],
    markdown: {
        // Migrated from deprecated top-level remarkPlugins/rehypePlugins keys
        // (removed in Astro 8.0) to the unified() processor pattern (Astro 6.4+)
        processor: unified({
            remarkPlugins: [remarkMath, remarkMermaid],
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
