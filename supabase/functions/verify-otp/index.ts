import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyOTPRequest {
  email: string;
  otp: string;
  mobile?: string;
  fullName?: string;
  role?: 'admin' | 'user';
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Verify OTP function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otp, mobile, fullName, role = 'user' }: VerifyOTPRequest = await req.json();
    console.log("Verifying OTP for email:", email, "Role:", role);

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: "Email and OTP are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find valid OTP
    const { data: otpRecord, error: fetchError } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otp)
      .eq("verified", false)
      .gte("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching OTP:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to verify OTP" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!otpRecord) {
      console.log("Invalid or expired OTP");
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark OTP as verified
    await supabase
      .from("otp_verifications")
      .update({ verified: true })
      .eq("id", otpRecord.id);

    // Check if user exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.find(u => u.email === email);

    let session = null;
    let user = null;

    if (userExists) {
      // Sign in existing user using magic link simulation
      console.log("User exists, generating sign-in link");
      
      const { data: signInData, error: signInError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        return new Response(
          JSON.stringify({ error: "Failed to sign in" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      user = signInData.user;
      
      // Check user's role matches requested role
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (userRole && userRole.role !== role) {
        return new Response(
          JSON.stringify({ error: `This account is registered as ${userRole.role}. Please select the correct role.` }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Update profile with mobile if provided
      if (mobile) {
        await supabase
          .from("profiles")
          .update({ mobile })
          .eq("user_id", user.id);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Verification successful",
          user: { id: user.id, email: user.email },
          role: userRole?.role || 'user',
          isNewUser: false,
          token: signInData.properties?.hashed_token
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } else {
      // Create new user
      console.log("Creating new user with role:", role);
      
      const password = crypto.randomUUID(); // Generate random password
      
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          mobile: mobile,
        },
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        return new Response(
          JSON.stringify({ error: "Failed to create account" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      user = signUpData.user;

      // Update role if admin
      if (role === 'admin') {
        await supabase
          .from("user_roles")
          .update({ role: 'admin' })
          .eq("user_id", user.id);
      }

      // Update profile with additional info
      await supabase
        .from("profiles")
        .update({ 
          mobile,
          full_name: fullName 
        })
        .eq("user_id", user.id);

      // Generate sign-in link for the new user
      const { data: signInData } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email,
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Account created successfully",
          user: { id: user.id, email: user.email },
          role: role,
          isNewUser: true,
          token: signInData?.properties?.hashed_token
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
  } catch (error: any) {
    console.error("Error in verify-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
