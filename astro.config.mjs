import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://alchoi.com',
  output: 'hybrid',
  integrations: [svelte(), tailwind(), mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: true
    }
  },
  adapter: vercel()
});