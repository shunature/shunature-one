import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.union([z.date(), z.string()]),
    excerpt: z.string().optional().default(''),
    tags: z.union([z.string(), z.array(z.string())]).optional().default([]),
    draft: z.boolean().optional().default(false),
    cover: z.string().optional().default(''),
  }),
});

export const collections = { notes };
