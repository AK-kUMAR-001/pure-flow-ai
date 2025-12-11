/**
 * Home Page (Index)
 * Main landing page for AquaAdapt
 * Combines all home page sections
 */

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import Chatbot from "@/components/Chatbot";
import ContactButtons from "@/components/ContactButtons";

const Index = () => {
  // Track if splash screen has been shown
  const [showSplash, setShowSplash] = useState(true);

  // Check if splash was already shown in this session
  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  /**
   * Handle splash screen completion
   * Marks splash as shown in session storage
   */
  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  return (
    <>
      {/* Splash Screen - Shows on first visit */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Main Page Content */}
      <div className={showSplash ? "opacity-0" : "opacity-100 transition-opacity duration-500"}>
        {/* Navigation Header */}
        <Navigation />

        {/* Page Sections */}
        <main>
          {/* Hero Section with main CTA */}
          <HeroSection />

          {/* Services Overview */}
          <ServicesSection />

          {/* How It Works Process */}
          <HowItWorks />

          {/* Customer Testimonials */}
          <TestimonialsSection />

          {/* Call to Action */}
          <CTASection />
        </main>

        {/* Footer */}
        <Footer />

        {/* AI Chatbot Assistant */}
        <Chatbot />

        {/* Contact Buttons - WhatsApp and Call */}
        <ContactButtons />
      </div>
    </>
  );
};

export default Index;
