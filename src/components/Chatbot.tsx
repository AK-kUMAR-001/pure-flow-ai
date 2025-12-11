/**
 * Chatbot Component
 * AI-powered chatbot assistant for customer support
 * Uses floating button with expandable chat window
 * 
 * TODO: Add Gemini API key from Google AI Studio
 * API Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
 */

import { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ========================================
   Message Interface
   Defines structure for chat messages
   ======================================== */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/* ========================================
   Chatbot Component
   Main chatbot interface with conversation handling
   ======================================== */
const Chatbot = () => {
  // State management for chat
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Ref for auto-scrolling to latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! 👋 I'm AquaBot, your water quality assistant. How can I help you today? You can ask me about:\n\n• Water testing services\n• Custom filter recommendations\n• Pricing and booking\n• Installation process",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  /**
   * Generate unique ID for messages
   * Uses timestamp + random string for uniqueness
   */
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Send message to AI and get response
   * TODO: Replace with actual Gemini API call
   * 
   * @param userMessage - The user's input message
   */
  const sendMessage = async (userMessage: string) => {
    // Prevent empty messages
    if (!userMessage.trim()) return;

    // Add user message to chat
    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // ============================================
      // TODO: Integrate Gemini API here
      // Replace the simulated response with actual API call
      // 
      // Example API call structure:
      // const response = await fetch(
      //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       contents: [{ parts: [{ text: userMessage }] }]
      //     })
      //   }
      // );
      // const data = await response.json();
      // const aiResponse = data.candidates[0].content.parts[0].text;
      // ============================================

      // Simulated AI response (remove when API is connected)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Context-aware mock responses
      const mockResponses: Record<string, string> = {
        test: "Our water testing service includes analysis of pH, TDS, turbidity, hardness, and more. It's completely FREE when you purchase a filter cartridge! Would you like to book a test?",
        filter: "We create custom 4-layer filtration systems using eco-friendly materials like Water Hyacinth, Activated Carbon, Banana Fiber, and Alumina Nano Beads. Each filter is designed based on your specific water quality needs.",
        price: "Our pricing starts at ₹4,500 for small cartridges (50L/day), ₹7,200 for medium (150L/day), and ₹11,000 for large (300L/day). Installation is always FREE!",
        book: "Great choice! You can book a water test by visiting our 'Book Test' page. Select your water source, preferred date & time, and we'll send a certified technician to your location.",
        default: "I'd be happy to help you with that! For specific inquiries about water testing, custom filters, or booking, please let me know what you'd like to explore. You can also call us at +91 8925081899 for immediate assistance.",
      };

      // Determine response based on keywords
      const lowerMessage = userMessage.toLowerCase();
      let responseText = mockResponses.default;
      
      if (lowerMessage.includes("test") || lowerMessage.includes("quality")) {
        responseText = mockResponses.test;
      } else if (lowerMessage.includes("filter") || lowerMessage.includes("cartridge")) {
        responseText = mockResponses.filter;
      } else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("₹")) {
        responseText = mockResponses.price;
      } else if (lowerMessage.includes("book") || lowerMessage.includes("appointment")) {
        responseText = mockResponses.book;
      }

      // Add AI response to chat
      const aiMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      // Handle API errors gracefully
      console.error("Chatbot error:", error);
      
      const errorMsg: Message = {
        id: generateId(),
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again or contact us directly at +91 8925081899.",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form submission
   * Prevents default and sends message
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  /**
   * Handle Enter key press for sending
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-aqua-lg transition-all duration-300",
          isOpen
            ? "bg-error-red hover:bg-error-red/90"
            : "bg-gradient-cta hover:shadow-aqua-glow animate-pulse-glow"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-300 origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        )}
      >
        <div className="bg-white rounded-2xl shadow-aqua-lg overflow-hidden border border-border">
          {/* Chat Header */}
          <div className="bg-gradient-primary p-4 water-bg">
            <div className="flex items-center gap-3">
              {/* Bot Avatar */}
              <div className="relative">
                <div className="p-2 bg-white/20 rounded-full">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-lime-green rounded-full border-2 border-white" />
              </div>
              
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  AquaBot
                  <Sparkles className="h-4 w-4 text-aqua-accent" />
                </h3>
                <p className="text-xs text-white/70">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-light-blue/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    "flex-shrink-0 p-2 rounded-full h-8 w-8 flex items-center justify-center",
                    message.role === "user"
                      ? "bg-ocean-blue"
                      : "bg-aqua-accent"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-deep-blue" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={cn(
                    "max-w-[75%] p-3 rounded-2xl text-sm",
                    message.role === "user"
                      ? "bg-ocean-blue text-white rounded-br-sm"
                      : "bg-white text-dark-grey shadow-aqua-sm rounded-bl-sm"
                  )}
                >
                  {/* Render message with line breaks */}
                  {message.content.split("\n").map((line, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="p-2 bg-aqua-accent rounded-full h-8 w-8 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-deep-blue" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-aqua-sm">
                  <Loader2 className="h-5 w-5 text-aqua-accent animate-spin" />
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                size="icon"
                variant="cta"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
