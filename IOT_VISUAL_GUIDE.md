# IoT ESP32 Setup - Visual Quick Reference

## 🎯 What You Have

```
📱 DASHBOARD
├─ Live Sensor Data Card
│  ├─ pH Level (Real-time)
│  ├─ Turbidity (Real-time)
│  ├─ Status Indicators
│  └─ Connection Status
└─ Sensor Testing Component
   ├─ Manual Value Input
   ├─ Random Reading Generator
   ├─ Sequence Simulator
   └─ Alarm Tester

🖥️  BACKEND SERVER (Port 5000)
├─ REST API Endpoints
│  ├─ POST /api/sensors (receive data)
│  ├─ GET /api/sensors/latest (get current)
│  ├─ GET /api/sensors (get history)
│  └─ GET /api/sensors/status (get info)
└─ WebSocket Server
   ├─ Real-time broadcasts
   ├─ 100 reading history
   └─ Auto-reconnect

🔌 HARDWARE (Optional)
├─ ESP32 Microcontroller
├─ PH Sensor (GPIO 34)
├─ Turbidity Sensor (GPIO 35)
└─ WiFi Connectivity

🗂️  FILES CREATED (15 files)
├─ Documentation (5 guides)
├─ Backend (2 files)
├─ Frontend (3 components)
├─ Setup Scripts (3 scripts)
└─ Configuration (package.json)
```

---

## 🚀 Quick Start Flowchart

```
START
  ↓
[npm install]
  ↓
Has Hardware? 
  │
  ├─→ NO → [Use SensorTestingComponent]
  │         ↓
  │         [Submit test data]
  │         ↓
  │         [Watch dashboard update]
  │         ↓
  │         END (Ready for hardware later!)
  │
  └─→ YES → [Read IOT_ESP32_SETUP.md]
            ↓
            [Assemble hardware]
            ↓
            [Upload firmware to ESP32]
            ↓
            [Configure WiFi in code]
            ↓
            [Upload to ESP32]
            ↓
            [Start backend: npm run sensor:server]
            ↓
            [Start frontend: npm run dev]
            ↓
            [Check Serial Monitor for success]
            ↓
            [Open dashboard]
            ↓
            [Watch real sensor readings]
            ↓
            END (Live monitoring works!)
```

---

## 🎮 Three Execution Paths

### Path 1️⃣: Software Testing (No Hardware)
```
1. npm install                          [5 min]
2. npm run sensor:server               [Terminal 1]
3. npm run dev                         [Terminal 2]
4. Use SensorTestingComponent         [Instant results]
5. Watch dashboard update             [Real-time]

Result: ✅ Works immediately, no hardware needed
```

### Path 2️⃣: With Real Hardware
```
1. Buy sensors (~$50)                 [Shopping]
2. Read IOT_ESP32_SETUP.md           [30 min]
3. Assemble + connect sensors        [30 min]
4. Follow Arduino setup guide        [20 min]
5. Upload firmware to ESP32          [10 min]
6. npm install                       [5 min]
7. npm run sensor:server             [Terminal 1]
8. npm run dev                       [Terminal 2]
9. Check Serial Monitor              [Verification]
10. Open dashboard                   [See live data!]

Result: ✅ Real water quality monitoring live
```

### Path 3️⃣: API-Only Integration
```
1. npm install                        [5 min]
2. npm run sensor:server             [Terminal 1]
3. Submit data via curl/API          [Anytime]
4. Dashboard auto-updates            [Real-time]
5. (Optional) Deploy to cloud        [Production]

Result: ✅ Flexible integration, multiple sources
```

---

## 📊 Data Flow Diagram

