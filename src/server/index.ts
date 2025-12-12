/**
 * IoT Sensor Backend Server
 * Receives sensor data from ESP32 and broadcasts to connected clients
 * Runs alongside the Vite dev server on port 5000
 */

import express, { Express } from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { WebSocketServer, WebSocket } from 'ws';
import { initSensorRoutes, registerWSClient } from './routes/sensors';

// Define port: Use environment variable if available, otherwise default to 5000
const PORT = process.env.PORT || process.env.SENSOR_PORT || 5000;
const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://kolqitcqcoxvpiziywyb.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbHFpdGNxY294dnBpeml5d3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDkyNjQsImV4cCI6MjA4MTAyNTI2NH0.443y4NxxY5tZylhr-pQZ4cR-Ibd_JaUdA-YfuKXB0xY';
export const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Middleware
 */
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON request bodies

/**
 * Request logging middleware
 * Logs every incoming HTTP request method and path
 */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'IoT Sensor Server is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * Initialize sensor routes
 */
initSensorRoutes(app, supabase);

// Serve static files from the dist directory (Vite build output)
const distPath = path.join(__dirname, '../../dist');
console.log('📂 Serving static files from:', distPath);
app.use(express.static(distPath));

/**
 * WebSocket connection handling
 * Listens for new WebSocket connections from the frontend or devices
 */
wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 New WebSocket connection');
  registerWSClient(ws);
});

/**
 * Error handling
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

/**
 * 404 handler
 * Handles requests that don't match any API routes or static files
 */
app.get('*', (req, res) => {
  // If it's an API request, return JSON 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Not found' });
  }
  // Otherwise, serve the React app (index.html) for client-side routing
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error('❌ Error sending index.html:', err);
      res.status(404).send('Frontend build not found. Please run "npm run build" to generate the dist folder.');
    }
  });
});

/**
 * Start server
 * Only listen if not running in a serverless environment (like Vercel)
 */
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log('\n🚀 IoT Sensor Server started!');
    console.log(`📡 API: http://localhost:${PORT}/api/sensors`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    console.log(`🗄️  Supabase: ${supabaseUrl ? 'Configured' : 'Missing URL'}`);
    console.log(`❤️  Health: http://localhost:${PORT}/health\n`);
    console.log('ESP32 will send sensor data to:');
    console.log(`  POST http://localhost:${PORT}/api/sensors`);
    console.log('  Expected JSON: { "ph": number, "turbidity": number, "inlet_flow": number, "outlet_flow": number }\n');
  });
}

export default app;

/**
 * Graceful shutdown
 */
process.on('SIGTERM', () => {
  console.log('\n⏹️  SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
