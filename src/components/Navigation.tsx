/**
 * Navigation Component
 * Main navigation bar with responsive mobile menu
 * Includes glassmorphism effect on scroll
 */

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Droplets, Phone, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";
import { getCurrentUser } from "@/services/localStorageService";
import { cn } from "@/lib/utils";

const Navigation = () => {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Track scroll position for transparent->solid nav transition
  const [isScrolled, setIsScrolled] = useState(false);

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  
  // Get current route for active link styling
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation links configuration
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/booking", label: "Book Test" },
    { href: "/home-test", label: "Home Test" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/analytics", label: "Analytics" },
    { href: "/mobile", label: "Mobile UI" },
  ];

  // Check authentication status on mount and when location changes
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setIsLoggedIn(true);
      setUserName(user.fullName || user.email);
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [location.pathname]);

  // Handle scroll event for nav background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserName("");
    navigate("/", { replace: true });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-gradient-primary/90 to-light-blue/90 backdrop-blur-sm"
      )}
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-aqua-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <Droplets 
              className={cn(
                "h-8 w-8 transition-colors",
                isScrolled ? "text-aqua-accent" : "text-white"
              )} 
            />
          </div>
          <span
            className={cn(
              "text-xl font-bold transition-colors whitespace-nowrap",
              isScrolled ? "text-deep-blue" : "text-white"
            )}
          >
            Aqua<span className="text-aqua-accent">Adapt</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "font-medium transition-colors relative group text-sm",
                isScrolled ? "text-dark-grey hover:text-aqua-accent" : "text-white/90 hover:text-white",
                location.pathname === link.href && "text-aqua-accent font-bold"
              )}
            >
              {link.label}
              {/* Underline animation */}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-aqua-accent transition-all duration-300",
                  location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
            <LanguageSelector />
            <Link to="/contact">
              <Button
                variant={isScrolled ? "outline" : "glass"}
                size="sm"
                className="gap-2"
              >
                <Phone className="h-4 w-4" />
                Contact
              </Button>
            </Link>
            {isLoggedIn ? (
              <Button 
                onClick={handleLogout}
                variant={isScrolled ? "cta" : "aqua"} 
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant={isScrolled ? "cta" : "aqua"} size="sm">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "md:hidden p-2 rounded-lg transition-colors shrink-0 ml-2",
            isScrolled ? "text-dark-grey hover:bg-light-blue/20" : "text-white hover:bg-white/10"
          )}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-white rounded-2xl shadow-aqua-lg p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "block px-4 py-3 rounded-xl font-medium transition-colors",
                location.pathname === link.href
                  ? "bg-aqua-accent/10 text-aqua-accent"
                  : "text-dark-grey hover:bg-light-blue"
              )}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Mobile CTA Buttons */}
          <div className="pt-4 flex flex-col gap-2 border-t border-border">
            <div className="px-4 py-2">
              <LanguageSelector />
            </div>
            <Link to="/contact">
              <Button variant="outline" className="w-full gap-2">
                <Phone className="h-4 w-4" />
                Contact Us
              </Button>
            </Link>
            {isLoggedIn ? (
              <Button 
                onClick={handleLogout}
                variant="cta" 
                className="w-full gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="cta" className="w-full gap-2">
                  <User className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navigation };
export default Navigation;
