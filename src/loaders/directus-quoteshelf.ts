import { createDirectus, readItems, rest, staticToken } from '@directus/sdk';
import slugify from '@sindresorhus/slugify';
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

    try {
      const quoteshelf = await client.request(readItems('quoteshelf', {
        limit: -1,
        fields: ['*', 'quotes.*']
      })) as Array<InputData>;

      console.log('quoteshelf', JSON.stringify(quoteshelf, null, 2));

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

      quotes.forEach(async (quote) => {
        const { id, ...rest } = quote;
        const parsed = await parseData({ id, data: rest });
        store.set({ id, data: parsed });

        // TODO - add to search index
      });


    } catch (e) {
      logger.error('Failed to load from directus ' + JSON.stringify(e, null, 2));
      throw e;
    }
  }

  return {
    name: 'directusQuoteshelfLoader',
    load,
  };
}
