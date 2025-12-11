/**
 * Dashboard Page
 * IoT monitoring dashboard with real-time stats
 * Shows water quality, savings, and filter status
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import ContactButtons from "@/components/ContactButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Droplets,
  Thermometer,
  Activity,
  Filter,
  TrendingUp,
  Leaf,
  PiggyBank,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Calendar,
  Settings,
  Bell,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data for dashboard (would come from API in production)
  const [filterLife, setFilterLife] = useState(78);
  
  // Quality metrics
  const qualityMetrics = [
    { label: "pH Level", value: "7.2", unit: "", status: "good", icon: Activity, range: "6.5-8.5" },
    { label: "TDS", value: "280", unit: "ppm", status: "good", icon: Droplets, range: "<500" },
    { label: "Turbidity", value: "Low", unit: "", status: "good", icon: Filter, range: "Low-Med" },
    { label: "Temperature", value: "24", unit: "°C", status: "good", icon: Thermometer, range: "20-30" },
  ];

  // Savings statistics
  const savingsStats = [
    { label: "Water Recycled", value: "2,450", unit: "L", icon: Droplets, color: "text-aqua-accent" },
    { label: "Money Saved", value: "₹3,200", unit: "", icon: PiggyBank, color: "text-lime-green" },
    { label: "Trees Equivalent", value: "14", unit: "", icon: Leaf, color: "text-leaf-green" },
    { label: "Carbon Offset", value: "28", unit: "kg", icon: TrendingUp, color: "text-ocean-blue" },
  ];

  // Usage history (mock data)
  const usageHistory = [
    { day: "Mon", liters: 340 },
    { day: "Tue", liters: 420 },
    { day: "Wed", liters: 380 },
    { day: "Thu", liters: 450 },
    { day: "Fri", liters: 390 },
    { day: "Sat", liters: 520 },
    { day: "Sun", liters: 480 },
  ];

  // Calculate max for chart scaling
  const maxUsage = Math.max(...usageHistory.map(d => d.liters));

  /**
   * Get status color based on metric status
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-leaf-green";
      case "warning": return "text-warning-orange";
      case "critical": return "text-error-red";
      default: return "text-muted-foreground";
    }
  };

  /**
   * Get filter status color and message
   */
  const getFilterStatus = () => {
    if (filterLife > 50) return { color: "bg-leaf-green", message: "Healthy" };
    if (filterLife > 20) return { color: "bg-warning-orange", message: "Replace Soon" };
    return { color: "bg-error-red", message: "Replace Now" };
  };

  const filterStatus = getFilterStatus();

  return (
    <div className="min-h-screen bg-light-blue/20">
      <Navigation />

      {/* Dashboard Header */}
      <section className="pt-24 pb-8 bg-gradient-primary water-bg relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Good Morning, Rajesh! 👋
              </h1>
              <p className="text-white/70 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-green animate-pulse" />
                System Online • Last updated: Just now
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="glass" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="glass" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          
          {/* Hero Quality Card */}
          <Card variant="elevated" className="mb-8 overflow-hidden animate-fade-in">
            <div className="bg-gradient-primary p-6 md:p-8 water-bg relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                {/* Quality Score */}
                <div className="text-center md:text-left">
                  <p className="text-white/70 mb-2">Your Water Quality</p>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {/* Circular Progress Ring */}
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          fill="none"
                          stroke="url(#qualityGradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${94 * 3.01} ${100 * 3.01}`}
                        />
                        <defs>
                          <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#41C9E2" />
                            <stop offset="100%" stopColor="#7FD858" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">94</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-white">Excellent ✨</span>
                      <p className="text-white/70">Safe for all uses</p>
                    </div>
                  </div>
                </div>

                {/* Quick Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {qualityMetrics.map((metric) => (
                    <div 
                      key={metric.label}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                    >
                      <metric.icon className="h-5 w-5 text-aqua-accent mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">
                        {metric.value}
                        <span className="text-sm font-normal ml-1">{metric.unit}</span>
                      </p>
                      <p className="text-xs text-white/70">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {savingsStats.map((stat, index) => (
              <Card 
                key={stat.label}
                variant="elevated" 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                  <p className="text-2xl font-bold text-deep-blue">
                    {stat.value}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Status & Usage Row */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Filter Status Card */}
            <Card variant="elevated" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-aqua-accent" />
                  Filter Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  {/* Filter Illustration */}
                  <div className="relative">
                    <div className="w-24 h-32 bg-gradient-to-b from-aqua-accent/20 to-leaf-green/20 rounded-xl border-2 border-aqua-accent/30 flex items-center justify-center">
                      <Droplets className="h-10 w-10 text-aqua-accent animate-float" />
                    </div>
                    {/* Fill Level */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-aqua-accent to-lime-green rounded-b-xl transition-all"
                      style={{ height: `${filterLife}%` }}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${filterStatus.color}`} />
                      <span className="font-semibold text-dark-grey">{filterStatus.message}</span>
                    </div>
                    <p className="text-3xl font-bold text-deep-blue mb-1">{filterLife}%</p>
                    <p className="text-sm text-muted-foreground">Filter life remaining</p>
                    
                    {/* Progress Bar */}
                    <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${filterStatus.color} transition-all`}
                        style={{ width: `${filterLife}%` }}
                      />
                    </div>
                  </div>
                </div>

                {filterLife < 30 && (
                  <div className="flex items-center gap-3 p-4 bg-warning-orange/10 rounded-xl mb-4">
                    <AlertTriangle className="h-5 w-5 text-warning-orange" />
                    <span className="text-sm">Order replacement soon to avoid interruption</span>
                  </div>
                )}

                <Button asChild variant="cta" className="w-full">
                  <Link to="/services#subscription">
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Order Replacement
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Usage Chart Card */}
            <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-aqua-accent" />
                  Weekly Usage
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-aqua-accent">
                  <Calendar className="mr-2 h-4 w-4" />
                  This Week
                </Button>
              </CardHeader>
              <CardContent>
                {/* Simple Bar Chart */}
                <div className="flex items-end justify-between h-48 gap-2">
                  {usageHistory.map((day, index) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs text-muted-foreground">{day.liters}L</span>
                      <div 
                        className="w-full bg-gradient-to-t from-ocean-blue to-aqua-accent rounded-t-lg transition-all hover:opacity-80"
                        style={{ 
                          height: `${(day.liters / maxUsage) * 100}%`,
                          minHeight: '20px'
                        }}
                      />
                      <span className="text-xs font-medium text-dark-grey">{day.day}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total this week</span>
                    <span className="font-semibold text-deep-blue">
                      {usageHistory.reduce((sum, d) => sum + d.liters, 0).toLocaleString()} L
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Daily average</span>
                    <span className="font-semibold text-deep-blue">
                      {Math.round(usageHistory.reduce((sum, d) => sum + d.liters, 0) / 7)} L
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Auto-Refill CTA */}
          <Card className="bg-gradient-cta text-white overflow-hidden animate-fade-in">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-full">
                  <RefreshCw className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Enable Auto-Refill</h3>
                  <p className="text-white/80">
                    Get 15% off and never run out! Auto-order when filter reaches 85%
                  </p>
                </div>
              </div>
              <Button variant="glass" size="lg" className="whitespace-nowrap">
                Enable Now
              </Button>
            </CardContent>
          </Card>

        </div>
      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
};

export default Dashboard;
