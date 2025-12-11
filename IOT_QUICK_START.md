# IoT ESP32 Live Sensor Dashboard - Quick Start Guide

## 🎯 What This Setup Does

Reads **PH Level** and **Turbidity** sensor values in **real-time** from an ESP32 microcontroller and displays them live on your dashboard webpage with:
- ✅ Live updates every 2-5 seconds
- ✅ WebSocket connection for real-time streaming
- ✅ Status indicators (Good/Warning/Critical)
- ✅ Visual progress bars
- ✅ Connection status monitoring
- ✅ Historical data logging

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  HARDWARE SENSORS (Water Quality)                   │
│  ┌──────────────┐          ┌──────────────┐        │
│  │  PH Sensor   │          │  Turbidity   │        │
│  │   Module     │          │   Sensor     │        │
│  └──────┬───────┘          └──────┬───────┘        │
│         │ (Analog 0-3.3V)         │                │
│         └─────────────────────────┘                │
│                  │                                  │
│                  ▼                                  │
│         ┌─────────────────┐                        │
│         │ ESP32 Dev Board │  (WiFi enabled)        │
│         └────────┬────────┘                        │
│                  │ WiFi (2.4GHz)                   │
│                  ▼                                  │
│         ┌─────────────────┐                        │
│         │ Your Local WiFi │                        │
│         └────────┬────────┘                        │
│                  │                                  │
└──────────────────┼──────────────────────────────────┘
                   │ HTTP POST every 5 seconds
                   ▼
┌──────────────────────────────────────────────────────┐
│  BACKEND SERVER (Node.js)                            │
│  ┌────────────────────────────────────────────────┐  │
│  │  IoT Sensor Server (Port 5000)                 │  │
│  │  ✅ Receives sensor data from ESP32            │  │
│  │  ✅ Broadcasts via WebSocket                   │  │
│  │  ✅ Stores last 100 readings                   │  │
│  │  ✅ REST API endpoints                         │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────┬───────────────────────────────────┘
                   │ WebSocket Connection
                   ▼
┌──────────────────────────────────────────────────────┐
│  FRONTEND (React + Vite)                             │
│  ┌────────────────────────────────────────────────┐  │
│  │  Dashboard Page                                │  │
│  │  ✅ Displays PH Level (real-time)              │  │
│  │  ✅ Displays Turbidity (real-time)             │  │
│  │  ✅ Status indicators                          │  │
│  │  ✅ Connection monitoring                      │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
       http://localhost:5173 (or your server IP)
