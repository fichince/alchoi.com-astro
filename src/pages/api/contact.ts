export const prerender = false;

import type { APIRoute } from 'astro';
import { verifySolution } from 'altcha-lib';

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

export const POST : APIRoute = async ({ request, redirect }) => {
  const body = await request.formData();

  const payload = body.get('altcha') ?? '';
  const name = body.get('name');
  const email = body.get('email');
  const message = body.get('message');
  const ok = await verifySolution(payload as string, import.meta.env.HMAC_SECRET);

  if (!ok || !name || !email || !message) {
    // TODO show an error message
    return redirect('/contact');
  }

  const msg = {
    to: import.meta.env.CONTACT_EMAIL,
    from: import.meta.env.CONTACT_EMAIL,
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

  // TODO how to show a "flash" message?
  return redirect('/contact');
}