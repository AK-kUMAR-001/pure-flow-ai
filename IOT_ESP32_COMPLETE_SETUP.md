# IoT ESP32 Integration - Complete Setup Package

## 📦 What You've Got

A complete **live water quality monitoring system** that:
- Reads **PH Level** and **Turbidity** in real-time from ESP32 sensors
- Displays data on your dashboard with WebSocket real-time updates
- Provides REST API for historical data access
- Works with or without hardware (testing mode available)

---

## 📁 Files Created

### Hardware & Firmware
| File | Purpose |
|------|---------|
| `IOT_ESP32_SETUP.md` | **Start here for hardware** - Complete guide with ESP32 Arduino code |
| `IOT_QUICK_START.md` | **Start here for software** - Setup & usage guide |

### Backend Server
| File | Purpose |
|------|---------|
| `src/server/index.ts` | Main sensor server (Express + WebSocket) |
| `src/server/routes/sensors.ts` | API endpoints for sensor data |
| `src/server/services/` | Service layer (currently used by routes) |

### Frontend Components
| File | Purpose |
|------|---------|
| `src/services/sensorService.ts` | Client-side WebSocket + REST API handler |
| `src/components/LiveSensorDisplay.tsx` | Dashboard widget showing PH & Turbidity |
| `src/components/SensorTestingComponent.tsx` | Testing tool (no hardware needed) |

### Setup Scripts
| File | Purpose |
|------|---------|
| `setup-sensor.bat` | Windows automated setup |
| `setup-sensor.sh` | macOS/Linux automated setup |

---

## 🚀 Quick Start (3 Options)

### OPTION A: Hardware Setup (Full IoT System)
**Time: ~2 hours** | **Cost: $30-60**

1. **Assemble Hardware** (30 min):
   - Read: `IOT_ESP32_SETUP.md` → "Hardware Requirements" section
   - Connect PH sensor to GPIO 34
   - Connect Turbidity sensor to GPIO 35
   - Connect ESP32 to WiFi

2. **Upload Firmware** (20 min):
   - Read: `IOT_ESP32_SETUP.md` → "ESP32 Arduino Firmware" section
   - Copy code to Arduino IDE
   - Update WiFi credentials and server IP
   - Upload to ESP32

3. **Start Servers** (5 min):
   ```powershell
   # Terminal 1
   npm run sensor:server
   
   # Terminal 2
   npm run dev
   ```

4. **Verify**:
   - Open http://localhost:5173/dashboard
   - Should see "Live Sensor Data" card with real readings

---

### OPTION B: Software Demo (No Hardware)
**Time: ~10 minutes** | **Cost: $0**

1. **Install dependencies** (5 min):
   ```powershell
   npm install
   # or if you want all at once:
   npm run sensor:server
   ```

2. **Start servers** (3 min):
   ```powershell
   # Terminal 1
   npm run sensor:server
   
   # Terminal 2
   npm run dev
   ```

3. **Test without hardware**:
   - Add `SensorTestingComponent` to Dashboard page
   - Use "Quick Test Actions" to simulate readings
   - Watch live updates on dashboard
   - See `src/components/SensorTestingComponent.tsx` for implementation

4. **Later, integrate real hardware**:
   - Just upload ESP32 firmware
   - Remove testing component
   - Done!

---

### OPTION C: Testing API Manually
**Time: ~5 minutes** | **Cost: $0**

```powershell
# Start server
npm run sensor:server

# In another terminal, test the API
curl -X POST http://localhost:5000/api/sensors `
  -H "Content-Type: application/json" `
  -d '{\"ph\": 7.2, \"turbidity\": 45.3}'

# Get latest reading
curl http://localhost:5000/api/sensors/latest

# Get system status
curl http://localhost:5000/api/sensors/status
```

---

## 📊 System Architecture

```
ESP32 Microcontroller (with sensors)
    ↓
    WiFi (2.4GHz)
    ↓
Backend Server (Node.js, Port 5000)
    ├─ REST API: /api/sensors
    └─ WebSocket: ws://localhost:5000
    ↓
Frontend (React, Port 5173)
    ├─ Dashboard Page
    └─ LiveSensorDisplay Component
```

---

## 🎮 Component Usage

