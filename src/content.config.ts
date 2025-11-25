import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import quoteshelfLoader from './loaders/quoteshelf';
import directusLoader from './loaders/directus';
import directusQuoteshelfLoader from './loaders/directus-quoteshelf';

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
  loader: quoteshelfLoader({ base: './src/data/quoteshelf', imageBase: './src/images/quoteshelf' }),
});


// const cmsBlog = defineCollection({
//   loader: directusLoader(),
// });

const cmsQuoteshelf = defineCollection({
});

const cmsBlog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/data/ks-blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    start: z.date().optional(),
    tags: z.string().array().optional(),
    draft: z.boolean().optional(),
    image: image().optional(),
    author: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
  }),
});

export const collections = {
  prose,
  //blog,
  code,
  other,
  //capsules,
  hkjapan,
  //quoteshelf,
  //cmsBlog,
  cmsBlog,
  // cmsQuoteshelf,
};
