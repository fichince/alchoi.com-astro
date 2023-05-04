import rss from '@astrojs/rss';
import { getAllBlogEntries } from '@src/utils';
import type { APIRoute } from 'astro';

export const get = (async (context) => {
  const blog = await getAllBlogEntries();
  const items = blog.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.description,
    // TODO maybe this link will be different for capsule reviews
    link: `/blog/${post.slug}`,
  }));

  return rss({
    title: `Albert Choi's blog`,
    description: 'I write code and sometimes prose.',
    site: context.site?.toString() ?? 'https://alchoi.com',
    items,
  });
}) satisfies APIRoute;