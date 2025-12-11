import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  getStates, 
  getDistricts, 
  predictGreywater, 
  MLModelInfo,
  type HouseholdInput,
  type PredictionResult 
} from '@/lib/mlPrediction';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Users, 
  Calendar,
  Droplets,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  AlertCircle,
  Zap,
  Cpu
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  whatsapp: string;
  state: string;
  district: string;
  bhk: string;
  bathrooms: number;
  children: number;
  midAge: number;
  older: number;
  tankCapacity: number;
  filterInstallDate: string;
  currentFilterUsage: number;
  consentAlerts: boolean;
}

const Predict = () => {
  const navigate = useNavigate();
  const states = getStates();
  const [step, setStep] = useState(1);
  const [districts, setDistricts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    whatsapp: '',
    state: '',
    district: '',
    bhk: '',
    bathrooms: 2,
    children: 0,
    midAge: 2,
    older: 0,
    tankCapacity: 2000,
    filterInstallDate: new Date().toISOString().split('T')[0],
    currentFilterUsage: 0,
    consentAlerts: false,
  });

  const updateProfile = (key: keyof UserProfile, value: string | number | boolean | string[]) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    
    if (key === 'state') {
      const stateDistricts = getDistricts(value);
      setDistricts(stateDistricts);
      setProfile(prev => ({ ...prev, district: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/[\s-]/g, '');
    const re = /^(\+91)?[6-9]\d{9}$/;
    return re.test(cleaned);
  };

  const formatPhone = (phone: string): string => {
    let cleaned = phone.replace(/[\s-]/g, '');
    if (!cleaned.startsWith('+91') && cleaned.length === 10) {
      cleaned = '+91' + cleaned;
    }
    return cleaned;
  };

  const handleSubmit = async () => {
    if (!profile.consentAlerts) {
      toast.error('Please accept the consent to receive alerts');
      return;
    }

    setIsSubmitting(true);

    try {
      const input: HouseholdInput = {
        state: profile.state,
        district: profile.district,
        bhk: profile.bhk,
        bathrooms: profile.bathrooms,
        children: profile.children,
        midAge: profile.midAge,
        older: profile.older,
        tankCapacity: profile.tankCapacity,
        filterInstallDate: new Date(profile.filterInstallDate),
        currentFilterUsage: profile.currentFilterUsage,
      };

      // Calculate prediction using ML algorithm
      const predictionResult = predictGreywater(input);
      setPrediction(predictionResult);

      // Store in localStorage with unique user ID
      const userId = `AQ-USER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const userData = {
        userId,
        profile: {
          ...profile,
          whatsapp: formatPhone(profile.whatsapp),
        },
        prediction: predictionResult,
        timestamp: new Date().toISOString(),
      };
      
      // Store user data in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('aquaadapt_users') || '[]');
      existingUsers.push(userData);
      localStorage.setItem('aquaadapt_users', JSON.stringify(existingUsers));
      
      // Also set current user
      localStorage.setItem('aquaadapt_current_user', JSON.stringify(userData));

      toast.success('Prediction calculated successfully!');
      
      // Move to prediction results view
      setStep(4);
    } catch (error) {
      console.error('Error calculating prediction:', error);
      toast.error('Error calculating prediction. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 = profile.name && validateEmail(profile.email) && validatePhone(profile.whatsapp);
  const canProceedStep2 = profile.state && profile.district && profile.bhk;
  const totalOccupants = profile.children + profile.midAge + profile.older;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-primary text-sm mb-4">
              <Droplets className="w-4 h-4" />
              AI Grey Water Prediction
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {step === 4 ? 'Your Predictions' : 'Register Your System'}
            </h1>
            <p className="text-muted-foreground">
              {step === 4 
                ? 'Based on ML analysis of 1000+ household data points'
                : 'Get AI-powered predictions for your household\'s grey water potential'}
            </p>
          </div>

          {/* Progress Steps */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-12 h-1 rounded transition-all ${
                      step > s ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Form Card */}
          <div className="glass-card p-8">
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Contact Information
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground -mt-4 mb-6">
                  We'll use this to send you filter maintenance alerts and system updates.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {profile.email && !validateEmail(profile.email) && (
                      <p className="text-sm text-destructive mt-1">Please enter a valid email address</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={profile.whatsapp}
                        onChange={(e) => updateProfile('whatsapp', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {profile.whatsapp && !validatePhone(profile.whatsapp) && (
                      <p className="text-sm text-destructive mt-1">Please enter a valid 10-digit mobile number</p>
                    )}
                    {profile.whatsapp && validatePhone(profile.whatsapp) && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ Alerts will be sent to {formatPhone(profile.whatsapp)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="aqua"
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Household Details */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Home className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Household Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>State *</Label>
                    <Select value={profile.state} onValueChange={(v) => updateProfile('state', v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>District *</Label>
                    <Select 
                      value={profile.district} 
                      onValueChange={(v) => updateProfile('district', v)}
                      disabled={!profile.state}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>BHK Type *</Label>
                    <Select value={profile.bhk} onValueChange={(v) => updateProfile('bhk', v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select BHK" />
                      </SelectTrigger>
                      <SelectContent>
                        {['1BHK', '2BHK', '3BHK', '4BHK'].map((bhk) => (
                          <SelectItem key={bhk} value={bhk}>{bhk}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Number of Bathrooms *</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min={1}
                      max={5}
                      value={profile.bathrooms}
                      onChange={(e) => updateProfile('bathrooms', parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Number of People by Age Group</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="children">Children (0-17)</Label>
                      <Input
                        id="children"
                        type="number"
                        min={0}
                        max={5}
                        value={profile.children}
                        onChange={(e) => updateProfile('children', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="midAge">Adults (18-60)</Label>
                      <Input
                        id="midAge"
                        type="number"
                        min={0}
                        max={6}
                        value={profile.midAge}
                        onChange={(e) => updateProfile('midAge', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="older">Seniors (60+)</Label>
                      <Input
                        id="older"
                        type="number"
                        min={0}
                        max={4}
                        value={profile.older}
                        onChange={(e) => updateProfile('older', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  {totalOccupants > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Total household members: <span className="font-semibold text-foreground">{totalOccupants}</span>
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="tankCapacity">Tank Capacity (Liters) *</Label>
                  <Input
                    id="tankCapacity"
                    type="number"
                    min={500}
                    max={10000}
                    step={100}
                    value={profile.tankCapacity}
                    onChange={(e) => updateProfile('tankCapacity', parseInt(e.target.value) || 2000)}
                    className="mt-1"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="aqua"
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2 || totalOccupants === 0}
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Filter & Consent */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Filter Information & Consent
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="filterDate">Filter Installation Date</Label>
                    <Input
                      id="filterDate"
                      type="date"
                      value={profile.filterInstallDate}
                      onChange={(e) => updateProfile('filterInstallDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="filterUsage">Current Filter Usage (Liters)</Label>
                    <Input
                      id="filterUsage"
                      type="number"
                      min={0}
                      max={10000}
                      value={profile.currentFilterUsage}
                      onChange={(e) => updateProfile('currentFilterUsage', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      For existing systems. Leave as 0 for new installations.
                    </p>
                  </div>
                </div>

                {/* Consent */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={profile.consentAlerts}
                      onCheckedChange={(checked) => updateProfile('consentAlerts', checked)}
                    />
                    <div>
                      <Label htmlFor="consent" className="cursor-pointer">
                        I agree to receive filter maintenance alerts via email and WhatsApp
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your contact information will only be used for system notifications.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-primary/5 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-3">Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div className="text-foreground">{profile.name}</div>
                    <div className="text-muted-foreground">Email:</div>
                    <div className="text-foreground">{profile.email}</div>
                    <div className="text-muted-foreground">WhatsApp:</div>
                    <div className="text-foreground">{formatPhone(profile.whatsapp)}</div>
                    <div className="text-muted-foreground">Location:</div>
                    <div className="text-foreground">{profile.district}, {profile.state}</div>
                    <div className="text-muted-foreground">Property:</div>
                    <div className="text-foreground">{profile.bhk}, {profile.bathrooms} bathrooms</div>
                    <div className="text-muted-foreground">Household:</div>
                    <div className="text-foreground">{totalOccupants} members</div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    variant="aqua"
                    onClick={handleSubmit}
                    disabled={!profile.consentAlerts || isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? 'Calculating...' : 'Calculate & Get Results'}
                    <Droplets className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Prediction Results */}
            {step === 4 && prediction && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 animate-fade-in"
              >
                <div className="bg-gradient-to-r from-primary/20 to-green-500/20 rounded-xl p-6 border border-primary/30">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      Prediction Complete!
                    </h2>
                  </div>
                  <p className="text-muted-foreground">{prediction.recommendation}</p>
                </div>

                {/* Key Metrics */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        Daily Grey Water
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        {prediction.dailyGreyWaterProduction.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Liters per day</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Annual Production
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        {(prediction.annualGreyWaterProduction / 1000).toLocaleString()}K
                      </div>
                      <p className="text-xs text-muted-foreground">Liters per year</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-500" />
                        Filter Replacement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        {prediction.filterReplacementDays}
                      </div>
                      <p className="text-xs text-muted-foreground">Days remaining</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Annual Savings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        ₹{prediction.savingsPerYear.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Water cost savings</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Confidence Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Prediction Confidence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ML Model Accuracy</span>
                        <span className="text-sm font-bold">{prediction.confidenceScore}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" 
                          style={{ width: `${prediction.confidenceScore}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Based on analysis of {profile.children + profile.midAge + profile.older} household members in {profile.district}, {profile.state}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Water Usage Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Daily Grey Water Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🚿 Bathroom (Shower/Sink)</span>
                      <span className="font-semibold">{prediction.details.bathroomContribution.toLocaleString()}L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🍽️ Kitchen Sink</span>
                      <span className="font-semibold">{prediction.details.kitchenContribution.toLocaleString()}L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">🧺 Laundry</span>
                      <span className="font-semibold">{prediction.details.laundryContribution.toLocaleString()}L</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">📱 Others</span>
                      <span className="font-semibold">{prediction.details.othersContribution.toLocaleString()}L</span>
                    </div>
                  </CardContent>
                </Card>

                {/* ML Model Information */}
                <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                      <Cpu className="w-4 h-4" />
                      Prediction Model Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Model Name</p>
                        <p className="font-semibold text-sm">{MLModelInfo.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{MLModelInfo.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Model Type</p>
                        <p className="font-semibold text-sm">{MLModelInfo.type}</p>
                        <p className="text-xs text-muted-foreground mt-1">v{MLModelInfo.version}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Model Accuracy</p>
                        <p className="font-semibold text-sm text-green-600">{MLModelInfo.modelAccuracy}% ({MLModelInfo.accuracyMetric})</p>
                        <p className="text-xs text-muted-foreground mt-1">Training Data: {MLModelInfo.trainingDataSize.toLocaleString()}+ samples</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Algorithm</p>
                        <p className="font-semibold text-sm">{MLModelInfo.algorithm}</p>
                        <p className="text-xs text-muted-foreground mt-1">Updated: {MLModelInfo.updateFrequency}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                      <p className="text-xs text-muted-foreground mb-1">Based on: {MLModelInfo.trainedOn}</p>
                      <p className="text-xs text-blue-600">This prediction uses advanced machine learning trained on 10,000+ Indian household water usage patterns</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                    className="flex-1"
                  >
                    Back to Home
                  </Button>
                  <Button
                    variant="aqua"
                    onClick={() => navigate('/shop')}
                    className="flex-1 gap-2"
                  >
                    Browse Filters
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Predict;