### Using LiveSensorDisplay in Dashboard

Already added to `src/pages/Dashboard.tsx`:

```tsx
import LiveSensorDisplay from '@/components/LiveSensorDisplay';

export default function Dashboard() {
  return (
    <div>
      {/* Your existing dashboard content */}
      
      {/* Add this component */}
      <LiveSensorDisplay onStatusChange={(isConnected) => {
        console.log('Sensor connection status:', isConnected);
      }} />
    </div>
  );
}
```

### Using SensorTestingComponent for Testing

Add to Dashboard temporarily for testing:

```tsx
import SensorTestingComponent from '@/components/SensorTestingComponent';

export default function Dashboard() {
  return (
    <div>
      {/* During testing */}
      <SensorTestingComponent />
      
      {/* During production */}
      <LiveSensorDisplay />
    </div>
  );
}
```

---

## 🔌 API Endpoints

### Sensor Data Submission
```
POST /api/sensors
Content-Type: application/json

Request:
{
  "ph": 7.2,
  "turbidity": 45.3,
  "deviceId": "ESP32-Default"  // optional
}

Response:
{
  "success": true,
  "message": "Sensor data received successfully",
  "data": {
    "id": "1702304625000-abc123",
    "ph": 7.2,
    "turbidity": 45.3,
    "timestamp": "2025-12-11T14:23:45.000Z",
    "deviceId": "ESP32-Default"
  }
}
```

### Get Latest Reading
```
GET /api/sensors/latest

Response:
{
  "success": true,
  "message": "Latest sensor reading",
  "data": {
    "id": "1702304625000-abc123",
    "ph": 7.2,
    "turbidity": 45.3,
    "timestamp": "2025-12-11T14:23:45.000Z",
    "deviceId": "ESP32-Default"
  }
}
```

### Get Multiple Readings
```
GET /api/sensors?limit=10

Response:
{
  "success": true,
  "message": "Sensor readings retrieved",
  "count": 10,
  "data": [ ... ]
}
```

### Get System Status
```
GET /api/sensors/status

Response:
{
  "success": true,
  "data": {
    "connected": true,
    "lastUpdate": "2025-12-11T14:23:45.000Z",
    "totalReadings": 42,
    "wsClientsConnected": 3,
    "data": { ... }
  }
}
```

---

## 🔧 Configuration

### ESP32 WiFi Configuration
Edit these lines in Arduino sketch:
```cpp
const char* SSID = "YOUR_SSID";
const char* PASSWORD = "YOUR_PASSWORD";
const char* SERVER_URL = "http://192.168.1.X:5000/api/sensors";  // Your computer IP
```

Get your computer IP:
- Windows: `ipconfig` → look for "IPv4 Address"
- macOS/Linux: `ifconfig` | grep "inet "

### Sensor Calibration
Edit these constants in Arduino sketch:
```cpp
const float PH_OFFSET = 0.0;     // Adjust for accuracy
const float PH_SCALE = 3.3 / 4095.0;  // ADC scaling

const float TURBIDITY_OFFSET = 2.5;   // Voltage offset
```

### Server Port
Change port in `src/server/index.ts`:
```typescript
const PORT = process.env.SENSOR_PORT || 5000;
```

Or set environment variable:
```powershell
$env:SENSOR_PORT = 8000; npm run sensor:server
```

---

## 🧪 Testing Checklist

- [ ] Backend server starts without errors
  ```powershell
  npm run sensor:server
  ```

- [ ] API is accessible
  ```powershell
  curl http://localhost:5000/health
  # Should return: {"status": "ok", ...}
  ```

- [ ] Frontend connects to backend
  - Open http://localhost:5173/dashboard
  - Should show "Live Sensor Data" card
  - Check browser console for errors

- [ ] Can submit test data
  - Use curl or testing component
  - Check if backend logs show received data

- [ ] WebSocket connection works
  - Browser console should show "✅ WebSocket connected to sensor server"
  - Connection status should show green dot

- [ ] ESP32 uploads data (if hardware present)
  - Serial Monitor should show successful HTTP POST
  - Backend should log received readings
  - Dashboard should update in real-time

---

## 📝 Integration with Dashboard

