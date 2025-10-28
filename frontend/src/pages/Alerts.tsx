import React from 'react';
import { motion } from 'framer-motion';
import { useAlerts } from '../hooks/useSocket';

const Alerts: React.FC = () => {
  const alerts = useAlerts();

  const activeAlerts = alerts.filter(alert => {
    const alertTime = new Date(alert.timestamp);
    const now = new Date();
    const diffMinutes = (now.getTime() - alertTime.getTime()) / (1000 * 60);
    return diffMinutes < 30; // Show alerts from last 30 minutes
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-900';
      case 'medium':
        return 'border-yellow-500 bg-yellow-900';
      default:
        return 'border-blue-500 bg-blue-900';
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
          <h2 className="text-xl font-semibold text-white">Active Alerts</h2>
          <p className="text-sm text-gray-400">Current system alerts and warnings</p>
        </div>
        <div className="card-content">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <p className="text-gray-400">No active alerts</p>
              <p className="text-sm text-gray-500 mt-2">All systems operating normally</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl">{getTypeIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg">{alert.message}</div>
                      <div className="text-sm text-gray-300 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          alert.severity === 'high' ? 'bg-red-700 text-red-200' :
                          alert.severity === 'medium' ? 'bg-yellow-700 text-yellow-200' :
                          'bg-blue-700 text-blue-200'
                        }`}>
                          {alert.severity.toUpperCase()} PRIORITY
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">Alert Statistics</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {alerts.filter(a => a.severity === 'high').length}
              </div>
              <div className="text-sm text-gray-400">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {alerts.filter(a => a.severity === 'medium').length}
              </div>
              <div className="text-sm text-gray-400">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {alerts.filter(a => a.severity === 'low').length}
              </div>
              <div className="text-sm text-gray-400">Low Priority</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Alerts;
