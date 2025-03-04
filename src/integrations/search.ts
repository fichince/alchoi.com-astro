import type { AstroIntegration, AstroIntegrationLogger } from 'astro';
import isString from 'lodash/isString';
import { readdir, readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { Client } from '@opensearch-project/opensearch';
import { parse } from 'yaml';
import slugify from '@sindresorhus/slugify';

import 'dotenv/config';

function stripMarkdown(s? : string) : string {
  if (!s) return '';
  if (!isString(s)) return s;
  return remark().use(strip).processSync(s).toString().trim();
}

function declutter(s : string) : string {
  return s.replace(/letterboxd link/, '').replace(/storygraph link/, '').trim();
}

async function readBlogContents(dir : string) : Promise<any> {

  const srcDir = await readdir(`./src/data/${dir}`);

  const result = [];

  for (let file of srcDir) {
    if (file.endsWith('.md')) {
      const fileContent = await readFile(`./src/data/${dir}/${file}`, 'utf8');
      const { data, content: body } = matter(fileContent);

      if (data.draft) continue;

      const title = stripMarkdown(data.title);
      const description = stripMarkdown(data.description);
      const content = declutter(stripMarkdown(body));

      const slug = basename(file, '.md');
      const urlPath = dir === 'blog' ? '/blog' : '/quick-reviews';

      result.push({
        title,
        description,
        content,
        id: slug,
        url: `${urlPath}/${slug}`,
        type: 'blog',
      });
    }
  }

  return result;

}

async function readQuoteshelfContents(): Promise<any> {

  const srcDir = await readdir('./src/data/quoteshelf');
  const result = [];

  // I don't like that I have to repeat a lot of the same work as
  // the quoteshelf loader, but unfortunately, you can't access the content
  // collection APIs from here.
  for (let file of srcDir) {
    if (file.endsWith('.yaml')) {
      const fileContent = await readFile(`./src/data/quoteshelf/${file}`, 'utf8');
      const data = parse(fileContent);

      const { title, author, quotes } = data;
      const authorSlug = slugify(author);
      const titleSlug = slugify(title);

      quotes.forEach((quote : string, index : number) => {
        const id = `${authorSlug}__${titleSlug}__${index}`;
        result.push({
          id,
          url: `/quoteshelf/${authorSlug}?book=${titleSlug}#${id}`,
          title,
          author,
          quote,
          type: 'quote',
        });
      });
    }
  }

  return result;
}

async function buildIndex(logger: AstroIntegrationLogger, client: Client) {

  try {

    const indexName = `alchoi-blog-${import.meta.env.DEV ? 'development' : 'production'}`;
    const { body: exists } = await client.indices.exists({ index: indexName });
    if (exists) {
      await client.indices.delete({ index: indexName });
    }

    // // TODO use directus API
    // const blog = await readBlogContents('blog');
    // const capsules = await readBlogContents('capsules');

    // const quoteshelf = await readQuoteshelfContents();

    // logger.info(`Indexing ${blog.length + capsules.length} blog entries and ${quoteshelf.length} quotes`);

    // const body = [...blog, ...capsules, ...quoteshelf].reduce((memo, entry) => {
    //   const { id, ...rest } = entry;
    //   const command = {
    //     create: { _id: id }
    //   };

    //   return [...memo, command, rest];
    // }, []);

    // const result = await client.bulk({
    //   index: indexName,
    //   body
    // });

    // logger.info(`Successfully saved OpenSearch index [${indexName}] in ${result.body.took} ms`);

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

      'astro:config:setup': async ({ logger }) => {
        logger.info('Clearing search index');
        await buildIndex(logger, client);
      },

      // for the development environment
      // 'astro:server:start': async ({ logger }) => {
      //   logger.info('Building search index - dev');
      //   await buildIndex(logger, client);
      // },

      // // when doing a production build
      // 'astro:build:done': async ({ logger }) => {
      //   logger.info('Building search index');
      //   await buildIndex(logger, client);
      // }
    },
  };
}
