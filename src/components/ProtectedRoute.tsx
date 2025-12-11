/**
 * Protected Route Component
 * Wraps routes that require authentication
 * Checks localStorage first, then falls back to Supabase
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Droplets } from "lucide-react";
import { getCurrentUser } from "@/services/localStorageService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage first (local-based auth)
        const localUser = getCurrentUser();
        if (localUser) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Fall back to Supabase auth
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setIsAuthenticated(true);
        } else {
          // Redirect to auth page if not logged in
          navigate("/auth", { replace: true });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/auth", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          // Check localStorage as fallback
          const localUser = getCurrentUser();
          if (!localUser) {
            navigate("/auth", { replace: true });
          }
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
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

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