```

---

## 📋 Prerequisites

- **ESP32 Development Board** ($8-15)
  - [Amazon Link](https://www.amazon.com/HiLetgo-NodeMCU-Internet-Development-Microcontroller/s?k=ESP32)
- **PH Sensor Module** ($20-30)
  - Type: Analog PH probe with amplifier module
  - Output: 0-3.3V (ADC compatible)
- **Turbidity Sensor** ($10-15)
  - Type: JSN-SR04T or similar
  - Output: 0-3.3V (ADC compatible)
- **USB Cable** (Micro-USB or USB-C, depending on ESP32 variant)
- **Jumper Wires** & **Breadboard** (optional but recommended)
- **WiFi Router** (2.4GHz - ESP32 doesn't support 5GHz)
- **Computer** with Node.js installed (you already have this!)

---

## 🔧 Setup Steps

### Step 1: Prepare Hardware (30 minutes)

1. **Connect PH Sensor to ESP32**:
   - PH Sensor VCC → ESP32 3.3V
   - PH Sensor GND → ESP32 GND
   - PH Sensor Signal → ESP32 GPIO 34 (ADC pin, input-only)

2. **Connect Turbidity Sensor to ESP32**:
   - Turbidity VCC → ESP32 5V
   - Turbidity GND → ESP32 GND
   - Turbidity Signal → ESP32 GPIO 35 (ADC pin, input-only)

3. **Connect USB Cable**:
   - Connect ESP32 to your computer via USB
   - LED on ESP32 should light up (red or green)

4. **Add Noise Filtering** (Optional but recommended):
   - Solder 0.1µF capacitors across sensor power/ground to reduce fluctuations

### Step 2: Install Arduino IDE & Upload Firmware (20 minutes)

1. **Download Arduino IDE 2.0+**:
   - Go to https://www.arduino.cc/en/software
   - Download and install for your OS

2. **Add ESP32 Board Support**:
   - Open Arduino IDE
   - Go to `Preferences` → `Additional Boards Manager URLs`
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Click OK

3. **Install ESP32 Board**:
   - Go to `Tools` → `Board Manager`
   - Search for "ESP32"
   - Click "Install" on "esp32 by Espressif Systems"

4. **Install Required Libraries**:
   - Go to `Sketch` → `Include Library` → `Manage Libraries`
   - Search and install:
     - **ArduinoJson** (v7.0.0+)
     - (WiFi and WebServer are built-in)

5. **Upload ESP32 Firmware**:
   - Copy the complete firmware code from `IOT_ESP32_SETUP.md`
   - Create new sketch in Arduino IDE
   - Paste the code
   - Configure at the top:
     ```cpp
     const char* SSID = "YOUR_SSID";              // Your WiFi name
     const char* PASSWORD = "YOUR_PASSWORD";       // Your WiFi password
     const char* SERVER_URL = "http://192.168.1.X:5000/api/sensors";  // Replace X with your computer's IP
     ```
   - Select Tools → Board → ESP32 → ESP32 Dev Module
   - Select correct COM port (Tools → Port)
   - Click Upload button
   - Monitor (Tools → Serial Monitor, 115200 baud) to verify

---

### Step 3: Install Backend Dependencies (5 minutes)

#### On Windows:
1. Open PowerShell in the project folder
2. Run: `setup-sensor.bat`
3. Or manually: `npm install express cors ws @types/express @types/ws ts-node`

#### On macOS/Linux:
1. Open Terminal in the project folder
2. Run: `bash setup-sensor.sh`
3. Or manually: `npm install express cors ws @types/express @types/ws ts-node`

---

### Step 4: Start Both Servers (3 minutes)

#### Terminal 1 - Start Sensor Server:
```powershell
npm run sensor:server
```

Expected output:
```
🚀 IoT Sensor Server started!
📡 API: http://localhost:5000/api/sensors
🔌 WebSocket: ws://localhost:5000
❤️  Health: http://localhost:5000/health
```

#### Terminal 2 - Start Frontend Dev Server:
```powershell
npm run dev
```

Expected output:
```
VITE v5.4.19 ready in 1757 ms → Local: http://localhost:5173/
```

---

### Step 5: Verify Everything Works (5 minutes)

1. **Check ESP32 is Uploading Data**:
   - Open Serial Monitor in Arduino IDE (Tools → Serial Monitor)
   - Baud rate: 115200
   - Should see messages like:
     ```
     ✅ WiFi connected!
     IP Address: 192.168.1.100
     📊 Sensor Reading - pH: 7.25 | Turbidity: 42.3 NTU
     ✅ Data sent successfully (HTTP 201)
     ```

2. **Check Backend is Receiving**:
   - Terminal 1 should show:
     ```
     ✅ Sensor Data Received [2025-12-11T14:23:45.000Z]
        pH: 7.25 | Turbidity: 42.3 NTU | Device: ESP32-Default
     ```

3. **Check Frontend Displays Data**:
   - Open http://localhost:5173 in browser
   - Go to Dashboard page
   - Should see "Live Sensor Data" card with:
     - PH Level (with status)
     - Turbidity (with status)
     - Connection indicator (green dot = connected)
     - Last update time

---

## 📊 File Locations

| File | Purpose |
|------|---------|
| `IOT_ESP32_SETUP.md` | Hardware guide & ESP32 firmware code |
| `IOT_QUICK_START.md` | This file - quick start guide |
| `src/server/index.ts` | Backend sensor server |
| `src/server/routes/sensors.ts` | Sensor API endpoints |
| `src/services/sensorService.ts` | Frontend sensor client |
| `src/components/LiveSensorDisplay.tsx` | Dashboard display component |
| `setup-sensor.bat` | Windows setup script |
| `setup-sensor.sh` | macOS/Linux setup script |

---

## 🚀 Starting Fresh Each Day

**Every time you want to use the IoT system**:

1. **Terminal 1** (Sensor Server):
   ```powershell
   npm run sensor:server
   ```

2. **Terminal 2** (Frontend + ESP32 data):
   ```powershell
   npm run dev
   ```

3. **Arduino IDE** (Optional monitoring):
   - Tools → Serial Monitor (115200 baud)
   - Watch ESP32 upload sensor data

4. **Open Dashboard**:
   - http://localhost:5173/dashboard
   - Watch live PH and Turbidity updates

---

## 🧪 Testing Without Hardware

If you don't have hardware ready yet, test with mock data:

### Option A: Manual Test Submissions

From your browser console while on the dashboard:
```javascript
// Import the sensor service
import { sensorService } from '@/services/sensorService';

