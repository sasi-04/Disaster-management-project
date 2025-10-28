import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  soilMoisture: number;
  rain: number;
  timestamp: string;
}

interface DataPoint {
  time: string;
  soilMoisture: number;
  rain: number;
}

const TrendChart: React.FC<TrendChartProps> = ({ soilMoisture, rain, timestamp }) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const newDataPoint: DataPoint = {
      time: new Date(timestamp).toLocaleTimeString(),
      soilMoisture,
      rain: rain * 100 // Scale rain to 0-100 for better visualization
    };

    setData(prev => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-20); // Keep last 20 data points
    });
  }, [soilMoisture, rain, timestamp]);

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
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
            dataKey="soilMoisture" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Soil Moisture (%)"
            dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="rain" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Rain Status"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
