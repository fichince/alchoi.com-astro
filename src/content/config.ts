import { z, defineCollection } from 'astro:content';

const blogSchema = (image : Function) => z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date(),
  tags: z.string().array().optional(),
  draft: z.boolean().optional(),
  image: image().optional(),

  author: z.string().optional(),
  end: z.date().optional(),
  type: z.enum(['book', 'movie', 'tv', 'game']).optional(),
  rating: z.number().min(1).max(5).optional(),
});

const prose = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    description: z.string(),
    image: z.string(),
  })
});

const blog = defineCollection({
  schema: ({ image }) => blogSchema(image),
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
  schema: ({ image }) => blogSchema(image),
});

export const collections = {
  prose,
  blog,
  code,
  other,
  capsules,
};