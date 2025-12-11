/**
 * CTASection Component
 * Call-to-action section with book test and contact options
 * Features gradient background with water effects
 */

import { ArrowRight, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-primary" />
      
      {/* Water Effect Overlay */}
      <div className="absolute inset-0 water-bg opacity-30" />
      
      {/* Decorative Circles */}
      <div className="absolute -left-20 -top-20 w-60 h-60 bg-aqua-accent/20 rounded-full blur-3xl" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-lime-green/20 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
          Ready to Start Saving Water?
        </h2>
        
        {/* Subheading */}
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Book your free water quality test today and discover how much you can 
          save with a custom AquaAdapt filtration system.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Button asChild variant="cta" size="xl" className="group">
            <Link to="/booking">
              <Calendar className="mr-2 h-5 w-5" />
              Book Free Test
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <Button asChild variant="glass" size="xl">
            <a href="tel:+918925081899">
              <Phone className="mr-2 h-5 w-5" />
              +91 8925081899
            </a>
          </Button>
        </div>

        {/* Trust Badge */}
        <div 
          className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-accent border-2 border-white flex items-center justify-center text-xs font-bold text-white"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <span className="text-white/90 text-sm">
            <strong>500+</strong> tests booked this month
          </span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
