import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import isString from 'lodash/isString';
import { writeFile, readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';
import 'dotenv/config';
import { createClient } from '@vercel/kv';

import MiniSearch from 'minisearch';

function stripMarkdown(s? : string) : string {
  if (!s) return '';
  if (!isString(s)) return s;
  return remark().use(strip).processSync(s).toString().trim();
}

function declutter(s : string) : string {
  return s.replace(/letterboxd link/, '').replace(/storygraph link/, '').trim();
}

async function readDirectoryContents(dir : string) : Promise<any> {

  const srcDir = await readdir(`./src/data/${dir}`);

  const result = [];

  for (let file of srcDir) {
    if (file.endsWith('.md')) {
      const fileContent = await readFile(`./src/data/${dir}/${file}`, 'utf8');
      const { data, content: body } = matter(fileContent);

      const title = stripMarkdown(data.title);
      const description = stripMarkdown(data.description);
      const content = declutter(stripMarkdown(body));

      const slug = basename(file, '.md');
      const urlPath = dir === 'blog' ? '/blog' : '/quick-reviews';

      result.push({
        title,
        description,
        content,
        url: `${urlPath}/${slug}`,
      });
    }
  }

  return result;

}

async function buildIndex(logger : AstroIntegrationLogger) {

  const blog = await readDirectoryContents('blog');
  const capsules = await readDirectoryContents('capsules');

  let id = 1;
  const entries = [...blog, ...capsules].map((entry) => {
    return {
      id: id++,
      url: entry.url,
      title: entry.title,
      description: entry.description,
      content: entry.content,
    };
  });
  logger.info(`Indexing ${entries.length} entries`);

  const miniSearch = new MiniSearch({
    fields: ['title', 'description', 'content'],
    storeFields: ['url', 'title', 'description', 'content'],
  });
  miniSearch.addAll(entries);

  return JSON.stringify(miniSearch);
}


export default function search(): AstroIntegration {
  return {
    name: 'search',
    hooks: {
      // for the development environment, store the search index
      // on the local file system
      'astro:server:start': async ({ logger }) => {
        logger.info('Building search index - dev');
        const index = await buildIndex(logger);
        await writeFile('./.search/search-index.json', index);
      },

      // when doing a production build, save the search index
      // in a Vercel KV store
      'astro:build:done': async (stuff) => {

        const { logger } = stuff;
        logger.info('Building search index');

        const index = await buildIndex(logger);

        const kv = createClient({
          url: process.env.KV_REST_API_URL,
          token: process.env.KV_REST_API_TOKEN,
        });

        await kv.set('search-index', JSON.parse(index));

      }
    },
  };
}
