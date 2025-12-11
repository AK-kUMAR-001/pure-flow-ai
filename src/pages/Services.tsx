/**
 * Services Page
 * Detailed information about all services offered
 */

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import ContactButtons from "@/components/ContactButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TestTube2, 
  Filter, 
  Wrench, 
  BarChart3, 
  RefreshCw, 
  Award,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  // Detailed services configuration
  const services = [
    {
      id: "testing",
      icon: TestTube2,
      title: "Water Quality Testing",
      description: "Comprehensive laboratory analysis of your water quality by certified technicians.",
      features: [
        "pH Level Analysis",
        "Total Dissolved Solids (TDS)",
        "Turbidity Measurement",
        "Hardness Testing",
        "Bacterial Contamination Check",
        "Heavy Metals Detection",
      ],
      price: "FREE",
      priceNote: "with filter purchase",
      color: "from-aqua-accent to-ocean-blue",
    },
    {
      id: "filters",
      icon: Filter,
      title: "Custom Filtration Systems",
      description: "Eco-friendly 4-layer filters designed specifically for your water conditions.",
      features: [
        "Water Hyacinth Layer (Natural)",
        "Activated Carbon (Odor Removal)",
        "Banana Fiber (Contaminant Trap)",
        "Alumina Nano Beads (Purification)",
        "AI-Optimized Composition",
        "Size Options: 50L, 150L, 300L/day",
      ],
      price: "₹4,500",
      priceNote: "starting price",
      color: "from-lime-green to-leaf-green",
    },
    {
      id: "installation",
      icon: Wrench,
      title: "Professional Installation",
      description: "Expert installation with seamless integration into your existing plumbing.",
      features: [
        "Certified Technicians",
        "Same-Day Service Available",
        "Plumbing Integration",
        "System Testing & Calibration",
        "Usage Training",
        "1-Year Installation Warranty",
      ],
      price: "FREE",
      priceNote: "included with purchase",
      color: "from-warning-orange to-ocean-blue",
    },
    {
      id: "monitoring",
      icon: BarChart3,
      title: "IoT Smart Monitoring",
      description: "Real-time tracking and alerts through our advanced monitoring dashboard.",
      features: [
        "Real-Time Water Quality",
        "Flow Rate Monitoring",
        "Filter Life Tracking",
        "Usage Analytics",
        "Mobile App Access",
        "Automated Alerts",
      ],
      price: "Included",
      priceNote: "with all systems",
      color: "from-ocean-blue to-deep-blue",
    },
    {
      id: "subscription",
      icon: RefreshCw,
      title: "Auto-Refill Program",
      description: "Never run out with our automatic cartridge replacement service.",
      features: [
        "15% Discount on Cartridges",
        "Auto-Order at 85% Depletion",
        "Priority Delivery",
        "Free Installation",
        "Cancel Anytime",
        "Flexible Scheduling",
      ],
      price: "15%",
      priceNote: "savings guaranteed",
      color: "from-leaf-green to-forest-green",
    },
    {
      id: "rewards",
      icon: Award,
      title: "Rewards & Referrals",
      description: "Earn points for every liter saved and refer friends for extra benefits.",
      features: [
        "Points per Liter Recycled",
        "Referral Bonuses (₹1,000 each)",
        "Tier-Based Benefits",
        "Exclusive Discounts",
        "Early Access to Products",
        "Eco-Friendly Merchandise",
      ],
      price: "Earn",
      priceNote: "while you save",
      color: "from-aqua-accent to-lime-green",
    },
  ];

  // Pricing tiers
  const pricingTiers = [
    {
      name: "Small",
      capacity: "50L/day",
      price: "₹4,500",
      ideal: "1-2 people",
      features: ["Basic Filtration", "IoT Monitoring", "1-Year Warranty"],
    },
    {
      name: "Medium",
      capacity: "150L/day",
      price: "₹7,200",
      ideal: "3-4 people",
      popular: true,
      features: ["4-Layer Filtration", "IoT Monitoring", "2-Year Warranty", "Priority Support"],
    },
    {
      name: "Large",
      capacity: "300L/day",
      price: "₹11,000",
      ideal: "5+ people",
      features: ["Premium Filtration", "IoT Monitoring", "3-Year Warranty", "Priority Support", "Free Maintenance"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-primary water-bg relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 animate-fade-in">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            Complete Water
            <br />
            <span className="text-aqua-accent">Recycling Solutions</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            From testing to monitoring, we provide end-to-end solutions for sustainable water management.
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={service.id}
                id={service.id}
                variant="elevated"
                className="overflow-hidden animate-fade-in scroll-mt-24"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${service.color}`} />
                
                <CardHeader>
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-4 w-fit`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardHeader>

                <CardContent>
                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-leaf-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-dark-grey">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Price */}
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-ocean-blue">
                        {service.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {service.priceNote}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-ocean-blue/10 text-ocean-blue text-sm font-medium mb-4">
              Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
              Choose Your Filter Size
            </h2>
            <p className="text-muted-foreground text-lg">
              All plans include free installation, IoT monitoring, and eco-friendly materials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={tier.name}
                variant={tier.popular ? "elevated" : "default"}
                className={`relative animate-fade-in ${tier.popular ? "ring-2 ring-aqua-accent" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-gradient-cta text-white text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <p className="text-aqua-accent font-medium">{tier.capacity}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-deep-blue">{tier.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ideal for {tier.ideal}
                  </p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-leaf-green" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    asChild 
                    variant={tier.popular ? "cta" : "outline"} 
                    className="w-full"
                  >
                    <Link to="/booking">
                      Choose {tier.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
              Why Choose AquaAdapt?
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Fast Installation", desc: "Same-day service available" },
              { icon: Shield, title: "3-Year Warranty", desc: "Complete peace of mind" },
              { icon: Clock, title: "24/7 Support", desc: "Always here to help" },
              { icon: Award, title: "Certified Quality", desc: "ISO 9001:2015 compliant" },
            ].map((item, index) => (
              <div 
                key={item.title} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-4 rounded-full bg-aqua-accent/10 mb-4">
                  <item.icon className="h-8 w-8 text-aqua-accent" />
                </div>
                <h3 className="font-semibold text-deep-blue mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary water-bg relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-white/80 max-w-xl mx-auto mb-8">
            Book your free water test today and get a personalized quote
          </p>
          <Button asChild variant="cta" size="xl">
            <Link to="/booking">
              Book Free Test
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
};

export default Services;
