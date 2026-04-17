import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    mission: z.string(),
    tech: z.array(z.string()),
    link: z.string().url(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { 'blog': blogCollection, 'projects': projects };