@echo off
REM IoT Sensor Server Setup Script for Windows PowerShell
REM Installs dependencies and prepares the sensor backend

echo.
echo ============================================
echo   IoT Sensor Server Setup for Windows
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo Detected Node.js version:
node --version

echo.
echo Detected npm version:
npm --version

echo.
echo.
echo Installing sensor server dependencies...
echo.

npm install express cors ws @types/express @types/ws ts-node

echo.
echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo To start the sensor server, run:
echo   npm run sensor:server
echo.
echo Then in another terminal, start the frontend:
echo   npm run dev
echo.
echo Note: Both servers will run in parallel
echo   - Frontend: http://localhost:5173 (or shown in terminal)
echo   - Sensor API: http://localhost:5000/api/sensors
echo   - WebSocket: ws://localhost:5000
echo.
pause
