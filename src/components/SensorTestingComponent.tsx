/**
 * Sensor Testing Component
 * Demo tool for testing the IoT sensor system without hardware
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sensorService } from '@/services/sensorService';
import { AlertCircle, CheckCircle, PlayCircle, RefreshCw } from 'lucide-react';

export const SensorTestingComponent = () => {
  const [ph, setPH] = useState(7.2);
  const [turbidity, setTurbidity] = useState(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'success' | 'error' | ''>('');

  /**
   * Submit test sensor reading
   */
  const handleSubmitReading = async () => {
    setIsSubmitting(true);
    setMessage('');
    setStatus('');

    try {
      const result = await sensorService.submitReading(ph, turbidity);
      if (result) {
        setMessage(`✅ Submitted: pH ${result.ph} | Turbidity ${result.turbidity} NTU`);
        setStatus('success');
      } else {
        setMessage('❌ Failed to submit reading');
        setStatus('error');
      }
    } catch (error) {
      setMessage('❌ Error submitting reading');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Send random readings to simulate ESP32
   */
  const handleRandomReading = async () => {
    const randomPH = Number((6.5 + Math.random() * 2).toFixed(2));
    const randomTurbidity = Number((Math.random() * 100).toFixed(2));
    setPH(randomPH);
    setTurbidity(randomTurbidity);

    // Auto-submit
    setIsSubmitting(true);
    try {
      const result = await sensorService.submitReading(randomPH, randomTurbidity);
      if (result) {
        setMessage(`✅ Random reading sent: pH ${result.ph} | Turbidity ${result.turbidity} NTU`);
        setStatus('success');
      }
    } catch (error) {
      setMessage('❌ Failed to send random reading');
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Simulate 5 readings with slight variations
   */
  const handleSimulateSequence = async () => {
    setMessage('Simulating 5 sensor readings...');
    setStatus('');

    const readings = [
      { ph: 7.15, turbidity: 42.5 },
      { ph: 7.22, turbidity: 44.1 },
      { ph: 7.18, turbidity: 43.8 },
      { ph: 7.25, turbidity: 45.2 },
      { ph: 7.20, turbidity: 44.5 },
    ];

    for (const reading of readings) {
      try {
        await sensorService.submitReading(reading.ph, reading.turbidity);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error in sequence:', error);
      }
    }

    setMessage('✅ Simulation complete! Watch the dashboard update.');
    setStatus('success');
  };

  /**
   * Simulate alarm conditions
   */
  const handleSimulateAlarm = async () => {
    const alarmReadings = [
      { ph: 4.5, turbidity: 150, desc: 'Low pH (Acidic)' },
      { ph: 9.5, turbidity: 200, desc: 'High pH (Alkaline)' },
      { ph: 7.2, turbidity: 250, desc: 'High Turbidity' },
    ];

    for (const reading of alarmReadings) {
      try {
        setPH(reading.ph);
        setTurbidity(reading.turbidity);
        setMessage(`⚠️ Simulating alarm: ${reading.desc}`);
        setStatus('error');
        
        await sensorService.submitReading(reading.ph, reading.turbidity);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error in alarm simulation:', error);
      }
    }

    setMessage('✅ Alarm simulation complete!');
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <PlayCircle className="w-5 h-5" />
          Sensor Testing & Demo
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Test the IoT system without hardware. Simulates ESP32 sensor readings.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Manual Input Section */}
        <div className="space-y-3 p-4 bg-white rounded-lg border border-purple-100">
          <h3 className="font-semibold text-gray-900">Manual Test Reading</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                pH Value (0-14)
              </label>
              <input
                type="number"
                min="0"
                max="14"
                step="0.1"
                value={ph}
                onChange={(e) => setPH(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turbidity (0-250 NTU)
              </label>
              <input
                type="number"
                min="0"
                max="250"
                step="0.1"
                value={turbidity}
                onChange={(e) => setTurbidity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Button
            onClick={handleSubmitReading}
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reading'}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 p-4 bg-white rounded-lg border border-purple-100">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Test Actions</h3>

          <Button
            onClick={handleRandomReading}
            disabled={isSubmitting}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Send Random Reading
          </Button>

          <Button
            onClick={handleSimulateSequence}
            disabled={isSubmitting}
            variant="outline"
            className="w-full"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Simulate 5 Readings (1s apart)
          </Button>

          <Button
            onClick={handleSimulateAlarm}
            disabled={isSubmitting}
            variant="outline"
            className="w-full text-red-600 hover:text-red-700"
          >
            ⚠️ Simulate Alarm Conditions
          </Button>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-3 rounded-lg flex items-start gap-2 ${
              status === 'success'
                ? 'bg-green-50 border border-green-200'
                : status === 'error'
                ? 'bg-red-50 border border-red-200'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : status === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={
                status === 'success'
                  ? 'text-green-700'
                  : status === 'error'
                  ? 'text-red-700'
                  : 'text-blue-700'
              }
            >
              {message}
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-2">💡 How to Test:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Submit test readings using the inputs above</li>
            <li>Open the Dashboard page to see live updates</li>
            <li>Check browser console for debugging info</li>
            <li>Use "Quick Test Actions" for automated demos</li>
            <li>When hardware is ready, remove this component</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorTestingComponent;
