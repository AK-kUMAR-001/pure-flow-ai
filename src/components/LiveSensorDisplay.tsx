/**
 * Live Sensor Display Component
 * Shows real-time PH and Turbidity readings from ESP32
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Droplets, AlertTriangle, Wifi } from 'lucide-react';
import { sensorService, SensorReading } from '@/services/sensorService';

interface LiveSensorDisplayProps {
  onStatusChange?: (isConnected: boolean) => void;
}

export const LiveSensorDisplay = ({ onStatusChange }: LiveSensorDisplayProps) => {
  const [currentReading, setCurrentReading] = useState<SensorReading | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [wsState, setWSState] = useState('DISCONNECTED');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  useEffect(() => {
    // Fetch initial reading
    const initializeSensor = async () => {
      try {
        setIsLoading(true);
        const reading = await sensorService.getLatestReading();
        if (reading) {
          setCurrentReading(reading);
          setLastUpdateTime(new Date(reading.timestamp));
        }
      } catch (error) {
        console.error('Failed to fetch initial reading:', error);
        setError('Failed to fetch sensor data');
      } finally {
        setIsLoading(false);
      }
    };

    // Connect to WebSocket
    const connectWS = async () => {
      try {
        await sensorService.connectWebSocket();
        setIsConnected(true);
        setWSState('CONNECTED');
        setError(null);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setError('Failed to connect to sensor server');
        setWSState('FAILED');
      }
    };

    initializeSensor();
    connectWS();

    // Listen to sensor updates
    const handleSensorUpdate = (reading: SensorReading) => {
      setCurrentReading(reading);
      setLastUpdateTime(new Date(reading.timestamp));
      setIsConnected(true);
      setError(null);
    };

    const handleWSConnected = () => {
      setIsConnected(true);
      setWSState('CONNECTED');
      setError(null);
    };

    const handleWSDisconnected = () => {
      setIsConnected(false);
      setWSState('DISCONNECTED');
    };

    const handleError = (error: any) => {
      console.error('Sensor error:', error);
      setError('Connection error - retrying...');
      setIsConnected(false);
    };

    sensorService.on('sensor-update', handleSensorUpdate);
    sensorService.on('ws-connected', handleWSConnected);
    sensorService.on('ws-disconnected', handleWSDisconnected);
    sensorService.on('error', handleError);

    // Notify parent of connection status
    if (onStatusChange) {
      onStatusChange(isConnected);
    }

    // Cleanup
    return () => {
      sensorService.disconnectWebSocket();
    };
  }, [onStatusChange]);

  /**
   * Determine PH status based on value
   */
  const getPHStatus = (ph: number) => {
    if (ph >= 6.5 && ph <= 8.5) return { status: 'good', label: 'Normal' };
    if (ph >= 6.0 && ph <= 9.0) return { status: 'warning', label: 'Acceptable' };
    return { status: 'critical', label: 'Out of Range' };
  };

  /**
   * Determine Turbidity status based on value
   */
  const getTurbidityStatus = (turbidity: number) => {
    if (turbidity <= 5) return { status: 'good', label: 'Clear' };
    if (turbidity <= 15) return { status: 'warning', label: 'Slightly Cloudy' };
    return { status: 'critical', label: 'Cloudy' };
  };

  /**
   * Get status color class
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  /**
   * Get status background color
   */
  const getStatusBG = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      case 'critical': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  if (isLoading && !currentReading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Wifi className="w-5 h-5 animate-pulse" />
            Live Sensor Data
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin mr-3">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-gray-600">Connecting to sensor...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !currentReading) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="w-5 h-5" />
            Sensor Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error}</p>
          <p className="text-sm text-red-600 mt-2">
            Make sure ESP32 is powered on and configured with correct WiFi credentials.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!currentReading) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-900">
            <AlertTriangle className="w-5 h-5" />
            No Sensor Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700">Waiting for first reading from ESP32...</p>
        </CardContent>
      </Card>
    );
  }

  const phStatus = getPHStatus(currentReading.ph);
  const turbidityStatus = getTurbidityStatus(currentReading.turbidity);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Wifi className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
            Live Sensor Data
            {isConnected && <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
          </CardTitle>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {wsState}
          </span>
        </div>
        {lastUpdateTime && (
          <p className="text-xs text-gray-600 mt-2">
            Last update: {lastUpdateTime.toLocaleTimeString()} • Device: {currentReading.deviceId}
          </p>
        )}
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PH Sensor */}
          <div className={`p-4 rounded-lg border-2 transition-all ${getStatusBG(phStatus.status)}`}>
            <div className="flex items-center gap-3 mb-3">
              <Activity className={`w-6 h-6 ${getStatusColor(phStatus.status)}`} />
              <div>
                <p className="text-sm font-semibold text-gray-700">pH Level</p>
                <p className={`text-2xl font-bold ${getStatusColor(phStatus.status)}`}>
                  {currentReading.ph.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Status:</span> {phStatus.label}</p>
              <p><span className="font-medium">Normal Range:</span> 6.5 - 8.5</p>
              <div className="mt-2 bg-white rounded p-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      phStatus.status === 'good'
                        ? 'bg-green-500'
                        : phStatus.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (currentReading.ph / 14) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Turbidity Sensor */}
          <div className={`p-4 rounded-lg border-2 transition-all ${getStatusBG(turbidityStatus.status)}`}>
            <div className="flex items-center gap-3 mb-3">
              <Droplets className={`w-6 h-6 ${getStatusColor(turbidityStatus.status)}`} />
              <div>
                <p className="text-sm font-semibold text-gray-700">Turbidity</p>
                <p className={`text-2xl font-bold ${getStatusColor(turbidityStatus.status)}`}>
                  {currentReading.turbidity.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <p><span className="font-medium">Status:</span> {turbidityStatus.label}</p>
              <p><span className="font-medium">Unit:</span> NTU</p>
              <div className="mt-2 bg-white rounded p-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      turbidityStatus.status === 'good'
                        ? 'bg-green-500'
                        : turbidityStatus.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (currentReading.turbidity / 50) * 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Info */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-sm text-red-700">
            ⚠️ {error}
          </div>
        )}

        {isConnected && !error && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded text-sm text-green-700">
            ✅ Connected to sensor • Receiving live updates
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveSensorDisplay;
