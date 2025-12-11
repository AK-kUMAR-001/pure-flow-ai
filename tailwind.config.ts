import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* ========== Font Family ========== */
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      
      /* ========== Color System ========== */
      colors: {
        /* Primary Colors */
        "ocean-blue": "hsl(var(--ocean-blue))",
        "deep-blue": "hsl(var(--deep-blue))",
        "aqua-accent": "hsl(var(--aqua-accent))",
        "light-blue": "hsl(var(--light-blue))",
        
        /* Secondary Colors */
        "leaf-green": "hsl(var(--leaf-green))",
        "lime-green": "hsl(var(--lime-green))",
        "mint": "hsl(var(--mint))",
        "forest-green": "hsl(var(--forest-green))",
        
        /* Supporting Colors */
        "soft-grey": "hsl(var(--soft-grey))",
        "dark-grey": "hsl(var(--dark-grey))",
        "warning-orange": "hsl(var(--warning-orange))",
        "success-green": "hsl(var(--success-green))",
        "error-red": "hsl(var(--error-red))",
        
        /* Semantic Colors */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      
      /* ========== Border Radius ========== */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      
      /* ========== Box Shadows ========== */
      boxShadow: {
        "aqua-sm": "0 2px 8px rgba(10, 126, 164, 0.08)",
        "aqua-md": "0 4px 16px rgba(10, 126, 164, 0.12)",
        "aqua-lg": "0 8px 32px rgba(10, 126, 164, 0.16)",
        "aqua-glow": "0 0 20px rgba(65, 201, 226, 0.4)",
        "neumorphic": "inset 4px 4px 8px rgba(0, 0, 0, 0.08), inset -4px -4px 8px rgba(255, 255, 255, 1)",
        "glass": "0 8px 32px rgba(10, 126, 164, 0.1)",
      },
      
      /* ========== Keyframe Animations ========== */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(65, 201, 226, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(65, 201, 226, 0.6)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "ripple": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "droplet": {
          "0%": { transform: "translateY(-100px) scale(0)", opacity: "0" },
          "50%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "70%": { transform: "translateY(0) scale(1.1)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "water-wave": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      
      /* ========== Animation Utilities ========== */
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        "float": "float 3s ease-in-out infinite",
        "ripple": "ripple 1s linear",
        "droplet": "droplet 1.2s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "water-wave": "water-wave 15s linear infinite",
      },
      
      /* ========== Background Images ========== */
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, hsl(200, 88%, 21%) 0%, hsl(195, 90%, 34%) 100%)",
        "gradient-accent": "linear-gradient(135deg, hsl(189, 72%, 57%) 0%, hsl(142, 54%, 40%) 100%)",
        "gradient-cta": "linear-gradient(135deg, hsl(100, 66%, 60%) 0%, hsl(142, 54%, 40%) 100%)",
        "gradient-hero": "linear-gradient(180deg, hsl(200, 88%, 21%) 0%, hsl(195, 90%, 34%) 50%, hsl(189, 72%, 57%) 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
