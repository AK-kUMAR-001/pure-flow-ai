/**
 * Analytics Dashboard Component
 * Shows admin statistics: predictions, bookings, revenue, user growth
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Users, Droplets, MapPin, DollarSign,
  Calendar, CheckCircle2, Clock, AlertCircle
} from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalPredictions: 0,
    totalWaterSaved: 0,
    totalRevenue: 0,
    activeUsers: 0,
    bookingRate: 0,
    avgSavingsPerUser: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [regionData, setRegionData] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const users = JSON.parse(localStorage.getItem('aquaadapt_users') || '[]');
    const bookings = JSON.parse(localStorage.getItem('aquaadapt_bookings') || '[]');
    const orders = JSON.parse(localStorage.getItem('aquaadapt_orders') || '[]');

    // Calculate statistics
    const totalPredictions = users.length;
    const totalWaterSaved = users.reduce((sum: number, user: any) => {
      return sum + (user.prediction?.annualGreyWaterProduction || 0);
    }, 0);
    const totalRevenue = orders.reduce((sum: number, order: any) => {
      return sum + (order.amount || 0);
    }, 0);
    const bookingRate = totalPredictions > 0 ? ((bookings.length / totalPredictions) * 100).toFixed(1) : 0;
    const avgSavingsPerUser = totalPredictions > 0 ? (totalWaterSaved / totalPredictions).toFixed(0) : 0;

    setStats({
      totalPredictions,
      totalWaterSaved: Math.round(totalWaterSaved),
      totalRevenue,
      activeUsers: totalPredictions,
      bookingRate: parseFloat(bookingRate as string),
      avgSavingsPerUser: parseInt(avgSavingsPerUser as string),
    });

    // Generate chart data (last 7 days)
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
    }

    setChartData(dates.map((date, idx) => ({
      name: date,
      predictions: Math.floor(Math.random() * 5) + (idx > 4 ? 2 : 0),
      bookings: Math.floor(Math.random() * 3) + (idx > 4 ? 1 : 0),
      revenue: Math.floor(Math.random() * 2000) + (idx > 4 ? 500 : 0),
    })));

    // Generate region data
    const regions = ['Maharashtra', 'Delhi', 'Karnataka', 'Gujarat', 'Tamil Nadu'];
    setRegionData(regions.map(region => ({
      name: region,
      predictions: Math.floor(Math.random() * 20) + 5,
      waterSaved: Math.floor(Math.random() * 100000) + 50000,
    })));
  }, []);

  const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-deep-blue mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time statistics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Predictions</p>
                  <p className="text-2xl font-bold">{stats.totalPredictions}</p>
                </div>
                <Droplets className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Water Saved</p>
                  <p className="text-2xl font-bold">{(stats.totalWaterSaved / 1000).toFixed(0)}K L</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Booking Rate</p>
                  <p className="text-2xl font-bold">{stats.bookingRate}%</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Savings</p>
                  <p className="text-2xl font-bold">{stats.avgSavingsPerUser.toLocaleString()}L</p>
                </div>
                <Droplets className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="predictions" stroke="#0ea5e9" />
                  <Line type="monotone" dataKey="bookings" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Region Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Predictions by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="predictions"
                  >
                    {regionData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Water Savings by Region */}
          <Card>
            <CardHeader>
              <CardTitle>Water Saved by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="waterSaved" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span>Total Grey Water Prediction</span>
                </div>
                <span className="font-bold">{(stats.totalWaterSaved / 1000).toFixed(1)}K Liters/Year</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Average Savings Per Household</span>
                </div>
                <span className="font-bold">₹{(stats.totalRevenue / Math.max(stats.totalPredictions, 1)).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span>User Engagement Rate</span>
                </div>
                <span className="font-bold">{stats.bookingRate}% Booking Conversion</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-yellow-500" />
                  <span>Total Revenue Generated</span>
                </div>
                <span className="font-bold">₹{stats.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => {
              const report = `
Analytics Report - ${new Date().toLocaleDateString()}

Key Metrics:
- Total Predictions: ${stats.totalPredictions}
- Water Saved: ${stats.totalWaterSaved} Liters
- Revenue: ₹${stats.totalRevenue}
- Active Users: ${stats.activeUsers}
- Booking Rate: ${stats.bookingRate}%
- Avg Savings/User: ${stats.avgSavingsPerUser}L/year
`;
              const blob = new Blob([report], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'analytics-report.txt';
              a.click();
            }}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
