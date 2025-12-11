/**
 * Contact Page
 * Direct customer support with Call and WhatsApp options
 * Removes Get Started CTA, focuses on communication
 */

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import ContactButtons from "@/components/ContactButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

// Support contact configuration
const SUPPORT_PHONE = "+918925081899";
const SUPPORT_EMAIL = "support@aquaadapt.com";

const Contact = () => {
  /**
   * Initiate phone call to support
   */
  const handleCall = () => {
    window.location.href = `tel:${SUPPORT_PHONE}`;
  };

  /**
   * Open WhatsApp chat with support
   */
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hello! I need assistance with AquaAdapt water filtration services.");
    window.open(`https://wa.me/${SUPPORT_PHONE.replace("+", "")}?text=${message}`, "_blank");
  };

  // Support features
  const supportFeatures = [
    { icon: Clock, text: "Available 9 AM - 9 PM, Mon - Sat" },
    { icon: Headphones, text: "Dedicated customer support team" },
    { icon: CheckCircle2, text: "Quick response within 24 hours" },
  ];

  return (
    <div className="min-h-screen bg-light-blue/20">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-primary water-bg relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Headphones className="h-5 w-5 text-aqua-accent" />
              <span className="text-white text-sm">Customer Support</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              We're Here to Help
            </h1>
            <p className="text-white/80 text-lg">
              Connect with our support team instantly via call or WhatsApp. 
              We're committed to providing the best assistance for all your water filtration needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Quick Contact Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Call Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="elevated" className="h-full overflow-hidden group cursor-pointer" onClick={handleCall}>
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-leaf-green to-forest-green p-8 text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Phone className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Call Us</h3>
                      <p className="text-white/80 mb-6">
                        Speak directly with our support team for immediate assistance
                      </p>
                      <Button 
                        variant="glass" 
                        size="lg" 
                        className="w-full gap-2"
                        onClick={handleCall}
                      >
                        <Phone className="h-5 w-5" />
                        Call Now
                      </Button>
                      <p className="text-center mt-4 text-white/70 text-sm">
                        {SUPPORT_PHONE}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* WhatsApp Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card variant="elevated" className="h-full overflow-hidden group cursor-pointer" onClick={handleWhatsApp}>
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-lime-green to-leaf-green p-8 text-white">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <MessageCircle className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">WhatsApp</h3>
                      <p className="text-white/80 mb-6">
                        Chat with us on WhatsApp for quick queries and support
                      </p>
                      <Button 
                        variant="glass" 
                        size="lg" 
                        className="w-full gap-2"
                        onClick={handleWhatsApp}
                      >
                        <MessageCircle className="h-5 w-5" />
                        Chat on WhatsApp
                      </Button>
                      <p className="text-center mt-4 text-white/70 text-sm">
                        Quick Response Guaranteed
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Support Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="elevated">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-deep-blue mb-6 text-center">
                    Why Contact Us?
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {supportFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 bg-light-blue rounded-xl">
                        <feature.icon className="h-6 w-6 text-aqua-accent flex-shrink-0" />
                        <span className="text-dark-grey">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <Card variant="elevated">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-deep-blue mb-6">
                    Other Ways to Reach Us
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Email */}
                    <a 
                      href={`mailto:${SUPPORT_EMAIL}`}
                      className="flex items-start gap-4 p-4 bg-light-blue rounded-xl hover:bg-aqua-accent/10 transition-colors group"
                    >
                      <div className="p-3 bg-white rounded-lg shadow-sm group-hover:bg-aqua-accent/20 transition-colors">
                        <Mail className="h-6 w-6 text-ocean-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-deep-blue">Email Us</p>
                        <p className="text-muted-foreground">{SUPPORT_EMAIL}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          For detailed inquiries and documentation
                        </p>
                      </div>
                    </a>

                    {/* Office Address */}
                    <div className="flex items-start gap-4 p-4 bg-light-blue rounded-xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <MapPin className="h-6 w-6 text-ocean-blue" />
                      </div>
                      <div>
                        <p className="font-medium text-deep-blue">Visit Us</p>
                        <p className="text-muted-foreground">
                          123 Green Tech Park,<br />
                          Sector 42, Gurugram,<br />
                          Haryana - 122001
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* FAQ Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <Card className="bg-gradient-cta text-white overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-2">Have Questions?</h3>
                  <p className="text-white/80 mb-4">
                    Check out our frequently asked questions for quick answers
                  </p>
                  <Button variant="glass" asChild>
                    <a href="/faqs">View FAQs</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
};

export default Contact;
