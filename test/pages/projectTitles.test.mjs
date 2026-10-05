import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');

describe('Project Titles and Metadata', () => {
    const targetSlugs = [
        'instant-app-opener',
        'free-markdown-to-pdf-converter',
        'seamless-qr-dining',
        'fueldrop',
        'vellor',
        'the-infinite-intelligence',
    ];

    test('project titles compose correctly from markdown frontmatter and stay <= 65 chars', () => {
        for (const slug of targetSlugs) {
            const mdPath = path.join(ROOT_DIR, 'src/content/projects', `${slug}.md`);
            assert.ok(fs.existsSync(mdPath), `Markdown file for ${slug} must exist`);

            const content = fs.readFileSync(mdPath, 'utf8');
            const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            assert.ok(match, `Frontmatter missing for ${slug}`);

            const data = yaml.load(match[1]);
            const shortTagline = data.description.includes('—')
                ? data.description.split('—')[0].trim()
                : '';
            const pageTitle = shortTagline ? `${data.title} — ${shortTagline}` : data.title;

            assert.ok(
                pageTitle.length <= 65,
                `Project ${slug} title length (${pageTitle.length}) exceeds 65: "${pageTitle}"`
            );
            assert.ok(
                !pageTitle.includes(' | Dhaatrik Chowdhury'),
                `Project ${slug} title contains brand suffix: "${pageTitle}"`
            );
        }
    });

    test('built project HTML has decoded title <= 65, title === og === twitter, and no brand suffix', () => {
        const distDir = path.join(ROOT_DIR, 'dist/projects');
        if (!fs.existsSync(distDir)) {
            return; // Skip if dist has not been generated yet
        }

        for (const slug of targetSlugs) {
            const htmlPath = path.join(distDir, slug, 'index.html');
            assert.ok(fs.existsSync(htmlPath), `Built HTML for ${slug} must exist at ${htmlPath}`);

            const html = fs.readFileSync(htmlPath, 'utf8');

            const titleMatch = html.match(/<title>(.*?)<\/title>/);
            const ogTitleMatch = html.match(
                /<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/
            );
            const twitterTitleMatch = html.match(
                /<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/
            );

            assert.ok(titleMatch, `Missing <title> in ${slug}`);
            assert.ok(ogTitleMatch, `Missing og:title in ${slug}`);
            assert.ok(twitterTitleMatch, `Missing twitter:title in ${slug}`);

            const title = titleMatch[1];
            const ogTitle = ogTitleMatch[1];
            const twitterTitle = twitterTitleMatch[1];

            assert.strictEqual(title, ogTitle, `Title and og:title mismatch in ${slug}`);
            assert.strictEqual(title, twitterTitle, `Title and twitter:title mismatch in ${slug}`);
            assert.ok(
                title.length <= 65,
                `Title in ${slug} exceeds 65 chars (${title.length}): "${title}"`
            );
            assert.ok(
                !title.includes(' | Dhaatrik Chowdhury'),
                `Title in ${slug} contains brand suffix: "${title}"`
            );
        }
    });
});
