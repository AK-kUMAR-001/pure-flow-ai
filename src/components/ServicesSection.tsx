/**
 * ServicesSection Component
 * Displays the main services offered by AquaAdapt
 * Features interactive cards with hover effects
 */

import { 
  TestTube2, 
  Filter, 
  Wrench, 
  BarChart3, 
  RefreshCw, 
  Award,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  // Service cards configuration
  const services = [
    {
      icon: TestTube2,
      title: "Water Quality Testing",
      description: "Comprehensive analysis of your water including pH, TDS, turbidity, hardness, and more. Free with filter purchase!",
      color: "from-aqua-accent to-ocean-blue",
      link: "/booking",
    },
    {
      icon: Filter,
      title: "Custom Filtration",
      description: "Eco-friendly 4-layer filters designed specifically for your water quality. Made with natural materials.",
      color: "from-lime-green to-leaf-green",
      link: "/services#filters",
    },
    {
      icon: Wrench,
      title: "Expert Installation",
      description: "Professional installation by certified technicians. Seamless integration with your existing plumbing.",
      color: "from-warning-orange to-ocean-blue",
      link: "/services#installation",
    },
    {
      icon: BarChart3,
      title: "IoT Monitoring",
      description: "Real-time tracking of water quality, filter life, and usage statistics through our smart dashboard.",
      color: "from-ocean-blue to-deep-blue",
      link: "/dashboard",
    },
    {
      icon: RefreshCw,
      title: "Auto-Refill Program",
      description: "Never run out! Automatic cartridge replacement when your filter reaches 85% depletion.",
      color: "from-leaf-green to-forest-green",
      link: "/services#subscription",
    },
    {
      icon: Award,
      title: "Rewards Program",
      description: "Earn points for every liter saved. Redeem for discounts, free services, and eco-friendly products.",
      color: "from-aqua-accent to-lime-green",
      link: "/rewards",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-aqua-accent/10 text-aqua-accent text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
            Complete Water Recycling Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From testing to installation and beyond, we provide end-to-end solutions 
            for sustainable water management in your home.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              variant="elevated"
              className="group relative overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Overlay on Hover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} 
              />
              
              <CardContent className="p-8">
                {/* Icon Container */}
                <div 
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="h-7 w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-dark-grey mb-3 group-hover:text-ocean-blue transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <Link
                  to={service.link}
                  className="inline-flex items-center text-ocean-blue font-medium hover:text-aqua-accent transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button asChild variant="cta" size="lg">
            <Link to="/services">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
