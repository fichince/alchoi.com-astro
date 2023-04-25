import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import mapValues from 'lodash/mapValues';
import isString from 'lodash/isString';
import { remark } from 'remark';
import strip from 'strip-markdown';

function stripMarkdown(s : string) : string {
  if (!s) return '';
  if (!isString(s)) return s;
  return remark().use(strip).processSync(s).toString().trim();
}

export const get = (async (context) => {
  const posts = await getCollection('blog');

  const index = posts.map((post) => {
    return mapValues({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      content: post.body,
    }, stripMarkdown);
  });

  return {
    body: JSON.stringify(index)
  };
}) satisfies APIRoute;