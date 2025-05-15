import { defineConfig, envField } from 'astro/config';
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
  env: {
    schema: {
      // these are environment variables that are required at runtime

      // used for altcha challenge, can be any randomly generated string
      HMAC_SECRET: envField.string({
        optional: false,
        context: 'server',
        access: 'secret',
      }),

      // API key for sending emails via sendgrid
      SENDGRID_API_KEY: envField.string({
        optional: false,
        context: 'server',
        access: 'secret',
      }),

      // my e-mail address, used in contact form
      CONTACT_EMAIL: envField.string({
        optional: false,
        context: 'server',
        access: 'secret',
      }),

      // additionally, the following environment variables are
      // needed at build-time, and accessed via import.meta.env or process.env
      // - OPENSEARCH_API
      // - DIRECTUS_URL
      // - DIRECTUS_TOKEN
    }
  }
});
