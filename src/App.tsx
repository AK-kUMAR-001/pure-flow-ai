/**
 * App Component
 * Main application entry point with routing configuration
 * Includes all page routes and global providers
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Page imports
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HomeTest from "./pages/HomeTest";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import MobileResponsiveUI from "./pages/MobileResponsiveUI";
import NotFound from "./pages/NotFound";
import Reset from "./pages/Reset";

// Initialize React Query client for data fetching
const queryClient = new QueryClient();

/**
 * Main App Component
 * Wraps application with providers and defines routes
 */
const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast notifications */}
        <Toaster />
        <Sonner />
        
        {/* Router configuration */}
        <BrowserRouter>
          <Routes>
            {/* Default route - show landing if not authenticated */}
            <Route path="/" element={<Landing />} />
            
            {/* Reset route - clears storage */}
            <Route path="/reset" element={<Reset />} />
            
            {/* Landing and Auth pages - no authentication required */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Home route */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home-test"
              element={
                <ProtectedRoute>
                  <HomeTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mobile"
              element={
                <ProtectedRoute>
                  <MobileResponsiveUI />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </LanguageProvider>
);

export default App;
