import type { LoaderContext, Loader } from 'astro/loaders';
import { z } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import * as crypto from 'node:crypto';
import { parse } from 'yaml';
import qs from 'query-string';
import slugify from '@sindresorhus/slugify';
import pickBy from 'lodash/pickBy';

export default function quoteshelfLoader(options: { base: string }): Loader {

  const inputSchema = z.object({
    title: z.string(),
    author: z.string(),
    sortName: z.string().optional(),
    quotes: z.string().array(),
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
  type OutputData = z.infer<typeof outputSchema>

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

  async function load(context: LoaderContext) {
    const { logger, store, parseData, generateDigest } = context;
    logger.info('Running the quoteshelf loader');

    const dir = await readdir(options.base);

    for (let file of dir) {
      if (file.endsWith('.yaml')) {
        const fileContent = await readFile(`${options.base}/${file}`, 'utf8');
        const id = basename(file, '.yaml');
        logger.info('Loading quotes for ' + id);

        const data = parse(fileContent) as InputData;

        inputSchema.parse(data);
        const { title, author, sortName, quotes } = data;

        let coverUrl = null;
        try {
          //coverUrl = await fetchCover(title, author);
        } catch (e) {
          logger.warn(`Failed to fetch cover for ${title} - ${e}`);
        }

        for (let q of quotes) {
          const quote: OutputData = pickBy({
            title,
            titleSlug: slugify(title),
            author,
            authorSlug: slugify(author),
            sortName,
            coverUrl,
            quote: q
          });

          const id = crypto.hash('sha-1', q, 'hex');
          const digest = generateDigest(quote);
          const existing = store.get(id);

          if (digest === existing?.digest) {
            logger.info('Reusing cached data for ' + id);
            continue;
          }

          const parsed = await parseData({ id, data: quote });
          store.set({
            id,
            data: parsed,
            digest
          });
        }
      }
    }
  }

  return {
    name: 'quoteshelfLoader',
    load,
    schema: outputSchema,
  };
}
