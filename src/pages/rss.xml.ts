import rss from '@astrojs/rss';
import { getCMSBlogEntries, getLinkToPost } from '@src/utils';
import { stripMarkdown, renderMarkdown } from '@src/markdown';
import type { APIRoute } from 'astro';

export const GET = (async (context) => {
  const blog = await getCMSBlogEntries();
  const items = blog.map((post) => {
    return {
      title: stripMarkdown(post.data.title),
      pubDate: post.data.date,
      description: (post.data.author ?? '') + stripMarkdown(post.data.description ?? ''),
      link: getLinkToPost(post),
      content: renderMarkdown(post.body),
    };
  });

  return rss({
    title: `Albert Choi's blog`,
    description: 'I write code and sometimes prose.',
    site: context.site?.toString() ?? 'https://alchoi.com',
    items,
  });
}) satisfies APIRoute;
