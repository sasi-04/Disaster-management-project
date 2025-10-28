import React from 'react';
import { motion } from 'framer-motion';

interface ProbabilityChartProps {
  title: string;
  value: number;
  type: 'flood' | 'landslide';
}

const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ title, value, type }) => {
  const getColor = (val: number) => {
    if (val <= 40) return '#10b981'; // Green
    if (val <= 70) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getStatus = (val: number) => {
    if (val <= 40) return 'Safe';
    if (val <= 70) return 'Moderate';
    return 'High Risk';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="text-center">
      <h4 className="text-sm font-medium text-gray-300 mb-2">{title}</h4>
      <div className="relative w-24 h-24 mx-auto">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={getColor(value)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{value}%</div>
            <div className={`text-xs font-medium ${
              value <= 40 ? 'text-green-400' : 
              value <= 70 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {getStatus(value)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityChart;
