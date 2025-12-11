#!/bin/bash
# IoT Sensor Server Setup Script for Linux/macOS
# Installs dependencies and starts the sensor backend

echo "🚀 IoT Sensor Server Setup"
echo "========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install backend dependencies
echo "📦 Installing sensor server dependencies..."
npm install express cors ws @types/express @types/ws ts-node

echo ""
echo "✅ Sensor server setup complete!"
echo ""
echo "To start the sensor server, run:"
echo "  npm run sensor:server"
echo ""
echo "Then in another terminal, start the frontend dev server:"
echo "  npm run dev"
echo ""
