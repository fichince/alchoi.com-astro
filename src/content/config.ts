import { z, defineCollection } from 'astro:content';

const prose = defineCollection({
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    description: z.string(),
    image: z.string(),
  })
});

export const collections = {
  prose,
};