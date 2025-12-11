/**
 * HowItWorks Component
 * Step-by-step process explanation
 * Features animated timeline with icons
 */

import { 
  Beaker, 
  Microscope, 
  Cog, 
  PackageCheck, 
  Smartphone 
} from "lucide-react";

const HowItWorks = () => {
  // Process steps configuration
  const steps = [
    {
      icon: Beaker,
      step: "01",
      title: "Book Water Test",
      description: "Schedule a free water quality test at your convenience. Our technician visits your home.",
    },
    {
      icon: Microscope,
      step: "02",
      title: "Get Analysis",
      description: "Receive detailed analysis of your water quality including pH, TDS, hardness, and contaminants.",
    },
    {
      icon: Cog,
      step: "03",
      title: "Custom Design",
      description: "We design a custom 4-layer filtration system optimized for your specific water conditions.",
    },
    {
      icon: PackageCheck,
      step: "04",
      title: "Installation",
      description: "Expert technicians install your filter system with seamless plumbing integration.",
    },
    {
      icon: Smartphone,
      step: "05",
      title: "Monitor & Save",
      description: "Track water quality, usage, and savings in real-time through our IoT dashboard.",
    },
  ];

  return (
    <section className="py-20 bg-light-blue/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-green/10 text-leaf-green text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
            Your Journey to Clean Water
          </h2>
          <p className="text-muted-foreground text-lg">
            From testing to monitoring, our streamlined process ensures you get 
            the perfect water recycling solution for your home.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-aqua-accent via-leaf-green to-ocean-blue" />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step Number & Icon */}
                <div className="relative inline-block mb-6">
                  {/* Background Circle */}
                  <div className="relative z-10 w-20 h-20 mx-auto bg-white rounded-full shadow-aqua-md flex items-center justify-center group-hover:shadow-aqua-glow transition-shadow">
                    <step.icon className="h-9 w-9 text-ocean-blue" />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-gradient-cta rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-white">{step.step}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-dark-grey mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
