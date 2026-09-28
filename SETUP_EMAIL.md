# Email Setup Instructions

To enable automatic email sending for inquiries and support requests, you need to set up Resend email service.

## Steps to Configure:

1. **Get Resend API Keys (Multiple for Fallback)**
   - Go to https://resend.com/
   - Sign up for multiple free accounts (you can use different email addresses)
   - For each account, navigate to API Keys section
   - Create a new API key
   - Copy all the API keys

2. **Add the API Keys to Environment Variables**
   - Open your `.env` file in the project root
   - Add the following lines:
     ```
     # Multiple API keys (comma-separated) - will try each one if previous fails
     RESEND_API_KEYS=key1,key2,key3
     
     # Single API key (fallback if RESEND_API_KEYS not set)
     RESEND_API_KEY=your_primary_api_key
     
     # Recipient email for all inquiries
     RECIPIENT_EMAIL=your_email@example.com
     ```
   - Replace the keys with your actual Resend API keys
   - Replace recipient email with your desired email

3. **Test the Setup**
   - Start your development server
   - Test the inquiry form on the website
   - Check if emails are being sent to your recipient email

## How Multiple API Keys Work:

- The system tries each API key in order
- If one key hits its daily/monthly limit, it automatically tries the next one
- This effectively multiplies your free tier limits
- Example: 3 free accounts = 9,000 emails/month instead of 3,000

## Notes:

- The system currently uses Resend's free tier with `onboarding@resend.dev` as the sender
- No domain verification needed for the free tier
- All emails will be sent to the RECIPIENT_EMAIL automatically
- If you want to use your own domain later (like noreply@thenu365.ca), you can add domain verification in Resend dashboard

## Current Configuration:

- **Recipient Email**: hnayel@yahoo.com
- **Sender Email**: noreply@thenu365.ca (can be changed in API files)
- **API Endpoints**:
  - `/api/send-enquiry` - For general inquiry form
  - `/api/send-inquiry` - For product-specific inquiries

## Files Modified:

1. `api/send-enquiry/index.js` - General inquiry email sending
2. `api/send-inquiry/index.js` - Product inquiry email sending (new)
3. `src/pages/ProductDetailPage.tsx` - Updated to use API instead of mailto
4. `package.json` - Added resend dependency

## Notes:

- The enquiry form fallback to mailto still exists if the API fails
- The footer contact link still uses mailto for direct email access
- Product inquiry now sends automatically without opening email client
