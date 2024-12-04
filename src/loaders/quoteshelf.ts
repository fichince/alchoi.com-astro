import type { LoaderContext, Loader } from 'astro/loaders';
import { getImage } from 'astro:assets';
import { z } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { parse } from 'yaml';
import qs from 'query-string';

export default function quoteshelfLoader(options: { base: string }): Loader {

  async function load(context: LoaderContext) {
    const { logger, store, parseData } = context;
    logger.info('Running the quoteshelf loader');

    const dir = await readdir(options.base);

    for (let file of dir) {
      if (file.endsWith('.yaml')) {
        const fileContent = await readFile(`${options.base}/${file}`, 'utf8');
        const id = basename(file, '.yaml');
        logger.info('Parsing data for ' + id);
        const data = parse(fileContent);

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
            const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
            console.log('here', getImage);
            const image = await getImage({ src: coverUrl, formats: ['webp'], inferSize: true });
            data.coverUrl = image.src;
          }

        } catch (e) {
          console.log('error', e);
          logger.warn(`Error fetching cover for ${data.title} - ${e}`);
        }

        const parsed = await parseData({ id, data });

        store.set({
          id,
          data: parsed
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
