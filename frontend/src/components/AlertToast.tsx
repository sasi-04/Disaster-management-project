import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../types';

interface AlertToastProps {
  alert: Alert;
}

const AlertToast: React.FC<AlertToastProps> = ({ alert }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'alert-high border-l-4 border-red-500';
      case 'medium':
        return 'alert-medium border-l-4 border-yellow-500';
      default:
        return 'alert-low border-l-4 border-blue-500';
    }
  };

  const getIcon = (type: string) => {
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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className={`fixed top-20 right-6 z-50 max-w-sm p-4 rounded-lg shadow-lg ${getAlertStyles(alert.severity)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl">{getIcon(alert.type)}</div>
            <div className="flex-1">
              <div className="font-semibold text-sm">{alert.message}</div>
              <div className="text-xs opacity-75 mt-1">
                {new Date(alert.timestamp).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white opacity-75 hover:opacity-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertToast;
