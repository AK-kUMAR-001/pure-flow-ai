/**
 * Input Component
 * Styled input with neumorphic design for AquaAdapt
 * Includes focus states and validation styling
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/* ========================================
   Input Component Interface
   ======================================== */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "neumorphic";
  error?: boolean;
}

/* ========================================
   Input Component
   Renders a styled input field
   ======================================== */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", error, ...props }, ref) => {
    // Base styles for all inputs
    const baseStyles = 
      "flex h-12 w-full rounded-xl px-4 py-2 text-base font-medium transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";
    
    // Variant-specific styles
    const variantStyles = {
      default: 
        "border border-input bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-aqua-accent focus-visible:ring-offset-2",
      neumorphic:
        "neumorphic-input border-none focus:ring-2 focus:ring-aqua-accent",
    };
    
    // Error state styles
    const errorStyles = error 
      ? "border-error-red ring-error-red/50 focus-visible:ring-error-red" 
      : "";

    return (
      <input
        type={type}
        className={cn(
          baseStyles,
          variantStyles[variant],
          errorStyles,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
