# IoT ESP32 Sensor Setup Guide

## Overview
This setup enables live reading of **PH** and **Turbidity** sensor values from ESP32 microcontroller and displays them in real-time on the dashboard.

---

## Hardware Requirements

### Microcontroller
- **ESP32 Development Board** (30-pin variant recommended)
- USB-C or Micro-USB cable for programming

### Sensors
1. **PH Sensor Module**
   - Analog PH probe
   - PH sensor module with amplifier (BNC connector or similar)
   - Typical output: 0-3.3V (ADC compatible)
   - Calibration: pH 4, pH 7, pH 10 solutions

2. **Turbidity Sensor Module**
   - Analog turbidity sensor (JSN-SR04T or similar)
   - Output: 0-3.3V (ADC compatible)
   - No complex calibration needed (linear mapping)

### Additional Components
- 2x capacitors (0.1µF) - noise filtering
- Micro-SD card reader (optional, for logging)
- USB power supply (5V, 1-2A)

---

## Pin Configuration

### ESP32 Pinout

```
PH SENSOR CONNECTION:
  PH Sensor VCC → ESP32 3.3V (or 5V with voltage divider)
  PH Sensor GND → ESP32 GND
  PH Sensor Signal → ESP32 GPIO 34 (ADC1_CH6, input-only)

TURBIDITY SENSOR CONNECTION:
  Turbidity VCC → ESP32 5V
  Turbidity GND → ESP32 GND
  Turbidity Signal → ESP32 GPIO 35 (ADC1_CH7, input-only)

WIFI CONNECTION:
  Built-in WiFi (no extra components needed)
```

---

## Software Setup

### 1. Arduino IDE Installation
1. Download [Arduino IDE 2.0+](https://www.arduino.cc/en/software)
2. Install ESP32 board support:
   - Go to `Preferences` → `Additional Boards Manager URLs`
   - Add: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
   - Open `Tools` → `Board Manager`, search "ESP32", install "esp32 by Espressif Systems"

### 2. Library Installation
In Arduino IDE, go to `Sketch` → `Include Library` → `Manage Libraries`:
- **ArduinoJson** (v7.0.0+) - For JSON formatting
- **WiFi** (built-in)
- **WebServer** (built-in)

---

## ESP32 Arduino Firmware

Create a new sketch and upload the following code:

### File: `esp32_water_sensors.ino`

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* SSID = "YOUR_SSID";              // Your WiFi name
const char* PASSWORD = "YOUR_PASSWORD";       // Your WiFi password
const char* SERVER_URL = "http://YOUR_IP:5000/api/sensors";  // Backend API

// Pin Configuration
const int PH_PIN = 34;           // ADC pin for PH sensor (GPIO 34)
const int TURBIDITY_PIN = 35;    // ADC pin for Turbidity sensor (GPIO 35)

// Calibration Constants (adjust based on your specific sensors)
const float PH_OFFSET = 0.0;     // PH sensor offset calibration
const float PH_SCALE = 3.3 / 4095.0;  // Scale factor for 12-bit ADC
const float TURBIDITY_OFFSET = 2.5;   // Turbidity offset (in volts)

// Sensor Reading Intervals
const unsigned long SENSOR_READ_INTERVAL = 2000;  // Read every 2 seconds
const unsigned long SEND_INTERVAL = 5000;         // Send to server every 5 seconds

// Global Variables
unsigned long lastReadTime = 0;
unsigned long lastSendTime = 0;
float lastPH = 0;
float lastTurbidity = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=== Water Quality IoT ESP32 Sensor ===");
  Serial.println("Starting initialization...");
  
  // Initialize pins
  pinMode(PH_PIN, INPUT);
  pinMode(TURBIDITY_PIN, INPUT);
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("\n✅ Initialization complete!");
  Serial.println("Reading sensors and sending data to dashboard...\n");
}

void loop() {
  // Ensure WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi disconnected, attempting to reconnect...");
    connectToWiFi();
  }
  
  unsigned long currentTime = millis();
  
  // Read sensors at regular intervals
  if (currentTime - lastReadTime >= SENSOR_READ_INTERVAL) {
    readSensors();
    lastReadTime = currentTime;
  }
  
  // Send data to server at regular intervals
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    sendSensorData();
    lastSendTime = currentTime;
  }
  
  delay(100);  // Small delay to prevent watchdog timeout
}

/**
 * Connect to WiFi network
 */
void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(SSID);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n❌ WiFi connection failed. Check SSID and password.");
  }
}

/**
 * Read analog values from sensors and convert to meaningful units
 */
