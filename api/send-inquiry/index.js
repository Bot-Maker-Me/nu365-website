import { Resend } from 'resend';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productName, userEmail, userMessage } = req.body;

    // Validate required fields
    if (!productName || !userEmail) {
      return res.status(400).json({ error: 'Product name and email are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Log the inquiry
    console.log('Product inquiry received:', {
      productName,
      userEmail,
      userMessage,
      timestamp: new Date().toISOString(),
    });

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'piyush80545@gmail.com',
      subject: `Product Inquiry: ${productName}`,
      html: `
        <h2>Product Inquiry from Website</h2>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Customer Email:</strong> ${userEmail}</p>
        ${userMessage ? `<p><strong>Message:</strong></p><p>${userMessage}</p>` : ''}
        <p><em>Please provide pricing and availability information for this product.</em></p>
      `,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Inquiry sent successfully' 
    });

  } catch (error) {
    console.error('Error sending inquiry:', error);
    return res.status(500).json({ 
      error: 'Failed to send inquiry' 
    });
  }
}
