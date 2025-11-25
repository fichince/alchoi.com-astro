import 'dotenv/config';
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';
import _ from 'lodash';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const f = await readFile(path.resolve(__dirname, 'posts-directus-out.json'), { encoding: 'utf-8' });
const posts = JSON.parse(f);

const imagesFile = await readFile(path.resolve(__dirname, 'directus-images.json'), { encoding: 'utf-8' });
const images = JSON.parse(imagesFile);
const imageMap = new Map(images.map(img => [img.id, img.filename_download]));

const outputDir = path.resolve(__dirname, '../src/data/ks-blog');

console.log(`Processing ${posts.length} posts...`);

for (const post of posts) {
  const { content, image, slug, ...rest } = post;

  console.log(`\nProcessing post: ${slug}`);

  const frontmatter = _.pickBy(rest, _.identity);
  const imagePath = path.resolve(__dirname, `../src/assets/images/ks-blog/${slug}`);
  await mkdir(imagePath, { recursive: true });

  if (image) {
    frontmatter.image = `@assets/images/ks-blog/${slug}/${image.filename_download}`;

    const imageURL = `https://cms.alchoi.cloud/assets/${image.id}`;

    console.log(`  Downloading featured image: ${image.filename_download}`);
    // Download and save the featured image
    const response = await fetch(imageURL);
    const buffer = await response.arrayBuffer();
    const imageFile = path.resolve(imagePath, image.filename_download);
    await writeFile(imageFile, Buffer.from(buffer));
  }

  // Process inline images in content
  let processedContent = content;
  const imageRegex = /https:\/\/cms\.alchoi\.cloud\/assets\/([a-f0-9-]+)/g;
  const matches = [...content.matchAll(imageRegex)];

  if (matches.length > 0) {
    console.log(`  Found ${matches.length} inline image(s)`);
  }

  for (const match of matches) {
    const imageId = match[1];
    const filename = imageMap.get(imageId);

    if (filename) {
      console.log(`    Downloading inline image: ${filename}`);
      // Download the inline image
      const inlineImageURL = match[0];
      const response = await fetch(inlineImageURL);
      const buffer = await response.arrayBuffer();
      const imageFile = path.resolve(imagePath, filename);
      await writeFile(imageFile, Buffer.from(buffer));

      // Replace URL with local reference
      processedContent = processedContent.replace(inlineImageURL, `@assets/images/ks-blog/${slug}/${filename}`);
    }
  }

  const output = matter.stringify(processedContent, frontmatter);
  const outputFile = path.resolve(outputDir, `${slug}.md`);

  console.log(`  Writing: ${slug}.md`);
  await writeFile(outputFile, output, { encoding: 'utf-8' });
}

console.log(`\nDone! Processed ${posts.length} posts.`);


