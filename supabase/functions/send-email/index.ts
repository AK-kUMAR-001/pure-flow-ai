// @ts-ignore: Deno and Node.js global conflicts
import { createTransport } from "npm:nodemailer";

// Define the expected structure of the incoming request body
interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Deno.serve is the modern, built-in entry point for Supabase Edge Functions.
declare const Deno: any; Deno.serve(async (req: Request) => {
  console.log("Function invoked");
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const { to, subject, html }: EmailRequest = await req.json();

    // Validate inputs
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, html" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        }
      );
    }

    // Get email credentials from environment variables
    const smtpHostname = Deno.env.get("SMTP_HOSTNAME");
    const smtpUsername = Deno.env.get("SMTP_USERNAME");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587"); // 587 is more common for STARTTLS
    const smtpFromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "noreply@aquaadapt.com";

    if (!smtpHostname || !smtpUsername || !smtpPassword) {
      console.error("Missing SMTP configuration");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS }
        }
      );
    }

    // Create SMTP transporter using nodemailer
    const transporter = createTransport({
      host: smtpHostname,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });

    // Send email
    await transporter.sendMail({
      from: smtpFromEmail,
      to: to,
      subject: subject,
      html: html,
    });

    console.log(`Email sent successfully to ${to}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json", ...CORS_HEADERS
        },
      }
    );
  } catch (error) {
    console.error("Email sending error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json", ...CORS_HEADERS
        },
      }
    );
  }
}, {
  onListen({ port, hostname }) {
    console.log(`Server started at http://${hostname}:${port}`);
  },
});
