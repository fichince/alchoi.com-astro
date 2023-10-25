import { type CollectionEntry, getCollection } from 'astro:content';
import isString from 'lodash/isString';
import { DateTime } from 'luxon';
import { remark } from 'remark';
import strip from 'strip-markdown';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';

export const PAGE_SIZE = 10;

export function stripMarkdown(s? : string) : string {
  if (!s) return '';
  if (!isString(s)) return s;
  return remark().use(strip).processSync(s).toString().trim();
}

export function enrichCapsuleEntry(entry : CollectionEntry<'capsules'>) 
  : CollectionEntry<'capsules'> {

  const { type } = entry.data;
  const tags = ['quick reviews'];
  switch (type) {
    case 'book':
      tags.push('books');
      break;
    case 'movie':
      tags.push('movies');
      break;
    case 'tv':
      tags.push('tv');
      break;
    case 'game':
      tags.push('games');
      break;
  }

  return {
    ...entry,
    data: {
      ...entry.data,
      tags
    }
  }
}

export async function getAllBlogEntries() : Promise<BlogEntry[]> {

  const [ blog, capsules ] = await Promise.all([
    getCollection('blog'),
    getCollection('capsules'),
  ]);

  const published = [...blog, ...capsules].filter((post) => {
    return !post.data.draft;
  });

  const entries : BlogEntry[] = published.map((entry) => {
    if (entry.collection === 'capsules') {
      return enrichCapsuleEntry(entry);
    } else {
      return entry;
    }
  });

  return entries.sort((a, b) => {
    const dateA = a.data.end ?? a.data.date;
    const dateB = b.data.end ?? b.data.date;
    return dateB.valueOf() - dateA.valueOf()
  });
}

export function shortDate(d : Date) : string {
  return DateTime
    .fromJSDate(d)
    .toUTC()
    .toLocaleString(DateTime.DATE_SHORT);
}

export function mediumDate(d : Date) : string {
  return DateTime
    .fromJSDate(d)
    .toUTC()
    .toLocaleString(DateTime.DATE_MED);
}

export function getLinkToPost(post? : BlogCollectionEntry | CapsuleCollectionEntry) : string {
  if (!post) return '';
  const path = post.collection === 'blog' ? '/blog' : '/quick-reviews';
  const link = `${path}/${post.slug}`;
  return link;
}

export function renderMarkdown(md : string) : string {
  const html = 
    remark()
      .use(remarkGfm)
      .use(remarkSmartypants)
      .use(remarkHtml, { sanitize: false })
      .processSync(md.trim())
      .toString();

  return html;
}