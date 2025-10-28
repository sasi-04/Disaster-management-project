import React from 'react';
import { motion } from 'framer-motion';

interface SensorCardProps {
  title: string;
  value: string;
  icon: string;
  color: 'green' | 'red' | 'blue' | 'yellow' | 'gray';
}

const SensorCard: React.FC<SensorCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    green: 'text-green-400 bg-green-900',
    red: 'text-red-400 bg-red-900',
    blue: 'text-blue-400 bg-blue-900',
    yellow: 'text-yellow-400 bg-yellow-900',
    gray: 'text-gray-400 bg-gray-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="card p-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">{title}</div>
          <div className="text-lg font-semibold text-white">{value}</div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default SensorCard;
