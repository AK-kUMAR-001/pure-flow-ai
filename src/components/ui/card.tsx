/**
 * Card Components
 * Styled card components for AquaAdapt
 * Includes glass morphism and elevated variants
 */

import * as React from "react";
import { cn } from "@/lib/utils";

/* ========================================
   Card Component
   Main container with shadow and rounded corners
   ======================================== */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glass" | "elevated" | "outline";
  }
>(({ className, variant = "default", ...props }, ref) => {
  // Define variant-specific styles
  const variantStyles = {
    default: "bg-card text-card-foreground shadow-aqua-sm",
    glass: "glass-card text-white",
    elevated: "bg-card text-card-foreground shadow-aqua-lg hover:shadow-aqua-glow transition-shadow duration-300",
    outline: "bg-transparent border-2 border-primary/20 text-card-foreground",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

/* ========================================
   Card Header Component
   Top section of card for title and description
   ======================================== */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/* ========================================
   Card Title Component
   Main heading within card header
   ======================================== */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* ========================================
   Card Description Component
   Subtext within card header
   ======================================== */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* ========================================
   Card Content Component
   Main content area of the card
   ======================================== */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/* ========================================
   Card Footer Component
   Bottom section for actions/buttons
   ======================================== */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
