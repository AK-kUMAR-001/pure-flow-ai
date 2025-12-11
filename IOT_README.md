# 🌊 IoT ESP32 Water Quality Monitoring System

**Live PH and Turbidity readings on your dashboard - powered by ESP32 sensors and WebSocket real-time updates**

---

## ⚡ Get Started in 3 Steps

### 1️⃣ Install Dependencies (5 min)
```powershell
npm install
```

Or use the setup script:
```powershell
.\setup-sensor.ps1        # Windows PowerShell
bash setup-sensor.sh      # macOS/Linux
```

### 2️⃣ Start Servers (2 terminals)

**Terminal 1 - Sensor Backend:**
```powershell
npm run sensor:server
```
Expected: `🚀 IoT Sensor Server started! 📡 API: http://localhost:5000/api/sensors`

**Terminal 2 - Frontend:**
```powershell
npm run dev
```
Expected: `VITE v5.4.19 ready in XXX ms → Local: http://localhost:5173/`

### 3️⃣ Open Dashboard
```
http://localhost:5173/dashboard
```

You should see **"Live Sensor Data"** card showing:
- ✅ PH Level (real-time)
- ✅ Turbidity (real-time)
- ✅ Status indicators
- ✅ Connection status

---

## 🎯 Choose Your Path

### 🔧 Just Software (No Hardware)
Perfect for learning and testing:
1. Use `SensorTestingComponent` on dashboard to simulate readings
2. Dashboard updates in real-time via WebSocket
3. Later add real hardware - no code changes needed!

See: `src/components/SensorTestingComponent.tsx`

### 🛠️ Full Hardware Setup
Building the complete water quality monitoring system:
1. Buy sensors (~$50 total)
2. Connect to ESP32 microcontroller
3. Upload firmware from `IOT_ESP32_SETUP.md`
4. Readings appear on dashboard automatically

See: `IOT_ESP32_SETUP.md`

### 📚 Full Documentation
Understand architecture and advanced features:
1. Architecture diagrams
2. API endpoint reference
3. Configuration options
4. Troubleshooting guide

See: `IOT_ESP32_COMPLETE_SETUP.md`

---

## 📖 Documentation Files

| File | Purpose | Read When |
|------|---------|-----------|
| **IOT_ESP32_SETUP_INDEX.md** | Overview & quick start | First - Start here! |
| **IOT_QUICK_START.md** | Step-by-step setup guide | Planning hardware |
| **IOT_ESP32_SETUP.md** | Hardware & firmware | Building hardware |
| **IOT_ESP32_COMPLETE_SETUP.md** | Full reference | Understanding details |

---

## 🧪 Test Without Hardware

Add to your dashboard:

```tsx
import SensorTestingComponent from '@/components/SensorTestingComponent';

export default function Dashboard() {
  return (
    <div>
      <SensorTestingComponent />  {/* Click "Send Random Reading" */}
      <LiveSensorDisplay />        {/* Watch it update in real-time */}
    </div>
  );
}
```

Features:
- 📝 Manual value input
- 🎲 Random readings
- 📊 Sequence simulation
- ⚠️ Alarm conditions
- ✅ No hardware needed!

---

## 📦 What's Included

### Backend
- **Express.js** REST API
- **WebSocket** real-time server
- **JSON** data format
- Auto-reconnect logic

### Frontend
- **React** component
- **WebSocket** client
- **Status indicators**
- **Real-time updates**
- **Error handling**

### Hardware Support
- **ESP32** with WiFi
- **Analog sensors** (0-3.3V)
- **WiFi connectivity** (2.4GHz)
- **HTTP POST** data format

### Documentation
- 📖 4 comprehensive guides
- 💻 Complete Arduino code
- 🔌 API documentation
- 🧪 Testing instructions

---

## 🔌 API Endpoints

### Submit Sensor Data
```bash
POST /api/sensors
Content-Type: application/json

{
  "ph": 7.2,
  "turbidity": 45.3,
  "deviceId": "ESP32-Default"  # optional
}
```

### Get Latest Reading
```bash
GET /api/sensors/latest
```

### Get Multiple Readings
```bash
GET /api/sensors?limit=10
```

### Get System Status
```bash
GET /api/sensors/status
```

---

## 🚀 Quick Commands

```powershell
# Installation
npm install                    # Install dependencies
.\setup-sensor.ps1            # Run Windows setup script
bash setup-sensor.sh          # Run macOS/Linux setup

# Running
npm run sensor:server         # Start backend (Port 5000)
npm run dev                   # Start frontend (Port 5173)
npm run sensor:dev            # Run both together (needs concurrently)

# Testing
npm run sensor:test           # Check if server is running
.\verify-iot-setup.ps1       # Verify installation
```

---

## 🏗️ System Architecture

```
┌─────────────────┐
│ Water Sensors   │  PH + Turbidity (Analog 0-3.3V)
├─────────────────┤
│   ESP32 Dev     │  WiFi Connection (2.4GHz)
│   Board         │  Converts ADC → JSON → HTTP POST
└────────┬────────┘
         │ WiFi
         ▼
┌─────────────────────────────────────────┐
│ Backend Server (Node.js, Port 5000)     │
│ ├─ Express API Endpoints                │
│ ├─ WebSocket Server                     │
│ └─ In-Memory Data Storage (last 100)    │
└────────┬────────────────────────────────┘
         │ WebSocket
         ▼
┌─────────────────────────────────────────┐
│ Frontend (React, Port 5173)             │
│ ├─ LiveSensorDisplay Component          │
│ ├─ SensorTestingComponent (optional)    │
│ └─ Real-time Updates                    │
└─────────────────────────────────────────┘
```