```
HARDWARE SIDE                NETWORK                SOFTWARE SIDE
═══════════════════════════════════════════════════════════════

Sensors                      WiFi (2.4GHz)          Frontend
(Analog 0-3.3V)                                     (React)
    ↓                            ↓                     ↑
    │                            │                     │
    └─→ ESP32 ──WiFi──→ HTTP POST ──→ Backend ──WebSocket─┘
        (Reads)       ↑           ↑      (Node.js)
                      │           │        │
                   PORT 5000   Receives    │
                                Stores     │
                                Broadcasts │
                                           │
                              Dashboard ←─┘
                              Updates
```

---

## 🔧 Commands Reference

### Installation
```powershell
npm install                           # Install all dependencies
.\setup-sensor.ps1                   # Run guided setup (Windows)
bash setup-sensor.sh                 # Run guided setup (macOS/Linux)
.\verify-iot-setup.ps1               # Check if everything is ready
```

### Running
```powershell
# Terminal 1
npm run sensor:server                 # Backend (Port 5000)

# Terminal 2
npm run dev                           # Frontend (Port 5173)

# Combined (if concurrently installed)
npm run sensor:dev
```

### Testing
```powershell
npm run sensor:test                   # Quick test
curl http://localhost:5000/health     # API test
curl http://localhost:5000/api/sensors/latest  # Get data
```

---

## 📁 File Quick Reference

### Start Reading (In Order)
| # | File | Read Time | Purpose |
|---|------|-----------|---------|
| 1 | **IOT_README.md** | 10 min | Overview & quick start |
| 2 | **IOT_QUICK_START.md** | 20 min | Step-by-step setup |
| 3 | **IOT_ESP32_SETUP.md** | 30 min | Hardware + firmware |
| 4 | **IOT_ESP32_COMPLETE_SETUP.md** | 20 min | Full reference |
| 5 | **IOT_ESP32_SETUP_INDEX.md** | 5 min | Navigation guide |

### Code Files (For Reference)
| File | Lines | Purpose |
|------|-------|---------|
| `src/server/index.ts` | ~60 | Express app setup |
| `src/server/routes/sensors.ts` | ~200 | API endpoints |
| `src/services/sensorService.ts` | ~250 | WebSocket client |
| `src/components/LiveSensorDisplay.tsx` | ~300 | Dashboard widget |
| `src/components/SensorTestingComponent.tsx` | ~250 | Testing tool |

---

## 🎯 Key Endpoints

### API Endpoints (all on port 5000)

**Submit Data** (Used by ESP32)
```
POST /api/sensors
Body: {"ph": 7.2, "turbidity": 45.3}
Response: 201 Created
```

**Get Latest**
```
GET /api/sensors/latest
Response: Last reading
```

**Get History**
```
GET /api/sensors?limit=10
Response: Last 10 readings
```

**System Status**
```
GET /api/sensors/status
Response: Connection info
```

**Health Check**
```
GET /health
Response: {"status": "ok"}
```

---

## 🧪 Testing Sequence

### Without Hardware (5 minutes)
```
1. Open http://localhost:5173/dashboard
2. Find "Sensor Testing" component
3. Click "Send Random Reading"
4. Watch "Live Sensor Data" card update
5. Try "Simulate 5 Readings"
6. Verify real-time updates work
✅ System confirmed working!
```

### With Hardware (After ESP32 upload)
```
1. Open Serial Monitor in Arduino IDE
2. Should see "✅ WiFi connected!"
3. Then "📊 Sensor Reading - pH: X.X..."
4. Then "✅ Data sent successfully"
5. Check dashboard - should see reading
6. Wait 5 seconds, should auto-update
✅ Hardware confirmed working!
```

---

## 🔴 Status Indicators

### LiveSensorDisplay Status Colors

**PH Level Status:**
- 🟢 Good: 6.5 - 8.5 (Normal)
- 🟡 Warning: 6.0 - 9.0 (Acceptable)
- 🔴 Critical: <6.0 or >9.0 (Out of range)

