import { type CollectionEntry, getCollection } from 'astro:content';
import isString from 'lodash/isString';
import { remark } from 'remark';
import strip from 'strip-markdown';


export function stripMarkdown(s : string) : string {
  if (!s) return '';
  if (!isString(s)) return s;
  return remark().use(strip).processSync(s).toString().trim();
}

function enrichCapsuleEntry(entry : CollectionEntry<'capsules'>) : CapsuleEntry {
  const { type } = entry.data;
  const tags = ['quick-thoughts'];
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

  const date = entry.data.start;

  return {
    ...entry,
    data: {
      ...entry.data,
      date,
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

  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

