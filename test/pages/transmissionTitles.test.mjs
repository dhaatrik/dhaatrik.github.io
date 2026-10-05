import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');

function decodeHtmlEntities(str) {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
}

describe('Transmission Titles and Metadata (Brief 2 & 2b)', () => {
    const expectedTitles = {
        'markpdf-tech-stack': 'MarkPDF Tech Stack — react-markdown, Print CSS, Highlighting',
        'seamless-qr-dining-tech-stack': 'Seamless QR Dining Tech Stack — Next.js 16 & Context Bus',
        'instant-app-opener-why-and-what':
            'Why Instant App Opener — Deep-Link Handoff (Not Electron)',
        'deltav-lab-whats-next': "What's Next for DeltaV Lab — Professional-Grade Roadmap",
        'seamless-qr-dining-prototype-honesty':
            'Seamless QR Dining — Simulated vs Real Restaurant Needs',
        'infinite-intelligence-byok-guardrails':
            'Infinite Intelligence — BYOK Keys, Rate Limits, Guardrails',
        'infinite-intelligence-tech-stack':
            'Infinite Intelligence Tech Stack — Orchestration, Zero Backend',
        'markpdf-why-and-what': 'Why MarkPDF — Browser Print to PDF, Not jsPDF',
        'deltav-lab-science': 'DeltaV Lab Science — Forces, Integration, Flight Software',
        'deltav-lab-not-professional-grade': 'Why DeltaV Lab Is Not Professional-Grade',
    };

    test('all target transmission markdown frontmatters have exact expected titles <= 65 chars', () => {
        const blogDir = path.join(ROOT_DIR, 'src/content/blog');

        for (const [slug, expectedTitle] of Object.entries(expectedTitles)) {
            const filePath = path.join(blogDir, `${slug}.md`);
            assert.ok(fs.existsSync(filePath), `Markdown file missing for ${slug} at ${filePath}`);

            const content = fs.readFileSync(filePath, 'utf8');
            const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            assert.ok(match, `Frontmatter missing in ${slug}.md`);

            const data = yaml.load(match[1]);
            assert.strictEqual(
                data.title,
                expectedTitle,
                `Frontmatter title in ${slug}.md does not match expected exact string`
            );
            assert.ok(
                data.title.length <= 65,
                `Frontmatter title in ${slug}.md length (${data.title.length}) exceeds 65: "${data.title}"`
            );
        }
    });

    test('built transmission HTML has decoded title <= 65, title === og === twitter === meta:title, and matches h1', (t) => {
        const distDir = path.join(ROOT_DIR, 'dist/transmissions');
        if (!fs.existsSync(distDir)) {
            t.skip(
                'Skipping dist test because dist/transmissions does not exist. Run npm run build first.'
            );
            return;
        }

        for (const [slug, expectedTitle] of Object.entries(expectedTitles)) {
            const htmlPath = path.join(distDir, slug, 'index.html');
            assert.ok(fs.existsSync(htmlPath), `Built HTML for ${slug} must exist at ${htmlPath}`);

            const html = fs.readFileSync(htmlPath, 'utf8');

            const titleMatch = html.match(/<title>(.*?)<\/title>/);
            const metaTitleMatch = html.match(
                /<meta\s+name=["']title["']\s+content=(?:"([^"]*)"|'([^']*)')/
            );
            const ogTitleMatch = html.match(
                /<meta\s+property=["']og:title["']\s+content=(?:"([^"]*)"|'([^']*)')/
            );
            const twitterTitleMatch = html.match(
                /<meta\s+name=["']twitter:title["']\s+content=(?:"([^"]*)"|'([^']*)')/
            );

            assert.ok(titleMatch, `Missing <title> in ${slug}`);
            assert.ok(metaTitleMatch, `Missing <meta name="title"> in ${slug}`);
            assert.ok(ogTitleMatch, `Missing og:title in ${slug}`);
            assert.ok(twitterTitleMatch, `Missing twitter:title in ${slug}`);

            const title = decodeHtmlEntities(titleMatch[1]);
            const metaTitle = decodeHtmlEntities(metaTitleMatch[1] ?? metaTitleMatch[2]);
            const ogTitle = decodeHtmlEntities(ogTitleMatch[1] ?? ogTitleMatch[2]);
            const twitterTitle = decodeHtmlEntities(twitterTitleMatch[1] ?? twitterTitleMatch[2]);

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
                `Decoded title in ${slug} length (${title.length}) exceeds 65: "${title}"`
            );
            assert.ok(
                !title.includes(' | Dhaatrik Chowdhury'),
                `Title in ${slug} should not contain brand suffix: "${title}"`
            );

            // Also verify H1 stays in sync
            const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
            assert.ok(h1Match, `Missing <h1> in ${slug}`);
            const h1Text = decodeHtmlEntities(h1Match[1].replace(/<[^>]+>/g, '').trim());
            assert.strictEqual(
                h1Text,
                expectedTitle,
                `h1 in ${slug} does not match expected title`
            );

            // Verify JSON-LD Article headline and BreadcrumbList item 3 name match title
            const jsonLdMatches = [
                ...html.matchAll(
                    /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/g
                ),
            ];
            let foundArticleHeadline = false;
            let foundBreadcrumbTitle = false;

            for (const match of jsonLdMatches) {
                try {
                    const parsed = JSON.parse(match[1]);
                    if (parsed['@type'] === 'Article') {
                        assert.strictEqual(
                            parsed.headline,
                            expectedTitle,
                            `Article schema headline in ${slug} does not match expected title`
                        );
                        foundArticleHeadline = true;
                    } else if (parsed['@type'] === 'BreadcrumbList') {
                        const item3 = parsed.itemListElement?.find((item) => item.position === 3);
                        if (item3) {
                            assert.strictEqual(
                                item3.name,
                                expectedTitle,
                                `BreadcrumbList item 3 name in ${slug} does not match expected title`
                            );
                            foundBreadcrumbTitle = true;
                        }
                    }
                } catch {
                    // Ignore non-json-ld script parses if any
                }
            }

            assert.ok(foundArticleHeadline, `Missing or invalid Article JSON-LD schema in ${slug}`);
            assert.ok(
                foundBreadcrumbTitle,
                `Missing or invalid BreadcrumbList JSON-LD schema item 3 in ${slug}`
            );
        }
    });
});
