export const prerender = false;

import type { APIRoute } from 'astro';

import sgMail from '@sendgrid/mail';
sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY);

export const POST : APIRoute = async ({ request, redirect }) => {
  const body = await request.formData();

  // TODO validate input

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
  return redirect('/');
}