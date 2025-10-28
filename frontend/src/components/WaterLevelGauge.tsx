import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface WaterLevelGaugeProps {
  value: number;
}

const WaterLevelGauge: React.FC<WaterLevelGaugeProps> = ({ value }) => {
  const data = [
    { name: 'Water Level', value: value, fill: value > 80 ? '#ef4444' : value > 60 ? '#f59e0b' : '#10b981' },
    { name: 'Empty', value: 100 - value, fill: '#374151' }
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center mt-4">
        <div className="text-3xl font-bold text-white">{value}%</div>
        <div className="text-sm text-gray-400">Water Level</div>
      </div>
    </div>
  );
};

export default WaterLevelGauge;
