import express, { Request, Response } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';

interface SensorData {
  ph: number;
  turbidity: number;
  timestamp?: number | string;
  deviceId?: string;
}

interface SensorReading {
  id?: string;
  ph: number;
  turbidity: number;
  timestamp: string;
  deviceId: string;
}

// In-memory storage for sensor readings (last 100 readings)
const sensorReadings: SensorReading[] = [];
const MAX_READINGS = 100;

// WebSocket clients for real-time updates
const wsClients: Set<any> = new Set();

/**
 * Simple Linear Regression Algorithm for Prediction
 * Predicts the next value based on the trend of recent historical data
 */
function predictNextValue(values: number[]): number {
  // Need at least 2 data points to form a line
  if (values.length < 2) return values[values.length - 1] || 0;

  const n = values.length;
  
  // Calculate sums required for Linear Regression formula: y = mx + c
  const sumX = (n * (n - 1)) / 2; // Sum of indices 0..n-1
  
  // Loop through values to calculate sum of Y (values) and sum of XY (index * value)
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
  const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices

  // Calculate slope (m) and intercept (c)
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Return the predicted value for the next index (n)
  return Number((slope * n + intercept).toFixed(2));
}

/**
 * Initialize sensor routes
 */
export function initSensorRoutes(app: express.Application, supabase: SupabaseClient) {
  const router = express.Router();

  /**
   * POST /api/sensors
   * Receive sensor data from ESP32
   */
  router.post('/', async (req: Request, res: Response) => {
    try {
      // Destructure data from the request body
      const { ph, turbidity, timestamp, deviceId } = req.body as SensorData;

      // Validate input types
      if (typeof ph !== 'number' || typeof turbidity !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Invalid sensor data: pH and turbidity must be numbers'
        });
      }

      // Validate pH range (0-14 standard scale)
      if (ph < 0 || ph > 14) {
        return res.status(400).json({
          success: false,
          message: 'Invalid pH value: must be between 0 and 14'
        });
      }

      // Validate Turbidity range (0-3000 NTU is typical for sensors)
      if (turbidity < 0 || turbidity > 3000) {
        return res.status(400).json({
          success: false,
          message: 'Invalid turbidity value: must be between 0 and 3000 NTU'
        });
      }

      // Create reading record
      const reading: SensorReading = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ph: Number(ph.toFixed(2)),
        turbidity: Number(turbidity.toFixed(2)),
        timestamp: new Date().toISOString(),
        deviceId: deviceId || 'ESP32-Default'
      };

      // Add to storage
      sensorReadings.push(reading);

      // Maintain fixed buffer size: Remove oldest reading if we exceed MAX_READINGS
      if (sensorReadings.length > MAX_READINGS) {
        sensorReadings.shift();
      }

      console.log(`✅ Sensor Data Received [${reading.timestamp}]`);
      console.log(`   pH: ${reading.ph} | Turbidity: ${reading.turbidity} NTU | Device: ${reading.deviceId}`);

      // AI Prediction: Extract last 10 pH readings and predict the next trend
      const recentPH = sensorReadings.slice(-10).map(r => r.ph);
      const predictedNextPH = predictNextValue(recentPH);
      console.log(`🔮 AI Prediction: Next pH trend indicates ~${predictedNextPH}`);

      // Broadcast to WebSocket clients
      broadcastSensorUpdate(reading);

      // Database: Insert the new reading into Supabase 'sensor_readings' table
      const { error } = await supabase.from('sensor_readings').insert([
        {
          ph: reading.ph,
          turbidity: reading.turbidity,
          inlet_flow: req.body.inlet_flow || 0,
          outlet_flow: req.body.outlet_flow || 0
        }
      ]);

      if (error) {
        console.error('❌ Supabase Insert Error:', error.message);
      }

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Sensor data received successfully',
        data: reading,
        prediction: {
          nextPH: predictedNextPH
        }
      });

    } catch (error) {
      console.error('❌ Error processing sensor data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  /**
   * GET /api/sensors
   * Get latest sensor readings
   */
  router.get('/', (req: Request, res: Response) => {
    try {
      // Parse limit query parameter, default to 10
      const limit = parseInt(req.query.limit as string) || 10;
      const readings = sensorReadings.slice(-limit).reverse();

      res.json({
        success: true,
        message: 'Sensor readings retrieved',
        count: readings.length,
        data: readings
      });

    } catch (error) {
      console.error('❌ Error retrieving sensor readings:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  /**
   * GET /api/sensors/latest
   * Get the most recent sensor reading
   */
  router.get('/latest', (req: Request, res: Response) => {
    try {
      const latest = sensorReadings[sensorReadings.length - 1];

      if (!latest) {
        return res.status(404).json({
          success: false,
          message: 'No sensor data available yet'
        });
      }

      res.json({
        success: true,
        message: 'Latest sensor reading',
        data: latest
      });

    } catch (error) {
      console.error('❌ Error retrieving latest reading:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  /**
   * GET /api/sensors/status
   * Get sensor system status
   */
  router.get('/status', (req: Request, res: Response) => {
    try {
      const latest = sensorReadings[sensorReadings.length - 1];

      const status = {
        connected: sensorReadings.length > 0,
        lastUpdate: latest?.timestamp || null,
        totalReadings: sensorReadings.length,
        wsClientsConnected: wsClients.size,
        data: latest || null
      };

      res.json({
        success: true,
        data: status
      });

    } catch (error) {
      console.error('❌ Error retrieving status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  /**
   * DELETE /api/sensors
   * Clear all sensor data (admin only)
   */
  router.delete('/', (req: Request, res: Response) => {
    try {
      const clearedCount = sensorReadings.length;
      sensorReadings.length = 0;

      console.log(`🗑️  Cleared ${clearedCount} sensor readings`);

      res.json({
        success: true,
        message: `Cleared ${clearedCount} sensor readings`,
        clearedCount
      });

    } catch (error) {
      console.error('❌ Error clearing sensor data:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  });

  app.use('/api/sensors', router);
}

/**
 * Broadcast sensor update to all connected WebSocket clients
 */
export function broadcastSensorUpdate(reading: SensorReading) {
  const message = JSON.stringify({
    type: 'sensor-update',
    data: reading
  });

  // Loop through all connected WebSocket clients
  wsClients.forEach(client => {
    // Check if the client connection is still open
    if (client.readyState === 1) { // WebSocket.OPEN
      try {
        client.send(message);
      } catch (error) {
        console.error('Error sending to WebSocket client:', error);
        // Remove dead clients to prevent memory leaks
        wsClients.delete(client);
      }
    }
  });
}

/**
 * Register WebSocket client for real-time updates
 */
export function registerWSClient(client: any) {
  wsClients.add(client);
  console.log(`🔌 WebSocket client connected (${wsClients.size} total)`);

  // Event listener for when a client disconnects
  client.on('close', () => {
    wsClients.delete(client);
    console.log(`🔌 WebSocket client disconnected (${wsClients.size} remaining)`);
  });

  // Send current latest reading to new client
  if (sensorReadings.length > 0) {
    const latest = sensorReadings[sensorReadings.length - 1];
    client.send(JSON.stringify({
      type: 'initial-data',
      data: latest
    }));
  }
}

/**
 * Get all current readings
 */
export function getAllReadings(): SensorReading[] {
  return [...sensorReadings];
}

/**
 * Get latest reading
 */
export function getLatestReading(): SensorReading | undefined {
  return sensorReadings[sensorReadings.length - 1];
}
