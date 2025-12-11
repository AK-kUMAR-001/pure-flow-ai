/**
 * Sensor Service
 * Handles communication with IoT sensor backend
 * Supports both REST API and WebSocket real-time updates
 */

export interface SensorReading {
  id?: string;
  ph: number;
  turbidity: number;
  timestamp: string;
  deviceId: string;
}

export interface SensorStatus {
  connected: boolean;
  lastUpdate: string | null;
  totalReadings: number;
  wsClientsConnected: number;
  data: SensorReading | null;
}

class SensorService {
  private apiBaseUrl: string;
  private wsUrl: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: Map<string, Function[]> = new Map();

  constructor(apiUrl?: string, wsUrl?: string) {
    // Get server URL from environment or use defaults
    const serverHost = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    const wsHost = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

    this.apiBaseUrl = apiUrl || serverHost;
    this.wsUrl = wsUrl || wsHost;

    console.log('🔧 Sensor Service initialized');
    console.log(`   API: ${this.apiBaseUrl}/api/sensors`);
    console.log(`   WS: ${this.wsUrl}`);
  }

  /**
   * Subscribe to sensor events
   * Events: 'sensor-update', 'ws-connected', 'ws-disconnected', 'error'
   */
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => {
      try {
        cb(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  /**
   * Connect to WebSocket for real-time updates
   */
  connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
          console.log('✅ WebSocket connected to sensor server');
          this.reconnectAttempts = 0;
          this.emit('ws-connected');
          resolve();
        };

        this.ws.onmessage = (event: MessageEvent) => {
          try {
            const message = JSON.parse(event.data);

            if (message.type === 'sensor-update') {
              console.log('📡 Sensor update received:', message.data);
              this.emit('sensor-update', message.data);
            } else if (message.type === 'initial-data') {
              console.log('📡 Initial sensor data:', message.data);
              this.emit('sensor-update', message.data);
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error: Event) => {
          console.error('❌ WebSocket error:', error);
          this.emit('error', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 WebSocket disconnected');
          this.emit('ws-disconnected');
          this.attemptReconnect();
        };

        // Timeout if not connected within 5 seconds
        setTimeout(() => {
          if (this.ws?.readyState !== WebSocket.OPEN) {
            reject(new Error('WebSocket connection timeout'));
          }
        }, 5000);

      } catch (error) {
        console.error('❌ Failed to connect WebSocket:', error);
        reject(error);
      }
    });
  }

  /**
   * Attempt to reconnect WebSocket
   */
  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Attempting WebSocket reconnection (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`
      );

      setTimeout(() => {
        this.connectWebSocket().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectDelay);
    } else {
      console.error('❌ Max WebSocket reconnection attempts reached');
      this.emit('error', new Error('Max reconnection attempts reached'));
    }
  }

  /**
   * Disconnect WebSocket
   */
  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      console.log('WebSocket disconnected');
    }
  }

  /**
   * Get latest sensor reading via REST API
   */
  async getLatestReading(): Promise<SensorReading | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/sensors/latest`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('⚠️  No sensor data available yet');
          return null;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      return json.data || null;

    } catch (error) {
      console.error('❌ Error fetching latest sensor reading:', error);
      this.emit('error', error);
      return null;
    }
  }

  /**
   * Get multiple recent sensor readings via REST API
   */
  async getReadings(limit: number = 10): Promise<SensorReading[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/sensors?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      return json.data || [];

    } catch (error) {
      console.error('❌ Error fetching sensor readings:', error);
      this.emit('error', error);
      return [];
    }
  }

  /**
   * Get sensor system status
   */
  async getStatus(): Promise<SensorStatus | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/sensors/status`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      return json.data || null;

    } catch (error) {
      console.error('❌ Error fetching sensor status:', error);
      this.emit('error', error);
      return null;
    }
  }

  /**
   * Manually submit sensor reading (for testing)
   */
  async submitReading(ph: number, turbidity: number): Promise<SensorReading | null> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/sensors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ph: Number(ph.toFixed(2)),
          turbidity: Number(turbidity.toFixed(2)),
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      console.log('✅ Manual sensor reading submitted:', json.data);
      return json.data || null;

    } catch (error) {
      console.error('❌ Error submitting sensor reading:', error);
      this.emit('error', error);
      return null;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get WebSocket state
   */
  getWSState(): string {
    if (!this.ws) return 'DISCONNECTED';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'CONNECTED';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }
}

// Export singleton instance
export const sensorService = new SensorService();
export default SensorService;
