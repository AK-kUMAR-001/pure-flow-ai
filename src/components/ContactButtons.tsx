/**
 * Contact Buttons Component
 * Floating action buttons for WhatsApp and Call
 * Includes language support for multiple languages
 */

import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const ContactButtons = () => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Phone number
  const phoneNumber = "8925081899";
  const countryCode = "91"; // India

  /**
   * Handle WhatsApp button click
   * Opens WhatsApp with pre-filled message
   */
  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Hello AquaAdapt! I'm interested in your water filtration services. Can you help me?"
    );
    window.open(
      `https://wa.me/${countryCode}${phoneNumber}?text=${message}`,
      "_blank"
    );
    setIsExpanded(false);
  };

  /**
   * Handle Call button click
   * Initiates phone call
   */
  const handleCall = () => {
    window.location.href = `tel:+${countryCode}${phoneNumber}`;
    setIsExpanded(false);
  };

  return (
    <>
      {/* Expanded Menu - Shows on hover/click */}
      {isExpanded && (
        <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-40 animate-scale-in">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsApp}
            className={cn(
              "group relative flex items-center gap-3 px-4 py-3",
              "bg-green-500 hover:bg-green-600 text-white rounded-full",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "transform hover:scale-110"
            )}
            title={t.contact.whatsapp}
            aria-label={t.contact.whatsapp}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">
              {t.contact.whatsapp}
            </span>
          </button>

          {/* Call Button */}
          <button
            onClick={handleCall}
            className={cn(
              "group relative flex items-center gap-3 px-4 py-3",
              "bg-blue-500 hover:bg-blue-600 text-white rounded-full",
              "shadow-lg hover:shadow-xl transition-all duration-300",
              "transform hover:scale-110"
            )}
            title={t.contact.call}
            aria-label={t.contact.call}
          >
            <Phone className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">
              {t.contact.call}
            </span>
          </button>
        </div>
      )}

      {/* Main Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "relative flex items-center justify-center h-14 w-14",
            "bg-gradient-primary text-white rounded-full",
            "shadow-lg hover:shadow-2xl transition-all duration-300",
            "transform hover:scale-110 active:scale-95",
            "border border-white/20"
          )}
          title={isExpanded ? "Close" : "Contact us"}
          aria-label={isExpanded ? "Close" : "Contact us"}
        >
          {isExpanded ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              {/* Pulsing background for attention */}
              <div className="absolute inset-0 bg-gradient-primary rounded-full animate-pulse" />
              <div className="relative flex items-center justify-center gap-2">
                <MessageCircle className="h-6 w-6" />
                <Phone className="h-5 w-5" />
              </div>
            </>
          )}
        </button>

        {/* Floating label/tooltip */}
        {!isExpanded && (
          <div className="absolute -top-12 right-0 bg-dark-grey text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap animate-fade-in pointer-events-none">
            💬 Chat or Call
          </div>
        )}
      </div>

      {/* Backdrop for mobile - closes menu when clicked */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsExpanded(false)}
          aria-label="Close contact menu"
        />
      )}
    </>
  );
};

export default ContactButtons;
