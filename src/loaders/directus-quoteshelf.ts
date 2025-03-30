import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';
import slugify from '@sindresorhus/slugify';
import { addToIndex } from '@src/search-utils';
import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';
import pickBy from 'lodash/pickBy';

export default function directusQuoteshelfLoader(): Loader {

  const client =
    createDirectus(import.meta.env.DIRECTUS_URL)
      .with(staticToken(import.meta.env.DIRECTUS_TOKEN))
      .with(rest());

  const inputSchema = z.object({
    title: z.string(),
    author: z.string(),
    sortName: z.string().nullable(),
    quotes: z.object({
      quote: z.string(),
    }).array(),
    cover: z.string().nullable(),
  });

  const outputSchema = z.object({
    title: z.string(),
    titleSlug: z.string(),
    author: z.string(),
    authorSlug: z.string(),
    sortName: z.string().optional(),
    quote: z.string(),
    coverUrl: z.string().optional(),
  });

  type InputData = z.infer<typeof inputSchema>;
  type OutputData = z.infer<typeof outputSchema>;

  type StoreData = OutputData & { id?: string };

  async function load(context: LoaderContext) {
    const { logger, store, parseData } = context;
    store.clear();
    logger.info('Running the quoteshelf loader');

    const searchIndexEntries: SearchIndexEntry[] = [];

    try {
      let quoteshelf = [];
      let hasMore = true;
      let pageNum = 1;
      while (hasMore) {
        const page = await client.request(readItems('quoteshelf', {
          limit: 20,
          page: pageNum,
          fields: ['*', 'quotes.quote']
        })) as Array<InputData>;

        if (page.length > 0) {
          quoteshelf = quoteshelf.concat(page);
          pageNum++;
        } else {
          hasMore = false;
        }
      }

      logger.info(`Loading [${quoteshelf.length}] books from Directus`);

      const quotes = quoteshelf.reduce<StoreData[]>((memo, book) => {
        inputSchema.parse(book);

        const { title, author, sortName, quotes, cover } = book;
        const titleSlug = slugify(title);
        const authorSlug = slugify(author);

        const coverUrl = `${import.meta.env.DIRECTUS_URL}/assets/${cover}`;

        const quotesForBook : StoreData[] = quotes.map(({ quote: q }, i) => {
          const id = `${authorSlug}__${titleSlug}__${i}`;

          const quote : StoreData = pickBy({
            id,
            title,
            titleSlug,
            author,
            authorSlug,
            sortName,
            quote: q,
            coverUrl,
          });
          return quote;

        });

        return memo.concat(quotesForBook);
      }, []);

      logger.info(`Processed [${quotes.length}] total quotes`);

      for (const quote of quotes) {
        const { id, ...rest } = quote;
        const parsed = await parseData({ id, data: rest });
        store.set({ id, data: parsed });

        searchIndexEntries.push({
          id,
          title: parsed.title,
          url: `/quoteshelf/${parsed.authorSlug}?book=${parsed.titleSlug}#${id}`,
          type: 'quote',
          author: parsed.author,
          quote: parsed.quote,
        });
      }

      addToIndex(searchIndexEntries, logger)

    } catch (e) {
      logger.error('Failed to load from directus ' + JSON.stringify(e, null, 2));
      throw e;
    }
  }

  return {
    name: 'directusQuoteshelfLoader',
    load,
    schema: outputSchema,
  };
}
