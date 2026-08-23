import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

const contentBlogDir = path.resolve('src/content/blog');
const contentProjectsDir = path.resolve('src/content/projects');

function getMarkdownFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
        const res = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) return getMarkdownFiles(res);
        if (dirent.name.endsWith('.md') || dirent.name.endsWith('.mdx')) return [res];
        return [];
    });
}

const blogFiles = getMarkdownFiles(contentBlogDir);
const projectFiles = getMarkdownFiles(contentProjectsDir);
const rootDocFiles = [
    path.resolve('README.md'),
    path.resolve('AGENTS.md'),
    path.resolve('public/llms.txt'),
    path.resolve('public/llms-full.txt'),
].filter((f) => fs.existsSync(f));

const blogSlugs = new Set(blogFiles.map((f) => path.basename(f, path.extname(f))));

const projectSlugs = new Set(projectFiles.map((f) => path.basename(f, path.extname(f))));

const validStaticRoutes = new Set([
    '/',
    '/personnel',
    '/personnel/',
    '/pedagogy',
    '/pedagogy/',
    '/projects',
    '/projects/',
    '/transmissions',
    '/transmissions/',
    '/rss.xml',
    '/llms.txt',
    '/llms-full.txt',
    '/robots.txt',
    '/sitemap-index.xml',
]);

const linkRegex = /\[.*?\]\((.*?)\)/g;

function extractLinks(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const links = [];
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
        links.push({
            rawUrl: match[1].trim(),
            line: content.slice(0, match.index).split('\n').length,
        });
    }
    return links;
}

describe('Content Link Integrity Audits', () => {
    describe('Blog Transmissions Link Validation', () => {
        blogFiles.forEach((file) => {
            const relPath = path.relative(process.cwd(), file);
            test(`${relPath} has valid internal links`, () => {
                const links = extractLinks(file);
                for (const { rawUrl, line } of links) {
                    const cleanUrl = rawUrl.split('#')[0].split('?')[0];

                    if (cleanUrl.startsWith('/transmissions/')) {
                        const slug = cleanUrl.replace(/^\/transmissions\//, '').replace(/\/$/, '');
                        if (slug) {
                            assert.ok(
                                blogSlugs.has(slug),
                                `Broken transmission link '${cleanUrl}' at line ${line} in ${relPath}`
                            );
                        }
                    } else if (cleanUrl.startsWith('/projects/')) {
                        const slug = cleanUrl.replace(/^\/projects\//, '').replace(/\/$/, '');
                        if (slug) {
                            assert.ok(
                                projectSlugs.has(slug),
                                `Broken project link '${cleanUrl}' at line ${line} in ${relPath}`
                            );
                        }
                    } else if (cleanUrl.startsWith('/') && !validStaticRoutes.has(cleanUrl)) {
                        assert.fail(
                            `Unknown root-relative link '${cleanUrl}' at line ${line} in ${relPath}`
                        );
                    } else if (
                        !cleanUrl.startsWith('http://') &&
                        !cleanUrl.startsWith('https://') &&
                        !cleanUrl.startsWith('mailto:') &&
                        !cleanUrl.startsWith('#') &&
                        !cleanUrl.startsWith('file://')
                    ) {
                        const resolvedPath = path.resolve(path.dirname(file), cleanUrl);
                        assert.ok(
                            fs.existsSync(resolvedPath),
                            `Broken relative file link '${cleanUrl}' at line ${line} in ${relPath}`
                        );
                    }
                }
            });
        });
    });

    describe('Projects Content Link Validation', () => {
        projectFiles.forEach((file) => {
            const relPath = path.relative(process.cwd(), file);
            test(`${relPath} has valid internal links`, () => {
                const links = extractLinks(file);
                for (const { rawUrl, line } of links) {
                    const cleanUrl = rawUrl.split('#')[0].split('?')[0];

                    if (cleanUrl.startsWith('/transmissions/')) {
                        const slug = cleanUrl.replace(/^\/transmissions\//, '').replace(/\/$/, '');
                        if (slug) {
                            assert.ok(
                                blogSlugs.has(slug),
                                `Broken transmission link '${cleanUrl}' at line ${line} in ${relPath}`
                            );
                        }
                    } else if (cleanUrl.startsWith('/projects/')) {
                        const slug = cleanUrl.replace(/^\/projects\//, '').replace(/\/$/, '');
                        if (slug) {
                            assert.ok(
                                projectSlugs.has(slug),
                                `Broken project link '${cleanUrl}' at line ${line} in ${relPath}`
                            );
                        }
                    } else if (cleanUrl.startsWith('/') && !validStaticRoutes.has(cleanUrl)) {
                        assert.fail(
                            `Unknown root-relative link '${cleanUrl}' at line ${line} in ${relPath}`
                        );
                    } else if (
                        !cleanUrl.startsWith('http://') &&
                        !cleanUrl.startsWith('https://') &&
                        !cleanUrl.startsWith('mailto:') &&
                        !cleanUrl.startsWith('#') &&
                        !cleanUrl.startsWith('file://')
                    ) {
                        const resolvedPath = path.resolve(path.dirname(file), cleanUrl);
                        assert.ok(
                            fs.existsSync(resolvedPath),
                            `Broken relative file link '${cleanUrl}' at line ${line} in ${relPath}`
                        );
                    }
                }
            });
        });
    });

    describe('Root Documentation Link Validation', () => {
        rootDocFiles.forEach((file) => {
            const relPath = path.relative(process.cwd(), file);
            test(`${relPath} has valid internal links`, () => {
                const links = extractLinks(file);
                for (const { rawUrl, line } of links) {
                    const cleanUrl = rawUrl.split('#')[0].split('?')[0];

                    if (cleanUrl.startsWith('/transmissions/')) {
                        const slug = cleanUrl.replace(/^\/transmissions\//, '').replace(/\/$/, '');
                        if (slug) {
                            assert.ok(
                                blogSlugs.has(slug),
                                `Broken transmission link '${cleanUrl}' at line ${line} in ${relPath}`
                            );
                        }
                    } else if (cleanUrl.startsWith('/projects/')) {
                        const slug = cleanUrl.replace(/^\/projects\//, '').replace(/\/$/, '');
                        if (slug) {
                            assert.ok(
                                projectSlugs.has(slug),
                                `Broken project link '${cleanUrl}' at line ${line} in ${relPath}`
                            );
                        }
                    } else if (cleanUrl.startsWith('/') && !validStaticRoutes.has(cleanUrl)) {
                        assert.fail(
                            `Unknown root-relative link '${cleanUrl}' at line ${line} in ${relPath}`
                        );
                    } else if (
                        !cleanUrl.startsWith('http://') &&
                        !cleanUrl.startsWith('https://') &&
                        !cleanUrl.startsWith('mailto:') &&
                        !cleanUrl.startsWith('#') &&
                        !cleanUrl.startsWith('file://')
                    ) {
                        const resolvedPath = path.resolve(path.dirname(file), cleanUrl);
                        assert.ok(
                            fs.existsSync(resolvedPath),
                            `Broken relative file link '${cleanUrl}' at line ${line} in ${relPath}`
                        );
                    }
                }
            });
        });
    });
});
