// Vercel serverless function: POST /api/enquiry
// Emails a website enquiry (general form or "inquire about product") to the owner via Resend.
//
// Environment variables (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   required
//   RECIPIENT_EMAIL  required — where enquiries are delivered
//   FROM_EMAIL       optional — a sender on a domain verified in Resend
//                    (defaults to Resend's test sender, which can only deliver to the Resend account owner)
import { Resend } from 'resend';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTH = 5000;

// User input goes into an HTML email, so escape it.
const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, mobile, email, message, product, website } = req.body ?? {};

  // Honeypot: real visitors never fill this field, so pretend success and drop the message.
  if (website) return res.status(200).json({ success: true });

  if (!email || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }
  if ([name, mobile, email, message, product].some((v) => String(v ?? '').length > MAX_LENGTH)) {
    return res.status(400).json({ error: 'Message is too long.' });
  }

  const { RESEND_API_KEY, RECIPIENT_EMAIL, FROM_EMAIL = 'onboarding@resend.dev' } = process.env;
  if (!RESEND_API_KEY || !RECIPIENT_EMAIL) {
    console.error('Missing RESEND_API_KEY or RECIPIENT_EMAIL');
    return res.status(500).json({ error: 'Email is not configured on the server.' });
  }

  // Only show the rows the visitor actually filled in.
  const rows = [
    ['Product', product],
    ['Name', name],
    ['Mobile', mobile],
    ['Email', email],
    ['Message', message],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
    .join('');

  try {
    const { error } = await new Resend(RESEND_API_KEY).emails.send({
      from: FROM_EMAIL,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: product ? `Product inquiry: ${product}` : `New enquiry from ${name || email}`,
      html: `<h2>${product ? 'Product inquiry' : 'New enquiry'} from the website</h2>${rows}`,
    });
    if (error) throw new Error(error.message);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to send enquiry:', error);
    return res.status(500).json({ error: 'Failed to send your message. Please try again later.' });
  }
}
