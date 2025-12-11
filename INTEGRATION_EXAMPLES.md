# Integration Examples - Three New Features

## Example 1: Using Analytics Dashboard

### Accessing the Dashboard
```typescript
// Navigation
import { Link } from 'react-router-dom';

export const AdminNav = () => {
  return (
    <Link to="/analytics" className="nav-link">
      View Analytics
    </Link>
  );
};
```

### Custom Analytics Component
```typescript
import AnalyticsDashboard from '@/pages/AnalyticsDashboard';
import { useAuth } from '@/contexts/AuthContext';

export const AdminPanel = () => {
  const { user } = useAuth();
  
  // Check if user has admin role
  if (user?.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return <AnalyticsDashboard />;
};
```

### Using Analytics Data in Other Components
```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const MetricsSummary = () => {
  const { data: metrics } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('metrics')
        .select('*')
        .single();
      return data;
    }
  });

  return (
    <div className="metrics-grid">
      <MetricCard 
        title="Total Users" 
        value={metrics?.totalUsers} 
        growth="+5.2%" 
      />
      <MetricCard 
        title="Revenue" 
        value={`₹${metrics?.totalRevenue}`} 
        growth="+12.5%" 
      />
    </div>
  );
};
```

---

## Example 2: Mobile Responsive UI Implementation

### Detect Device and Adapt Layout
```typescript
import MobileResponsiveUI from '@/pages/MobileResponsiveUI';
import { useEffect, useState } from 'react';

export const AdaptiveLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-layout">
        <MobileNav />
        {children}
        <MobileFooter />
      </div>
    );
  }

  return (
    <div className="desktop-layout">
      <DesktopNav />
      {children}
      <DesktopFooter />
    </div>
  );
};
```

### PWA Installation Prompt
```typescript
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      toast.success('App installing...');
    }
  };

  if (isInstalled) {
    return <div>✓ App Installed</div>;
  }

  return deferredPrompt ? (
    <Button onClick={handleInstall} className="gap-2">
      <Download className="h-4 w-4" />
      Install App
    </Button>
  ) : null;
};
```

### Service Worker Offline Support
```typescript
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker?.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New version available');
          }
        });
      });
    } catch (error) {
      console.error('SW registration failed:', error);
    }
  }
};
```

### Responsive Tailwind Classes
```typescript
export const ResponsiveCard = ({ title, children }: any) => {
  return (
    <div className="
      w-full                    // Mobile: full width
      md:w-1/2                  // Tablet: half width
      lg:w-1/3                  // Desktop: third width
      
      text-base                 // Mobile: 16px
      md:text-lg                // Tablet: 18px
      lg:text-xl                // Desktop: 20px
      
      px-4                      // Mobile: 16px padding
      md:px-6                   // Tablet: 24px padding
      lg:px-8                   // Desktop: 32px padding
      
      py-4                      // Mobile: 16px
      md:py-6                   // Tablet: 24px
      lg:py-8                   // Desktop: 32px
    ">
      <h2 className="font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};
```

---

## Example 3: AI Enhancements Integration

### Using Enhanced Predictions in Home Test
```typescript
import { enhanceMLPrediction } from '@/lib/aiEnhancements';
import { predictGreywater } from '@/lib/mlPrediction';

export const EnhancedPredictionTest = async (householdData: any) => {
  // Step 1: Get base prediction from ML model
  const basePrediction = await predictGreywater({
    familyMembers: householdData.members,
    floorArea: householdData.area,
    region: householdData.region,
    householdType: householdData.type,
  });

  // Step 2: Enhance with seasonal/weather/climate factors
  const enhanced = await enhanceMLPrediction(
    basePrediction.prediction,
    new Date(),                    // Current date
    householdData.region,          // e.g., "Maharashtra"
    householdData.latitude || 19.0,
    householdData.longitude || 72.0,
    householdData.type            // e.g., "Urban (3 BHK)"
  );

  // Step 3: Display results
  return {
    basePrediction: basePrediction.prediction,
    seasonalAdjustedPrediction: enhanced.finalPrediction,
    adjustments: {
      seasonal: enhanced.seasonalAdjustment,
      weather: enhanced.weatherAdjustment,
      climate: enhanced.climateAdjustment,
    },
    confidence: enhanced.confidence,
    factors: enhanced.factors,
  };
};
```

### Generate Weather Report
```typescript
import { generateWeatherReport } from '@/lib/aiEnhancements';

export const WeatherImpactDisplay = async () => {
  const report = await generateWeatherReport('Maharashtra', new Date());

  return (
    <div className="weather-report">
      <h3>Weather Impact Analysis</h3>
      
      <div className="weather-current">
        <p>Temperature: {report.weatherData.temperature}°C</p>
        <p>Humidity: {report.weatherData.humidity}%</p>
        <p>Rainfall: {report.weatherData.rainfall}mm</p>
        <p>Condition: {report.weatherData.condition}</p>
      </div>

      <div className="adjustments">
        <p>Seasonal Factor: {report.adjustments.seasonal}x</p>
        <p>Weather Factor: {report.adjustments.weather}x</p>
        <p>Climate Factor: {report.adjustments.climate}x</p>
      </div>

      <div className="recommendations">
        {report.recommendations.map((rec, i) => (
          <p key={i}>• {rec}</p>
        ))}
      </div>
    </div>
  );
};
```

