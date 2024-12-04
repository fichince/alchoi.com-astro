import type { LoaderContext, Loader } from 'astro/loaders';
import { z } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { parse } from 'yaml';

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
    coverId: z.string().optional(),
  });

  return {
    name: 'quoteshelfLoader',
    load,
    schema,
  };
}
