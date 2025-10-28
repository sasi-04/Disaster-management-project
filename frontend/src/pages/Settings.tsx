import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings, useConnectionStatus } from '../hooks/useSocket';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  const status = useConnectionStatus();
  const [formData, setFormData] = useState({
    waterLevelThreshold: 80,
    soilMoistureThreshold: 70,
    vibrationThreshold: 1
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-white">System Settings</h2>
          <p className="text-sm text-gray-400">Configure alert thresholds and system parameters</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Water Level Threshold (%)
                </label>
                <input
                  type="number"
                  name="waterLevelThreshold"
                  value={formData.waterLevelThreshold}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Alert when water level exceeds this percentage
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Soil Moisture Threshold (%)
                </label>
                <input
                  type="number"
                  name="soilMoistureThreshold"
                  value={formData.soilMoistureThreshold}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Alert when soil moisture exceeds this percentage
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vibration Threshold
                </label>
                <select
                  name="vibrationThreshold"
                  value={formData.vibrationThreshold}
                  onChange={(e) => setFormData(prev => ({ ...prev, vibrationThreshold: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Low</option>
                  <option value={1}>High</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Vibration level that triggers alerts
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">System Status</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Connection Status</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  status?.connected ? 'bg-green-400' : 'bg-red-400'
                }`} />
                <span className={`text-sm font-medium ${
                  status?.connected ? 'text-green-400' : 'text-red-400'
                }`}>
                  {status?.connected ? 'Connected' : 'Disconnected'}
                </span>
                {status?.simulatorMode && (
                  <span className="text-xs text-yellow-400">(Simulator Mode)</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Serial Port</h4>
              <p className="text-sm text-gray-400">
                {status?.connected ? 'COM17' : 'Not Available'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
