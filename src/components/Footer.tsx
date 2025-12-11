/**
 * Footer Component
 * Site-wide footer with links, contact info, and social media
 */

import { Link } from "react-router-dom";
import { 
  Droplets, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  MessageCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  // Phone number for contact
  const phoneNumber = "8925081899";
  const countryCode = "91";
  
  // Current year for copyright
  const currentYear = new Date().getFullYear();

  // Footer link sections configuration
  const footerSections = [
    {
      title: "Services",
      links: [
        { label: "Water Testing", href: "/services#testing" },
        { label: "Custom Filters", href: "/services#filters" },
        { label: "Installation", href: "/services#installation" },
        { label: "Maintenance", href: "/services#maintenance" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Our Mission", href: "/about#mission" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/faqs" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  // Social media links configuration
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  /**
   * Handle WhatsApp click
   */
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello AquaAdapt! I'm interested in your water filtration services. Can you help me?"
    );
    window.open(
      `https://wa.me/${countryCode}${phoneNumber}?text=${message}`,
      "_blank"
    );
  };

  /**
   * Handle Call click
   */
  const handleCall = () => {
    window.location.href = `tel:+${countryCode}${phoneNumber}`;
  };

  return (
    <footer className="bg-deep-blue text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Droplets className="h-8 w-8 text-aqua-accent" />
              <span className="text-2xl font-bold">
                Aqua<span className="text-aqua-accent">Adapt</span>
              </span>
            </Link>
            
            {/* Description */}
            <p className="text-white/70 mb-6 max-w-sm">
              Transforming grey water into clean, reusable water with custom-designed 
              eco-friendly filtration systems. Join the water conservation revolution.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:hello@aquaadapt.com" 
                className="flex items-center gap-3 text-white/70 hover:text-aqua-accent transition-colors"
              >
                <Mail className="h-5 w-5" />
                hello@aquaadapt.com
              </a>
              
              {/* WhatsApp Button */}
              <button 
                onClick={handleWhatsApp}
                className="flex items-center gap-3 text-white/70 hover:text-green-400 transition-colors"
                title={t.contact.whatsapp}
              >
                <MessageCircle className="h-5 w-5" />
                {t.contact.whatsapp}: +{countryCode}{phoneNumber}
              </button>
              
              {/* Call Button */}
              <button 
                onClick={handleCall}
                className="flex items-center gap-3 text-white/70 hover:text-blue-400 transition-colors"
                title={t.contact.call}
              >
                <Phone className="h-5 w-5" />
                {t.contact.call}: +{countryCode}{phoneNumber}
              </button>
              
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  123 Green Tech Park,<br />
                  Sector 42, Gurugram, India
                </span>
              </div>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-white/70 hover:text-aqua-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-white/50 text-sm">
              © {currentYear} AquaAdapt. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2 rounded-full bg-white/10 hover:bg-aqua-accent/20 hover:text-aqua-accent transition-all"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
export default Footer;
