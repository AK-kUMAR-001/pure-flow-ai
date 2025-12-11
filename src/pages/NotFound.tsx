/**
 * NotFound Page (404)
 * Displayed when user navigates to non-existent route
 * Features water-themed design with navigation options
 */

import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Droplets, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  // Log 404 errors for monitoring
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero water-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Bubbles Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${Math.random() * 80 + 30}px`,
              height: `${Math.random() * 80 + 30}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content Card */}
      <div className="relative text-center max-w-lg animate-fade-in">
        {/* Animated Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 animate-pulse-glow rounded-full blur-xl bg-aqua-accent/30" />
          <Droplets className="relative h-24 w-24 text-white animate-float" />
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-bold text-white/20 mb-4">
          404
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Oops! This Page Has{" "}
          <span className="text-aqua-accent">Evaporated</span>
        </h2>

        <p className="text-white/70 mb-8 max-w-md mx-auto">
          The page you're looking for seems to have flowed away. 
          Don't worry, let's get you back to fresh waters!
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="cta" size="lg">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          
          <Button asChild variant="glass" size="lg">
            <Link to="/services">
              <Search className="mr-2 h-5 w-5" />
              Explore Services
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/50 text-sm mb-4">Quick Links</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { label: "About Us", href: "/about" },
              { label: "Book Test", href: "/booking" },
              { label: "Dashboard", href: "/dashboard" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-white/70 hover:text-aqua-accent transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
