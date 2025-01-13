import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import isString from 'lodash/isString';
import { readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { Client } from '@opensearch-project/opensearch';

import 'dotenv/config';

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
        slug,
        url: `${urlPath}/${slug}`,
      });
    }
  }

  return result;

}

async function buildIndex(logger: AstroIntegrationLogger, client: Client) {

  try {
    const blog = await readDirectoryContents('blog');
    const capsules = await readDirectoryContents('capsules');

    const indexName = `alchoi-blog-${import.meta.env.DEV ? 'development' : 'production'}`;

    const { body: exists } = await client.indices.exists({ index: indexName });
    if (exists) {
      await client.indices.delete({ index: indexName });
    }

    const entries = [...blog, ...capsules].map((entry) => {
      return {
        id: entry.slug,
        url: entry.url,
        title: entry.title,
        description: entry.description,
        content: entry.content,
      };
    });
    logger.info(`Indexing ${entries.length} entries`);

    const body = entries.reduce((memo, entry) => {
      const { id, ...rest } = entry;
      const command = {
        create: { _id: id }
      };

      return [...memo, command, rest];
    }, []);


    const result = await client.bulk({
      index: indexName,
      body
    });

    logger.info(`Successfully saved OpenSearch index [${indexName}]`);

  } catch (e) {
    logger.error('Failed to build search index ' + e);
  }
}


export default function search(): AstroIntegration {

  const client = new Client({
    node: process.env.OPENSEARCH_API
  });

  return {
    name: 'search',
    hooks: {

      // for the development environment
      'astro:server:start': async ({ logger }) => {
        logger.info('Building search index - dev');
        await buildIndex(logger, client);
      },

      // when doing a production build
      'astro:build:done': async ({ logger }) => {
        logger.info('Building search index');
        await buildIndex(logger, client);
      }
    },
  };
}
