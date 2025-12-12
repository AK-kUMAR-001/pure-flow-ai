# 💧 AquaAdapt - Smart Water Filtration System

## 📖 About Our System

**AquaAdapt** is an advanced IoT-enabled Grey Water Recycling - solution designed to make water management smart, efficient, and accessible that will be monitore and predicted (based on real time data after production test) - trying to provide for our college sudent's .

The system connects physical water filtration hardware with a digital dashboard, allowing users to monitor water quality in real-time. 
It uses **Artificial Intelligence (Linear Regression) - xboost etc ...** to predict future water quality trends based on historical data, ensuring proactive maintenance and safety.

### 🌟 Key Features

1.  **Real-Time Monitoring**: Live tracking of **pH**, **Turbidity**, **Inlet Flow**, and **Outlet Flow**.
2.  **AI Prediction Engine**: Predicts future pH levels using a Linear Regression algorithm to alert users of potential filter issues before they happen.
3.  **IoT Connectivity**: Seamless integration with **ESP32** microcontrollers via WebSockets for instant data updates.
4. **live Test at Home and produce personalized - custom based catridge filtration**
5.  **Cross-Platform**: Works as a responsive Web App and a native Android App (via Capacitor).
6.  **User Authentication**: Secure login and signup flow.
7.  **Interactive Dashboard**: Beautiful charts and gauges powered by Recharts and Tailwind CSS.

---

## 🛠️ Tech Stack & Versions

This application is built with the following specific versions to ensure stability:

### **Frontend (Web & Mobile UI)**
*   **Framework**: React `^18.3.1`
*   **Build Tool**: Vite `^5.4.19`
*   **Language**: TypeScript `^5.8.3`
*   **Styling**: Tailwind CSS `^3.4.17`
*   **UI Components**: Shadcn UI / Radix UI
*   **Charts**: Recharts `^2.15.4`
*   **Icons**: Lucide React `^0.462.0`

### **Backend (IoT Server)**
*   **Runtime**: Node.js
*   **Server Framework**: Express `^4.18.2`
*   **Real-time Communication**: WS (WebSockets) `^8.14.2`
*   **Database Client**: Supabase JS `^2.87.0`
*   **Execution**: TSX `^4.21.0` (TypeScript Execution)

### **Mobile (Android)**
*   **Runtime**: Capacitor `^8.0.0`
*   **Platform**: Android

---

## 👶 Baby Setup Guide (Step-by-Step)

Follow these instructions exactly to set up the project from scratch on a new computer.

### **Phase 1: Prerequisites**

1.  **Install Node.js**: Download and install the "LTS" version from nodejs.org.
2.  **Install Git**: Download from git-scm.com.
3.  **VS Code**: Recommended code editor.

### **Phase 2: Installation**

1.  **Open Terminal**: Open your command prompt or terminal.
2.  **Navigate to folder**: Go to where you want the project.
3.  **Clone/Download**:
    ```bash
    git clone <your-repo-url>
    cd pure-flow-ai-main
    ```
4.  **Install Dependencies**:
    Run this command to download all the libraries listed in `package.json`.
    ```bash
    npm install
    ```
    *(Wait for it to finish. It might take a few minutes.)*

### **Phase 3: Environment Setup**

1.  Create a new file in the root folder named `.env`.
2.  Add your Supabase credentials (get these from your Supabase Dashboard -> Settings -> API):
    ```env
    VITE_SUPABASE_URL=https://your-project-id.supabase.co
    VITE_SUPABASE_ANON_KEY=your-long-anon-key-string
    ```

### **Phase 4: Running the Application**

You need to run two things: the **Frontend** (React) and the **Backend** (Sensor Server).

**Option A: Run Everything Together (Recommended)**
```bash
npm run sensor:dev
```
*   This starts the React app at `http://localhost:8080` (or similar).
*   This starts the IoT Server at `http://localhost:5000`.

**Option B: Run Separately**
*   Terminal 1 (Frontend): `npm run dev`
*   Terminal 2 (Backend): `npm run sensor:server`

### **Phase 5: Building for Production**

When you are ready to deploy or create the Android app, you must build the project.

1.  **Build Command**:
    ```bash
    npm run build
    ```
    *   This creates a `dist` folder with optimized files.

### **Phase 6: Android App Setup**

To run this on an Android phone:

1.  **Sync Capacitor**:
    ```bash
    npx cap sync
    ```
2.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
3.  **Run**: inside Android Studio, click the green "Play" button to run on an emulator or connected USB device.

---

## 📡 API Endpoints

The backend server runs on port `5000` by default.

### **1. Post Sensor Data (For ESP32)**
*   **URL**: `POST /api/sensors`
*   **Body**:
    ```json
    {
      "ph": 7.2,
      "turbidity": 15.5,
      "inlet_flow": 45,
      "outlet_flow": 42,
      "deviceId": "ESP32-001"
    }
    ```

### **2. Get Latest Data**
*   **URL**: `GET /api/sensors/latest`

### **3. Health Check**
*   **URL**: `GET /health`

---

**Developed for SIH (Smart India Hackathon)**