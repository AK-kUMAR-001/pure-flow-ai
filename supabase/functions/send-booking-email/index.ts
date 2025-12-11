/**
 * Send Booking Confirmation Email Edge Function
 * Sends booking details to user email using SendGrid
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  email: string;
  name: string;
  phone: string;
  address: string;
  waterSource: string;
  date: string;
  time: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, phone, address, waterSource, date, time }: BookingEmailRequest = await req.json();

    console.log("Sending booking confirmation to:", email);

    // Get SendGrid API key from environment
    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    if (!SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not configured");
    }

    // Send email via SendGrid
    const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: email }],
            subject: "Your AquaAdapt Water Test Booking Confirmed!",
          },
        ],
        from: {
          email: "akshayprabhu19012005@gmail.com",
          name: "AquaAdapt",
        },
        content: [
          {
            type: "text/html",
            value: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f9fc; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                  .header { background: linear-gradient(135deg, #0077B6, #00B4D8); padding: 40px; text-align: center; }
                  .header h1 { color: white; margin: 0; font-size: 28px; }
                  .header p { color: rgba(255,255,255,0.9); margin-top: 10px; }
                  .content { padding: 40px; }
                  .booking-details { background: #f4f9fc; border-radius: 12px; padding: 24px; margin: 20px 0; }
                  .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
                  .detail-row:last-child { border-bottom: none; }
                  .detail-label { color: #666; }
                  .detail-value { font-weight: 600; color: #0077B6; }
                  .footer { background: #f4f9fc; padding: 24px; text-align: center; }
                  .footer p { color: #666; font-size: 14px; margin: 0; }
                  .cta-button { display: inline-block; background: linear-gradient(135deg, #7CB518, #9EF01A); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎉 Booking Confirmed!</h1>
                    <p>Thank you for choosing AquaAdapt</p>
                  </div>
                  <div class="content">
                    <p>Dear <strong>${name}</strong>,</p>
                    <p>Your water quality test has been successfully scheduled. Our certified technician will visit your location at the scheduled time.</p>
                    
                    <div class="booking-details">
                      <h3 style="margin-top: 0; color: #0077B6;">📋 Booking Details</h3>
                      <div class="detail-row">
                        <span class="detail-label">Water Source</span>
                        <span class="detail-value">${waterSource}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Date</span>
                        <span class="detail-value">${date}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Time Slot</span>
                        <span class="detail-value">${time}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${address}</span>
                      </div>
                      <div class="detail-row">
                        <span class="detail-label">Contact</span>
                        <span class="detail-value">${phone}</span>
                      </div>
                    </div>

                    <p><strong>What to expect:</strong></p>
                    <ul>
                      <li>Our technician will arrive within the scheduled time slot</li>
                      <li>The water test takes approximately 30 minutes</li>
                      <li>You'll receive a detailed report with filter recommendations</li>
                      <li>This test is absolutely FREE!</li>
                    </ul>

                    <p>If you need to reschedule or have any questions, please contact us:</p>
                    <p>📞 +91 8925081899</p>
                  </div>
                  <div class="footer">
                    <p>© 2024 AquaAdapt - Sustainable Water Solutions</p>
                    <p>Tamil Nadu, India</p>
                  </div>
                </div>
              </body>
              </html>
            `,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("SendGrid error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    console.log("Booking confirmation email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Booking confirmation sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
