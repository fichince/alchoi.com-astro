import type { LoaderContext, Loader } from 'astro/loaders';
import { z } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import qs from 'query-string';
import slugify from '@sindresorhus/slugify';
import pickBy from 'lodash/pickBy';
import { addToIndex } from '@src/search-utils';

export default function quoteshelfLoader(options: {
  base: string,
  imageBase: string,
}): Loader {

  const inputSchema = z.object({
    title: z.string(),
    author: z.string(),
    sortName: z.string().optional(),
    quotes: z.string().array(),
    googleId: z.string().optional()
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

  /*
  async function fetchCover(title: string, author: string) : Promise<string> {
    const url = qs.stringifyUrl({
      url: 'https://openlibrary.org/search.json',
      query: {
        author: author,
        q: title,
      }
    });

    const response = await fetch(url);
    const info = await response.json();

    const coverId = info.docs[0]?.cover_i || null;

    if (coverId) {
      return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    } else {
      return null;
    }
  }

  async function fetchCover(title: string, author: string, logger: AstroIntegrationLogger) : Promise<string> {
    const url = qs.stringifyUrl({
      url: 'https://www.googleapis.com/books/v1/volumes',
      query: {
        key: import.meta.env.GOOGLE_BOOKS_API_KEY,
        q: `intitle:${title} inauthor:${author}`
      }
    });

    const response = await fetch(url);
    const info = await response.json();

    const coverUrl = info.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;

    if (coverUrl) {
      logger.info(`Found cover URL for ${title} - ${coverUrl}`);
    } else {
      logger.info(`Cover not found for ${title}`);
    }

    return coverUrl;
  }
  */

  function getCoverUrl(
    googleId : string,
    titleSlug : string,
    authorSlug : string,
    imageDir : string[],
  ) : string {

    // first, look for a local file with filename e.g. "neal-stephenson__snow-crash"
    // if we don't have one, then use the Google ID in the YAML to build a URL that fetches from Google books

    const filename = [authorSlug, titleSlug].join('__');
    const index = imageDir.findIndex((file) => file.startsWith(filename));

    if (index !== -1) {
      return imageDir[index];
    } else {
      const coverUrl = Boolean(googleId) ? qs.stringifyUrl({
        url:  'https://books.google.com/books/content',
        query: {
          id: googleId,
          printsec: 'frontcover',
          img: 1,
          zoom: 2,
        }
      }) : null;

      return coverUrl;
    }
  }

  async function load(context: LoaderContext) {
    const { logger, store, parseData } = context;
    store.clear();
    logger.info('Running the quoteshelf loader');

    const dir = await readdir(options.base);
    const imageDir = await readdir(options.imageBase);

    const searchIndexEntries : SearchIndexEntry[] = [];

    for (let file of dir) {
      if (!file.endsWith('.yaml')) continue;

      const fileContent = await readFile(`${options.base}/${file}`, 'utf8');

      const data = parse(fileContent) as InputData;

      inputSchema.parse(data);
      const { title, author, sortName, googleId, quotes } = data;
      const titleSlug = slugify(title);
      const authorSlug = slugify(author);

      const coverUrl = getCoverUrl(googleId, titleSlug, authorSlug, imageDir);

      logger.info('Loading quotes for ' + titleSlug);

      for (let i = 0; i < quotes.length; i++) {
        const q = quotes[i];

        const quote: OutputData = pickBy({
          title,
          titleSlug,
          author,
          authorSlug,
          sortName,
          quote: q,
          coverUrl,
        });

        const id = `${authorSlug}__${titleSlug}__${i}`;
        /*
        const digest = generateDigest(quote);
        const existing = store.get(id);

        if (digest === existing?.digest) {
          logger.info('Reusing cached data for ' + id);
          continue;
        }
        */

        const parsed = await parseData({ id, data: quote });
        store.set({
          id,
          data: parsed,
          //digest
        });

        searchIndexEntries.push({
          id,
          title: parsed.title,
          url: `/quoteshelf/${parsed.authorSlug}?book=${parsed.titleSlug}#${id}`,
          type: 'quote',
          author: parsed.author,
          quote: parsed.quote,
        });
      }

    }

    addToIndex(searchIndexEntries, logger);
  }

  return {
    name: 'quoteshelfLoader',
    load,
    schema: outputSchema,
  };
}
