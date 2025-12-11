/**
 * TestimonialsSection Component
 * Customer testimonials with card carousel
 * Features star ratings and customer avatars
 */

import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TestimonialsSection = () => {
  // Testimonials data
  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Varanasi, UP",
      avatar: "RK",
      rating: 5,
      text: "AquaAdapt transformed our water usage! We're saving ₹3,000 monthly on water bills, and our garden has never looked better with recycled water.",
    },
    {
      name: "Priya Sharma",
      location: "Jaipur, Rajasthan",
      avatar: "PS",
      rating: 5,
      text: "The custom filter works amazingly for our hard water. Installation was professional and the IoT monitoring gives me peace of mind about water quality.",
    },
    {
      name: "Amit Patel",
      location: "Ahmedabad, Gujarat",
      avatar: "AP",
      rating: 5,
      text: "Been using AquaAdapt for 6 months now. Recycled over 15,000 liters! The auto-refill program is super convenient. Highly recommend!",
    },
    {
      name: "Sunita Reddy",
      location: "Hyderabad, Telangana",
      avatar: "SR",
      rating: 4,
      text: "Great service and eco-friendly approach. The technicians were knowledgeable and installation was done within an hour. Worth every rupee!",
    },
  ];

  /**
   * Renders star rating based on count
   * @param rating - Number of filled stars (1-5)
   */
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-warning-orange fill-warning-orange" : "text-muted"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-ocean-blue/10 text-ocean-blue text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of satisfied customers who are saving water and money 
            with AquaAdapt's custom filtration solutions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              variant="elevated"
              className="relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-6 h-12 w-12 text-aqua-accent/10" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <p className="text-dark-grey text-lg mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>

                  {/* Name & Location */}
                  <div>
                    <div className="font-semibold text-dark-grey">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">Trusted by leading organizations</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            {/* Placeholder for partner logos */}
            <div className="h-12 w-32 bg-muted rounded-lg" />
            <div className="h-12 w-32 bg-muted rounded-lg" />
            <div className="h-12 w-32 bg-muted rounded-lg" />
            <div className="h-12 w-32 bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
