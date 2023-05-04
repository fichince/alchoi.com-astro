import { z, defineCollection } from 'astro:content';

const prose = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    description: z.string(),
    image: z.string(),
  })
});

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    tags: z.string().array().optional(),
    draft: z.boolean().optional(),
    image: z.string().optional(),
  })
});

const code = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    images: z.string().array(),
  })
});

const other = defineCollection({});

const capsules = defineCollection({
  schema: z.object({
    title: z.string(),
    author: z.string().optional(),
    url: z.string().url().optional(),
    image: z.string().optional(),
    start: z.date(),
    end: z.date().optional(),
    type: z.enum(['book', 'movie', 'tv', 'game']),
    rating: z.number().min(1).max(5),
  })
});

export const collections = {
  prose,
  blog,
  code,
  other,
  capsules,
};