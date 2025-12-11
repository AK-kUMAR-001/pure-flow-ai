# How to Add Live Sensor Data to Your Dashboard

## 🎯 Quick Integration (5 minutes)

Your dashboard already has the sensor infrastructure ready. Just add the display component!

---

## 1️⃣ Add to Dashboard Page

Edit `src/pages/Dashboard.tsx`:

```tsx
// At the top, add this import
import LiveSensorDisplay from '@/components/LiveSensorDisplay';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-light-blue/20">
      <Navigation />

      {/* Your existing dashboard header and content */}
      
      {/* ADD THIS SECTION: Live Sensor Data */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-ocean-blue mb-4">
          Water Quality Monitoring
        </h2>
        
        {/* Live Sensor Display Component */}
        <LiveSensorDisplay />
      </section>

      {/* Your existing content continues */}
      
      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
}
```

That's it! The component handles everything:
- ✅ Auto-connects to backend
- ✅ WebSocket real-time updates
- ✅ Error handling
- ✅ Connection status monitoring

---

## 2️⃣ Optional: Add Testing Component

During development, add testing component to test without hardware:

```tsx
import LiveSensorDisplay from '@/components/LiveSensorDisplay';
import SensorTestingComponent from '@/components/SensorTestingComponent';

export default function Dashboard() {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-light-blue/20">
      <Navigation />

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-ocean-blue mb-4">
          Water Quality Monitoring
        </h2>
        
        {/* Show testing component in development */}
        {isDevelopment && (
          <div className="mb-6">
            <SensorTestingComponent />
          </div>
        )}
        
        {/* Always show live display */}
        <LiveSensorDisplay />
      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
}
```

Now you can test without hardware! Just remove the testing component later for production.

---

## 3️⃣ Customize Appearance

The `LiveSensorDisplay` component accepts props:

```tsx
<LiveSensorDisplay 
  onStatusChange={(isConnected) => {
    console.log('Sensor connection status:', isConnected);
    // You could show a banner or alert if disconnected
  }}
/>
```

### Styling
The component uses Tailwind CSS classes and your theme colors:
- `text-ocean-blue` - Primary blue
- `text-leaf-green` - Success color
- `text-warning-orange` - Warning color
- `text-error-red` - Error color

To customize, edit `src/components/LiveSensorDisplay.tsx`:

```tsx
// Change the card header styling
<CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
  {/* Modify colors here */}
</CardHeader>
```

---

## 4️⃣ Position on Dashboard

### Option A: At Top (Recommended)
```tsx
{/* Header section */}
{/* Live sensors (HIGH PRIORITY) */}
<LiveSensorDisplay />

{/* Quality metrics (existing) */}
{/* Savings stats (existing) */}
{/* Charts (existing) */}
```

### Option B: In Grid with Other Cards
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <LiveSensorDisplay />
  
  <div>
    {/* Your other important cards */}
  </div>
</div>
```

### Option C: Floating Alert
```tsx
{/* In a sticky/fixed position for always-visible monitoring */}
<div className="fixed bottom-4 right-4 w-80">
  <LiveSensorDisplay />
</div>
```

---

## 5️⃣ Handle Connection Errors

The component handles errors gracefully, but you can add additional logic:

```tsx
import { useState } from 'react';
import LiveSensorDisplay from '@/components/LiveSensorDisplay';

export default function Dashboard() {
  const [sensorStatus, setSensorStatus] = useState('connected');

  return (
    <div className="min-h-screen bg-light-blue/20">
      <Navigation />

      {/* Show alert if sensors disconnected */}
      {sensorStatus === 'disconnected' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 font-semibold">
            ⚠️ Sensor System Offline
          </p>
          <p className="text-red-600 text-sm">
            Could not connect to water quality sensors. 
            Ensure ESP32 is powered and connected to WiFi.
          </p>
        </div>
      )}

      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-ocean-blue mb-4">
          Water Quality Monitoring
        </h2>
        
        {/* Update status when connection changes */}
        <LiveSensorDisplay 
          onStatusChange={(isConnected) => {
            setSensorStatus(isConnected ? 'connected' : 'disconnected');
          }}
        />
      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
}
```

---

## 6️⃣ Make Sure Backend is Running

The component needs the backend server running:

```powershell
# Terminal 1: Start sensor backend
npm run sensor:server

# Terminal 2: Start frontend
npm run dev
```

The component will:
- ✅ Auto-connect to `http://localhost:5000`
- ✅ Attempt to reconnect if disconnected
- ✅ Show connection status
- ✅ Display error messages if needed

