export const prerender = false;

import type { APIRoute } from 'astro';
import { verifySolution } from 'altcha-lib';
import { HMAC_SECRET, SENDGRID_API_KEY, CONTACT_EMAIL } from 'astro:env/server';

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(SENDGRID_API_KEY);

export const POST : APIRoute = async ({ request, redirect }) => {
  const body = await request.formData();

  const payload = body.get('altcha') ?? '';
  const name = body.get('name');
  const email = body.get('email');
  const message = body.get('message');
  const ok = await verifySolution(payload as string, HMAC_SECRET);

  if (!ok || !name || !email || !message) {
    return redirect('/contact?success=false');
  }

  const msg = {
    to: CONTACT_EMAIL,
    from: CONTACT_EMAIL,
    subject: `New message from ${body.get('name')} [${body.get('email')}]`,
    text: `${body.get('message')}`,
  };

  try {
    const response = await sgMail.send(msg);
    console.log('Sent', response);
  } catch (e) {
    console.log('Error sending', e);
  }

  console.log('POST contact', body);

  return redirect('/contact?success=true');
}
