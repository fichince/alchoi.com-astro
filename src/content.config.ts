import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blogSchema = (image : Function) => z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date(),
  tags: z.string().array().optional(),
  draft: z.boolean().optional(),
  image: image().optional(),

  author: z.string().optional(),
  end: z.date().optional(),
  type: z.enum(['book', 'movie', 'tv', 'game', 'music', 'other']).optional(),
  rating: z.number().min(1).max(5).optional(),
});

const prose = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/prose' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    url: z.string().url(),
    description: z.string(),
    image: image(),
  })
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/blog' }),
  schema: ({ image }) => blogSchema(image),
});

const code = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/code' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    url: z.string(),
    images: image().array(),
  })
});

const other = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/other' }),
});

const capsules = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/capsules' }),
  schema: ({ image }) => blogSchema(image),
});

const hkjapan = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/hkjapan' }),
  schema: ({ image }) => z.object({
    title: z.string().optional(),
    date: z.date().optional(),
    component: z.string(),
    map: z.object({
      lat: z.number(),
      lon: z.number(),
      zoom: z.number(),
    }).optional(),
    images: z.object({
      image: image(),
      caption: z.string().optional(),
      location: z.object({
        lat: z.number(),
        lon: z.number(),
      }).optional(),
    }).array().optional(),
  })
});

const quoteshelf = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/quoteshelf' }),
  schema: () => z.object({
    title: z.string(),
    author: z.string(),
    quotes: z.string().array(),
  })
});

export const collections = {
  prose,
  blog,
  code,
  other,
  capsules,
  hkjapan,
  quoteshelf,
};
