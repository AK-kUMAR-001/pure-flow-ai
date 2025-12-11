# IoT ESP32 Integration - Start Here 🚀

## What You Have

A complete, production-ready **Live Water Quality Monitoring System** that reads PH and Turbidity sensor values from an ESP32 in real-time and displays them on your dashboard.

---

## ⚡ Quick Start (Choose Your Path)

### 🔧 Option 1: Just Software (No Hardware Yet)
**Time: 10 minutes** | **Perfect for learning**

```powershell
# Install once
npm install

# Terminal 1: Start backend sensor server
npm run sensor:server

# Terminal 2: Start frontend
npm run dev

# Open dashboard at http://localhost:5173/dashboard
# Use SensorTestingComponent to simulate readings
```

### 🛠️ Option 2: Full Hardware Setup
**Time: 2 hours** | **Complete system**

1. Read: [`IOT_ESP32_SETUP.md`](./IOT_ESP32_SETUP.md) - Hardware assembly & firmware
2. Read: [`IOT_QUICK_START.md`](./IOT_QUICK_START.md) - Step-by-step setup
3. Upload ESP32 firmware
4. Run servers (same as Option 1)

### 📖 Option 3: Full Documentation
**Time: 30 minutes** | **Understand everything**

Read in order:
1. This file (overview)
2. [`IOT_ESP32_COMPLETE_SETUP.md`](./IOT_ESP32_COMPLETE_SETUP.md) - Architecture & configuration
3. [`IOT_QUICK_START.md`](./IOT_QUICK_START.md) - Practical implementation
4. [`IOT_ESP32_SETUP.md`](./IOT_ESP32_SETUP.md) - Hardware details

---

## 📦 What's Included

### Firmware
- **Complete Arduino code** for ESP32 with WiFi + sensors
- Reads PH and Turbidity analog values
- Sends data every 5 seconds via HTTP POST
- Includes calibration constants

### Backend Server
- **Express.js** REST API on port 5000
- **WebSocket** for real-time updates
- Stores last 100 readings in memory
- Endpoints for GET/POST sensor data
- Health check endpoint

### Frontend Components
- **LiveSensorDisplay** - Beautiful dashboard card showing live values
- **SensorTestingComponent** - Test without hardware
- **SensorService** - Client-side WebSocket + REST client
- Status indicators, progress bars, connection monitoring

### Documentation
- 3 comprehensive guides (hardware, quick start, complete setup)
- Arduino code with comments
- API endpoint documentation
- Troubleshooting guide
- Testing instructions

### Setup Scripts
- Windows batch file (`setup-sensor.bat`)
- Bash script for macOS/Linux (`setup-sensor.sh`)
- npm scripts for easy startup

---

## 🎯 How It Works

```
PH Sensor → ESP32 → WiFi → Backend → Dashboard
Turbidity   (GPIO 34)      (Port 5000)  (Port 5173)
            (GPIO 35)
```

1. **Sensors** read water quality values (0-3.3V analog)
2. **ESP32** converts to digital, connects via WiFi
3. **Backend** receives via HTTP POST, broadcasts via WebSocket
4. **Dashboard** displays real-time values with status indicators

---

## 📋 Hardware You'll Need (Optional)

| Item | Cost | Purpose |
|------|------|---------|
| ESP32 Dev Board | $8-15 | Main microcontroller |
| PH Sensor Module | $20-30 | Measures acidity (0-14) |
| Turbidity Sensor | $10-15 | Measures cloudiness (NTU) |
| USB Cable | $5 | Programming & power |
| Jumper Wires | $3 | Connections |
| Capacitors (0.1µF) | $2 | Noise filtering |
| **Total** | **~$50** | Complete hardware |

All available on Amazon/AliExpress/Local electronics stores.

---

## 🚀 Startup Commands

### First Time
```powershell
# Install dependencies
npm install

# Run setup script (recommended)
.\setup-sensor.bat  # Windows
bash setup-sensor.sh  # macOS/Linux
```

### Every Day (2 terminals)

**Terminal 1 - Sensor Server:**
```powershell
npm run sensor:server
# Output: 🚀 IoT Sensor Server started!
#         📡 API: http://localhost:5000/api/sensors
#         🔌 WebSocket: ws://localhost:5000
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
# Output: VITE v5.4.19 ready in XXX ms → Local: http://localhost:5173/
```

**That's it!** Dashboard will auto-connect to sensor server.

---

## 🧪 Testing Without Hardware

Add testing component to your dashboard:

```tsx
import SensorTestingComponent from '@/components/SensorTestingComponent';

export default function Dashboard() {
  return (
    <div>
      <SensorTestingComponent />  {/* Test mode */}
      <LiveSensorDisplay />        {/* Production */}
    </div>
  );
}
```

Features:
- ✅ Manual value input
- ✅ Submit single readings
- ✅ Generate random readings
- ✅ Simulate sequences
- ✅ Test alarm conditions

---

## 📊 Dashboard Display

The **LiveSensorDisplay** component shows:

```
┌─────────────────────────────────────────┐
│         Live Sensor Data    🟢 Connected│
│  Last update: 14:23:45 | ESP32-Default  │
├──────────────────┬──────────────────────┤
│  pH Level        │  Turbidity            │
│  7.2             │  45.3 NTU             │
│  Normal          │  Slightly Cloudy      │
│  ████████░░░░░   │  ████░░░░░░░░░░░░░   │
│  Range: 6.5-8.5  │  Unit: NTU            │
├──────────────────┴──────────────────────┤
│ ✅ Connected to sensor • Receiving live  │
│    updates every 2-5 seconds             │
└─────────────────────────────────────────┘
```

