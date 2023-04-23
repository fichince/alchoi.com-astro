import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const get = (async (context) => {
  const blog = await getCollection('blog');
  const items = blog.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.description,
    link: `/blog/${post.slug}`,
  }));

  return rss({
    title: `Albert Choi's blog`,
    description: 'I write code and sometimes prose.',
    site: context.site?.toString() ?? 'https://alchoi.com',
    items,
  });
}) satisfies APIRoute;