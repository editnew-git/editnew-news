import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const categories = ['Getting Started', 'Daily Use', 'Training & Layouts', 'Troubleshooting', 'Product Updates'] as const;
const contentTypes = ['Guide', 'Training', 'Troubleshooting', 'Update'] as const;
const audiences = ['All users', 'Content contributors', 'Administrators', 'Resellers'] as const;

function categoryFromTags(tags: string[]): (typeof categories)[number] {
  const normalizedTags = new Set(tags.map((tag) => tag.trim().toLowerCase()));

  // Check the more specific entry-point tags first. The fallback keeps existing
  // releases working when they do not carry an Editnew-specific tag.
  if (normalizedTags.has('getting-started') || normalizedTags.has('onboarding')) return 'Getting Started';
  if (normalizedTags.has('troubleshooting') || normalizedTags.has('troubleshoot')) return 'Troubleshooting';
  if (normalizedTags.has('training') || normalizedTags.has('layouts')) return 'Training & Layouts';
  if (normalizedTags.has('daily-use')) return 'Daily Use';
  return 'Product Updates';
}

const news = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/news' }),
  schema: z.object({
    title: z.string(), subheadline: z.string().optional(), date: z.string(), location: z.string().optional(), slug: z.string(),
    image: z.string().optional(), excerpt: z.string().optional(), tags: z.array(z.string()).default([]),
    category: z.enum(categories).optional(),
    contentType: z.enum(contentTypes).default('Update'),
    audience: z.enum(audiences).default('All users'),
    draft: z.boolean().default(false),
  }).transform((data) => ({ ...data, category: data.category ?? categoryFromTags(data.tags) })),
});

export const collections = { news };