---

## 7️⃣ Advanced: Track Multiple Sensors

If you add more sensors later (temperature, salinity, etc.):

```tsx
// src/components/MultiSensorDisplay.tsx
import LiveSensorDisplay from './LiveSensorDisplay';

export default function MultiSensorDisplay() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <LiveSensorDisplay /> {/* PH & Turbidity */}
      
      {/* Future sensors */}
      {/* <TemperatureSensorDisplay /> */}
      {/* <SalinitySensorDisplay /> */}
      {/* <DissolvedOxygenDisplay /> */}
    </div>
  );
}
```

---

## 8️⃣ Testing the Integration

### Without Hardware
1. Add `SensorTestingComponent` to dashboard
2. Click "Send Random Reading"
3. Watch `LiveSensorDisplay` update
4. Verify real-time WebSocket connection

### With Hardware
1. Upload ESP32 firmware
2. Check Serial Monitor for "Data sent successfully"
3. Dashboard should show readings automatically
4. Updates every 2-5 seconds

---

## 📋 Complete Integration Example

Here's a complete example showing everything together:

```tsx
/**
 * Enhanced Dashboard Page
 * With live water quality sensor monitoring
 */

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import ContactButtons from "@/components/ContactButtons";
import LiveSensorDisplay from "@/components/LiveSensorDisplay";
import SensorTestingComponent from "@/components/SensorTestingComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [sensorConnected, setSensorConnected] = useState(false);

  return (
    <div className="min-h-screen bg-light-blue/20">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-8 bg-gradient-primary water-bg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">
            Water Quality Dashboard
          </h1>
          <p className="text-white/70">
            Real-time monitoring of water quality parameters
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        
        {/* Connection Status Alert */}
        {!sensorConnected && (
          <Card className="mb-6 bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <p className="text-yellow-800">
                ⚠️ Sensor system is connecting. Live data will appear shortly...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Live Sensor Display (Main) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ocean-blue mb-4">
            Live Sensor Readings
          </h2>
          <LiveSensorDisplay 
            onStatusChange={(isConnected) => {
              setSensorConnected(isConnected);
            }}
          />
        </div>

        {/* Testing Component (Development Only) */}
        {import.meta.env.DEV && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-ocean-blue mb-4">
              Sensor Testing (Development)
            </h2>
            <SensorTestingComponent />
          </div>
        )}

        {/* Historical Data Section (Example) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ocean-blue mb-4">
            Water Quality Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Your existing quality metrics cards */}
          </div>
        </div>

      </section>

      <Footer />
      <Chatbot />
      <ContactButtons />
    </div>
  );
};

export default Dashboard;
```

---

## ✅ Integration Checklist

- [ ] Import `LiveSensorDisplay` component
- [ ] Add to Dashboard page
- [ ] Backend server running: `npm run sensor:server`
- [ ] Frontend running: `npm run dev`
- [ ] Can see component on dashboard
- [ ] Component shows "Connected" status
- [ ] Test with SensorTestingComponent
- [ ] Dashboard updates in real-time

---

## 🚀 You're Done!

The sensor data display is now live on your dashboard.

**Next steps:**
1. If you have hardware, upload ESP32 firmware from `IOT_ESP32_SETUP.md`
2. If testing, use `SensorTestingComponent` to simulate readings
3. Watch real-time updates on the dashboard
4. Deploy to production when ready

---

## 🎯 What Happens Next

Users visiting your dashboard will see:

```
┌─────────────────────────────────────────┐
│         Live Sensor Data    ✅ Connected│
│  Last update: 14:23:45                  │
├──────────────┬──────────────────────────┤
│              │                          │
│  pH Level    │  Turbidity               │
│  7.2         │  45.3 NTU                │
│  Normal      │  Slightly Cloudy         │
│  ████████░░░ │  ████░░░░░░░░░░░░░░░░   │
│              │                          │
├──────────────┴──────────────────────────┤
│ ✅ Connected to sensor • Receiving      │
│    live updates every 2-5 seconds       │
└─────────────────────────────────────────┘
```

Real-time, automatic, beautiful! 🌊💧

---

## 📖 Related Documentation

- **Setup Guide:** `IOT_QUICK_START.md`
- **Hardware Guide:** `IOT_ESP32_SETUP.md`
- **API Reference:** `IOT_ESP32_COMPLETE_SETUP.md`
- **Testing Guide:** `IOT_VISUAL_GUIDE.md`

