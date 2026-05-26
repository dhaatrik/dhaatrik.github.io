import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'astro/zod';

// Helper to mock the image() function in Astro schemas
const imageMock = () =>
    z
        .string()
        .or(z.object({ src: z.string() }))
        .optional();

// Re-defining schemas here to avoid complex Astro environment imports during node:test
const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: imageMock(),
    readingTime: z.string().optional(),
});

const projectsSchema = z.object({
    title: z.string(),
    description: z.string(),
    logo: z.string().optional(),
    tags: z.array(z.string()).optional(),
    githubUrl: z
        .string()
        .url()
        .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
            message: 'URL must use http or https protocol for security',
        })
        .optional(),
    progress: z.string().optional(),
    order: z.number().default(0),
});

const validateDirectory = (dirPath, schema, collectionName) => {
    if (!fs.existsSync(dirPath)) {
        console.warn(
            `Warning: Directory ${dirPath} does not exist. Skipping ${collectionName} validation.`
        );
        return;
    }

    const files = fs
        .readdirSync(dirPath)
        .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));

    describe(`${collectionName} Content Validation`, () => {
        files.forEach((file) => {
            test(`${file} has valid frontmatter`, () => {
                const filePath = path.join(dirPath, file);
                const content = fs.readFileSync(filePath, 'utf8');

                // Simple regex to extract frontmatter between --- delimiters
                const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
                assert.ok(match, `${file} is missing frontmatter delimiters (---)`);

                const frontmatterRaw = match[1];
                const frontmatter = yaml.load(frontmatterRaw);

                const result = schema.safeParse(frontmatter);

                if (!result.success) {
                    const errors = result.error.errors
                        .map((e) => `${e.path.join('.')}: ${e.message}`)
                        .join(', ');
                    assert.fail(`${file} frontmatter is invalid: ${errors}`);
                }
            });
        });
    });
};

// Validate both collections
validateDirectory(path.resolve('src/content/blog'), blogSchema, 'Blog');
validateDirectory(path.resolve('src/content/projects'), projectsSchema, 'Projects');
