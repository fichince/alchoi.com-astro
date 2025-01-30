import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import search from './src/integrations/search.ts';
import tailwindcss from "@tailwindcss/vite"
//import Sonda from 'sonda/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://alchoi.com',
  output: 'static',
  integrations: [
    svelte(),
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
    ],
  },
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: true
    }
  },
  adapter: vercel({
  }),
  vite: {
    plugins: [ tailwindcss() ],
    build: {
      sourcemap: false
    }
  },
});
