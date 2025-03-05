import 'dotenv/config';
import {
  createDirectus,
  staticToken,
  rest,
  readItems,
  updateItem,
} from '@directus/sdk';
import { DateTime } from 'luxon';
import padStart from 'lodash/padStart.js';

const client =
  createDirectus(process.env.DIRECTUS_URL)
    .with(staticToken(process.env.DIRECTUS_TOKEN))
    .with(rest());

const posts = await client.request(readItems('posts', {
  limit: -1
}));

// create a map of post slugs to URL paths
const postMap = new Map();
posts.forEach((post) => {
  const date = DateTime.fromISO(post.date);
  const year = date.year;
  const month = padStart(new String(date.month), 2, '0');
  const url = `/blog/${year}/${month}/${post.slug}`;

  postMap.set(post.slug, url);
});

//console.log('postMap', postMap);

const prefixes = ['/blog', '/quick-reviews'];

for (const post of posts) {
  const content = post.content;
  // NOTE: this regex doesn't match everything that I wanted it to
  // but it was easier to just clean things up manually
  const linkRegex = /\((.*)\)/g;

  const matches = content.matchAll(linkRegex);
  const mArray = Array.from(matches);
  if (mArray.length === 0) continue;

  let hasMatch = false;
  console.log('matches', mArray);

  const substitutions = [];

  for (const match of mArray) {
    let matched = match[1];
    if (matched.startsWith('..')) matched = matched.substring(2);

    const isLink = prefixes.some((prefix) => matched.startsWith(prefix));
    if (!isLink) continue;

    if (matched.startsWith('/blog/tag')) continue;
    if (matched.split('/').length > 2) continue;

    hasMatch = true;

    let slug = '';
    if (matched.startsWith('/quick-reviews')) {
      slug = matched.substring(15);
    } else if (matched.startsWith('/blog')) {
      slug = matched.substring(17);
    }

    if (!postMap.has(slug)) {
      console.log('no match', slug);
      process.exit();
    }

    substitutions.push([matched, postMap.get(slug)]);
  }

  if (hasMatch) {
    console.log('---', post.slug);
    console.log('substitutions', substitutions);

    let updated = content;
    substitutions.forEach(([matched, replacement]) => {
      updated = updated.replaceAll(matched, replacement);
    });

    // const req = updateItem('posts', post.slug, {
    //   content: updated,
    // });
    // const response = await client.request(req);

    // console.log('response', response);
  }
}
