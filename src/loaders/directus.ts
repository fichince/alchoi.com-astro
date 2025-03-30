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

    const searchIndexEntries: SearchIndexEntry[] = [];

    try {
      let posts = [];
      let hasMore = true;
      let pageNum = 1;
      while (hasMore) {
        const page = await client.request(readItems('posts', {
          limit: 20,
          page: pageNum,
          sort: '-date',
        }));

        if (page.length > 0) {
          posts = posts.concat(page);
          pageNum++;
        } else {
          hasMore = false;
        }
      }

      logger.info(`Loading [${posts.length}] posts from Directus`);

      let totalWordCount = 0;
      for (const post of posts) {

        const { slug: id, ...rest } = post as InputData;
        const parsed = await parseData({ id, data: rest });

        const wordcount = stripMarkdown(parsed.content).split(' ').length;
        totalWordCount += wordcount;

        const { content, excerpt } = renderWithExcerpt(parsed.content);

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

      logger.info(`All-time word count [${totalWordCount}]`);

    } catch (e) {
      logger.error('Failed to load from directus ' + JSON.stringify(e, null, 2));
      throw e;
    }

  }

  return {
    name: 'directusLoader',
    load,
    schema,
  };
}
