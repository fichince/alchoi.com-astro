import { stripMarkdown } from '@src/utils';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import mapValues from 'lodash/mapValues';

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