**Turbidity Status:**
- 🟢 Good: 0 - 5 NTU (Clear)
- 🟡 Warning: 5 - 15 NTU (Slightly cloudy)
- 🔴 Critical: >15 NTU (Cloudy)

**Connection Status:**
- 🟢 Green dot = Connected (live updates)
- ⚪ Gray = Disconnected (trying to reconnect)
- 🔴 Red = Error (check backend)

---

## ⏱️ Timeline Estimates

### Software Only
```
npm install              →    5 min
Read IOT_README.md      →   10 min
Start servers           →    2 min
Test with component     →    3 min
Total:                  →   20 min ✅
```

### With Hardware (First Time)
```
Read IOT_ESP32_SETUP.md →   30 min
Buy components          →   1-2 days (shipping)
Assemble hardware       →   30 min
Arduino IDE setup       →   20 min
Upload firmware         →   10 min
npm install             →    5 min
Start servers           →    2 min
Verify on dashboard     →    5 min
Total:                  →   2-3 hours ✅
```

### Daily Use (After setup)
```
npm run sensor:server   →    1 min
npm run dev             →    1 min
Open dashboard          →   30 sec
Total:                  →    3 min ✅
```

---

## 🎓 Key Components Explained

### LiveSensorDisplay
- Main dashboard widget
- Connects automatically via WebSocket
- Shows PH and Turbidity with status
- Auto-reconnects if connection lost
- Location: `src/components/LiveSensorDisplay.tsx`

### SensorTestingComponent
- Test tool without hardware
- Submit manual values
- Generate random readings
- Simulate sequences
- Location: `src/components/SensorTestingComponent.tsx`

### SensorService
- WebSocket client
- REST API client
- Event emitter pattern
- Auto-reconnect logic
- Location: `src/services/sensorService.ts`

### Backend Server
- Express.js HTTP server
- WebSocket broadcast
- Data validation
- 100-reading history
- Location: `src/server/index.ts` + `src/server/routes/sensors.ts`

---

## ✅ Success Indicators

You know everything works when you see:

### Terminal 1 (Backend)
```
🚀 IoT Sensor Server started!
📡 API: http://localhost:5000/api/sensors
🔌 WebSocket: ws://localhost:5000
❤️  Health: http://localhost:5000/health
```

### Terminal 2 (Frontend)
```
VITE v5.4.19 ready in 1757 ms → Local: http://localhost:5173/
```

### Dashboard
```
✅ "Live Sensor Data" card visible
✅ Shows "Connected" status (green dot)
✅ PH value displayed
✅ Turbidity value displayed
✅ Updates every 2-5 seconds
```

### Browser Console
```
✅ WebSocket connected to sensor server
✅ No error messages
```

---

## 🚨 Troubleshooting Flowchart

```
Is backend running?
├─ NO  → Run: npm run sensor:server
└─ YES → Continue

Is frontend running?
├─ NO  → Run: npm run dev
└─ YES → Continue

Dashboard opens?
├─ NO  → Check http://localhost:5173 in browser
└─ YES → Continue

Can see "Live Sensor Data" card?
├─ NO  → Check browser console for errors
└─ YES → Continue

WebSocket showing "Connected"?
├─ NO  → Backend not on port 5000
└─ YES → Continue

Can submit test data?
├─ NO  → Use curl: POST to /api/sensors
└─ YES → SUCCESS! ✅
```

---

## 🎉 You're Ready!

Everything you need is installed and configured.

**Next step:** Open `IOT_README.md` and pick your path (software-only, hardware, or API integration).

---

**Quick Links:**
- 📖 Main Guide: `IOT_README.md`
- ⚡ Quick Start: `IOT_QUICK_START.md`
- 🛠️ Hardware: `IOT_ESP32_SETUP.md`
- 📚 Reference: `IOT_ESP32_COMPLETE_SETUP.md`
- 🗺️ Navigation: `IOT_ESP32_SETUP_INDEX.md`

---

Happy monitoring! 🌊💧