### Multi-Season Predictions
```typescript
import { generateMultiSeasonPredictions } from '@/lib/aiEnhancements';

export const SeasonalForecast = async (currentPrediction: number, region: string) => {
  const seasonalPredictions = await generateMultiSeasonPredictions(
    currentPrediction,
    region,
    "Urban (3 BHK)"
  );

  return (
    <div className="seasonal-forecast">
      <h3>Annual Water Usage Forecast</h3>
      
      {Object.entries(seasonalPredictions).map(([season, prediction]) => (
        <div key={season} className="season-card">
          <h4 className="capitalize">{season}</h4>
          <p>Predicted: {prediction.finalPrediction} L/day</p>
          <p>Confidence: {prediction.confidence}%</p>
          
          <div className="factors">
            {prediction.factors.map((factor, i) => (
              <span key={i} className="factor-tag">{factor}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Export Enhancement Report
```typescript
import { exportAIEnhancementsSummary } from '@/lib/aiEnhancements';

export const DownloadReport = async (prediction: AIEnhancedPrediction) => {
  const summary = exportAIEnhancementsSummary(prediction);
  
  // Create downloadable file
  const blob = new Blob([summary], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `water-prediction-${new Date().toISOString()}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
};
```

---

## Example 4: Complete Integration in Dashboard

```typescript
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { enhanceMLPrediction, generateWeatherReport } from '@/lib/aiEnhancements';
import { supabase } from '@/lib/supabase';

export const CompleteDashboard = () => {
  const [prediction, setPrediction] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Get user data
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // 2. Get base prediction
      const { data: ml } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // 3. Enhance prediction
      const enhanced = await enhanceMLPrediction(
        ml.prediction,
        new Date(),
        profile.region,
        profile.latitude,
        profile.longitude,
        profile.household_type
      );
      setPrediction(enhanced);

      // 4. Get weather impact
      const weatherReport = await generateWeatherReport(profile.region);
      setWeather(weatherReport);

      // 5. Get analytics
      const { data: analyticsData } = await supabase
        .from('analytics_metrics')
        .select('*')
        .single();
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Prediction Card */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Water Prediction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Base Prediction</p>
              <p className="text-2xl font-bold">{prediction?.basePrediction} L</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Adjusted Prediction</p>
              <p className="text-2xl font-bold text-blue-600">
                {prediction?.finalPrediction} L
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Adjustments:</p>
            <ul className="text-sm space-y-1 ml-4">
              {prediction?.factors.map((factor: string, i: number) => (
                <li key={i}>• {factor}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">
            Confidence: {prediction?.confidence}%
          </p>
        </CardContent>
      </Card>

      {/* Weather Impact Card */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Impact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Temperature</p>
              <p className="font-semibold">{weather?.weatherData.temperature}°C</p>
            </div>
            <div>
              <p className="text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weather?.weatherData.humidity}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rainfall</p>
              <p className="font-semibold">{weather?.weatherData.rainfall}mm</p>
            </div>
            <div>
              <p className="text-muted-foreground">Condition</p>
              <p className="font-semibold capitalize">{weather?.weatherData.condition}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">Recommendations:</p>
            <ul className="text-sm space-y-1 ml-4">
              {weather?.recommendations.map((rec: string, i: number) => (
                <li key={i}>✓ {rec}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{analytics?.totalUsers}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Bookings Made</p>
              <p className="text-2xl font-bold">{analytics?.totalBookings}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₹{analytics?.totalRevenue}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## Example 5: Testing the Features

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { 
  getCurrentSeason, 
  getSeasonalMultiplier,
  calculateWeatherAdjustment,
  enhanceMLPrediction 
} from '@/lib/aiEnhancements';

describe('AI Enhancements', () => {
  it('should detect season correctly', () => {
    const summerDate = new Date(2024, 4, 15); // May
    expect(getCurrentSeason(summerDate, 19.0)).toBe('spring');

    const monsoonDate = new Date(2024, 7, 15); // August
    expect(getCurrentSeason(monsoonDate, 19.0)).toBe('summer');
  });

  it('should apply seasonal multipliers', () => {
    const summer = getSeasonalMultiplier('summer');
    expect(summer.multiplier).toBe(1.35);

    const monsoon = getSeasonalMultiplier('monsoon');
    expect(monsoon.multiplier).toBe(0.55);
  });

  it('should enhance prediction correctly', async () => {
    const enhanced = await enhanceMLPrediction(
      150,
      new Date(),
      'Maharashtra',
      19.0,
      72.0,
      'Urban (3 BHK)'
    );

    expect(enhanced.finalPrediction).toBeLessThanOrEqual(200);
    expect(enhanced.confidence).toBeGreaterThan(0.85);
    expect(enhanced.factors.length).toBeGreaterThan(0);
  });
});
```

---

## Deployment Checklist

- [ ] Update environment variables for APIs
- [ ] Connect to real Supabase database
- [ ] Deploy Service Worker (`/public/sw.js`)
- [ ] Add PWA manifest (`/public/manifest.json`)
- [ ] Test on mobile devices (iOS & Android)
- [ ] Verify offline functionality
- [ ] Test analytics with real data
- [ ] Test all responsive breakpoints
- [ ] Verify weather API integration
- [ ] Performance test (Lighthouse)
- [ ] Security audit
- [ ] Deploy to production

---

This comprehensive integration guide covers all aspects of using the three new features in your AquaAdapt application!
