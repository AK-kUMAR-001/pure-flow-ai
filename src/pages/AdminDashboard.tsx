/**
 * Admin Dashboard Page
 * Shows customer management, monitoring, and data export features
 * Only accessible by admin users
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  BarChart3,
  Download,
  Search,
  Eye,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  Droplets,
  Calendar,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Indian states and districts data
const statesAndDistricts: Record<string, string[]> = {
  "Karnataka": ["Bangalore Urban", "Bangalore Rural", "Mysore", "Hubli", "Mangalore"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "South Delhi"],
};

interface CustomerDetail {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  mobile: string;
  address: string | null;
  district: string | null;
  state: string | null;
  family_members: number | null;
  water_source: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState<"customers" | "monitoring">("customers");
  const [customers, setCustomers] = useState<CustomerDetail[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Monitoring filters
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  // Check admin access on mount
  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Fetch customers when tab changes
  useEffect(() => {
    if (activeTab === "customers") {
      fetchCustomers();
    }
  }, [activeTab]);

  // Filter customers based on search and location
  useEffect(() => {
    let filtered = customers;
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.mobile.includes(searchQuery) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // State filter
    if (selectedState) {
      filtered = filtered.filter((c) => c.state === selectedState);
    }
    
    // District filter
    if (selectedDistrict) {
      filtered = filtered.filter((c) => c.district === selectedDistrict);
    }
    
    setFilteredCustomers(filtered);
  }, [customers, searchQuery, selectedState, selectedDistrict]);

  /**
   * Check if current user has admin role
   */
  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Access Denied",
          description: "Please login to access admin dashboard",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Check admin role using has_role function
      const { data: isAdmin, error } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });

      if (error || !isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/auth");
    }
  };

  /**
   * Fetch all customer details from database
   */
  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from("customer_details")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customer data",
        variant: "destructive",
      });
    }
  };

  /**
   * Export customer data to CSV
   */
  const exportToCSV = () => {
    const dataToExport = filteredCustomers.length > 0 ? filteredCustomers : customers;
    
    if (dataToExport.length === 0) {
      toast({
        title: "No Data",
        description: "No customer data available to export",
        variant: "destructive",
      });
      return;
    }

    // CSV headers
    const headers = [
      "Name",
      "Email",
      "Mobile",
      "Address",
      "District",
      "State",
      "Family Members",
      "Water Source",
      "Registered Date",
    ];

    // CSV rows
    const rows = dataToExport.map((c) => [
      c.full_name,
      c.email,
      c.mobile,
      c.address || "",
      c.district || "",
      c.state || "",
      c.family_members?.toString() || "",
      c.water_source || "",
      new Date(c.created_at).toLocaleDateString(),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `aquaadapt_customers_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast({
      title: "Export Successful",
      description: `Exported ${dataToExport.length} customer records`,
    });
  };

  /**
   * View customer details in modal
   */
  const viewCustomerDetails = (customer: CustomerDetail) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  // Calculate statistics for monitoring
  const getStateStats = () => {
    const stats: Record<string, number> = {};
    customers.forEach((c) => {
      if (c.state) {
        stats[c.state] = (stats[c.state] || 0) + 1;
      }
    });
    return stats;
  };

  const getDistrictStats = () => {
    const stats: Record<string, number> = {};
    const filtered = selectedState
      ? customers.filter((c) => c.state === selectedState)
      : customers;
    
    filtered.forEach((c) => {
      if (c.district) {
        stats[c.district] = (stats[c.district] || 0) + 1;
      }
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-blue/20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-aqua-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-blue/20">
      <Navigation />

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-primary water-bg relative">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Manage customers and monitor usage analytics</p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 mb-8">
            <Button
              variant={activeTab === "customers" ? "cta" : "outline"}
              onClick={() => setActiveTab("customers")}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Customer Details
            </Button>
            <Button
              variant={activeTab === "monitoring" ? "cta" : "outline"}
              onClick={() => setActiveTab("monitoring")}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Monitoring
            </Button>
          </div>

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <Card variant="elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-aqua-accent" />
                  All Customers ({filteredCustomers.length})
                </CardTitle>
                <Button onClick={exportToCSV} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {/* Search Bar */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, mobile, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Customer Table */}
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>District</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No customers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell className="font-medium">{customer.full_name}</TableCell>
                            <TableCell>{customer.mobile}</TableCell>
                            <TableCell>{customer.state || "-"}</TableCell>
                            <TableCell>{customer.district || "-"}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => viewCustomerDetails(customer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monitoring Tab */}
          {activeTab === "monitoring" && (
            <div className="space-y-6">
              {/* Filters */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-aqua-accent" />
                    Geographic Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">State</label>
                      <Select value={selectedState} onValueChange={(val) => {
                        setSelectedState(val);
                        setSelectedDistrict("");
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select State" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All States</SelectItem>
                          {Object.keys(statesAndDistricts).map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">District</label>
                      <Select 
                        value={selectedDistrict} 
                        onValueChange={setSelectedDistrict}
                        disabled={!selectedState}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Districts</SelectItem>
                          {selectedState &&
                            statesAndDistricts[selectedState]?.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card variant="elevated">
                  <CardContent className="p-6 text-center">
                    <Users className="h-10 w-10 text-aqua-accent mx-auto mb-3" />
                    <p className="text-3xl font-bold text-deep-blue">{customers.length}</p>
                    <p className="text-muted-foreground">Total Customers</p>
                  </CardContent>
                </Card>
                <Card variant="elevated">
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-10 w-10 text-leaf-green mx-auto mb-3" />
                    <p className="text-3xl font-bold text-deep-blue">
                      {Object.keys(getStateStats()).length}
                    </p>
                    <p className="text-muted-foreground">States Covered</p>
                  </CardContent>
                </Card>
                <Card variant="elevated">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-10 w-10 text-lime-green mx-auto mb-3" />
                    <p className="text-3xl font-bold text-deep-blue">
                      {Object.keys(getDistrictStats()).length}
                    </p>
                    <p className="text-muted-foreground">Districts Active</p>
                  </CardContent>
                </Card>
              </div>

              {/* State-wise Distribution */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Usage by {selectedState ? "District" : "State"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(selectedState ? getDistrictStats() : getStateStats())
                      .sort((a, b) => b[1] - a[1])
                      .map(([location, count]) => (
                        <div key={location} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium truncate">{location}</div>
                          <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-ocean-blue to-aqua-accent rounded-full"
                              style={{
                                width: `${(count / customers.length) * 100}%`,
                              }}
                            />
                          </div>
                          <div className="w-12 text-right text-sm font-semibold">{count}</div>
                        </div>
                      ))}
                    {Object.keys(selectedState ? getDistrictStats() : getStateStats()).length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No data available for the selected filters
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Customer Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-aqua-accent" />
              Customer Details
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-light-blue rounded-lg">
                <User className="h-5 w-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedCustomer.full_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light-blue rounded-lg">
                <Mail className="h-5 w-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light-blue rounded-lg">
                <Phone className="h-5 w-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{selectedCustomer.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light-blue rounded-lg">
                <Home className="h-5 w-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {selectedCustomer.address || "-"}
                    {selectedCustomer.district && `, ${selectedCustomer.district}`}
                    {selectedCustomer.state && `, ${selectedCustomer.state}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light-blue rounded-lg">
                <Users className="h-5 w-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Family Members</p>
                  <p className="font-medium">{selectedCustomer.family_members || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light-blue rounded-lg">
                <Droplets className="h-5 w-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Water Source</p>
                  <p className="font-medium">{selectedCustomer.water_source || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-light-blue rounded-lg">
                <Calendar className="h-5 w-5 text-ocean-blue" />
                <div>
                  <p className="text-sm text-muted-foreground">Registered On</p>
                  <p className="font-medium">
                    {new Date(selectedCustomer.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
