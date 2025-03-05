import rss from '@astrojs/rss';
import { getCMSBlogEntries, getLinkToPost } from '@src/utils';
import { stripMarkdown, renderMarkdown } from '@src/markdown';
import type { APIRoute } from 'astro';
import { DateTime } from 'luxon';

export const GET = (async (context) => {
  const blog = await getCMSBlogEntries();
  const items = blog.map((post) => {
    return {
      title: stripMarkdown(post.data.title),
      pubDate: DateTime.fromISO(post.data.date).toJSDate(),
      description: (post.data.author ?? '') + stripMarkdown(post.data.description ?? ''),
      link: getLinkToPost(post),
      content: renderMarkdown(post.data.content),
    };
  });

  return rss({
    title: `Albert Choi's blog`,
    description: 'I write code and sometimes prose.',
    site: context.site?.toString() ?? 'https://alchoi.com',
    items,
  });
}) satisfies APIRoute;
