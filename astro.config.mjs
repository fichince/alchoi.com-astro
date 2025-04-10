import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";
import search from './src/integrations/search.ts';
//import Sonda from 'sonda/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://alchoi.com',
  output: 'static',
  integrations: [
    svelte(),
    tailwind(),
    mdx(),
    sitemap(),
    search(),
    /*
    Sonda({
      open: false,
      server: true,
    })
    */
  ],
  image: {
    domains: [
      'covers.openlibrary.org',
      'books.google.com',
      'cms.alchoi.dev',
      'cms.alchoi.cloud',
    ],
  },
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: true
    }
  },
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    build: {
      sourcemap: false
    }
  },
});
