import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import isString from 'lodash/isString';
import { fileURLToPath } from 'node:url';
import { writeFile, readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
//import { getAllBlogEntries } from '../utils';
//import { getCollection } from 'astro:content';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { put } from '@vercel/blob';
import 'dotenv/config';

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
  const srcDir = await readdir(`./src/content/${dir}`);

  const result = [];

  for (let file of srcDir) {
    if (file.endsWith('.md')) {
      const fileContent = await readFile(`./src/content/${dir}/${file}`, 'utf8');
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
  /*
  const index = Fuse.createIndex([ 
    { name: 'title', weight: 2 }, 
    { name: 'description', weight: 2 }, 
    { name: 'content', weight: 1 } 
  ], entries);
  */

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
      'astro:server:start': async ({ logger }) => {
        logger.info('Building search index - dev');
        /*
        const { index, entries } = await buildIndex(logger);

        await writeFile('./.search/search-index.json', JSON.stringify(index));
        await writeFile('./.search/search-entries.json', JSON.stringify(entries));
        */

        const index = await buildIndex(logger);
        await writeFile('./.search/search-index.json', index);
      },
      'astro:build:done': async (stuff) => {

        const { logger, dir } = stuff;
        logger.info('Building search index');

        /*
        const { index, entries } = await buildIndex(logger);
        const indexOut = fileURLToPath(new URL('./search-index.json', dir));
        await writeFile(indexOut, JSON.stringify(index));
        const entriesOut = fileURLToPath(new URL('./search-entries.json', dir));
        await writeFile(entriesOut, JSON.stringify(entries));
        */

        const index = await buildIndex(logger);

        /*
        const indexOut = fileURLToPath(new URL('./search-index.json', dir));
        await writeFile(indexOut, index);
        */

        const resp = await put('search-index.json', index, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        console.log('saved search-index.json to blob', resp);
      }
    },
  };
}