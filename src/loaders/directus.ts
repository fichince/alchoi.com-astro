import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';
import { createDirectus, staticToken, rest, readItems } from '@directus/sdk';
import { renderWithExcerpt, stripMarkdown } from '@src/markdown';
import { getLinkToPostWithDate } from '@src/utils';
import { addToIndex } from '@src/search-utils';

export default function directusLoader(): Loader {

  const client =
    createDirectus(import.meta.env.DIRECTUS_URL)
      .with(staticToken(import.meta.env.DIRECTUS_TOKEN))
      .with(rest());

  const schema = z.object({
    title: z.string(),
    date: z.string().date(),
    content: z.string(),
    image: z.string().nullable(),
    description: z.string().nullable(),
    tags: z.string().array().nullable(),
    author: z.string().nullable(),
    start: z.string().date().nullable(),
    rating: z.number().nullable(),
    draft: z.boolean().nullable(),
  });

  const inputSchema = schema.extend({
    slug: z.string(),
  });

  type InputData = z.infer<typeof inputSchema>;

  async function load(context: LoaderContext) {
    const { logger, store, parseData } = context;

    store.clear();

    const posts = await client.request(readItems('posts', {
      limit: -1,
      sort: '-date',
    }));
    logger.info(`Loading ${posts.length} posts from Directus`);

    const searchIndexEntries : SearchIndexEntry[] = [];

    for (const post of posts) {

      const { slug: id, ...rest } = post as InputData;
      const parsed = await parseData({ id, data: rest });

      const wordcount = stripMarkdown(parsed.content).split(' ').length;
      const { content, excerpt } = renderWithExcerpt(parsed.content);

      logger.info(`Word count for ${id}: ${wordcount}`);

      store.set({
        id,
        data: parsed,
        rendered: {
          html: content,
          metadata: {
            excerpt,
            wordcount,
          },
        }
      });

      searchIndexEntries.push({
        id,
        title: parsed.title,
        url: getLinkToPostWithDate(parsed.date, id),
        type: 'blog',
        content: parsed.content,
        description: parsed.description,
        author: parsed.author,
      });

    }

    addToIndex(searchIndexEntries, logger);

  }

  return {
    name: 'directusLoader',
    load,
    schema,
  };
}
