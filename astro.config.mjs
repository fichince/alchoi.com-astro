import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://alchoi.com',
  integrations: [
    svelte(), 
    tailwind(), 
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    }), 
    mdx(), 
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: true
    }
  },
  compressHTML: true,
});