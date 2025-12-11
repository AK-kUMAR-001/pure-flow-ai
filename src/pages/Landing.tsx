/**
 * Landing Page Component
 * Shows before user authentication - signup/login entry point
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, LogIn, UserPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/services/localStorageService";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Don't check auth on landing page - let user see signup/login options
  useEffect(() => {
    // Remove any existing user data when landing page loads
    // This ensures fresh start
    const checkAuth = async () => {
      try {
        const localUser = getCurrentUser();
        // Only redirect if explicitly logged in AND on landing page
        // User can still click login/signup
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="animate-spin">
          <Droplets className="h-12 w-12 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-primary via-light-blue to-aqua-accent/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo/Branding */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="p-4 bg-white rounded-full shadow-lg">
              <Droplets className="h-12 w-12 text-gradient-cta" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold text-deep-blue mb-2">AquaAdapt</h1>
          <p className="text-light-gray text-lg">
            Smart Water Filtration for Your Home
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-aqua-accent/10 rounded-lg mt-1">
                <Droplets className="h-5 w-5 text-aqua-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-deep-blue mb-1">
                  Pure Water at Home
                </h3>
                <p className="text-sm text-light-gray">
                  Advanced filtration technology for safe drinking water
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-aqua-accent/10 rounded-lg mt-1">
                <Droplets className="h-5 w-5 text-aqua-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-deep-blue mb-1">
                  Easy Management
                </h3>
                <p className="text-sm text-light-gray">
                  Book tests, track orders, and manage your account
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-aqua-accent/10 rounded-lg mt-1">
                <Droplets className="h-5 w-5 text-aqua-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-deep-blue mb-1">
                  Customer Support
                </h3>
                <p className="text-sm text-light-gray">
                  24/7 support via WhatsApp and phone
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => navigate("/auth?mode=signup")}
              className="w-full bg-gradient-cta hover:bg-gradient-cta/90 text-white h-12 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Sign Up
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => navigate("/auth?mode=login")}
              variant="outline"
              className="w-full h-12 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 border-2 border-gradient-cta text-gradient-cta hover:bg-gradient-cta/5"
            >
              <LogIn className="h-5 w-5" />
              Log In
            </Button>
          </motion.div>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-light-gray mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default Landing;
