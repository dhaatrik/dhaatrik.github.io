import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
    // Load Markdown and MDX files in the `src/content/blog/` directory.
    loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
    // Type-check frontmatter using a schema
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            // Transform string to Date object
            pubDate: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            heroImage: z.optional(image()),
            readingTime: z.string().optional(),
            tags: z.array(z.string()).optional(),
            series: z.string().optional(),
            author: z.string().default('DHAATRIK'),
            clearance: z
                .enum(['PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'LEVEL_4'])
                .default('PUBLIC'),
            // Set to true on posts that contain KaTeX math ($$) so the CSS is loaded conditionally
            hasMath: z.boolean().default(false),
        }),
});

const projects = defineCollection({
    loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            logo: z.optional(image()),
            video: z.string().optional(),
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
            transmissionTag: z.string().optional(),
            // Mission Report fields: honest fuckup teaser and build pain rating (1–5)
            fuckup_teaser: z.string().optional(),
            pain_level: z.number().min(1).max(5).optional(),
        }),
});

export const collections = { blog, projects };
