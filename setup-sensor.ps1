#!/usr/bin/env pwsh
# IoT ESP32 Sensor System - Windows Setup Script
# Installs dependencies and configures everything needed

param(
    [switch]$SkipInstall = $false,
    [switch]$TestOnly = $false
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         IoT ESP32 Sensor System - Windows Setup               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "   Download from https://nodejs.org/" -ForegroundColor Gray
    exit 1
}
Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version 2>$null
if (-not $npmVersion) {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm $npmVersion" -ForegroundColor Green
Write-Host ""

# Install dependencies
if (-not $SkipInstall) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    Write-Host "   Installing main packages..." -ForegroundColor Gray
    npm install 2>&1 | Out-Null
    
    Write-Host "   Installing sensor server packages..." -ForegroundColor Gray
    npm install express cors ws @types/express @types/ws 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some packages may have failed to install" -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Skipping dependency installation" -ForegroundColor Yellow
}

Write-Host ""

# Test backend
if ($TestOnly) {
    Write-Host "🧪 Testing backend server..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Starting sensor server..." -ForegroundColor Gray
    Start-Process pwsh -ArgumentList "-NoExit -Command `"npm run sensor:server`"" -WindowStyle Normal
    Start-Sleep -Seconds 3
    
    Write-Host "Testing API endpoint..." -ForegroundColor Gray
    try {
        $response = curl.exe -s -m 2 http://localhost:5000/health
        $json = $response | ConvertFrom-Json -ErrorAction Stop
        Write-Host "✅ Server is responding!" -ForegroundColor Green
        Write-Host "   Status: $($json.status)" -ForegroundColor Green
        Write-Host "   Message: $($json.message)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Server may not be running yet" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Summary
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Start the sensor server (Terminal 1):" -ForegroundColor White
Write-Host "   npm run sensor:server" -ForegroundColor Cyan
Write-Host ""
Write-Host "2️⃣  Start the frontend (Terminal 2):" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "3️⃣  Open dashboard:" -ForegroundColor White
Write-Host "   http://localhost:5173/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Yellow
Write-Host "   Quick Start:    IOT_QUICK_START.md" -ForegroundColor Gray
Write-Host "   Hardware Guide: IOT_ESP32_SETUP.md" -ForegroundColor Gray
Write-Host "   Complete Setup: IOT_ESP32_COMPLETE_SETUP.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🧪 Test without hardware:" -ForegroundColor Yellow
Write-Host "   Add SensorTestingComponent to your dashboard page" -ForegroundColor Gray
Write-Host "   See src/components/SensorTestingComponent.tsx" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if user wants to start servers
Write-Host "Would you like to start the servers now? (Y/n)" -ForegroundColor Cyan
$response = Read-Host
if ($response -ne 'n' -and $response -ne 'N') {
    Write-Host ""
    Write-Host "Starting servers in new windows..." -ForegroundColor Green
    Start-Process pwsh -ArgumentList "-NoExit -Command `"cd '$PWD'; npm run sensor:server`"" -WindowStyle Normal
    Start-Sleep -Seconds 2
    Start-Process pwsh -ArgumentList "-NoExit -Command `"cd '$PWD'; npm run dev`"" -WindowStyle Normal
    Write-Host "✅ Servers started in new terminal windows" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Setup complete! Happy monitoring 🌊" -ForegroundColor Green
Write-Host ""
