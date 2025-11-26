import { glob } from 'astro/loaders';
import type { Loader, LoaderContext } from 'astro/loaders';

interface CustomGlobOptions {
  pattern: string | string[];
  base: string;
  // Hook that runs after all entries are loaded
  onLoad?: (context: Pick<LoaderContext, 'store' | 'logger'>) => Promise<void>;
}

export function customGlob(options: CustomGlobOptions): Loader {
  const { pattern, base, onLoad } = options;

  // Create the base glob loader
  const globLoader = glob({ pattern, base });

  // Return a wrapped loader
  return {
    name: `custom-glob-loader`,
    load: async (context) => {
      const { store, logger } = context;

      // First, run the original glob loader
      await globLoader.load(context);

      // Run custom onLoad hook if provided
      if (onLoad) {
        await onLoad({ store, logger });
      }
    },
    schema: globLoader.schema,
  };
}
