# Resend Email Setup Guide

This guide will help you set up Resend for sending OTP emails in your MedMate application.

## Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Click "Get Started" or "Sign Up"
3. Create your account (you can use GitHub, Google, or email)
4. Verify your email address

## Step 2: Get Your API Key

1. After signing up, you'll be redirected to the Resend dashboard
2. Click on "API Keys" in the sidebar
3. Click "Create API Key"
4. Give it a name like "MedMate OTP"
5. Copy the API key (it starts with `re_`)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in your `client` directory
2. Add your Resend API key:

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_your_api_key_here

# Other required variables
MONGODB_URI=mongodb://localhost:27017/medmate
JWT_SECRET=your-super-secret-jwt-key
```

## Step 4: Test the Setup

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Go to your application and try the login flow
3. Enter your details and click "Send OTP"
4. Check your email for the OTP

## Step 5: Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain:

1. In the Resend dashboard, go to "Domains"
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the DNS setup instructions
5. Once verified, update the `from` email in `src/lib/email.ts`:

```typescript
from: 'MedMate <noreply@yourdomain.com>',
```

## Troubleshooting

### Email Not Sending

- Check that your `RESEND_API_KEY` is correct
- Verify the API key is active in the Resend dashboard
- Check the console logs for any error messages

### OTP Not Received

- Check your spam folder
- Verify the email address you entered
- Check the Resend dashboard for delivery status

### API Key Issues

- Make sure the API key starts with `re_`
- Ensure the API key is not expired
- Check that you have sufficient credits (Resend gives 3,000 free emails/month)

## Resend Features

- **High Deliverability**: 99%+ delivery rate
- **Free Tier**: 3,000 emails/month free
- **Analytics**: Track email opens, clicks, and bounces
- **Webhooks**: Get real-time delivery notifications
- **Templates**: Create reusable email templates
- **Multiple Domains**: Send from multiple verified domains

## Production Considerations

1. **Domain Verification**: Verify your domain for better deliverability
2. **Webhooks**: Set up webhooks to track email events
3. **Rate Limiting**: Implement rate limiting for OTP requests
4. **Monitoring**: Monitor email delivery rates and bounces
5. **Templates**: Create professional email templates

## Support

- Resend Documentation: [docs.resend.com](https://docs.resend.com)
- Resend Support: [resend.com/support](https://resend.com/support)
- Community: [discord.gg/resend](https://discord.gg/resend)
