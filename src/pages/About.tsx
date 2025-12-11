/**
 * About Page
 * Company information, mission, innovators team, and impact stats
 */

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import ContactButtons from "@/components/ContactButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Droplets, 
  Leaf, 
  Target, 
  Heart, 
  Users, 
  Lightbulb,
  Globe,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  // Core values configuration
  const values = [
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Every product we create uses natural, biodegradable materials that return to the earth harmlessly.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Cutting-edge IoT technology meets traditional filtration wisdom for the best results.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Your satisfaction and water quality are our top priorities. 24/7 support guaranteed.",
    },
    {
      icon: Globe,
      title: "Impact Driven",
      description: "Every liter recycled contributes to a larger mission of global water conservation.",
    },
  ];

  // Innovators team - 6 members with roles
  const innovators = [
    {
      role: "Bio Technologist",
      initials: "BT",
    },
    {
      role: "Web - ML Engineer",
      initials: "WM",
    },
    {
      role: "Bio Technologist",
      initials: "BT",
    },
    {
      role: "Bio Technologist",
      initials: "BT",
    },
    {
      role: "IOT Engineer",
      initials: "IE",
    },
    {
      role: "Technical Assistance",
      initials: "TA",
    },
  ];

  // Impact statistics - placeholder format as requested
  const impactStats = [
    { value: "-", suffix: "M+", label: t.about.litersRecycled },
    { value: "-", suffix: "K+", label: t.about.happyHomes },
    { value: "-", suffix: "+", label: t.about.citiesServed },
    { value: "-", suffix: "%", label: t.about.satisfaction },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-primary water-bg relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 animate-fade-in">
            About AquaAdapt
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            {t.about.title}
            <br />
            <span className="text-aqua-accent">{t.about.subtitle}</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            We're on a mission to transform how India uses water, one household at a time.
          </p>
        </div>
        
        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Impact Statistics - Moved from home */}
      <section className="py-20 bg-gradient-primary water-bg relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.about.impact}
            </h2>
            <p className="text-white/80 text-lg">
              {t.about.impactSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Story Content */}
            <div className="animate-fade-in">
              <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-green/10 text-leaf-green text-sm font-medium mb-4">
                {t.about.ourStory}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-6">
                {t.about.storyTitle}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{t.about.story1}</p>
                <p>{t.about.story2}</p>
                <p>{t.about.story3}</p>
              </div>
            </div>

            {/* Story Visual */}
            <div className="relative animate-fade-in-up">
              <div className="aspect-square rounded-3xl bg-gradient-accent p-8 flex items-center justify-center">
                <Droplets className="w-32 h-32 text-white/80 animate-float" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-lime-green/20 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-aqua-accent/20 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <Card variant="elevated" className="p-8 animate-fade-in">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-primary mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-deep-blue mb-4">{t.about.missionTitle}</h3>
              <p className="text-muted-foreground text-lg">
                {t.about.mission}
              </p>
            </Card>

            {/* Vision Card */}
            <Card variant="elevated" className="p-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-cta mb-6">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-deep-blue mb-4">{t.about.visionTitle}</h3>
              <p className="text-muted-foreground text-lg">
                {t.about.vision}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-aqua-accent/10 text-aqua-accent text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
              {t.about.valuesTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={value.title} 
                variant="elevated" 
                className="p-6 text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-4 rounded-full bg-gradient-accent mb-4">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-deep-blue mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Innovators Section - 6 team members */}
      <section className="py-20 bg-light-blue/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-leaf-green/10 text-leaf-green text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
              {t.about.innovators}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.about.innovatorsSubtitle}
            </p>
          </div>

          {/* First row - 3 innovators */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {innovators.slice(0, 3).map((member, index) => (
              <div 
                key={`${member.role}-${index}`}
                className="flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Large Circle Image Placeholder */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-primary flex items-center justify-center mb-6 shadow-xl hover:scale-105 transition-transform">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {member.initials}
                  </span>
                </div>
                <p className="text-aqua-accent text-lg font-semibold text-center">
                  {member.role}
                </p>
              </div>
            ))}
          </div>

          {/* Second row - 3 innovators */}
          <div className="grid md:grid-cols-3 gap-8">
            {innovators.slice(3, 6).map((member, index) => (
              <div 
                key={`${member.role}-${index + 3}`}
                className="flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              >
                {/* Large Circle Image Placeholder */}
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-primary flex items-center justify-center mb-6 shadow-xl hover:scale-105 transition-transform">
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    {member.initials}
                  </span>
                </div>
                <p className="text-aqua-accent text-lg font-semibold text-center">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex p-4 rounded-full bg-aqua-accent/10 mb-6">
            <Users className="h-8 w-8 text-aqua-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-deep-blue mb-4">
            Join Our Mission
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Whether you're a homeowner looking to save water or a partner interested 
            in sustainable solutions, we'd love to connect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="cta" size="lg">
              <Link to="/booking">
                Book Free Test
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Partner With Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
};

export default About;
