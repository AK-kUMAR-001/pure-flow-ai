/**
 * Admin Analytics Dashboard
 * Comprehensive analytics for water prediction, bookings, revenue, and user growth
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, Users, Droplets, DollarSign, Calendar, 
  PieChart as PieChartIcon, Activity, AlertCircle, Download
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageWaterSavings: number;
  userGrowth: { month: string; users: number }[];
  bookingTrends: { month: string; bookings: number }[];
  revenueTrends: { month: string; revenue: number }[];
  predictionAccuracy: number;
  regionDistribution: { region: string; users: number }[];
  categoryBreakdown: { category: string; count: number }[];
}

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate data loading (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockMetrics: DashboardMetrics = {
        totalUsers: 1247,
        activeUsers: 892,
        totalBookings: 3456,
        completedBookings: 3124,
        totalRevenue: 524600,
        averageWaterSavings: 3847,
        userGrowth: [
          { month: 'Jan', users: 250 },
          { month: 'Feb', users: 380 },
          { month: 'Mar', users: 520 },
          { month: 'Apr', users: 680 },
          { month: 'May', users: 890 },
          { month: 'Jun', users: 1247 },
        ],
        bookingTrends: [
          { month: 'Jan', bookings: 120 },
          { month: 'Feb', bookings: 185 },
          { month: 'Mar', bookings: 340 },
          { month: 'Apr', bookings: 520 },
          { month: 'May', bookings: 810 },
          { month: 'Jun', bookings: 481 },
        ],
        revenueTrends: [
          { month: 'Jan', revenue: 18000 },
          { month: 'Feb', revenue: 27750 },
          { month: 'Mar', revenue: 51000 },
          { month: 'Apr', revenue: 78000 },
          { month: 'May', revenue: 121500 },
          { month: 'Jun', revenue: 72150 },
        ],
        predictionAccuracy: 92.3,
        regionDistribution: [
          { region: 'Maharashtra', users: 245 },
          { region: 'Delhi', users: 198 },
          { region: 'Karnataka', users: 176 },
          { region: 'Tamil Nadu', users: 154 },
          { region: 'Others', users: 474 },
        ],
        categoryBreakdown: [
          { category: 'Urban (2 BHK)', count: 445 },
          { category: 'Urban (3 BHK)', count: 380 },
          { category: 'Semi-Urban', count: 256 },
          { category: 'Rural', count: 166 },
        ],
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!metrics) return;

    const report = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      metrics,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2>Error Loading Dashboard</h2>
            <p className="text-muted-foreground">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Real-time analytics and performance metrics
                </p>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
                <Button onClick={downloadReport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                    <p className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">+5.2% this month</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                    <p className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">{((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}% online</p>
                  </div>
                  <Activity className="h-10 w-10 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold">{metrics.totalBookings.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">{((metrics.completedBookings / metrics.totalBookings) * 100).toFixed(1)}% completed</p>
                  </div>
                  <Calendar className="h-10 w-10 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                    <p className="text-2xl font-bold">₹{(metrics.totalRevenue / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-green-600 mt-1">+12.5% growth</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Avg Water Saved</p>
                    <p className="text-2xl font-bold">{(metrics.averageWaterSavings / 1000).toFixed(1)}K L</p>
                    <p className="text-xs text-blue-600 mt-1">Per user annually</p>
                  </div>
                  <Droplets className="h-10 w-10 text-cyan-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  User Growth Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#0088FE" 
                      strokeWidth={2}
                      dot={{ fill: '#0088FE', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.revenueTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value}`} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Booking Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics.bookingTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Region Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  User Distribution by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metrics.regionDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ region, users }) => `${region}: ${users}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="users"
                    >
                      {metrics.regionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Model Performance */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>ML Model Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Prediction Accuracy</span>
                    <span className="text-sm font-bold">{metrics.predictionAccuracy}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${metrics.predictionAccuracy}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Training Samples</p>
                    <p className="text-lg font-bold">10,000+</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">States Covered</p>
                    <p className="text-lg font-bold">28</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Model Version</p>
                    <p className="text-lg font-bold">v2.4.1</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">R² Score</p>
                    <p className="text-lg font-bold">0.89</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Household Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>User Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.categoryBreakdown.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{cat.category}</span>
                        <span className="text-sm font-bold">{cat.count}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            idx === 0 ? 'bg-blue-500' :
                            idx === 1 ? 'bg-green-500' :
                            idx === 2 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(cat.count / metrics.totalUsers) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
