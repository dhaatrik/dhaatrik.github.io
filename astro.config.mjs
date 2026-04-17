// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://dhaatrik.github.io',
    integrations: [mdx(), sitemap()],

    markdown: {
        remarkPlugins: [remarkReadingTime],
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
