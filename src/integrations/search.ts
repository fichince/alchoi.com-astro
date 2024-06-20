import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { getAllBlogEntries } from '../utils';
import Fuse from 'fuse.js';

async function buildIndex() {
  const blogEntries = await getAllBlogEntries();
  const index = Fuse.createIndex([ 'title', 'description', 'content' ], blogEntries);
  return index;
}

export default function search(): AstroIntegration {
  return {
    name: 'search',
    hooks: {
      'astro:server:start': async ({ logger }) => {
        logger.info('Building search index - dev');
        const index = await buildIndex();
      },
      'astro:build:done': async ({ dir, logger }) => {
        logger.info('Building search index');
        const index = await buildIndex();
        const outFile = fileURLToPath(new URL('./search-index.json', dir));
        await writeFile(outFile, JSON.stringify(index));
      }
    },
  };
}