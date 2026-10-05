import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');

function resolvePageTitle(title, description) {
    const shortTagline = description.includes('—') ? description.split('—')[0].trim() : '';
    return shortTagline ? `${title} — ${shortTagline}` : title;
}

function decodeHtmlEntities(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x2F;/g, '/');
}

describe('Project Titles and Metadata', () => {
    const expectedTitles = {
        'instant-app-opener': 'Instant App Opener — social URLs to mobile deep links',
        'free-markdown-to-pdf-converter': 'MarkPDF — Browser markdown-to-PDF via print export',
        'seamless-qr-dining': 'Seamless QR Dining — Next.js 16 restaurant demo v3.0.0',
        fueldrop: 'FuelDrop — Frontend-only fuel delivery UX demo v3.0.0',
        vellor: 'Vellor — Free MIT-licensed tutoring-management PWA',
        'the-infinite-intelligence': 'Infinite Intelligence — BYOK multi-agent council v4.0.0',
    };

    test('tagline and pageTitle resolution handles edge cases cleanly', () => {
        // Fallback to title when no em-dash is present
        assert.strictEqual(
            resolvePageTitle('My Project', 'A concise tool for converting files without a dash'),
            'My Project'
        );

        // Fallback to title when description is empty or starts with em-dash
        assert.strictEqual(resolvePageTitle('My Project', ''), 'My Project');
        assert.strictEqual(
            resolvePageTitle('My Project', ' — only after dash detail'),
            'My Project'
        );

        // Uses text before first em-dash when multiple em-dashes exist
        assert.strictEqual(
            resolvePageTitle('My Project', 'First tagline — second detail — third note'),
            'My Project — First tagline'
        );

        // Trims extra whitespace around em-dash
        assert.strictEqual(
            resolvePageTitle('My Project', '   Spaced tagline    — extra detail   '),
            'My Project — Spaced tagline'
        );
    });

    test('all project markdown frontmatters compose page titles <= 65 chars without brand suffix', () => {
        const projectsDir = path.join(ROOT_DIR, 'src/content/projects');
        const files = fs.readdirSync(projectsDir).filter((file) => file.endsWith('.md'));
        assert.ok(files.length >= 6, 'Must have at least 6 project files');

        for (const file of files) {
            const slug = file.replace(/\.md$/, '');
            const content = fs.readFileSync(path.join(projectsDir, file), 'utf8');
            const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            assert.ok(match, `Frontmatter missing in ${file}`);

            const data = yaml.load(match[1]);
            const pageTitle = resolvePageTitle(data.title, data.description);

            assert.ok(
                pageTitle.length <= 65,
                `Project ${slug} title length (${pageTitle.length}) exceeds 65: "${pageTitle}"`
            );
            assert.ok(
                !pageTitle.includes(' | Dhaatrik Chowdhury'),
                `Project ${slug} title contains brand suffix: "${pageTitle}"`
            );
            assert.ok(
                !pageTitle.includes(' | Projects'),
                `Project ${slug} title contains "| Projects" drift: "${pageTitle}"`
            );

            if (expectedTitles[slug]) {
                assert.strictEqual(
                    pageTitle,
                    expectedTitles[slug],
                    `Composed title for ${slug} does not match expected exact string`
                );
            }
        }
    });

    test('built project HTML has decoded title <= 65, title === og === twitter === meta:title, and no brand suffix', (t) => {
        const distDir = path.join(ROOT_DIR, 'dist/projects');
        if (!fs.existsSync(distDir)) {
            t.skip(
                'Skipping dist test because dist/projects does not exist. Run npm run build first.'
            );
            return;
        }

        for (const [slug, expectedTitle] of Object.entries(expectedTitles)) {
            const htmlPath = path.join(distDir, slug, 'index.html');
            assert.ok(fs.existsSync(htmlPath), `Built HTML for ${slug} must exist at ${htmlPath}`);

            const html = fs.readFileSync(htmlPath, 'utf8');

            const titleMatch = html.match(/<title>(.*?)<\/title>/);
            const metaTitleMatch = html.match(/<meta\s+name=["']title["']\s+content=["'](.*?)["']/);
            const ogTitleMatch = html.match(
                /<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/
            );
            const twitterTitleMatch = html.match(
                /<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/
            );

            assert.ok(titleMatch, `Missing <title> in ${slug}`);
            assert.ok(metaTitleMatch, `Missing <meta name="title"> in ${slug}`);
            assert.ok(ogTitleMatch, `Missing og:title in ${slug}`);
            assert.ok(twitterTitleMatch, `Missing twitter:title in ${slug}`);

            const title = decodeHtmlEntities(titleMatch[1]);
            const metaTitle = decodeHtmlEntities(metaTitleMatch[1]);
            const ogTitle = decodeHtmlEntities(ogTitleMatch[1]);
            const twitterTitle = decodeHtmlEntities(twitterTitleMatch[1]);

            assert.strictEqual(title, ogTitle, `Title and og:title mismatch in ${slug}`);
            assert.strictEqual(title, twitterTitle, `Title and twitter:title mismatch in ${slug}`);
            assert.strictEqual(title, metaTitle, `Title and meta:title mismatch in ${slug}`);
            assert.strictEqual(
                title,
                expectedTitle,
                `Decoded title in ${slug} does not match expected "${expectedTitle}"`
            );
            assert.ok(
                title.length <= 65,
                `Title in ${slug} exceeds 65 chars (${title.length}): "${title}"`
            );
            assert.ok(
                !title.includes(' | Dhaatrik Chowdhury'),
                `Title in ${slug} contains brand suffix: "${title}"`
            );
            assert.ok(
                !title.includes(' | Projects'),
                `Title in ${slug} contains "| Projects": "${title}"`
            );
        }
    });
});
