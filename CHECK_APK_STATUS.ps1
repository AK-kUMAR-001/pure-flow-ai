#!/usr/bin/env powershell

# APK Build Monitor Script
# Run this periodically to check if build is complete

$apkPath = "c:\Users\rathn\OneDrive\Desktop\sih\pure-flow-ai-main\android\app\build\outputs\apk\debug\app-debug.apk"
$buildDir = "c:\Users\rathn\OneDrive\Desktop\sih\pure-flow-ai-main\android\app\build"

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "APK BUILD STATUS MONITOR" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Check if build folder exists
if (Test-Path $buildDir) {
    Write-Host "✓ Build folder exists" -ForegroundColor Green
} else {
    Write-Host "✗ Build folder not created yet" -ForegroundColor Yellow
    Write-Host "  Build is initializing..." -ForegroundColor Yellow
}

# Check if APK is complete
if (Test-Path $apkPath) {
    Write-Host ""
    Write-Host "✅ APK BUILD COMPLETE!" -ForegroundColor Green
    Write-Host ""
    
    $apkFile = Get-Item $apkPath
    $apkSizeMB = [math]::Round($apkFile.Length / 1MB, 2)
    $apkSizeKB = [math]::Round($apkFile.Length / 1KB, 2)
    
    Write-Host "📦 APK File Details:" -ForegroundColor Green
    Write-Host "   Name: app-debug.apk" -ForegroundColor White
    Write-Host "   Size: $apkSizeMB MB ($apkSizeKB KB)" -ForegroundColor White
    Write-Host "   Created: $($apkFile.CreationTime)" -ForegroundColor White
    Write-Host "   Modified: $($apkFile.LastWriteTime)" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📍 Location:" -ForegroundColor Cyan
    Write-Host "   $apkPath" -ForegroundColor White
    Write-Host ""
    
    Write-Host "🚀 NEXT STEPS:" -ForegroundColor Yellow
    Write-Host "   1. Copy APK to Google Drive" -ForegroundColor White
    Write-Host "   2. Make link public" -ForegroundColor White
    Write-Host "   3. Share link with friends" -ForegroundColor White
    Write-Host "   4. Users download & install" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📖 Read: APK_BUILD_IN_PROGRESS.md for detailed instructions" -ForegroundColor Green
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "⏳ Still Building..." -ForegroundColor Yellow
    Write-Host ""
    
    # Check for build artifacts to show progress
    $intermediates = Get-ChildItem -Path "$buildDir\intermediates" -ErrorAction SilentlyContinue | Measure-Object
    $outputs = Get-ChildItem -Path "$buildDir\outputs" -ErrorAction SilentlyContinue | Measure-Object
    
    Write-Host "Build Progress:" -ForegroundColor Yellow
    if ($intermediates.Count -gt 0) {
        Write-Host "   ✓ Intermediates created ($($intermediates.Count) items)" -ForegroundColor Green
    } else {
        Write-Host "   ⏳ Initializing..." -ForegroundColor Yellow
    }
    
    if ($outputs.Count -gt 0) {
        Write-Host "   ✓ Output folder created ($($outputs.Count) items)" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "⏱️  Check back in 5 minutes..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Tip: Run this script again to check progress" -ForegroundColor Green
    Write-Host "   Or check: APK_BUILD_IN_PROGRESS.md for updates" -ForegroundColor Green
    Write-Host ""
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
