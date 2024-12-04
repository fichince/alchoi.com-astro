import type { LoaderContext, Loader } from 'astro/loaders';
import { z } from 'astro:content';

export default function quoteshelfLoader(): Loader {

  async function load(context: LoaderContext) {
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
