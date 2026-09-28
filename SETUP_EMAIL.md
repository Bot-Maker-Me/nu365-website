# Email Setup Instructions

To enable automatic email sending for inquiries and support requests, you need to set up Resend email service.

## Steps to Configure:

1. **Get a Resend API Key**
   - Go to https://resend.com/
   - Sign up for a free account
   - Navigate to API Keys section
   - Create a new API key
   - Copy the API key

2. **Add the API Key to Environment Variables**
   - Open your `.env` file in the project root
   - Add the following line:
     ```
     RESEND_API_KEY=your_actual_api_key_here
     ```
   - Replace `your_actual_api_key_here` with your actual Resend API key

3. **Test the Setup**
   - Start your development server
   - Test the inquiry form on the website
   - Check if emails are being sent to hnayel@yahoo.com

## Notes:

- The system currently uses Resend's free tier with `onboarding@resend.dev` as the sender
- No domain verification needed for the free tier
- All emails will be sent to hnayel@yahoo.com automatically
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
