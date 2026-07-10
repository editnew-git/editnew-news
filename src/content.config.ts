import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categories = ['Getting Started', 'Daily Use', 'Training & Layouts', 'Troubleshooting', 'Product Updates'] as const;
const contentTypes = ['Guide', 'Training', 'Troubleshooting', 'Update'] as const;
const audiences = ['All users', 'Content contributors', 'Administrators', 'Resellers'] as const;

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: z.object({
    title: z.string(), subheadline: z.string().optional(), date: z.string(), location: z.string().optional(), slug: z.string(),
    image: z.string().optional(), excerpt: z.string().optional(), tags: z.array(z.string()).default([]),
    category: z.enum(categories).default('Product Updates'),
    contentType: z.enum(contentTypes).default('Update'),
    audience: z.enum(audiences).default('All users'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