void readSensors() {
  // Read PH Sensor
  int phRaw = analogRead(PH_PIN);
  float phVoltage = phRaw * (3.3 / 4095.0);  // Convert to voltage (0-3.3V)
  lastPH = phVoltage * 3.5 + PH_OFFSET;  // Convert voltage to pH (adjust multiplier based on calibration)
  
  // Constrain to valid pH range (0-14)
  lastPH = constrain(lastPH, 0.0, 14.0);
  
  // Read Turbidity Sensor
  int turbidityRaw = analogRead(TURBIDITY_PIN);
  float turbidityVoltage = turbidityRaw * (3.3 / 4095.0);  // Convert to voltage (0-3.3V)
  
  // Convert voltage to NTU (Nephelometric Turbidity Units)
  // Formula: NTU = -2000 * V + 6000 (adjust based on sensor datasheet)
  lastTurbidity = -2000.0 * turbidityVoltage + 6000.0;
  lastTurbidity = constrain(lastTurbidity, 0.0, 3000.0);  // Constrain to reasonable range
  
  // Print to Serial Monitor
  Serial.print("📊 Sensor Reading - pH: ");
  Serial.print(lastPH, 2);
  Serial.print(" | Turbidity: ");
  Serial.print(lastTurbidity, 2);
  Serial.println(" NTU");
  Serial.print("   [Raw: pH=");
  Serial.print(phRaw);
  Serial.print(" (");
  Serial.print(phVoltage, 2);
  Serial.print("V), Turbidity=");
  Serial.print(turbidityRaw);
  Serial.print(" (");
  Serial.print(turbidityVoltage, 2);
  Serial.println("V)]");
}

/**
 * Send sensor data to backend server via HTTP POST
 */
void sendSensorData() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi not connected, skipping send");
    return;
  }
  
  HTTPClient http;
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["ph"] = round(lastPH * 10.0) / 10.0;  // Round to 1 decimal place
  doc["turbidity"] = round(lastTurbidity * 10.0) / 10.0;
  doc["timestamp"] = millis() / 1000;  // Seconds since boot
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send POST request
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(jsonString);
  
  if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_CREATED) {
    Serial.print("✅ Data sent successfully (HTTP ");
    Serial.print(httpCode);
    Serial.print(") - ");
    Serial.println(jsonString);
  } else {
    Serial.print("❌ Failed to send data (HTTP ");
    Serial.print(httpCode);
    Serial.print("): ");
    Serial.println(http.errorToString(httpCode));
  }
  
  http.end();
}
```

### Configuration Steps:

1. **Set WiFi Credentials** (lines 7-8):
   ```cpp
   const char* SSID = "YourWiFiName";
   const char* PASSWORD = "YourWiFiPassword";
   ```

2. **Set Server URL** (line 9):
   ```cpp
   const char* SERVER_URL = "http://192.168.x.x:5000/api/sensors";
   // Replace with your backend server IP:port
   ```

3. **Calibrate Sensors**:
   - **PH Sensor**: Adjust `PH_SCALE` and `PH_OFFSET` using pH 4, 7, 10 solutions
   - **Turbidity**: Use distilled water (0 NTU) and calibration solutions if available

4. **Upload to ESP32**:
   - Select `Tools` → `Board` → `ESP32` → `ESP32 Dev Module`
   - Select appropriate COM port
   - Click `Upload`
   - Open Serial Monitor (115200 baud) to verify operation

---

## Backend API Endpoint

### Route: `POST /api/sensors`

**Request Payload:**
```json
{
  "ph": 7.2,
  "turbidity": 45.3,
  "timestamp": 12345
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sensor data received",
  "data": {
    "ph": 7.2,
    "turbidity": 45.3,
    "timestamp": "2025-12-11T14:23:45.000Z"
  }
}
```

---

## WebSocket Real-Time Updates

The dashboard connects via WebSocket to receive live sensor updates:

```typescript
const sensorSocket = new WebSocket("ws://YOUR_IP:5000");

sensorSocket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update pH: data.ph
  // Update Turbidity: data.turbidity
};
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| ESP32 not detecting | Install CH340 driver from [Silicon Labs](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers) |
| WiFi connection fails | Check SSID/password, ensure router is 2.4GHz (ESP32 doesn't support 5GHz) |
| Sensor readings fluctuate | Add capacitors (0.1µF) across sensor power/ground, average multiple readings |
| Data not reaching server | Verify backend is running, check firewall, confirm IP address is correct |
| Invalid pH values | Calibrate sensor with pH 4, 7, 10 solutions; adjust `PH_SCALE` constant |

---

## Sensor Maintenance

### PH Sensor
- Store in storage solution when not in use
- Calibrate weekly with 3-point calibration (pH 4, 7, 10)
- Clean electrode with distilled water before use
- Replace membrane every 6-12 months

### Turbidity Sensor
- Keep optical window clean (use soft cloth with distilled water)
- Avoid direct sunlight on sensor
- Use only in water (dry operation can damage sensor)

---

## Next Steps

1. ✅ Upload ESP32 firmware
2. ✅ Configure WiFi and backend URL
3. ✅ Start backend server (runs simultaneously with React dev server)
4. ✅ Open dashboard to see live PH and Turbidity values
5. ✅ (Optional) Add data logging and historical charts

---

## File References

- **ESP32 Code**: `esp32_water_sensors.ino` (above)
- **Backend API**: `src/server/routes/sensors.ts` (created next)
- **Dashboard Component**: `src/pages/Dashboard.tsx` (updated)
- **Sensor Service**: `src/services/sensorService.ts` (created)

---

**Setup Time: ~30 minutes**  
**Cost: $15-30 (sensors) + ESP32 ($8-15)**

