import { type CollectionEntry, getCollection } from 'astro:content';
import { DateTime } from 'luxon';
export const PAGE_SIZE = 10;

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

  const published = blog.filter((post) => !post.data.draft);

  const entries : BlogEntry[] = [...published, ...capsules].map((entry) => {
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
