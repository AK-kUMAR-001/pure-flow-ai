/**
 * SplashScreen Component
 * Animated splash screen with water droplet effect
 * Displays for 2 seconds before fading out
 */

import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void; // Callback when splash animation finishes
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  // Track animation state for fade out effect
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after 2 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2000);

    // Complete splash and unmount after fade out
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-hero transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Water ripple background effect */}
      <div className="absolute inset-0 water-bg" />

      {/* Animated water droplet icon */}
      <div className="relative animate-droplet">
        <div className="relative">
          {/* Glow effect behind icon */}
          <div className="absolute inset-0 animate-pulse-glow rounded-full blur-xl bg-aqua-accent/30" />
          
          {/* Main droplet icon */}
          <Droplets className="relative h-24 w-24 text-white drop-shadow-2xl" />
        </div>

        {/* Ripple effect circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute h-32 w-32 animate-ripple rounded-full border-2 border-white/30" />
          <div 
            className="absolute h-32 w-32 animate-ripple rounded-full border-2 border-white/20" 
            style={{ animationDelay: "0.3s" }} 
          />
          <div 
            className="absolute h-32 w-32 animate-ripple rounded-full border-2 border-white/10" 
            style={{ animationDelay: "0.6s" }} 
          />
        </div>
      </div>

      {/* Brand name and tagline */}
      <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Aqua<span className="text-aqua-accent">Adapt</span>
        </h1>
        <p className="mt-3 text-lg text-white/80 font-light">
          Smart Water, Smarter Living
        </p>
      </div>

      {/* Loading indicator */}
      <div className="mt-16 flex gap-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-2 w-2 rounded-full bg-white/60 animate-bounce"
            style={{ animationDelay: `${index * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
