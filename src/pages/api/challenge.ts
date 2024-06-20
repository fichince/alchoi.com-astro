export const prerender = false;

import type { APIRoute } from 'astro';
import { createChallenge } from 'altcha-lib';

export const GET : APIRoute = async () => {
  const challenge = await createChallenge({
    hmacKey: import.meta.env.HMAC_SECRET,
  });
  return new Response(JSON.stringify(challenge));
}