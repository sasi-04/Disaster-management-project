import React from 'react';
import { motion } from 'framer-motion';
import { useAlerts } from '../hooks/useSocket';

const Logs: React.FC = () => {
  const alerts = useAlerts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 bg-red-900';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900';
      default:
        return 'text-blue-400 bg-blue-900';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flood':
        return '🌊';
      case 'landslide':
        return '🏔️';
      default:
        return '⚠️';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-white">System Logs</h2>
          <p className="text-sm text-gray-400">Historical alerts and system events</p>
        </div>
        <div className="card-content">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-400">No logs available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg"
                >
                  <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{alert.message}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Logs;
