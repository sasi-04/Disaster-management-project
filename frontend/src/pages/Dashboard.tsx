import React from 'react';
import { motion } from 'framer-motion';
import { useSensorData, useAlerts } from '../hooks/useSocket';
import WaterLevelGauge from '../components/WaterLevelGauge';
import ProbabilityChart from '../components/ProbabilityChart';
import SensorCard from '../components/SensorCard';
import AccelerometerChart from '../components/AccelerometerChart';
import TrendChart from '../components/TrendChart';
import AlertToast from '../components/AlertToast';

const Dashboard: React.FC = () => {
  const sensorData = useSensorData();
  const alerts = useAlerts();

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
      {/* Alert Toasts */}
      {alerts.slice(0, 3).map((alert) => (
        <AlertToast key={alert.id} alert={alert} />
      ))}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Water Level Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Water Level</h3>
            </div>
            <div className="card-content">
              <WaterLevelGauge value={sensorData.waterLevel} />
            </div>
          </motion.div>

          {/* Probability Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
            </div>
            <div className="card-content space-y-4">
              <ProbabilityChart
                title="Flood Probability"
                value={sensorData.floodProbability}
                type="flood"
              />
              <ProbabilityChart
                title="Landslide Probability"
                value={sensorData.landslideProbability}
                type="landslide"
              />
            </div>
          </motion.div>
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          {/* Sensor Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <SensorCard
              title="Soil Moisture"
              value={`${sensorData.soilMoisture}%`}
              icon="🌱"
              color="green"
            />
            <SensorCard
              title="Rain Status"
              value={sensorData.rain ? "Detected" : "Not Detected"}
              icon="🌧️"
              color={sensorData.rain ? "blue" : "gray"}
            />
            <SensorCard
              title="Vibration"
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
          </div>

          {/* Accelerometer Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Accelerometer</h3>
            </div>
            <div className="card-content">
              <AccelerometerChart data={sensorData.accelerometer} />
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Trends</h3>
            </div>
            <div className="card-content">
              <TrendChart
                soilMoisture={sensorData.soilMoisture}
                rain={sensorData.rain}
                timestamp={sensorData.timestamp}
              />
            </div>
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card"
          >
            <div className="card-header">
              <h3 className="text-lg font-semibold text-white">Location Map</h3>
            </div>
            <div className="card-content">
              <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p>Map placeholder</p>
                  <p className="text-sm">GPS integration coming soon</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
