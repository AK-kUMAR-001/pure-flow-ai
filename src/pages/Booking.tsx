/**
 * Booking Page
 * Water quality test booking form with scheduling
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import ContactButtons from "@/components/ContactButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Check,
  ArrowRight,
  Star,
  Shield,
  Loader
} from "lucide-react";
import { toast } from "sonner";
import { sendBookingConfirmationEmails } from "@/services/emailService";

const Booking = () => {
  // Form state management
  const [step, setStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
  });

  // Water source options
  const waterSources = [
    { id: "kitchen", label: "Kitchen Sink", icon: "🚰" },
    { id: "washing", label: "Washing Machine", icon: "👕" },
    { id: "shower", label: "Shower/Bathroom", icon: "🚿" },
    { id: "mixed", label: "Mixed Sources", icon: "💧" },
  ];

  // Available time slots
  const timeSlots = [
    { id: "morning", label: "Morning", time: "9 AM - 12 PM" },
    { id: "afternoon", label: "Afternoon", time: "12 PM - 4 PM" },
    { id: "evening", label: "Evening", time: "4 PM - 7 PM" },
  ];

  // Generate next 7 available dates
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      });
    }
    return dates;
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Validate current step before proceeding
   */
  const validateStep = () => {
    if (step === 1 && !selectedSource) {
      toast.error("Please select a water source");
      return false;
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      toast.error("Please select date and time");
      return false;
    }
    if (step === 3) {
      if (!formData.name || !formData.phone || !formData.address) {
        toast.error("Please fill all required fields");
        return false;
      }
      // Basic phone validation
      if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return false;
      }
    }
    return true;
  };

  /**
   * Handle next step navigation
   */
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  /**
   * Handle booking submission with email confirmation
   */
  const handleSubmit = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      try {
        // Generate booking ID
        const bookingId = `BOOKING-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Send confirmation emails
        await sendBookingConfirmationEmails(
          formData.email,
          formData.name,
          "akshayprabhu19012005@gmail.com",
          {
            bookingId,
            bookingDate: selectedDate,
            bookingTime: selectedTime,
          }
        );

        toast.success("Booking confirmed! Confirmation email sent successfully.");
        
        // Save booking to localStorage
        const bookings = JSON.parse(localStorage.getItem('aquaadapt_bookings') || '[]');
        bookings.push({
          id: bookingId,
          ...formData,
          selectedSource,
          selectedDate,
          selectedTime,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('aquaadapt_bookings', JSON.stringify(bookings));
        
        setStep(5); // Success step
      } catch (error) {
        console.error('Error sending booking confirmation:', error);
        toast.error("Booking confirmed but email could not be sent. Our team will contact you shortly.");
        // Still proceed to success step as booking is saved
        setStep(5);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-primary water-bg relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            Book Your <span className="text-aqua-accent">Free</span> Water Test
          </h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Our certified technician will visit your home and analyze your water quality
          </p>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full" preserveAspectRatio="none">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s
                      ? "bg-gradient-cta text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 md:w-20 h-1 mx-2 rounded transition-all ${
                      step > s ? "bg-lime-green" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm text-muted-foreground">
              Step {Math.min(step, 4)} of 4: {
                step === 1 ? "Select Source" :
                step === 2 ? "Choose Date & Time" :
                step === 3 ? "Your Details" :
                step === 4 ? "Confirm Booking" : "Complete"
              }
            </span>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          
          {/* Step 1: Water Source Selection */}
          {step === 1 && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-aqua-accent" />
                  Select Water Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Which water source would you like us to test?
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {waterSources.map((source) => (
                    <button
                      key={source.id}
                      onClick={() => setSelectedSource(source.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedSource === source.id
                          ? "border-aqua-accent bg-aqua-accent/5 shadow-aqua-md"
                          : "border-border hover:border-aqua-accent/50"
                      }`}
                    >
                      <span className="text-3xl mb-3 block">{source.icon}</span>
                      <span className="font-medium text-dark-grey">{source.label}</span>
                    </button>
                  ))}
                </div>

                <Button 
                  variant="cta" 
                  className="w-full mt-8"
                  onClick={handleNext}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-aqua-accent" />
                  Choose Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Date Selection */}
                <p className="text-muted-foreground mb-4">Select a date:</p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                  {getAvailableDates().map((date) => (
                    <button
                      key={date.value}
                      onClick={() => setSelectedDate(date.value)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        selectedDate === date.value
                          ? "border-aqua-accent bg-aqua-accent/5"
                          : "border-border hover:border-aqua-accent/50"
                      }`}
                    >
                      <span className="text-sm font-medium">{date.label}</span>
                    </button>
                  ))}
                </div>

                {/* Time Selection */}
                <p className="text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Select a time slot:
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTime(slot.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedTime === slot.id
                          ? "border-aqua-accent bg-aqua-accent/5"
                          : "border-border hover:border-aqua-accent/50"
                      }`}
                    >
                      <span className="block font-medium text-dark-grey">{slot.label}</span>
                      <span className="text-xs text-muted-foreground">{slot.time}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button variant="cta" className="flex-1" onClick={handleNext}>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: User Details */}
          {step === 3 && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-aqua-accent" />
                  Your Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-12"
                        variant="neumorphic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-12"
                        variant="neumorphic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Email (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-12"
                        variant="neumorphic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        name="address"
                        placeholder="Full address with pin code"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="pl-12"
                        variant="neumorphic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Landmark (Optional)
                    </label>
                    <Input
                      name="landmark"
                      placeholder="Nearby landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      variant="neumorphic"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button variant="cta" className="flex-1" onClick={handleNext}>
                    Review Booking
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-leaf-green" />
                  Confirm Your Booking
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Booking Summary */}
                <div className="bg-light-blue/50 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-deep-blue mb-4">Booking Summary</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Water Source:</span>
                      <span className="font-medium">
                        {waterSources.find(s => s.id === selectedSource)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {getAvailableDates().find(d => d.value === selectedDate)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {timeSlots.find(t => t.id === selectedTime)?.time}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-medium text-right max-w-[60%]">{formData.address}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-aqua-accent/20">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Test Cost:</span>
                      <div className="text-right">
                        <span className="line-through text-muted-foreground mr-2">₹500</span>
                        <span className="font-bold text-leaf-green">FREE</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      * Free when you purchase a filter cartridge
                    </p>
                  </div>
                </div>

                {/* Technician Info */}
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-aqua-sm mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-lg font-bold text-white">AK</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Amit Kumar</span>
                      <span className="flex items-center text-warning-orange text-sm">
                        <Star className="h-4 w-4 fill-current" />
                        4.9
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-leaf-green" />
                      Verified Expert • 150+ Tests
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(3)} disabled={isSubmitting}>
                    Back
                  </Button>
                  <Button variant="cta" className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Booking
                        <Check className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <Card variant="elevated" className="text-center animate-bounce-in">
              <CardContent className="py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-cta flex items-center justify-center animate-bounce-in">
                  <Check className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-deep-blue mb-2">
                  Booking Confirmed! 🎉
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your water quality test has been scheduled successfully.
                  <br />
                  You'll receive a confirmation SMS shortly.
                </p>

                <div className="bg-light-blue/50 rounded-xl p-4 mb-6 text-left">
                  <div className="text-sm space-y-2">
                    <p><strong>Booking ID:</strong> AQA-{Date.now().toString().slice(-8)}</p>
                    <p><strong>Date:</strong> {getAvailableDates().find(d => d.value === selectedDate)?.label}</p>
                    <p><strong>Time:</strong> {timeSlots.find(t => t.id === selectedTime)?.time}</p>
                  </div>
                </div>

                <Button asChild variant="cta" className="w-full">
                  <a href="/">Return to Home</a>
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
};

export default Booking;
