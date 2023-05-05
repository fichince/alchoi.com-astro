import { getAllBlogEntries, stripMarkdown } from '@src/utils';
import type { APIRoute } from 'astro';

export const get = (async (context) => {
  const posts = await getAllBlogEntries();

  const index = posts.map((post) => {

    const value : SearchIndexEntry = {
      slug: post.slug,
      title: stripMarkdown(post.data.title),
      content: stripMarkdown(post.body),
      description: (post.data.author ?? '') + stripMarkdown(post.data.description),
      collection: post.collection,
    };

    return value;
  });

  return {
    body: JSON.stringify(index)
  };
}) satisfies APIRoute;