The `LiveSensorDisplay` component is designed to:
1. **Auto-connect** to sensor server on mount
2. **Display** current PH and Turbidity values
3. **Show status** (Good/Warning/Critical)
4. **Handle disconnection** with retry logic
5. **Work offline** (shows error message when unavailable)

### Positioning on Dashboard

Add to the top of your existing metrics:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <LiveSensorDisplay /> {/* NEW */}
  {/* Your existing content */}
</div>
```

---

## 🚨 Troubleshooting

### Server won't start
```
Error: EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process using port 5000
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### WebSocket connection fails
**Solution**: 
- Check if backend is running
- Check if port 5000 is open
- Check firewall settings

### No sensor data appears
**Solution**:
- Check ESP32 Serial Monitor (115200 baud)
- Verify WiFi connection successful
- Verify server IP in ESP32 code
- Check backend receives POST requests

### Readings are wildly inaccurate
**Solution**:
- Calibrate sensors properly
- Add capacitors to reduce noise
- Average multiple readings
- Check sensor connections

---

## 🎯 Next Steps

Once basic setup works:

1. **Add more sensors**:
   - Temperature, Salinity, Dissolved Oxygen
   - Just add more GPIO pins and API fields

2. **Store historical data**:
   - Use Supabase database (already in your project)
   - Create tables for sensor readings
   - Add time-based queries

3. **Create charts**:
   - Use Recharts library (already installed)
   - Display pH trend over last hour/day
   - Show turbidity history

4. **Add alerts**:
   - Email notifications when out of range
   - Browser notifications
   - SMS via Twilio

5. **Mobile app**:
   - Your React app already builds to APK
   - Just add LiveSensorDisplay component
   - Same WebSocket connection works

6. **Cloud deployment**:
   - Deploy backend to Heroku/Railway
   - Access from anywhere
   - Multiple users can monitor

---

## 📚 Documentation Files

Read in this order:

1. **IOT_QUICK_START.md** - How to set up and run
2. **IOT_ESP32_SETUP.md** - Hardware & firmware details
3. **This file** - Architecture & advanced usage

---

## ✅ Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Backend Server | ✅ Complete | Express + WebSocket |
| REST API | ✅ Complete | Full CRUD endpoints |
| WebSocket | ✅ Complete | Real-time updates |
| Frontend Display | ✅ Complete | Responsive component |
| Testing Component | ✅ Complete | No hardware needed |
| Arduino Firmware | ✅ Complete | Ready to upload |
| Setup Scripts | ✅ Complete | Windows & Unix |
| Documentation | ✅ Complete | Comprehensive guides |

---

## 🎓 Learning Resources

- [ESP32 Official Docs](https://docs.espressif.com/)
- [Arduino WiFi Tutorials](https://www.arduino.cc/en/Reference/WiFi)
- [Express.js Guide](https://expressjs.com/)
- [WebSocket Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [React Hooks](https://react.dev/reference/react)

---

## 💡 Tips

1. **Keep Serial Monitor open** while developing - great for debugging
2. **Test API endpoints** with curl before integrating into React
3. **Start with demo mode** (no hardware) to understand the flow
4. **Add logging** to understand data flow
5. **Check browser DevTools** Console tab for WebSocket messages
6. **Use Postman** to test API if you prefer GUI to curl

---

## 📞 Common Questions

**Q: Do I need the hardware right now?**  
A: No! Start with Option B (Demo) to understand the system. Hardware can be added later.

**Q: Can I use different sensors?**  
A: Yes! Just adjust the Arduino code and API fields.

**Q: Can multiple users monitor?**  
A: Yes! WebSocket broadcasts to all connected clients.

**Q: Can I store data in database?**  
A: Yes! Modify `src/server/routes/sensors.ts` to save to Supabase.

**Q: Will it work on my phone?**  
A: Yes! Just access the same URL from your phone on the same WiFi.

---

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Backend server shows `🚀 IoT Sensor Server started!`
2. ✅ Frontend shows `Dashboard` page without errors
3. ✅ Can submit test data via curl/testing component
4. ✅ Browser shows `WebSocket connected` message
5. ✅ Dashboard displays PH and Turbidity values
6. ✅ Values update every 2-5 seconds

---

**Ready to start?**
→ Go to `IOT_QUICK_START.md` for step-by-step instructions!

