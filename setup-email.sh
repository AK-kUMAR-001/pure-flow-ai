#!/bin/bash
# Quick Email Setup Script for Supabase

echo "🚀 AquaAdapt Email Service Setup"
echo "================================"
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✓ Supabase CLI found"
echo ""

# Ask which email provider to use
echo "Choose your email provider:"
echo "1) Gmail (recommended for testing)"
echo "2) SendGrid (recommended for production)"
echo "3) Skip for now (manual setup later)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📧 Gmail Setup"
        echo "=============="
        echo "1. Go to myaccount.google.com"
        echo "2. Enable 2-Factor Authentication"
        echo "3. Go to App passwords"
        echo "4. Select Mail > Windows Computer"
        echo "5. Copy the 16-character password"
        echo ""
        read -p "Enter your Gmail: " gmail_email
        read -sp "Enter your App Password (16 chars): " gmail_password
        echo ""
        
        echo ""
        echo "Setting Supabase secrets..."
        supabase secrets set SMTP_HOSTNAME="smtp.gmail.com"
        supabase secrets set SMTP_PORT="587"
        supabase secrets set SMTP_USERNAME="$gmail_email"
        supabase secrets set SMTP_PASSWORD="$gmail_password"
        supabase secrets set SMTP_FROM_EMAIL="akshayprabhu19012005@gmail.com"
        
        echo "✓ Secrets set successfully"
        ;;
    2)
        echo ""
        echo "📧 SendGrid Setup"
        echo "=================="
        echo "1. Go to sendgrid.com and create a free account"
        echo "2. Create an API key"
        echo "3. Verify sender email: akshayprabhu19012005@gmail.com"
        echo ""
        read -p "Enter SendGrid API Key: " sendgrid_key
        
        echo ""
        echo "Setting Supabase secrets..."
        supabase secrets set SENDGRID_API_KEY="$sendgrid_key"
        supabase secrets set SENDGRID_FROM_EMAIL="akshayprabhu19012005@gmail.com"
        
        echo "✓ Secrets set successfully"
        ;;
    3)
        echo "⏭️  Skipping setup. Read EMAIL_SERVICE_SETUP.md for manual setup instructions."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Deploying email function..."
supabase functions deploy send-email

echo ""
echo "✅ Email setup complete!"
echo ""
echo "Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Complete a payment in the app"
echo "3. Check if you received confirmation emails"
echo ""
echo "To view logs: supabase functions logs send-email"
