import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');

test('AEO: BaseHead.astro contains machine-readable LLM context discovery links', () => {
    const baseHeadPath = path.join(ROOT_DIR, 'src/components/BaseHead.astro');
    const content = fs.readFileSync(baseHeadPath, 'utf8');

    assert.ok(
        content.includes('href="/llms.txt"'),
        'BaseHead.astro must include link to /llms.txt'
    );
    assert.ok(
        content.includes('href="/llms-full.txt"'),
        'BaseHead.astro must include link to /llms-full.txt'
    );
    assert.ok(content.includes('href="/ai.txt"'), 'BaseHead.astro must include link to /ai.txt');
    assert.ok(
        content.includes('rel="alternate"'),
        'BaseHead.astro must use rel="alternate" for machine-readable context links'
    );
});

test('AEO: robots.txt allows modern generative search crawlers and AI bots', () => {
    const robotsPath = path.join(ROOT_DIR, 'public/robots.txt');
    const content = fs.readFileSync(robotsPath, 'utf8');

    const requiredBots = [
        'GPTBot',
        'OAI-SearchBot',
        'ClaudeBot',
        'Claude-Web',
        'PerplexityBot',
        'Amazonbot',
        'DuckAssistBot',
        'Google-Extended',
    ];

    for (const bot of requiredBots) {
        assert.ok(
            content.includes(`User-agent: ${bot}`),
            `robots.txt must explicitly configure User-agent: ${bot}`
        );
    }
});

test('AEO: Homepage index.astro FAQPage schema covers core technical entities', () => {
    const indexPath = path.join(ROOT_DIR, 'src/pages/index.astro');
    const content = fs.readFileSync(indexPath, 'utf8');

    assert.ok(
        content.includes("'@type': 'FAQPage'") || content.includes('"@type": "FAQPage"'),
        'index.astro must provide FAQPage JSON-LD schema'
    );

    const expectedQuestions = [
        'Who is Dhaatrik Chowdhury?',
        'What is DBS Classes?',
        "What is Dhaatrik's teaching philosophy?",
        'What projects has Dhaatrik built?',
        'What is DeltaV Lab?',
        'What is Vellor?',
        'Why does Dhaatrik release software under MIT with Zero Terms?',
    ];

    for (const q of expectedQuestions) {
        assert.ok(content.includes(q), `FAQPage schema in index.astro must answer: "${q}"`);
    }
});

test('AEO: BlogPost layout Article schema includes inLanguage and author credentials', () => {
    const blogPostPath = path.join(ROOT_DIR, 'src/layouts/BlogPost.astro');
    const content = fs.readFileSync(blogPostPath, 'utf8');

    assert.ok(
        content.includes("inLanguage: 'en-US'"),
        'BlogPost.astro must set inLanguage: en-US in articleSchema'
    );
    assert.ok(
        content.includes("url: 'https://dhaatrik.github.io/personnel/'"),
        'BlogPost.astro author schema must point to /personnel/'
    );
    assert.ok(
        content.includes("jobTitle: 'Entrepreneur & AI Engineer'"),
        'BlogPost.astro author schema must specify jobTitle'
    );
});

test('AEO: Project slug page SoftwareSourceCode schema includes inLanguage and author details', () => {
    const projectPath = path.join(ROOT_DIR, 'src/pages/projects/[...slug].astro');
    const content = fs.readFileSync(projectPath, 'utf8');

    assert.ok(
        content.includes("inLanguage: 'en-US'"),
        'projects/[...slug].astro must set inLanguage: en-US in projectSchema'
    );
    assert.ok(
        content.includes("url: 'https://dhaatrik.github.io/personnel/'"),
        'projects/[...slug].astro author schema must point to /personnel/'
    );
});

test('AEO: Pedagogy VideoObject schema includes author attribution and inLanguage', () => {
    const pedagogyPath = path.join(ROOT_DIR, 'src/pages/pedagogy.astro');
    const content = fs.readFileSync(pedagogyPath, 'utf8');

    assert.ok(
        content.includes("inLanguage: 'en-US'"),
        'pedagogy.astro VideoObject must set inLanguage: en-US'
    );
    assert.ok(
        content.includes("url: 'https://dhaatrik.github.io/personnel/'"),
        'pedagogy.astro VideoObject author must point to /personnel/'
    );
});

test('AEO: All blog transmissions and projects are indexed in llms.txt and llms-full.txt', () => {
    const llmsPath = path.join(ROOT_DIR, 'public/llms.txt');
    const llmsFullPath = path.join(ROOT_DIR, 'public/llms-full.txt');
    const llmsContent = fs.readFileSync(llmsPath, 'utf8');
    const llmsFullContent = fs.readFileSync(llmsFullPath, 'utf8');

    const blogDir = path.join(ROOT_DIR, 'src/content/blog');
    const blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));

    for (const file of blogFiles) {
        const slug = file.replace(/\.md$/, '');
        assert.ok(
            llmsContent.includes(`/transmissions/${slug}/`),
            `llms.txt must include transmission slug: ${slug}`
        );
        assert.ok(
            llmsFullContent.includes(`/transmissions/${slug}/`),
            `llms-full.txt must include transmission slug: ${slug}`
        );
    }

    const projectsDir = path.join(ROOT_DIR, 'src/content/projects');
    const projectFiles = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.md'));

    for (const file of projectFiles) {
        const slug = file.replace(/\.md$/, '');
        assert.ok(
            llmsContent.includes(`/projects/${slug}/`),
            `llms.txt must include project slug: ${slug}`
        );
        assert.ok(
            llmsFullContent.includes(`/projects/${slug}/`),
            `llms-full.txt must include project slug: ${slug}`
        );
    }
});
