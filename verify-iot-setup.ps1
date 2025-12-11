#!/usr/bin/env pwsh
# IoT ESP32 System - Verification & Diagnostics Script
# Checks if everything is set up correctly

param(
    [switch]$Verbose = $false
)

$ErrorCount = 0
$WarningCount = 0
$SuccessCount = 0

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
    $global:SuccessCount++
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
    $global:WarningCount++
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
    $global:ErrorCount++
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    IoT ESP32 System - Installation Verification              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "🔍 Checking environment..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Success "Node.js installed ($nodeVersion)"
} else {
    Write-Error "Node.js is not installed or not in PATH"
}

# Check npm
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Success "npm installed ($npmVersion)"
} else {
    Write-Error "npm is not installed"
}

Write-Host ""

# Check required files
Write-Host "📁 Checking required files..." -ForegroundColor Cyan

$requiredFiles = @(
    "package.json",
    "src/server/index.ts",
    "src/server/routes/sensors.ts",
    "src/services/sensorService.ts",
    "src/components/LiveSensorDisplay.tsx",
    "src/components/SensorTestingComponent.tsx",
    "IOT_ESP32_SETUP.md",
    "IOT_QUICK_START.md",
    "IOT_ESP32_COMPLETE_SETUP.md"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success "Found: $file"
    } else {
        Write-Error "Missing: $file"
    }
}

Write-Host ""

# Check node_modules
Write-Host "📦 Checking dependencies..." -ForegroundColor Cyan

$requiredModules = @(
    "express",
    "cors",
    "ws",
    "react",
    "react-router-dom"
)

foreach ($module in $requiredModules) {
    $modulePath = "node_modules/$module"
    if (Test-Path $modulePath) {
        Write-Success "Installed: $module"
    } else {
        Write-Warning "Not installed: $module (run 'npm install' to fix)"
    }
}

Write-Host ""

# Check npm scripts
Write-Host "🔧 Checking npm scripts..." -ForegroundColor Cyan

$requiredScripts = @("dev", "build", "sensor:server")

try {
    $packageJson = Get-Content package.json | ConvertFrom-Json
    $scripts = $packageJson.scripts
    
    foreach ($script in $requiredScripts) {
        if ($scripts.$script) {
            Write-Success "Script available: npm run $script"
        } else {
            Write-Error "Missing script: npm run $script"
        }
    }
} catch {
    Write-Error "Could not read package.json"
}

Write-Host ""

# Test connectivity
Write-Host "🔌 Testing connectivity (optional)..." -ForegroundColor Cyan

# Test if backend is running
try {
    $response = curl.exe -s -m 1 http://localhost:5000/health 2>$null
    if ($response) {
        Write-Success "Backend server is running on http://localhost:5000"
    } else {
        Write-Warning "Backend server not responding (start with: npm run sensor:server)"
    }
} catch {
    Write-Warning "Backend server is not running (this is OK if you haven't started it yet)"
}

# Test if frontend is running
try {
    $response = curl.exe -s -m 1 http://localhost:5173 2>$null
    if ($response) {
        Write-Success "Frontend dev server is running on http://localhost:5173"
    } else {
        Write-Warning "Frontend dev server not responding (start with: npm run dev)"
    }
} catch {
    Write-Warning "Frontend dev server is not running (this is OK if you haven't started it yet)"
}

Write-Host ""

# Summary
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Verification Summary:" -ForegroundColor Yellow
Write-Host "   ✅ Passed:  $SuccessCount" -ForegroundColor Green
Write-Host "   ⚠️  Warnings: $WarningCount" -ForegroundColor Yellow
Write-Host "   ❌ Errors:  $ErrorCount" -ForegroundColor Red
Write-Host ""

if ($ErrorCount -eq 0) {
    Write-Host "🎉 All checks passed! Your IoT system is ready." -ForegroundColor Green
    Write-Host ""
    Write-Host "To start using:" -ForegroundColor Cyan
    Write-Host "  1. Terminal 1: npm run sensor:server" -ForegroundColor Gray
    Write-Host "  2. Terminal 2: npm run dev" -ForegroundColor Gray
    Write-Host "  3. Open: http://localhost:5173/dashboard" -ForegroundColor Gray
} elseif ($ErrorCount -gt 0) {
    Write-Host "⚠️  Please fix the errors above before proceeding." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Cyan
    Write-Host "  - Run: npm install" -ForegroundColor Gray
    Write-Host "  - Restart your terminal" -ForegroundColor Gray
    Write-Host "  - Check file paths are correct" -ForegroundColor Gray
} else {
    Write-Host "✅ Setup looks good! You can start the servers." -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($Verbose) {
    Write-Host "📖 For detailed information, read:" -ForegroundColor Cyan
    Write-Host "   - IOT_QUICK_START.md (recommended)" -ForegroundColor Gray
    Write-Host "   - IOT_ESP32_SETUP.md (hardware guide)" -ForegroundColor Gray
    Write-Host "   - IOT_ESP32_COMPLETE_SETUP.md (full reference)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host ""
