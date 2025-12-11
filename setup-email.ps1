#!/usr/bin/env pwsh
# Quick Email Setup Script for Supabase (Windows PowerShell)

Write-Host "🚀 AquaAdapt Email Service Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if supabase CLI is installed
$supabasePath = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $supabasePath) {
    Write-Host "❌ Supabase CLI not found. Install it first:" -ForegroundColor Red
    Write-Host "   npm install -g supabase"
    exit 1
}

Write-Host "✓ Supabase CLI found" -ForegroundColor Green
Write-Host ""

# Ask which email provider to use
Write-Host "Choose your email provider:" -ForegroundColor Yellow
Write-Host "1) Gmail (recommended for testing)" -ForegroundColor White
Write-Host "2) SendGrid (recommended for production)" -ForegroundColor White
Write-Host "3) Skip for now (manual setup later)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📧 Gmail Setup" -ForegroundColor Cyan
        Write-Host "==============" -ForegroundColor Cyan
        Write-Host "1. Go to myaccount.google.com"
        Write-Host "2. Enable 2-Factor Authentication"
        Write-Host "3. Go to App passwords"
        Write-Host "4. Select Mail > Windows Computer"
        Write-Host "5. Copy the 16-character password"
        Write-Host ""
        
        $gmailEmail = Read-Host "Enter your Gmail"
        $gmailPassword = Read-Host "Enter your App Password (16 chars)" -AsSecureString
        $gmailPasswordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($gmailPassword))
        
        Write-Host ""
        Write-Host "Setting Supabase secrets..." -ForegroundColor Yellow
        
        & supabase secrets set SMTP_HOSTNAME="smtp.gmail.com"
        & supabase secrets set SMTP_PORT="587"
        & supabase secrets set SMTP_USERNAME="$gmailEmail"
        & supabase secrets set SMTP_PASSWORD="$gmailPasswordPlain"
        & supabase secrets set SMTP_FROM_EMAIL="akshayprabhu19012005@gmail.com"
        
        Write-Host "✓ Secrets set successfully" -ForegroundColor Green
    }
    "2" {
        Write-Host ""
        Write-Host "📧 SendGrid Setup" -ForegroundColor Cyan
        Write-Host "=================" -ForegroundColor Cyan
        Write-Host "1. Go to sendgrid.com and create a free account"
        Write-Host "2. Create an API key"
        Write-Host "3. Verify sender email: akshayprabhu19012005@gmail.com"
        Write-Host ""
        
        $sendgridKey = Read-Host "Enter SendGrid API Key"
        
        Write-Host ""
        Write-Host "Setting Supabase secrets..." -ForegroundColor Yellow
        
        & supabase secrets set SENDGRID_API_KEY="$sendgridKey"
        & supabase secrets set SENDGRID_FROM_EMAIL="akshayprabhu19012005@gmail.com"
        
        Write-Host "✓ Secrets set successfully" -ForegroundColor Green
    }
    "3" {
        Write-Host "⏭️  Skipping setup. Read EMAIL_SERVICE_SETUP.md for manual setup instructions." -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Deploying email function..." -ForegroundColor Yellow
& supabase functions deploy send-email

Write-Host ""
Write-Host "✅ Email setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start dev server: npm run dev"
Write-Host "2. Complete a payment in the app"
Write-Host "3. Check if you received confirmation emails"
Write-Host ""
Write-Host "To view logs: supabase functions logs send-email" -ForegroundColor Cyan
