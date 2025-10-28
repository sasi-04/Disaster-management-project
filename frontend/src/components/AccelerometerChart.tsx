import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AccelerometerChartProps {
  data: {
    x: number;
    y: number;
    z: number;
  };
}

const AccelerometerChart: React.FC<AccelerometerChartProps> = ({ data }) => {
  const chartData = [
    { axis: 'X', value: data.x },
    { axis: 'Y', value: data.y },
    { axis: 'Z', value: data.z }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-400">X-Axis</div>
          <div className="text-lg font-semibold text-white">{data.x.toFixed(1)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Y-Axis</div>
          <div className="text-lg font-semibold text-white">{data.y.toFixed(1)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Z-Axis</div>
          <div className="text-lg font-semibold text-white">{data.z.toFixed(1)}</div>
        </div>
      </div>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="axis" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccelerometerChart;
