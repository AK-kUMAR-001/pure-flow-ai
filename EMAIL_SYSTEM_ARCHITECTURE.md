# Email System Architecture & Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User Completes Payment                                       │
│     ├─ Click "Complete Payment"                                  │
│     ├─ Select QR or UPI                                          │
│     └─ Payment processed → Order saved                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PAYMENT GATEWAY                             │
│                  (PaymentGateway.tsx)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. handleQRPayment() / handleUPIPayment()                       │
│     ├─ Extract user info (email, name)                           │
│     ├─ Store order to localStorage + Supabase                   │
│     └─ Call sendOrderConfirmationEmails()                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EMAIL SERVICE LAYER                           │
│               (emailService.ts)                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  sendOrderConfirmationEmails() receives:                         │
│  ├─ userEmail: "customer@gmail.com"                              │
│  ├─ userName: "Rahul Prabhu"                                     │
│  ├─ ownerEmail: "akshayprabhu19012005@gmail.com"                │
│  └─ orderData: { orderId, amount, paymentMethod, ... }          │
│                                                                   │
│  Service generates two emails:                                   │
│  ├─ USER EMAIL: orderConfirmationUserTemplate()                 │
│  │   └─ "✓ Order Confirmed!" + order details                    │
│  └─ OWNER EMAIL: orderConfirmationOwnerTemplate()               │
│      └─ "📦 New Order Received" + action checklist              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EMAIL TEMPLATES LAYER                          │
│              (emailTemplates.ts)                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Templates return HTML email with:                               │
│  ├─ Subject line                                                 │
│  ├─ HTML body (professional styling)                             │
│  └─ Order/Booking details                                        │
│                                                                   │
│  Available templates:                                            │
│  ├─ orderConfirmationUserTemplate()                              │
│  ├─ orderConfirmationOwnerTemplate()                             │
│  ├─ bookingConfirmationUserTemplate()                            │
│  └─ bookingConfirmationOwnerTemplate()                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD FUNCTION                       │
│          (supabase/functions/send-email/index.ts)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  POST /functions/v1/send-email                                   │
│  ├─ Receives: { to, subject, html }                              │
│  ├─ Reads SMTP secrets from Supabase                            │
│  ├─ Connects to email provider (Gmail/SendGrid)                 │
│  ├─ Sends email via SMTP/API                                     │
│  └─ Returns: { success, message }                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
         ┌─────────────────┐ ┌──────────────────┐
         │  EMAIL 1: USER  │ │ EMAIL 2: OWNER   │
         ├─────────────────┤ ├──────────────────┤
         │ To: customer    │ │ To: akshayprabhu │
         │ Subject: ✓      │ │ Subject: 📦      │
         │ Order confirmed │ │ New order        │
         └─────────────────┘ └──────────────────┘
         │                   │
         ▼                   ▼
    🪶 Gmail/SendGrid   🪶 Gmail/SendGrid
         │                   │
         ▼                   ▼
    ✓ Email Inbox        ✓ Owner Inbox
```

## Data Flow Example

### Step 1: Payment Completed
```
User clicks "Complete Payment" with ₹1,000 order
↓
PaymentGateway.tsx:handleQRPayment()
├─ userData = { email: "rahul@gmail.com", full_name: "Rahul Prabhu" }
├─ orderData = {
│    orderId: "AQ-ORD-20250101-001",
│    amount: 1000,
│    paymentMethod: "Google Pay QR",
│    transactionId: "TXN-20250101-001"
│  }
└─ Call: sendOrderConfirmationEmails(
    "rahul@gmail.com",
    "Rahul Prabhu",
    "akshayprabhu19012005@gmail.com",
    orderData
  )
```

### Step 2: Email Service Generates Templates
```
sendOrderConfirmationEmails() receives data
↓
Call emailTemplates.orderConfirmationUserTemplate()
├─ Inputs: order details, customer name, email
└─ Output: {
    subject: "✓ Order Confirmed",
    html: "<html>...order details...</html>"
  }
↓
Call emailTemplates.orderConfirmationOwnerTemplate()
├─ Inputs: order details, customer name, email
└─ Output: {
    subject: "📦 New Order Received",
    html: "<html>...customer details...</html>"
  }
```

### Step 3: Emails Sent via Supabase Function
```
Email 1:
  POST /functions/v1/send-email
  {
    "to": "rahul@gmail.com",
    "subject": "✓ Order Confirmed",
    "html": "...HTML email content..."
  }
  ↓
  Supabase Function connects to SMTP
  ↓
  Sends via Gmail/SendGrid
  ↓
  ✓ Delivered to rahul@gmail.com

Email 2:
  POST /functions/v1/send-email
  {
    "to": "akshayprabhu19012005@gmail.com",
    "subject": "📦 New Order Received",
    "html": "...HTML email content..."
  }
  ↓
  Supabase Function connects to SMTP
  ↓
  Sends via Gmail/SendGrid
  ↓
  ✓ Delivered to akshayprabhu19012005@gmail.com
