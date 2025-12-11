import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendOTPRequest {
  email: string;
  mobile?: string;
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send OTP function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, mobile }: SendOTPRequest = await req.json();
    console.log("Sending OTP to email:", email);

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate OTP
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    console.log("Generated OTP:", otpCode);

    // Store OTP in database
    const { error: insertError } = await supabase
      .from("otp_verifications")
      .insert({
        email,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        verified: false,
      });

    if (insertError) {
      console.error("Error storing OTP:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to generate OTP" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email using SendGrid
    const sendGridApiKey = Deno.env.get("SENDGRID_API_KEY");
    
    if (!sendGridApiKey) {
      console.error("SendGrid API key not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sendGridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email }],
            subject: "Your AquaAdapt Verification Code",
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
                  body { font-family: 'Poppins', Arial, sans-serif; background-color: #f0f9ff; margin: 0; padding: 20px; }
                  .container { max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #0ea5e9, #06b6d4); border-radius: 16px; padding: 40px; color: white; }
                  .logo { text-align: center; margin-bottom: 24px; }
                  .logo h1 { margin: 0; font-size: 28px; font-weight: 700; }
                  .otp-box { background: rgba(255,255,255,0.2); border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
                  .otp-code { font-size: 36px; font-weight: 700; letter-spacing: 8px; margin: 0; }
                  .message { text-align: center; font-size: 14px; opacity: 0.9; }
                  .footer { text-align: center; margin-top: 24px; font-size: 12px; opacity: 0.7; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="logo">
                    <h1>💧 AquaAdapt</h1>
                  </div>
                  <p class="message">Your verification code is:</p>
                  <div class="otp-box">
                    <p class="otp-code">${otpCode}</p>
                  </div>
                  <p class="message">This code will expire in 10 minutes.</p>
                  <p class="message">If you didn't request this code, please ignore this email.</p>
                  <div class="footer">
                    <p>© 2024 AquaAdapt - Smart Water Solutions</p>
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
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("OTP email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
