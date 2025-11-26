import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import quoteshelfLoader from './loaders/quoteshelf';
import { customGlob } from './loaders/customGlob';
import { getLinkToPostWithDate } from '@src/utils';
import { DateTime } from 'luxon';
import { addToIndex } from './search-utils';
import slugify from '@sindresorhus/slugify';

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
  loader: customGlob({
    pattern: '*.yaml',
    base: './src/data/ks-quoteshelf',
    onLoad: async ({ store, logger }) => {
      logger.info(`Loaded ${store.values().length} quoteshelf entries`);
      const entries = Array.from(store.values());
      const searchIndexEntries : SearchIndexEntry[] = entries.reduce((memo, entry) => {
        const authorSlug = slugify(entry.data.author as string);
        const titleSlug = slugify(entry.data.title as string);
        const quotes : string[] = entry.data.quotes as string[];

        const entriesForBook : SearchIndexEntry[] = quotes.map((quote) => {
          return {
            id: entry.id,
            title: entry.data.title as string,
            url: `/quoteshelf/${authorSlug}?book=${titleSlug}`,
            type: 'quote',
            quote,
            author: entry.data.author as string,
          };
        });
        return memo.concat(entriesForBook);
      }, []);
      addToIndex(searchIndexEntries, logger);
    },
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    author: z.string(),
    sortName: z.string().optional(),
    quotes: z.string().array(),
    cover: image().optional(),
  }),
});

const cmsBlog = defineCollection({
  loader: customGlob({
    pattern: '*.md',
    base: './src/data/ks-blog',
    onLoad: async ({ store, logger }) => {
      logger.info(`Loaded ${store.values().length} blog entries`);
      const entries = Array.from(store.values());
      const searchIndexEntries : SearchIndexEntry[] = entries.map((entry) => {
        return {
          id: entry.id,
          title: entry.data.title as string,
          url: getLinkToPostWithDate(DateTime.fromJSDate(entry.data.date as Date).toISO(), entry.id),
          type: 'blog',
          content: entry.data.content as string,
          description: entry.data.description as string,
        };
      });
      addToIndex(searchIndexEntries, logger);
    },
  }),
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
  cmsQuoteshelf,
};
