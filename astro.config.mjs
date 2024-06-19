import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
//import search from './src/integrations/search.ts';

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