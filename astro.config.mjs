import { defineConfig } from 'astro/config';

import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: 'https://alchoi.com',
  integrations: [
    svelte(), 
    tailwind(), 
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    })
  ],
  markdown: {
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: true,
    }
  }
});