// Submit test readings
await sensorService.submitReading(7.2, 45.3);  // pH 7.2, Turbidity 45.3 NTU
await sensorService.submitReading(7.5, 38.1);  // Another reading
```

### Option B: Test API with curl

```bash
# Submit test sensor data
curl -X POST http://localhost:5000/api/sensors \
  -H "Content-Type: application/json" \
  -d '{"ph": 7.2, "turbidity": 45.3}'

# Get latest reading
curl http://localhost:5000/api/sensors/latest

# Get system status
curl http://localhost:5000/api/sensors/status

# Get last 10 readings
curl http://localhost:5000/api/sensors?limit=10
```

---

## 🔍 Troubleshooting

### Problem: "ESP32 not detected"
**Solution**: Install CH340 driver from [Silicon Labs](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)

### Problem: "WiFi connection fails on ESP32"
**Solution**: 
- Verify SSID and password are correct
- Ensure router is 2.4GHz (ESP32 doesn't support 5GHz)
- Check if other devices can connect to same WiFi

### Problem: "Data not reaching server"
**Solution**:
- Verify backend is running: `http://localhost:5000/health`
- Check firewall isn't blocking port 5000
- Confirm IP address is correct in ESP32 code (use `ipconfig` to find your computer's IP)

### Problem: "Invalid pH/Turbidity readings"
**Solution**:
- Calibrate PH sensor with pH 4, 7, 10 solutions
- Adjust PH_SCALE and PH_OFFSET constants in ESP32 code
- Check sensor is fully submerged in water (if using turbidity sensor)

### Problem: "Sensor readings fluctuate wildly"
**Solution**:
- Add 0.1µF capacitors across sensor power/ground pins
- Keep sensor wires away from power cables
- Average readings over time (firmware already does this)

### Problem: "Dashboard shows 'No Sensor Data'"
**Solution**:
1. Verify sensor server is running (Terminal 1)
2. Check Serial Monitor in Arduino IDE shows successful WiFi connection
3. Check Serial Monitor shows "✅ Data sent successfully"
4. Wait 5-10 seconds for first data to arrive

### Problem: "WebSocket connection failed"
**Solution**:
- Ensure sensor server is running on port 5000
- Check browser console for specific error message
- Try refreshing the page
- Check if firewall is blocking WebSocket connections

---

## 📈 Next Steps / Advanced Features

Once basic setup is working:

1. **Historical Charts**:
   - Implement time-series graph showing last hour of data
   - Use Recharts library (already installed)

2. **Data Logging**:
   - Save readings to database for historical analysis
   - Create trending reports

3. **Alerts & Notifications**:
   - Send email/SMS if PH or turbidity out of range
   - Browser notifications when sensor disconnects

4. **Multiple Sensors**:
   - Add more sensors (temperature, salinity, etc.)
   - Support multiple ESP32 devices

5. **Mobile App**:
   - APK already building (remember your APK deployment!)
   - Display live sensor data on phone

6. **Cloud Backup**:
   - Store readings in cloud database
   - Access from anywhere

---

## 🎓 Learning Resources

- **ESP32 Documentation**: https://docs.espressif.com/projects/esp-idf/en/latest/
- **Arduino Reference**: https://www.arduino.cc/reference/
- **Node.js Express**: https://expressjs.com/
- **WebSocket Guide**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

## ✅ Checklist

- [ ] Hardware connected (PH + Turbidity + ESP32 + USB)
- [ ] Arduino IDE installed with ESP32 board support
- [ ] ESP32 firmware uploaded successfully
- [ ] Backend dependencies installed (`npm install...`)
- [ ] Sensor server running (`npm run sensor:server`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Dashboard page displays live sensor data
- [ ] Serial Monitor shows successful WiFi connection
- [ ] Serial Monitor shows "Data sent successfully"
- [ ] Browser console shows WebSocket connected
- [ ] Live readings update every 2-5 seconds

---

## 📞 Support

If you encounter issues:
1. Check Serial Monitor output on ESP32
2. Check browser console for JavaScript errors
3. Check Terminal 1 for backend errors
4. Verify all IPs and ports are correct
5. Try restarting both servers
6. Check WiFi connection with other devices

---

**Setup Time: ~1 hour total**  
**Cost: $30-60 (sensors + board)**  
**Difficulty: Beginner (following step-by-step)**

Happy monitoring! 🎉