---

## 🎓 How It Works

1. **ESP32** reads sensors every 2 seconds (via ADC pins)
2. **ESP32** sends data every 5 seconds (HTTP POST to backend)
3. **Backend** receives data, validates, stores
4. **Backend** broadcasts via WebSocket to all connected clients
5. **Frontend** updates display in real-time (no page refresh needed)
6. **Dashboard** shows PH and Turbidity with status indicators

---

## 🛠️ Hardware Components (Optional)

| Component | Purpose | Cost | Notes |
|-----------|---------|------|-------|
| ESP32 Dev Board | Microcontroller | $8-15 | WiFi enabled |
| PH Sensor Module | Measures acidity | $20-30 | 0-14 scale |
| Turbidity Sensor | Measures cloudiness | $10-15 | NTU units |
| USB Cable | Programming | $5 | Micro or USB-C |
| Jumper Wires | Connections | $3 | Breadboard compatible |
| Capacitors 0.1µF | Noise filtering | $2 | Optional |
| **Total** | **Complete Setup** | **~$50** | All from Amazon |

---

## ✅ Verification Checklist

After setup:

- [ ] `npm install` completes without errors
- [ ] `npm run sensor:server` shows "🚀 IoT Sensor Server started!"
- [ ] `npm run dev` shows "VITE vX.X.X ready in XXX ms"
- [ ] Can access http://localhost:5173/dashboard
- [ ] Dashboard shows "Live Sensor Data" card
- [ ] Can submit test data via SensorTestingComponent
- [ ] Browser console shows "✅ WebSocket connected to sensor server"
- [ ] Values update every 2-5 seconds

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| "Address already in use" | Kill port 5000: `netstat -ano \| findstr :5000` |
| WebSocket fails to connect | Ensure backend is running on port 5000 |
| No readings appear | Try submitting test data first |
| ESP32 won't upload | Install CH340 driver or check USB cable |
| WiFi connection fails | Verify SSID/password and 2.4GHz frequency |

See `IOT_QUICK_START.md` for detailed troubleshooting.

---

## 📊 Example Dashboard Display

```
┌─────────────────────────────────────────────┐
│         Live Sensor Data    [🟢 Connected]  │
│  Last update: 14:23:45 | Device: ESP32     │
├──────────────────┬────────────────────────┤
│                  │                        │
│  pH Level        │  Turbidity             │
│  7.2             │  45.3 NTU              │
│  Normal ✓        │  Slightly Cloudy ✓     │
│  ████████░░░░░   │  ████░░░░░░░░░░░░░░   │
│  Range: 6.5-8.5  │  Unit: NTU             │
│                  │                        │
├──────────────────┴────────────────────────┤
│ ✅ Connected to sensor • Receiving live    │
│    updates every 2-5 seconds               │
└─────────────────────────────────────────────┘
```

---

## 🎯 Next Steps

### Immediate
1. Run: `npm install`
2. Run: `npm run sensor:server` (Terminal 1)
3. Run: `npm run dev` (Terminal 2)
4. Open: http://localhost:5173/dashboard
5. Test with `SensorTestingComponent`

### With Hardware
1. Read `IOT_ESP32_SETUP.md`
2. Buy components (~$50)
3. Assemble hardware (1 hour)
4. Upload firmware (20 min)
5. Watch live readings on dashboard

### Advanced
- Store data in Supabase database
- Create historical charts
- Add email/SMS alerts
- Support multiple sensors
- Deploy to cloud

---

## 📚 Resources

- [ESP32 Official Docs](https://docs.espressif.com/)
- [Arduino Reference](https://www.arduino.cc/reference/)
- [Express.js Docs](https://expressjs.com/)
- [WebSocket MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [React Hooks](https://react.dev/reference/react)

---

## 💡 Tips for Success

1. **Start with software** - Get comfortable with the flow
2. **Use testing component** - No hardware needed to learn
3. **Check browser console** - See WebSocket messages
4. **Monitor Serial output** - ESP32 debug information
5. **Keep documentation open** - Reference as you go
6. **Test API with curl** - Before integrating into React

---

## 🎉 Ready?

Choose your path:

- **New to this?** → Read `IOT_QUICK_START.md`
- **Want hardware?** → Read `IOT_ESP32_SETUP.md`
- **Need full details?** → Read `IOT_ESP32_COMPLETE_SETUP.md`
- **Just start?** → Run `setup-sensor.ps1`

---

## 📞 Quick Help

**Commands:**
```powershell
npm install                    # Install all
npm run sensor:server          # Backend
npm run dev                    # Frontend
.\verify-iot-setup.ps1        # Check setup
```

**URLs:**
```
Dashboard: http://localhost:5173/dashboard
Backend:   http://localhost:5000/api/sensors
WebSocket: ws://localhost:5000
Health:    http://localhost:5000/health
```

---

**Happy monitoring! 🌊💧**

Questions? Check the documentation files or the code comments in:
- `src/server/routes/sensors.ts`
- `src/services/sensorService.ts`
- `src/components/LiveSensorDisplay.tsx`

