/**
 * Backend Email API Handler
 * This is an example implementation for Node.js + Express
 * You can adapt this to your backend framework
 * 
 * Place this in your backend as: /api/send-email route
 * 
 * Installation:
 * npm install nodemailer
 * OR
 * npm install @sendgrid/mail
 */

// ============ OPTION 1: Using Nodemailer (Gmail SMTP) ============
/*
import nodemailer from 'nodemailer';

// Configure your email service
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail
    pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
  },
});

// Express route handler
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});
*/

// ============ OPTION 2: Using SendGrid ============
/*
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Express route handler
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@aquaadapt.com',
      subject: subject,
      html: html,
    };

    await sgMail.send(msg);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('SendGrid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});
*/

// ============ OPTION 3: Using Firebase Email (Cloud Functions) ============
/*
import functions from 'firebase-functions';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password,
  },
});

exports.sendEmail = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { to, subject, html } = req.body;

    const mailOptions = {
      from: functions.config().email.user,
      to: to,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});
*/

// ============ OPTION 4: Using AWS SES ============
/*
import AWS from 'aws-sdk';

const ses = new AWS.SES({
  region: process.env.AWS_REGION,
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    const params = {
      Source: process.env.AWS_SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: html,
          },
        },
      },
    };

    await ses.sendEmail(params).promise();

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('SES error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});
*/

// ============ SETUP INSTRUCTIONS ============

/*
STEP 1: Choose your email service
- Gmail (Nodemailer) - Free, good for testing
- SendGrid - Recommended for production (1000 free emails/month)
- Firebase Cloud Functions - If using Firebase backend
- AWS SES - For large scale

STEP 2: Install dependencies
npm install nodemailer
OR
npm install @sendgrid/mail

STEP 3: Set environment variables
For Gmail (Nodemailer):
  EMAIL_USER=your-email@gmail.com
  EMAIL_PASSWORD=your-app-password (generate in Google Account settings)

For SendGrid:
  SENDGRID_API_KEY=your-sendgrid-api-key
  SENDGRID_FROM_EMAIL=noreply@aquaadapt.com

STEP 4: Add to your backend
Copy the code from OPTION 1, 2, 3, or 4 above to your backend

STEP 5: Test it
1. Complete a payment on the frontend
2. Check if emails are received
3. Monitor logs for any errors

IMPORTANT NOTES:
- The email endpoint expects POST request with { to, subject, html }
- Currently sending emails from your backend to /api/send-email
- Make sure CORS is configured if frontend and backend are on different domains
- Test email addresses in development before going live

GMAIL SETUP (Recommended for testing):
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate "App Password" for Gmail
4. Use that password in EMAIL_PASSWORD env var

SENDGRID SETUP (Recommended for production):
1. Create free SendGrid account
2. Generate API key
3. Verify a sender email address
4. Add API key to SENDGRID_API_KEY env var
*/

export default {};
