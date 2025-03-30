import 'dotenv/config';
import {
  createDirectus,
  staticToken,
  rest,
  readFolders,
  readFiles,
  uploadFiles,
  readItems,
  deleteFile,
  deleteFiles,
  deleteItems,
} from '@directus/sdk';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';
import { DateTime }  from 'luxon';
import ky from 'ky';
import qs from 'query-string';
import { parse } from 'yaml';
import slugify from '@sindresorhus/slugify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FOLDER_ID = '2e03b745-002f-42ce-8574-7ef6f0db2fcd';

const client =
  createDirectus(process.env.DIRECTUS_URL)
    .with(staticToken(process.env.DIRECTUS_TOKEN))
    .with(rest());

const kyClient = ky.create({
  prefixUrl: process.env.DIRECTUS_URL,
  headers: {
    'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`
  },
  timeout: 30000,
  throwHttpErrors: false
});

const quoteshelfDir = path.resolve(__dirname, '../src/data/quoteshelf');
const imageDir = path.resolve(__dirname, '../src/images/quoteshelf');
const imageList = await readdir(imageDir);

async function createCoverImage(googleId, titleSlug, authorSlug, title, author) {
  const filename = [authorSlug, titleSlug].join('__');
  const index = imageList.findIndex((file) => file.startsWith(filename));

  if (index !== -1) {
    const buffer = await readFile(path.resolve(imageDir, imageList[index]));

    const formData = new FormData();
    formData.append('folder', FOLDER_ID);
    formData.append('storage', 'tigris');
    formData.append('type', 'image/jpeg');
    formData.append('title', `${title} - ${author}`);
    formData.append('file', new Blob([buffer], { type: 'image/jpeg' }), imageList[index]);

    const response = await kyClient.post('files', {
      body: formData,
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.log('Failed to upload image', title, author, JSON.stringify(responseBody));
      return null;
    }

    const { data: { id } } = responseBody;
    return id;
  } else if (googleId) {

    const response = await kyClient.post('files/import', {
      json: {
        url: qs.stringifyUrl({
          url: 'https://books.google.com/books/content',
          query: {
            id: googleId,
            printsec: 'frontcover',
            img: 1,
            zoom: 2,
          }
        }),
        data: {
          folder: FOLDER_ID,
          storage: 'tigris',
          title: `${title} - ${author}`,
        }
      },
    });

    const responseBody = await response.json();

    if (!response.ok) {
      console.log('Failed to import image', title, author, JSON.stringify(responseBody));
      return null;
    }

    const { data: { id } } = responseBody;
    return id;
  } else {
    return null;
  }
}

// cleanup first
const coverImages = await client.request(readFiles({
  limit: -1,
  filter: {
    folder: {
      "_eq": FOLDER_ID
    }
  }
}));
const books = await client.request(readItems('quoteshelf', {
  limit: -1,
}));
const quotes = await client.request(readItems('quotes', {
  limit: -1,
}));
console.log('coverImages', coverImages.length);
console.log('books', books.length);
console.log('quotes', quotes.length);
const fileIds = coverImages.map(({ id }) => id);
const bookIds = books.map(({ id }) => id);
const quoteIds = quotes.map(({ id }) => id);

console.log('fileIds', fileIds);
console.log('bookIds', bookIds);
console.log('quoteIds', quoteIds);

let response;
if (fileIds.length > 0) {
  response = await client.request(deleteFiles(fileIds));
  console.log('deleted files', response);
}

if (bookIds.length > 0) {
  response = await client.request(deleteItems('quoteshelf', bookIds));
  console.log('deleted books', response);
}

if (quoteIds.length > 0) {
  response = await client.request(deleteItems('quotes', quoteIds));
  console.log('deleted quotes', response);
}

const files = await readdir(quoteshelfDir);
for (const file of files) {
  if (!file.endsWith('.yaml')) continue;

  const contents = await readFile(path.resolve(quoteshelfDir, file), { encoding: 'utf-8' });
  const data = parse(contents);

  const { title, author, sortName, googleId, quotes } = data;
  const titleSlug = slugify(title);
  const authorSlug = slugify(author);

  const cover = await createCoverImage(googleId, titleSlug, authorSlug, title, author);
  console.log('Cover for ', title, cover);

  let response;
  let responseBody;

  response = await kyClient.post('items/quoteshelf', {
    json: {
      title,
      author,
      sortName,
      cover,
    }
  });

  responseBody = await response.json();

  if (!response.ok) {
    console.log('Failed to create book', title, author, JSON.stringify(responseBody));
    continue;
  }

  console.log('Created', title, author);

  const { data: { id: quoteshelfId } } = responseBody;

  const quoteBody = quotes.map((quote) => {
    return {
      quote,
      book: quoteshelfId,
    };
  });

  response = await kyClient.post('items/quotes', {
    json: quoteBody
  });

  responseBody = await response.json();

  if (!response.ok) {
    console.log('Failed to upload quotes for', title, author, JSON.stringify(responseBody));
    continue;
  }

  console.log('Created quotes', title, author);

}
