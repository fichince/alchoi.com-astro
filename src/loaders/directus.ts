import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';
import { createDirectus, staticToken, rest, readItems } from '@directus/sdk';
import { renderWithExcerpt } from '@src/markdown';

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
    end: z.string().date().nullable(),
    rating: z.number().nullable(),
    draft: z.boolean().nullable(),
  });

  const inputSchema = schema.extend({
    slug: z.string(),
  });

  type InputData = z.infer<typeof inputSchema>;

  async function load(context: LoaderContext) {
    const { logger, store, parseData } = context;

    const posts = await client.request(readItems('posts'));
    logger.info(`Loading ${posts.length} posts from Directus`);

    for (const post of posts) {

      const { slug: id, ...rest } = post as InputData;
      const parsed = await parseData({ id, data: rest });

      const { content, excerpt } = renderWithExcerpt(parsed.content);

      // TODO use digest for caching

      store.set({
        id,
        data: parsed,
        rendered: {
          html: content,
          metadata: {
            excerpt,
          },
        }
      });

    }
  }

  return {
    name: 'directusLoader',
    load,
    schema,
  };
}
