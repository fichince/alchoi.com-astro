import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: 'https://alchoi.com',
  integrations: [
    svelte(), 
    tailwind(), 
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    }), 
    mdx()
  ],
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: true
    }
  }
});