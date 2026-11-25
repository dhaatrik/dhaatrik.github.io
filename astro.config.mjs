import { existsSync, readdirSync, readFileSync } from 'node:fs';
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

function loadBlogLastmodMap() {
    const blogDir = resolve(process.cwd(), 'src/content/blog');
    const map = new Map();
    if (!existsSync(blogDir)) return map;
    for (const file of readdirSync(blogDir)) {
        if (!file.endsWith('.md')) continue;
        const raw = readFileSync(resolve(blogDir, file), 'utf8');
        const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!fmMatch) continue;
        const fm = fmMatch[1];
        const updated = fm.match(/^updatedDate:\s*['"]?([^\r\n'"]+)['"]?/m)?.[1];
        const pub = fm.match(/^pubDate:\s*['"]?([^\r\n'"]+)['"]?/m)?.[1];
        const dateStr = updated || pub;
        if (!dateStr) continue;
        const parsed = new Date(dateStr.trim());
        if (!Number.isNaN(parsed.getTime())) {
            const slug = file.replace(/\.md$/, '');
            map.set(`https://dhaatrik.github.io/transmissions/${slug}/`, parsed.toISOString());
        }
    }
    return map;
}

const blogLastmodMap = loadBlogLastmodMap();

// https://astro.build/config
export default defineConfig({
    site: 'https://dhaatrik.github.io',
    integrations: [
        sitemap({
            entryLimit: 10000,
            serialize(item) {
                const lastmod = blogLastmodMap.get(item.url);
                return lastmod ? { ...item, lastmod } : item;
            },
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
