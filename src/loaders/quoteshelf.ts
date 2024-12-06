import type { LoaderContext, Loader } from 'astro/loaders';
import { z } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { parse } from 'yaml';
import qs from 'query-string';

export default function quoteshelfLoader(options: { base: string }): Loader {

  async function load(context: LoaderContext) {
    const { logger, store, parseData, generateDigest } = context;
    logger.info('Running the quoteshelf loader');

    const dir = await readdir(options.base);

    for (let file of dir) {
      if (file.endsWith('.yaml')) {
        const fileContent = await readFile(`${options.base}/${file}`, 'utf8');
        const id = basename(file, '.yaml');
        logger.info('Loading quotes for ' + id);
        const data = parse(fileContent);

        const digest = generateDigest(data);
        const existing = store.get(id);

        if (digest === existing?.digest) {
          logger.info('Reusing cached data for ' + id);
          continue;
        }

        try {
          const url = qs.stringifyUrl({
            url: 'https://openlibrary.org/search.json',
            query: {
              author: data.author,
              q: data.title,
            }
          });

          const response = await fetch(url);
          const info = await response.json();

          const coverId = info.docs[0]?.cover_i || null;

          if (coverId) {
            data.coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
          }

        } catch (e) {
          logger.warn(`Error fetching cover for ${data.title} - ${e}`);
        }

        const parsed = await parseData({ id, data });

        store.set({
          id,
          data: parsed,
          digest
        });
      }
    }
  }

  const schema = z.object({
    title: z.string(),
    author: z.string(),
    quotes: z.string().array(),
    coverUrl: z.string().optional(),
  });

  return {
    name: 'quoteshelfLoader',
    load,
    schema,
  };
}
