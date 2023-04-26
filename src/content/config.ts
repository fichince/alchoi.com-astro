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
    description: z.string(),
    images: z.string().array(),
  })
});

const other = defineCollection({});

export const collections = {
  prose,
  blog,
  code,
  other,
};