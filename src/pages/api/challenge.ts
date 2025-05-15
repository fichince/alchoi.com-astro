export const prerender = false;

import type { APIRoute } from 'astro';
import { createChallenge } from 'altcha-lib';
import { HMAC_SECRET } from 'astro:env/server';

export const GET : APIRoute = async () => {
  const challenge = await createChallenge({
    hmacKey: HMAC_SECRET
  });
  return new Response(JSON.stringify(challenge));
}
