import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, Shield, Droplets, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AuthStep = "login" | "otp";
type UserRole = "user" | "admin";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState<AuthStep>("login");
  const [role, setRole] = useState<UserRole>("user");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check user role and redirect accordingly
        const { data: userRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        if (userRole?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    };
    checkSession();
  }, [navigate]);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate mobile format
  const isValidMobile = (mobile: string) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  // Handle sending OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!mobile || !isValidMobile(mobile)) {
      toast({
        title: "Invalid Mobile",
        description: "Please enter a valid 10-digit mobile number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { 
          email, 
          mobile, 
          fullName,
          address,
          state,
          district
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        setOtpSent(true);
        setStep("otp");
        toast({
          title: "OTP Sent!",
          description: "Please check your email for the verification code.",
        });
      } else {
        throw new Error(data?.error || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Send OTP error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: { 
          email, 
          otp, 
          mobile, 
          fullName, 
          address,
          state,
          district,
          role 
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.success) {
        toast({
          title: "Verification Successful!",
          description: data.isNewUser ? "Welcome to AquaAdapt!" : "Welcome back!",
        });

        // If we got a token, use it to sign in
        if (data.token) {
          // For new flow, we need to handle session differently
          // The edge function creates the user, now we need to sign them in
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: false,
            }
          });
          
          if (!signInError) {
            // Redirect based on role
            if (data.role === "admin") {
              navigate("/admin");
            } else {
              navigate("/");
            }
          }
        } else {
          // Redirect based on role
          if (data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      } else {
        throw new Error(data?.error || "Verification failed");
      }
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setOtpSent(false);
    setOtp("");
    await handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Water animation background */}
      <div className="absolute inset-0 water-bg opacity-30" />
      
      {/* Floating water droplets */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-aqua-accent/20 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-background/20 backdrop-blur-md rounded-2xl mb-4"
          >
            <Droplets className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-primary-foreground font-poppins">
            AquaAdapt
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Smart Water, Smarter Living
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-2xl p-8">
          {/* Role Selection */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                role === "user"
                  ? "bg-ocean-blue text-primary-foreground shadow-aqua-glow"
                  : "bg-background/50 text-foreground hover:bg-background/70"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium">User</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                role === "admin"
                  ? "bg-ocean-blue text-primary-foreground shadow-aqua-glow"
                  : "bg-background/50 text-foreground hover:bg-background/70"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Admin</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOTP}
                className="space-y-5"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {role === "admin" ? "Admin Login" : "Welcome"}
                </h2>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-foreground/80">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 neumorphic-input h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 neumorphic-input h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-foreground/80">
                    Mobile Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                      className="pl-10 neumorphic-input h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground/80">
                    Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="neumorphic-input h-12 rounded-xl"
                  />
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-foreground/80">
                    State
                  </Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="Enter your state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="neumorphic-input h-12 rounded-xl"
                  />
                </div>

                {/* District */}
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-foreground/80">
                    District
                  </Label>
                  <Input
                    id="district"
                    type="text"
                    placeholder="Enter your district"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="neumorphic-input h-12 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-cta hover:opacity-90 text-primary-foreground font-semibold rounded-xl shadow-aqua-glow transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Get OTP
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOTP}
                className="space-y-5"
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-success" />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Verify OTP
                  </h2>
                  <p className="text-muted-foreground text-sm mt-2">
                    Enter the 6-digit code sent to
                    <br />
                    <span className="text-ocean-blue font-medium">{email}</span>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-foreground/80">
                    Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] neumorphic-input h-14 rounded-xl font-mono"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-cta hover:opacity-90 text-primary-foreground font-semibold rounded-xl shadow-aqua-glow transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center space-y-3">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-ocean-blue hover:underline text-sm font-medium"
                  >
                    Resend OTP
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => {
                      setStep("login");
                      setOtp("");
                    }}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    ← Back to Login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-foreground/60 text-sm mt-6">
          © 2024 AquaAdapt. Smart Water Solutions
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
