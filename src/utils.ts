import { type CollectionEntry, getCollection } from 'astro:content';
import padStart from 'lodash/padStart';
import countBy  from 'lodash/countBy';
import sortBy from 'lodash/sortBy';
import reverse from 'lodash/reverse';
import { DateTime } from 'luxon';
export const PAGE_SIZE = 10;

export async function getCMSBlogEntries(): Promise<CollectionEntry<'cmsBlog'>[]> {
  const collection = await getCollection('cmsBlog');

  const includeDrafts = import.meta.env.DEV;

  const published = !includeDrafts ?
    collection.filter((post) => {
      return !post.data.draft;
    })
    : collection;

  return reverse(sortBy(published, post => post.data.date));
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

export function getLinkToPost(post : CollectionEntry<'cmsBlog'>) : string {
  return getLinkToPostWithDate(post.data.date, post.id);
}

export function getLinkToPostWithDate(d : Date, id : string) : string {
  const date = DateTime.fromJSDate(d);
  const year = date.year;
  const month = padStart(`${date.month}`, 2, '0');

  const link = `/blog/${year}/${month}/${id}`;
  return link;
}

export async function getAllBlogTags(): Promise<Record<string, number>> {
  const collection = await getCMSBlogEntries();
  const allTags = collection.reduce<string[]>((memo, post) => {
    return memo.concat(post.data.tags ?? []);
  }, []);

  return countBy(allTags);
}
