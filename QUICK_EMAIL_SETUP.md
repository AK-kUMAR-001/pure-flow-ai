# Email Service - Quick Start Guide ⚡

## What's Been Done ✅

Your water filtration app now has a complete email notification system:

- ✅ **Order Confirmation Emails** - Sent to customer after payment
- ✅ **Owner Notifications** - New orders sent to akshayprabhu19012005@gmail.com
- ✅ **Booking Confirmations** - Ready to send to customers
- ✅ **Professional HTML Templates** - Beautiful, branded emails with order details
- ✅ **Supabase Cloud Function** - Backend ready to send emails

## What You Need to Do (5 Minutes) ⏱️

### Step 1: Choose Email Provider

**Option A: Gmail** (Free, Good for Testing)
- Go to myaccount.google.com
- Enable 2-Factor Authentication
- Create "App Password" for Gmail
- Copy the 16-character password

**Option B: SendGrid** (Free Tier, 1000 emails/month, Production-Ready)
- Go to sendgrid.com
- Create free account
- Generate API key
- Verify sender email

### Step 2: Set Supabase Secrets

**Using PowerShell (Windows):**
```powershell
# Option A: Gmail
supabase secrets set SMTP_HOSTNAME="smtp.gmail.com"
supabase secrets set SMTP_PORT="587"
supabase secrets set SMTP_USERNAME="your-email@gmail.com"
supabase secrets set SMTP_PASSWORD="xxxx xxxx xxxx xxxx"
supabase secrets set SMTP_FROM_EMAIL="akshayprabhu19012005@gmail.com"

# OR Option B: SendGrid
supabase secrets set SENDGRID_API_KEY="SG.xxxxx..."
supabase secrets set SENDGRID_FROM_EMAIL="akshayprabhu19012005@gmail.com"
```

**Or use the automated setup script:**
```powershell
./setup-email.ps1
```

### Step 3: Deploy Supabase Function

```bash
supabase functions deploy send-email
```

### Step 4: Test It!

1. Start your app: `npm run dev`
2. Complete a payment (QR or UPI)
3. Check your email for order confirmation
4. Check akshayprabhu19012005@gmail.com for owner notification

## Files Created

| File | Purpose | Status |
|------|---------|--------|
| `/supabase/functions/send-email/index.ts` | Email sending backend | Ready to deploy |
| `/src/services/emailService.ts` | Frontend email handler | ✅ Integrated |
| `/src/services/emailTemplates.ts` | HTML email templates | ✅ Ready |
| `/src/components/PaymentGateway.tsx` | Order email integration | ✅ Integrated |
| `EMAIL_SERVICE_SETUP.md` | Detailed setup guide | Complete |
| `setup-email.ps1` | Automated setup script | Ready |

## Current Integration Points

### ✅ Order Payments
- QR code payment → Sends order confirmation email
- UPI payment → Sends order confirmation email
- Both user and owner receive emails

### 🔄 Bookings (Ready to integrate)
- HomeTest.tsx needs booking email integration
- Function `sendBookingConfirmationEmails()` ready to use

## Email Recipients

| Type | User Email | Owner Email |
|------|-----------|------------|
| Orders | From userData.email | akshayprabhu19012005@gmail.com |
| Bookings | From userData.email | akshayprabhu19012005@gmail.com |

## What Each Email Contains

### Order Confirmation (User)
```
Subject: Order Confirmation #AQ-ORD-123456
- ✓ Payment Received
- Order details (ID, amount, method)
- Processing timeline (24-48 hours)
- Shipping info
- Contact: 8925081899
```

### Order Notification (Owner)
```
Subject: New Order Received #AQ-ORD-123456
- Customer name & email
- Order details
- Payment status
- Action checklist:
  - Verify payment
  - Pick & pack
  - Generate tracking
```

### Booking Confirmation (User)
```
Subject: Booking Confirmed #AQ-BOOK-123456
- Booking ID & date
- Test timeline (15-20 minutes)
- What to expect
- Important instructions
- Contact: 8925081899
```

### Booking Notification (Owner)
```
Subject: New Booking #AQ-BOOK-123456
- Customer details
- Booking date & time
- Action checklist:
  - Confirm availability
  - Prepare equipment
  - Schedule team
  - Call customer 24h before
```

## Troubleshooting

### "Function not found" / "Email not sent"
1. Check if function is deployed: `supabase functions list`
2. Check logs: `supabase functions logs send-email`
3. Verify secrets are set: `supabase secrets list`
4. Redeploy: `supabase functions deploy send-email`

### "SMTP connection error"
- Check credentials are correct
- Verify Gmail/SendGrid account is active
- Ensure App Password is correct (16 characters with spaces)
- For Gmail: Check 2-FA is enabled

### "Email not arriving"
- Check spam folder
- Verify recipient email is correct
- Check email provider logs (Gmail/SendGrid dashboard)
- Try sending test email manually

### "Permission denied" when running script
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Next: Add Booking Email Integration

Once order emails work, add booking confirmation in `HomeTest.tsx`:

```typescript
import { sendBookingConfirmationEmails } from "@/services/emailService";

// After booking is created
await sendBookingConfirmationEmails(
  userEmail,
  userName,
  "akshayprabhu19012005@gmail.com",
  {
    bookingId: "AQ-BOOK-" + bookingId,
    bookingDate: selectedDate,
    bookingTime: selectedTime,
  }
);
```

## Production Checklist

- [ ] Email provider chosen and configured
- [ ] Supabase secrets set
- [ ] Function deployed successfully
- [ ] Test order email received (user)
- [ ] Test order email received (owner)
- [ ] Test booking email (optional)
- [ ] Monitor logs for errors
- [ ] Set up alerts (optional)

## Important Contact Info

- **Owner Email**: akshayprabhu19012005@gmail.com
- **Owner Phone**: 8925081899
- **Payment**: ₹1,000 per product
- **QR Label**: "Akshay GPay owner"

## Still Have Questions?

1. Read `EMAIL_SERVICE_SETUP.md` for detailed instructions
2. Check Supabase dashboard for function status and logs
3. Test with cURL to diagnose issues

## Quick Test Command

```bash
curl -X POST https://[PROJECT].supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "html": "<h1>Test Email</h1>"
  }'
```

---

**Status**: Frontend complete ✅ | Backend function ready ✅ | Awaiting email provider setup ⏳

Once you set up the email provider and deploy the function, emails will start sending automatically on every payment!