---

## 🔌 API Examples

### Submit Sensor Data
```bash
curl -X POST http://localhost:5000/api/sensors \
  -H "Content-Type: application/json" \
  -d '{"ph": 7.2, "turbidity": 45.3}'
```

### Get Latest Reading
```bash
curl http://localhost:5000/api/sensors/latest
```

### Get System Status
```bash
curl http://localhost:5000/api/sensors/status
```

### Get Last 10 Readings
```bash
curl "http://localhost:5000/api/sensors?limit=10"
```

---

## 📁 File Structure

```
project/
├── IOT_ESP32_SETUP.md                      (Hardware guide + code)
├── IOT_QUICK_START.md                      (Setup walkthrough)
├── IOT_ESP32_COMPLETE_SETUP.md            (Architecture & config)
├── IOT_ESP32_SETUP_INDEX.md               (This file)
├── setup-sensor.bat                        (Windows setup)
├── setup-sensor.sh                         (macOS/Linux setup)
│
├── src/
│   ├── server/
│   │   ├── index.ts                        (Main server)
│   │   └── routes/
│   │       └── sensors.ts                  (API endpoints)
│   │
│   ├── services/
│   │   └── sensorService.ts               (Client-side WebSocket)
│   │
│   ├── components/
│   │   ├── LiveSensorDisplay.tsx          (Dashboard widget)
│   │   └── SensorTestingComponent.tsx     (Testing tool)
│   │
│   └── pages/
│       └── Dashboard.tsx                   (Updated with sensor display)
│
└── package.json                            (Updated with new scripts)
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `npm run sensor:server` starts without errors
- [ ] `npm run dev` starts frontend without errors
- [ ] Can access http://localhost:5173/dashboard
- [ ] Dashboard shows "Live Sensor Data" card
- [ ] Can submit test data via curl or testing component
- [ ] WebSocket shows connected (green dot)
- [ ] Values update every 2-5 seconds

---

## 🎯 Next Steps

### Immediate (Choose one):
1. **Option A**: Go to `IOT_QUICK_START.md` for step-by-step guide
2. **Option B**: Start with `SensorTestingComponent` in dashboard
3. **Option C**: Deploy ESP32 firmware from `IOT_ESP32_SETUP.md`

### Later (When comfortable):
- Add historical data charts
- Store readings in Supabase database
- Create alert system for out-of-range values
- Support multiple sensor devices
- Deploy backend to cloud

---

## 🚨 Need Help?

| Issue | Solution |
|-------|----------|
| Server won't start | Kill port 5000: `netstat -ano \| findstr :5000` |
| WebSocket fails | Check backend is running on port 5000 |
| No readings appear | Check ESP32 Serial Monitor (115200 baud) |
| Values seem wrong | Calibrate sensors or adjust constants |
| Hardware not detected | Install CH340 driver |

See `IOT_QUICK_START.md` for full troubleshooting guide.

---

## 🎓 Key Concepts

**REST API**: HTTP endpoints to fetch historical data
- Used by dashboard on startup
- Stores last 100 readings

**WebSocket**: Real-time bidirectional connection
- Broadcasts updates every 2-5 seconds
- Lower latency than polling
- Auto-reconnects on disconnect

**Arduino Sketch**: Code uploaded to ESP32
- Reads analog pins (PH & Turbidity)
- Converts to meaningful units
- Sends HTTP POST every 5 seconds

**React Component**: Dashboard display widget
- Connects to WebSocket automatically
- Shows current readings & status
- Handles errors gracefully

---

## 💡 Pro Tips

1. **Keep Serial Monitor open** - Great for debugging ESP32
2. **Start with testing component** - Understand flow before hardware
3. **Check browser console** - See WebSocket debug messages
4. **Use curl to test API** - Verify backend before frontend
5. **Calibrate sensors properly** - Makes huge difference in accuracy
6. **Add capacitors to sensors** - Reduces electrical noise

---

## 📞 Quick Reference

### Commands
```powershell
npm install                    # Install all dependencies
npm run sensor:server          # Start backend on port 5000
npm run dev                    # Start frontend on port 5173
npm run sensor:dev             # Run both (if concurrently installed)
npm run sensor:test            # Test if server is running
```

### URLs
```
Frontend:        http://localhost:5173
Dashboard:       http://localhost:5173/dashboard
Backend API:     http://localhost:5000/api/sensors
WebSocket:       ws://localhost:5000
Health Check:    http://localhost:5000/health
```

### Arduino IDE Serial Monitor
```
Port:     (Your COM port - see Arduino IDE)
Baud:     115200
Expected: ✅ WiFi connected! + 📊 Sensor Reading messages
```

---

## 🎉 You're All Set!

Everything is ready to go. Choose your path above and follow the guide.

**Most people start here:**
→ [`IOT_QUICK_START.md`](./IOT_QUICK_START.md)

**For complete understanding:**
→ [`IOT_ESP32_COMPLETE_SETUP.md`](./IOT_ESP32_COMPLETE_SETUP.md)

**For hardware details:**
→ [`IOT_ESP32_SETUP.md`](./IOT_ESP32_SETUP.md)

---

**Questions?** Check the troubleshooting section in any guide, or review the code comments in:
- `src/server/routes/sensors.ts` (Backend)
- `src/services/sensorService.ts` (Frontend)
- `src/components/LiveSensorDisplay.tsx` (UI)

Happy monitoring! 🌊💧

