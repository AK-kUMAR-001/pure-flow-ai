/**
 * Auth Page Component
 * Signup with password and Login with email/password
 * Stores data locally and in Supabase
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  Droplets,
  Loader2,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  registerUserLocally,
  loginUserLocally,
  setCurrentUser,
  getCurrentUser,
} from "@/services/localStorageService";

type AuthStep = "mode-select" | "signup" | "signup-success" | "login";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Auth state
  const [step, setStep] = useState<AuthStep>("mode-select");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Signup fields
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupFullName, setSignupFullName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupAddress, setSignupAddress] = useState("");
  const [signupState, setSignupState] = useState("");
  const [signupDistrict, setSignupDistrict] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Check if user already logged in and handle mode
  useEffect(() => {
    // Check URL params for mode FIRST
    const mode = searchParams.get("mode");
    console.log("Auth page - mode param:", mode);
    
    // Only redirect if no mode specified (user arrived without signing up/logging in)
    if (!mode) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        // Only redirect if coming directly to /auth without mode
        console.log("User already logged in, redirecting to home");
        navigate("/home", { replace: true });
        return;
      }
      // No mode and no user, show mode-select
      console.log("No mode specified, showing mode-select");
      setStep("mode-select");
      return;
    }

    // If mode is specified, show that form regardless of login status
    if (mode === "signup") {
      console.log("Setting step to signup");
      setStep("signup");
    } else if (mode === "login") {
      console.log("Setting step to login");
      setStep("login");
    }
  }, [navigate, searchParams]);

  // Validators
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);
  const isValidPassword = (password: string) => password.length >= 6;

  // Handle Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!isValidEmail(signupEmail)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email", variant: "destructive" });
      return;
    }

    if (!signupFullName.trim()) {
      toast({ title: "Required", description: "Please enter your full name", variant: "destructive" });
      return;
    }

    if (!isValidPhone(signupPhone)) {
      toast({ title: "Invalid Phone", description: "Please enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }

    if (!isValidPassword(signupPassword)) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      toast({ title: "Passwords Mismatch", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    if (!signupAddress.trim() || !signupState.trim() || !signupDistrict.trim()) {
      toast({ title: "Required", description: "Please fill in address, state, and district", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // Register locally
      const newUser = registerUserLocally({
        email: signupEmail,
        password: signupPassword,
        fullName: signupFullName,
        phone: signupPhone,
        address: signupAddress,
        state: signupState,
        district: signupDistrict,
      });

      // Set as current user
      setCurrentUser(newUser);

      // Show success screen
      setSignupSuccess(true);

      toast({
        title: "Account Created! ✓",
        description: `Welcome ${signupFullName}! Your unique ID is ${newUser.uniqueId}`,
      });

      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        setStep("login");
        setSignupSuccess(false);
        setLoginEmail(signupEmail);
        setLoginPassword("");
        // Clear signup fields
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");
        setSignupFullName("");
        setSignupPhone("");
        setSignupAddress("");
        setSignupState("");
        setSignupDistrict("");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(loginEmail)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email", variant: "destructive" });
      return;
    }

    if (!loginPassword) {
      toast({ title: "Required", description: "Please enter your password", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // Try local login first
      const user = loginUserLocally(loginEmail, loginPassword);

      if (!user) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Login Successful! ✓",
        description: `Welcome back, ${user.fullName}!`,
      });

      // Set the user in auth context
      setCurrentUser(user);

      // Redirect to home after short delay
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-primary via-light-blue to-aqua-accent/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white rounded-full shadow-lg">
              <Droplets className="h-8 w-8 text-gradient-cta" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-deep-blue">AquaAdapt</h1>
          <p className="text-light-gray text-sm mt-1">Pure Water Solutions</p>
        </div>

        <AnimatePresence mode="wait">
          {/* Mode Selection */}
          {step === "mode-select" && (
            <motion.div
              key="mode-select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-4"
            >
              <h2 className="text-2xl font-bold text-deep-blue text-center mb-6">
                Get Started
              </h2>

              <Button
                onClick={() => setStep("signup")}
                className="w-full h-12 bg-gradient-cta hover:opacity-90 text-white font-semibold rounded-xl"
              >
                Create New Account
              </Button>

              <Button
                onClick={() => setStep("login")}
                variant="outline"
                className="w-full h-12 border-2 border-gradient-cta text-gradient-cta hover:bg-gradient-cta/5 font-semibold rounded-xl"
              >
                I Already Have an Account
              </Button>
            </motion.div>
          )}

          {/* Signup Form */}
          {step === "signup" && !signupSuccess && (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSignup}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-deep-blue">Create Account</h2>
                <Button
                  type="button"
                  onClick={() => setStep("mode-select")}
                  variant="ghost"
                  size="sm"
                  className="text-light-gray hover:text-deep-blue"
                >
                  ← Back
                </Button>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-foreground/80">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-foreground/80">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label className="text-foreground/80">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label className="text-foreground/80">Address *</Label>
                <Input
                  type="text"
                  placeholder="123 Main Street"
                  value={signupAddress}
                  onChange={(e) => setSignupAddress(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>

              {/* State & District */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground/80">State *</Label>
                  <Input
                    type="text"
                    placeholder="Kerala"
                    value={signupState}
                    onChange={(e) => setSignupState(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">District *</Label>
                  <Input
                    type="text"
                    placeholder="Kochi"
                    value={signupDistrict}
                    onChange={(e) => setSignupDistrict(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-foreground/80">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="text-foreground/80">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-cta hover:opacity-90 text-white font-semibold rounded-xl mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setStep("mode-select")}
                variant="ghost"
                className="w-full text-light-gray hover:text-deep-blue"
              >
                Back
              </Button>
            </motion.form>
          )}

          {/* Signup Success Screen */}
          {signupSuccess && (
            <motion.div
              key="signup-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-20 h-20 mx-auto bg-gradient-cta rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-deep-blue mb-2">
                  Account Created! ✓
                </h2>
                <p className="text-light-gray">
                  Your account has been successfully created with unique ID:{" "}
                  <span className="font-bold text-gradient-cta">AQ-USER-001</span>
                </p>
              </div>

              <div className="bg-light-blue/30 rounded-xl p-4">
                <p className="text-sm text-light-gray">
                  Redirecting to login in 3 seconds...
                </p>
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          {step === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleLogin}
              className="bg-white rounded-2xl shadow-xl p-8 space-y-5"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-deep-blue">Login</h2>
                <Button
                  type="button"
                  onClick={() => setStep("mode-select")}
                  variant="ghost"
                  size="sm"
                  className="text-light-gray hover:text-deep-blue"
                >
                  ← Back
                </Button>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-foreground/80">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-foreground/80">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-cta hover:opacity-90 text-white font-semibold rounded-xl mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Logging In...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setStep("mode-select")}
                variant="ghost"
                className="w-full text-light-gray hover:text-deep-blue"
              >
                Back
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-xs text-light-gray mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