```

## Email Types & Recipients

```
ORDER PAYMENT
├─ Email 1: USER (rahul@gmail.com)
│  ├─ Subject: "✓ Order Confirmed"
│  ├─ Contains: Order ID, ₹1,000, Payment method
│  ├─ Timeline: "Processing 24-48 hours"
│  └─ Contact: 8925081899
│
└─ Email 2: OWNER (akshayprabhu19012005@gmail.com)
   ├─ Subject: "📦 New Order Received"
   ├─ Contains: Customer name, email, order details
   ├─ Actions: Verify payment, pick & pack, tracking
   └─ Status: Alert owner to process order

BOOKING
├─ Email 1: USER (rahul@gmail.com)
│  ├─ Subject: "✓ Booking Confirmed"
│  ├─ Contains: Booking ID, Date, Time
│  ├─ Details: 15-20 min test, expert consultation
│  └─ Instructions: Prepare water sample, ensure someone home
│
└─ Email 2: OWNER (akshayprabhu19012005@gmail.com)
   ├─ Subject: "📅 New Booking Received"
   ├─ Contains: Customer details, booking date/time
   ├─ Actions: Confirm availability, schedule team, call 24h before
   └─ Status: Alert owner to confirm booking
```

## Technology Stack

```
FRONTEND
├─ React 18.3.1 (TypeScript)
├─ emailService.ts (custom service)
├─ emailTemplates.ts (HTML templates)
├─ PaymentGateway.tsx (integration point)
└─ Uses fetch() to call Supabase function

BACKEND
├─ Supabase Cloud Functions (Deno runtime)
├─ send-email/index.ts (email handler)
└─ SMTP client (nodemailer via Deno)

EMAIL PROVIDER
├─ Gmail SMTP (via credentials)
├─ SendGrid API (alternative)
└─ Custom SMTP (any provider)

DATABASE
├─ localStorage (user data, orders)
├─ Supabase PostgreSQL (orders, bookings)
└─ Supabase Secrets (SMTP credentials)
```

## Configuration Flow

```
Setup Process:
1. Choose Provider (Gmail or SendGrid)
2. Get Credentials (API key or app password)
3. Set Supabase Secrets:
   ├─ SMTP_HOSTNAME="smtp.gmail.com"
   ├─ SMTP_USERNAME="email@gmail.com"
   ├─ SMTP_PASSWORD="app_password"
   └─ SMTP_FROM_EMAIL="akshayprabhu19012005@gmail.com"
4. Deploy Function:
   └─ supabase functions deploy send-email
5. Test:
   └─ Complete payment, check emails

Key Points:
├─ Secrets stored in Supabase (never in code)
├─ Function reads secrets at runtime
├─ Environment variables keep credentials safe
└─ Multiple providers supported
```

## Error Handling Flow

```
Email Sending Error?
├─ Function catches error
├─ Logs error details
├─ Returns { success: false, error: message }
├─ Frontend logs warning (doesn't fail order)
└─ Admin can check logs: supabase functions logs send-email

Order Still Succeeds:
├─ Payment is already processed
├─ Order saved to database
├─ Even if email fails, order is not lost
└─ Admin can resend email manually later
```

## Integration Timeline

```
Current Phase (✅ COMPLETE):
├─ Frontend service created
├─ Email templates created
├─ Payment gateway integrated
├─ Supabase function ready
└─ Documentation complete

Next Phase (⏳ YOUR ACTION):
├─ Set up email provider (5 min)
├─ Set Supabase secrets (2 min)
├─ Deploy function (1 min)
└─ Test emails (2 min)

Future Phase (🔄 OPTIONAL):
├─ Booking email integration
├─ Email logs/tracking
├─ Resend failed emails
└─ Email status page
```

## File Structure

```
project/
├─ src/
│  ├─ services/
│  │  ├─ emailService.ts ................. Main email handler
│  │  └─ emailTemplates.ts ............... HTML templates
│  └─ components/
│     └─ PaymentGateway.tsx .............. Integration point
│
├─ supabase/
│  └─ functions/
│     └─ send-email/
│        └─ index.ts ..................... Cloud function
│
├─ QUICK_EMAIL_SETUP.md .................. 5-min setup guide
├─ EMAIL_SERVICE_SETUP.md ................ Detailed guide
├─ EMAIL_TESTING.md ...................... Testing guide
└─ EMAIL_IMPLEMENTATION_SUMMARY.md ....... This overview
```

## Summary

✅ **Frontend**: Complete, integrated with payments
✅ **Backend**: Ready to deploy
⏳ **Setup**: Requires email provider credentials
✅ **Testing**: Simple manual and automatic tests
✅ **Documentation**: Comprehensive and ready

**Next Step**: Run `./setup-email.ps1` or follow `QUICK_EMAIL_SETUP.md`

---

For detailed setup: See `QUICK_EMAIL_SETUP.md`
For troubleshooting: See `EMAIL_TESTING.md`
For technical details: See `EMAIL_SERVICE_SETUP.md`
