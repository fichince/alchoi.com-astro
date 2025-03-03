import 'dotenv/config';
import {
  createDirectus,
  staticToken,
  rest,
  readFolders,
  readFiles
} from '@directus/sdk';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';
import { DateTime }  from 'luxon';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client =
  createDirectus(process.env.DIRECTUS_URL)
    .with(staticToken(process.env.DIRECTUS_TOKEN))
    .with(rest());

// first, create a mapping of image names with their IDs
const folders = await client.request(readFolders());
const folderMap = new Map();

folders.forEach((folder) => {
  folderMap.set(folder.id, folder);
});

let images = [];

for (const folder of folders) {
  const imagesInFolder = await client.request(readFiles({
    limit: -1,
    filter: {
      folder: {
        _eq: folder.id,
      }
    }
  }));

  images = images.concat(imagesInFolder);
}

const imageMap = new Map();

function buildPath(folderId) {
  const folder = folderMap.get(folderId);
  const { parent, name } = folder;
  if (parent) {
    return [buildPath(parent), name].join('/');
  } else {
    return name;
  }
}

for (const image of images) {
  const { id, filename_download: filename, folder } = image;
  const path = buildPath(folder);

  imageMap.set([ path, filename ].join('/'), id);
}

function findImageId(imagePath) {
  const relativePath = path.relative('../../images', imagePath);
  if (!imageMap.has(relativePath)) {
    console.log('image not found', imagePath);
    process.exit();
  }
  return imageMap.get(relativePath);
}

console.log('imageMap', imageMap);

// read the blog posts

let result = [];
const slugs = new Set();

const blogDir = path.resolve(__dirname, '../src/data/blog');
const blogFiles = await readdir(blogDir);

for (const file of blogFiles) {
  if (!file.endsWith('.md')) continue;

  const contents = await readFile(path.resolve(blogDir, file), { encoding: 'utf-8' });
  const { data, content } = matter(contents);

  let imageId = null;
  if (data.image) {
    imageId = findImageId(data.image);
  }

  const segments = path.basename(file, '.md').split('-');
  segments.splice(0, 3);
  const slug = segments.join('-');
  console.log('slug', slug);

  if (slugs.has(slug)) {
    console.log('slug already exists', slug);
    process.exit();
  }

  slugs.add(slug);

  result.push({
    draft: false,
    ...data,
    slug,
    image: imageId,
    date: DateTime.fromJSDate(data.date).toISODate(),
    content: content.trim(),
    end: null,
    author: null,
    rating: null,
  });
}

const capsulesDir = path.resolve(__dirname, '../src/data/capsules');
const capsulesFiles = await readdir(capsulesDir);

for (const file of capsulesFiles) {
  if (!file.endsWith('.md')) continue;

  const contents = await readFile(path.resolve(capsulesDir, file), { encoding: 'utf-8' });
  const { data, content } = matter(contents);

  let imageId = null;
  if (data.image) {
    imageId = findImageId(data.image);
  }

  const tags = [...(data.tags ?? [])];
  switch (data.type) {
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

  const slug = path.basename(file, '.md');

  if (slugs.has(slug)) {
    console.log('slug already exists', slug);
    process.exit();
  }

  slugs.add(slug);

  result.push({
    draft: false,
    ...data,
    tags,
    slug,
    image: imageId,
    date: DateTime.fromJSDate(data.date).toISODate(),
    end: data.end ? DateTime.fromJSDate(data.end).toISODate() : null,
    content: content.trim(),
  });
}

// find inline images and replace the URL
result = result.map((post) => {

  let content = post.content;
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  let match;
  while ((match = imageRegex.exec(content)) !== null) {
    const imagePath = match[1];
    const imageId = findImageId(imagePath);
    const newImageMarkup = `![](https://cms.alchoi.dev/assets/${imageId})`;
    console.log(`replace ${match[0]} with ${newImageMarkup}`);
    content = content.replace(match[0], newImageMarkup);
  }

  return {
    ...post,
    content,
  };
});

await writeFile('posts.json', JSON.stringify(result, null, 2));
