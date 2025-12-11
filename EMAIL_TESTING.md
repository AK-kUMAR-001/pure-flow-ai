# Email Testing Guide

## Manual Email Test

Use this to test your email function without going through the app:

```bash
# Replace with your actual Supabase URL
curl -X POST https://your-project.supabase.co/functions/v1/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@gmail.com",
    "subject": "✓ Test Email from AquaAdapt",
    "html": "<h1>Hello!</h1><p>This is a test email from your water filtration app.</p>"
  }'
```

## Test Scenarios

### Scenario 1: Order Confirmation (User)
**Step 1**: Run test command above

**Step 2**: Verify email contains:
- Subject: "✓ Order Confirmed!"
- Order ID, Amount, Payment method
- "Processing within 24-48 hours"
- Contact number: 8925081899
- Professional formatting and logo

### Scenario 2: Full Payment Flow
1. Go to app: http://localhost:8081
2. Click "Buy Now" on any product
3. Complete payment with QR code
4. Check your email for order confirmation within 30 seconds
5. Check akshayprabhu19012005@gmail.com for owner notification

### Scenario 3: Check Supabase Logs
```bash
supabase functions logs send-email
```

You should see logs like:
```
Email sent successfully to: your-email@gmail.com
Email sent successfully to: akshayprabhu19012005@gmail.com
```

## Debug Checklist

- [ ] Supabase URL is correct
- [ ] Email address is valid
- [ ] SMTP credentials are set
- [ ] Function is deployed
- [ ] Check spam folder
- [ ] Check email provider logs (Gmail/SendGrid)
- [ ] Try different email address
- [ ] Check browser console for errors

## Gmail App Password Format

Gmail App Passwords are 16 characters with spaces:
```
xxxx xxxx xxxx xxxx
```

When setting in Supabase, include the spaces:
```powershell
supabase secrets set SMTP_PASSWORD="xxxx xxxx xxxx xxxx"
```

## Common Email Issues

| Issue | Solution |
|-------|----------|
| "Email not configured" | Run `supabase secrets list` - verify SMTP_* vars are set |
| "Connection refused" | Check SMTP credentials and port (587 for Gmail) |
| "Invalid sender" | Verify email address is in your Gmail/SendGrid account |
| "CORS error" | Function has CORS headers, check browser console |
| Email in spam | Add sender to contacts, check spam filter settings |
| "550 user unknown" | Recipient email address is invalid or bouncing |

## View Recent Logs

```bash
# Show last 100 lines of logs
supabase functions logs send-email

# Follow logs in real-time
supabase functions logs send-email --follow
```

## Reset and Redeploy

If something goes wrong:

```bash
# Clear old deployment
supabase functions delete send-email

# Redeploy
supabase functions deploy send-email
```

## Testing Both User and Owner Emails

When you complete a payment:
- Check your inbox for user confirmation
- Check akshayprabhu19012005@gmail.com for owner notification

Both should arrive within 1 minute.

## Email Provider Status Pages

Check if your email service is having issues:
- **Gmail**: https://www.google.com/appsstatus/dashboard
- **SendGrid**: https://status.sendgrid.com
- **Supabase**: https://status.supabase.com

## Next Steps

1. Complete the setup in `QUICK_EMAIL_SETUP.md`
2. Deploy the Supabase function
3. Run this manual test to verify it works
4. Complete a payment in the app
5. Monitor logs: `supabase functions logs send-email`

---

Once emails are working, every payment will automatically send confirmations! 🎉
