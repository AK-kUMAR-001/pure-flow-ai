# Email Service Setup Guide

## Overview

Your water filtration system now has a complete email notification system that:
- ✅ Sends order confirmation emails to customers
- ✅ Sends order notifications to owner (Akshay)
- ✅ Sends booking confirmation emails to customers
- ✅ Sends booking notifications to owner

## Frontend Integration (COMPLETE ✅)

The following files have been created and integrated:

### 1. Email Service (`/src/services/emailService.ts`)
- Handles all email sending logic
- Exports functions:
  - `sendOrderConfirmationEmails()` - Sends order confirmation
  - `sendBookingConfirmationEmails()` - Sends booking confirmation
- Calls Supabase Cloud Function: `POST /functions/v1/send-email`

### 2. Email Templates (`/src/services/emailTemplates.ts`)
- 4 professional HTML email templates:
  1. **Order Confirmation (User)** - "✓ Order Confirmed!"
  2. **Order Notification (Owner)** - "📦 New Order Received"
  3. **Booking Confirmation (User)** - "✓ Booking Confirmed!"
  4. **Booking Notification (Owner)** - "📅 New Booking Received"

### 3. Payment Gateway Integration (`/src/components/PaymentGateway.tsx`)
- Sends order confirmation emails after successful payment
- Sends to both user and owner
- QR code branded as "Akshay GPay owner"

## Backend Setup (REQUIRED - Choose One Option)

### Option A: Gmail + Nodemailer (Recommended for Quick Testing)

1. **Enable Gmail App Password:**
   ```
   1. Go to myaccount.google.com
   2. Enable 2-Factor Authentication
   3. Go to App passwords
   4. Select Mail > Windows Computer
   5. Copy the generated 16-character password
   ```

2. **Add to your Supabase Secrets:**
   ```bash
   supabase secrets set SMTP_HOSTNAME="smtp.gmail.com"
   supabase secrets set SMTP_PORT="587"
   supabase secrets set SMTP_USERNAME="your-email@gmail.com"
   supabase secrets set SMTP_PASSWORD="xxxx xxxx xxxx xxxx"  # 16-char app password
   supabase secrets set SMTP_FROM_EMAIL="akshayprabhu19012005@gmail.com"
   ```

3. **Test locally:**
   ```bash
   supabase functions serve
   ```

### Option B: SendGrid (Recommended for Production)

1. **Create SendGrid Account:**
   - Go to sendgrid.com
   - Sign up for free account (1000 free emails/month)
   - Create API key

2. **Verify Sender Email:**
   - In SendGrid dashboard, verify: akshayprabhu19012005@gmail.com
   - Follow verification email from SendGrid

3. **Add to Supabase Secrets:**
   ```bash
   supabase secrets set SENDGRID_API_KEY="SG.xxxxx..."
   supabase secrets set SENDGRID_FROM_EMAIL="akshayprabhu19012005@gmail.com"
   ```

4. **Update `/supabase/functions/send-email/index.ts`:**
   Replace the current implementation with SendGrid version (see below)

### Option C: Resend.dev (Modern Alternative)

1. **Create Resend Account:**
   - Go to resend.com
   - Create account and get API key

2. **Add to Supabase Secrets:**
   ```bash
   supabase secrets set RESEND_API_KEY="re_xxxxx..."
   ```

3. **Update function to use Resend**

## Deploy to Supabase

1. **Push to Supabase:**
   ```bash
   supabase functions deploy send-email
   ```

2. **Verify Deployment:**
   - Go to Supabase Dashboard
   - Functions > send-email
   - Should show "Active"

3. **Get Function URL:**
   ```
   https://your-project-ref.supabase.co/functions/v1/send-email
   ```

## Update Frontend Endpoint

The frontend email service (`/src/services/emailService.ts`) needs to call your Supabase function.

**Current configuration (should work automatically):**
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const endpoint = `${SUPABASE_URL}/functions/v1/send-email`;
```

## Test Email Sending

### Manual Test (Using cURL):
```bash
curl -X POST https://your-project.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1>"
  }'
```

### Automatic Test (Through Payment):
1. Go to your app at localhost:8081
2. Click "Buy Now" on any product
3. Complete payment with QR or UPI
4. Check email for order confirmation

### What to Check:
- ✅ User receives order confirmation email
- ✅ Owner (akshayprabhu19012005@gmail.com) receives notification
- ✅ Emails have proper formatting
- ✅ Order details are correct
- ✅ Contact info (8925081899) is visible

## Email Recipients

### Order Payments:
- **User Email**: From userData.email or localStorage
- **Owner Email**: akshayprabhu19012005@gmail.com
- **Template**: Order Confirmation + Order Notification

### Bookings:
- **User Email**: From userData.email or localStorage
- **Owner Email**: akshayprabhu19012005@gmail.com
- **Template**: Booking Confirmation + Booking Notification

## Environment Variables Needed

```env
# Gmail/SMTP
SMTP_HOSTNAME=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM_EMAIL=akshayprabhu19012005@gmail.com

# OR SendGrid
SENDGRID_API_KEY=SG.xxxxx...
SENDGRID_FROM_EMAIL=akshayprabhu19012005@gmail.com
```

## Troubleshooting

### "Email service not configured"
- Check that environment variables are set in Supabase
- Verify secrets with: `supabase secrets list`
- Redeploy function: `supabase functions deploy send-email`

### "Failed to send email"
- Check email logs: `supabase functions logs send-email`
- Verify sender email is verified in Gmail/SendGrid
- Check recipient email address is valid

### "CORS error"
- Function includes CORS headers
- If issue persists, check Supabase CORS settings

### Emails not arriving
- Check spam folder
- Verify sender email domain reputation
- Check Gmail/SendGrid logs
- Try test email first

## Alternative: SendGrid Implementation

If you prefer SendGrid, replace the function content with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  try {
    const { to, subject, html }: EmailRequest = await req.json();

    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const apiKey = Deno.env.get("SENDGRID_API_KEY");
    const fromEmail = Deno.env.get("SENDGRID_FROM_EMAIL");

    if (!apiKey || !fromEmail) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500 }
      );
    }

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: fromEmail },
        subject: subject,
        content: [{ type: "text/html", value: html }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
});
```

## Next Steps

1. ✅ **Choose Email Provider** (Gmail, SendGrid, or Resend)
2. ✅ **Set Up Credentials** (Add environment variables to Supabase)
3. ✅ **Deploy Function** (`supabase functions deploy send-email`)
4. ✅ **Test Email Sending** (Complete a payment and check email)
5. ✅ **Add Booking Emails** (Integrate booking confirmation in HomeTest.tsx)

## Production Checklist

- [ ] Email provider set up and verified
- [ ] Environment variables configured in Supabase
- [ ] Function deployed and tested
- [ ] Order confirmation emails working
- [ ] Owner notifications received
- [ ] Test both user and owner email addresses
- [ ] Verify email formatting on different clients
- [ ] Add booking email integration
- [ ] Monitor email logs for failures
- [ ] Set up email delivery alerts (optional)

## Support

For issues:
1. Check Supabase function logs
2. Verify environment variables
3. Test with curl command above
4. Check email provider dashboard for delivery failures
