export type Enquiry = {
  email: string;
  message?: string;
  name?: string;
  mobile?: string;
  /** Set when the enquiry is about a specific product. */
  product?: string;
  /** Honeypot — must stay empty. */
  website?: string;
};

/** Send an enquiry email through the `/api/enquiry` serverless function. Throws a readable Error on failure. */
export async function sendEnquiry(enquiry: Enquiry): Promise<void> {
  const res = await fetch('/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiry),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: '' }));
    throw new Error(error || 'Failed to send. Please try again.');
  }
}
