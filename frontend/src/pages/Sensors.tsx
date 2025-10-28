import React from 'react';
import { motion } from 'framer-motion';
import { useSensorData } from '../hooks/useSocket';
import SensorCard from '../components/SensorCard';
import AccelerometerChart from '../components/AccelerometerChart';

const Sensors: React.FC = () => {
  const sensorData = useSensorData();

  if (!sensorData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="text-xl font-semibold text-white">Sensor Readings</h2>
          <p className="text-sm text-gray-400">Real-time sensor data from Arduino Nano</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SensorCard
              title="Water Level"
              value={`${sensorData.waterLevel}%`}
              icon="🌊"
              color={sensorData.waterLevel > 80 ? "red" : sensorData.waterLevel > 60 ? "yellow" : "green"}
            />
            <SensorCard
              title="Soil Moisture"
              value={`${sensorData.soilMoisture}%`}
              icon="🌱"
              color={sensorData.soilMoisture > 70 ? "red" : sensorData.soilMoisture > 40 ? "yellow" : "green"}
            />
            <SensorCard
              title="Rain Status"
              value={sensorData.rain ? "Detected" : "Not Detected"}
              icon="🌧️"
              color={sensorData.rain ? "blue" : "gray"}
            />
            <SensorCard
              title="Vibration Level"
              value={sensorData.vibration ? "High" : "Low"}
              icon="📳"
              color={sensorData.vibration ? "red" : "green"}
            />
            <SensorCard
              title="Water Flow"
              value={sensorData.waterFlow ? "ON" : "OFF"}
              icon="💧"
              color={sensorData.waterFlow ? "blue" : "gray"}
            />
            <SensorCard
              title="Last Update"
              value={new Date(sensorData.timestamp).toLocaleTimeString()}
              icon="🕒"
              color="gray"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="card-header">
          <h3 className="text-lg font-semibold text-white">Accelerometer Data</h3>
        </div>
        <div className="card-content">
          <AccelerometerChart data={sensorData.accelerometer} />
        </div>
      </motion.div>
    </div>
  );
};

export default Sensors;
