import 'dotenv/config';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';
import _ from 'lodash';
import slugify from '@sindresorhus/slugify';
import { stringify } from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const f1 = await readFile(path.resolve(__dirname, 'quoteshelf-directus-out.json'), { encoding: 'utf-8' });
const f2 = await readFile(path.resolve(__dirname, 'quotes-directus-out.json'), { encoding: 'utf-8' });
const quoteshelf = JSON.parse(f1);
const quotes = JSON.parse(f2);

const quotesMap = new Map(quotes.map(quote => [quote.id, quote]));

const imagesFile = await readFile(path.resolve(__dirname, 'directus-images-quoteshelf.json'), { encoding: 'utf-8' });
const images = JSON.parse(imagesFile);
const imageMap = new Map(images.map(img => [img.id, img]));

const outputDir = path.resolve(__dirname, '../src/data/ks-quoteshelf');

console.log(`Processing ${quoteshelf.length} books...`);

for (const book of quoteshelf) {
  const { quotes: quoteIds, cover, title, ...rest } = _.omit(book, ['date_created', 'id']);

  const slug = slugify(title);
  console.log(`\nProcessing book: ${title} (${slug})`);

  const quotes = quoteIds.map(id => quotesMap.get(id).quote);

  const frontmatter = _.pickBy({ title, ...rest, quotes }, _.identity);
  const imagePath = path.resolve(__dirname, `../src/assets/images/ks-quoteshelf/${slug}`);
  await mkdir(imagePath, { recursive: true });

  if (cover) {
    const coverImage = imageMap.get(cover);
    let filename = null;
    if (coverImage.filename_download == 'content') {
      const extension = coverImage.type.split('/')[1];
      filename = `${slug}.${extension}`;
    } else {
      filename = coverImage.filename_download;
    }
    frontmatter.cover = `@assets/images/ks-quoteshelf/${slug}/${filename}`;

    //const imageURL = `https://cms.alchoi.cloud/assets/${cover}`;

    //console.log(`  Downloading featured image: ${filename}`);
    // Download and save the featured image
    //const response = await fetch(imageURL);
    //const buffer = await response.arrayBuffer();
    //const imageFile = path.resolve(imagePath, filename);
    //await writeFile(imageFile, Buffer.from(buffer));
  }

  const output = stringify(frontmatter);
  const outputFile = path.resolve(outputDir, `${slug}.yaml`);

  console.log(`  Writing: ${slug}.yaml`);
  await writeFile(outputFile, output, { encoding: 'utf-8' });
}

console.log(`\nDone! Processed ${quoteshelf.length} books.`);


