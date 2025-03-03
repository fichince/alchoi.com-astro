import { type CollectionEntry, getCollection } from 'astro:content';
import union from 'lodash/union';
import countBy  from 'lodash/countBy';
import { DateTime } from 'luxon';
export const PAGE_SIZE = 10;

export function enrichCapsuleEntry(entry : CollectionEntry<'capsules'>)
  : CollectionEntry<'capsules'> {

  const { type } = entry.data;
  const tags = ['quick reviews', ...(entry.data.tags ?? [])];
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
    case 'music':
      tags.push('music');
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

export async function getCMSBlogEntries(): Promise<CollectionEntry<'cmsBlog'>[]> {
  const collection = await getCollection('cmsBlog');
  const published = collection.filter((post) => {
    return !post.data.draft;
  });

  return published;
}

export function shortDate(d : string) : string {
  return DateTime
    .fromISO(d)
    .toUTC()
    .toLocaleString(DateTime.DATE_SHORT);
}

export function mediumDate(d : string) : string {
  return DateTime
    .fromISO(d)
    .toUTC()
    .toLocaleString(DateTime.DATE_MED);
}

export function getLinkToPost(post? : BlogCollectionEntry | CapsuleCollectionEntry) : string {
  if (!post) return '';
  const path = post.collection === 'blog' ? '/blog' : '/quick-reviews';
  const link = `${path}/${post.id}`;
  return link;
}

export async function getAllBlogTags(): Promise<Record<string, number>> {
  const collection = await getCMSBlogEntries();
  const allTags = collection.reduce<string[]>((memo, post) => {
    return memo.concat(post.data.tags ?? []);
  }, []);

  return countBy(allTags);
}
