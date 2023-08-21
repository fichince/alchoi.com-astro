import { z, defineCollection } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date(),
  tags: z.string().array().optional(),
  draft: z.boolean().optional(),
  image: z.string().optional(),

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
  schema: blogSchema,
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
  schema: blogSchema,
});

const hkjapan = defineCollection({
  schema: z.object({
    title: z.string().optional(),
    date: z.date().optional(),
    component: z.string(),
    map: z.object({
      lat: z.number(),
      lon: z.number(),
      zoom: z.number(),
    }).optional(),
    images: z.object({
      image: z.string(),
      caption: z.string().optional(),
    }).array().optional(),
  })
});

export const collections = {
  prose,
  blog,
  code,
  other,
  capsules,
  hkjapan,
};