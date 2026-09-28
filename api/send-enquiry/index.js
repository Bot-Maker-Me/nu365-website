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
    const { name, mobile, email, description } = req.body;

    // Validate required fields
    if (!name || !mobile || !email || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Log the enquiry
    console.log('Enquiry received:', {
      name,
      mobile,
      email,
      description,
      timestamp: new Date().toISOString(),
    });

    // Send email using Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'piyush80545@gmail.com',
      subject: `New Enquiry from ${name}`,
      html: `
        <h2>New Enquiry from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Enquiry:</strong></p>
        <p>${description}</p>
      `,
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Enquiry sent successfully' 
    });

  } catch (error) {
    console.error('Error sending enquiry:', error);
    return res.status(500).json({ 
      error: 'Failed to send enquiry' 
    });
  }
}
