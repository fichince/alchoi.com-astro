import type { APIRoute } from 'astro';

export const prerender = false;

export const GET : APIRoute = async ({ url }) => {
  const q = url.searchParams.get('q');
  console.log('got request', q);
  console.log('is prod', import.meta.env.PROD);
  return new Response();
};