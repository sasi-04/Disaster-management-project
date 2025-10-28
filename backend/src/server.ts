import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import SerialPortList from '@serialport/list';
import dayjs from 'dayjs';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

app.use(cors());
app.use(express.json());

// Store sensor data and alerts
let currentData = {
  waterLevel: 0,
  soilMoisture: 0,
  rain: 0,
  vibration: 0,
  waterFlow: 0,
  accelerometer: { x: 0, y: 0, z: 0 },
  floodProbability: 0,
  landslideProbability: 0,
  timestamp: dayjs().toISOString()
};

let alerts: Array<{
  id: string;
  type: 'flood' | 'landslide';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}> = [];

let settings = {
  waterLevelThreshold: 80,
  soilMoistureThreshold: 70,
  vibrationThreshold: 1
};

// Serial port setup with simulator fallback
let serialPort: SerialPort | null = null;
let isSimulatorMode = false;

async function initializeSerialPort() {
  try {
    let serialPortPath = process.env.SERIAL_PORT || 'COM7';
    
    // Auto-detect Arduino/CH340 if no specific port is set
    if (!process.env.SERIAL_PORT) {
      logger.info('Scanning for Arduino/CH340 devices...');
      const ports = await SerialPortList.list();
      const arduino = ports.find((p: any) => 
        /CH340|Arduino|USB.*Serial/i.test(p.manufacturer || '') ||
        /CH340|Arduino/i.test(p.friendlyName || '')
      );
      
      if (arduino) {
        serialPortPath = arduino.path;
        logger.info(`Auto-detected Arduino device: ${arduino.path} (${arduino.manufacturer || arduino.friendlyName})`);
      } else {
        logger.info(`No Arduino/CH340 detected, using default: ${serialPortPath}`);
      }
    }
    
    serialPort = new SerialPort({
      path: serialPortPath,
      baudRate: 9600,
    });

    const parser = serialPort.pipe(new ReadlineParser({ delimiter: '\n' }));
    
    parser.on('data', (data: string) => {
      parseSensorData(data);
    });

    serialPort.on('error', (err) => {
      logger.error('Serial port error:', err);
      startSimulator();
    });

    logger.info(`Serial port ${serialPortPath} connected`);
  } catch (error) {
    logger.warn(`Serial port ${process.env.SERIAL_PORT || 'COM7'} not available, starting simulator`);
    startSimulator();
  }
}

function startSimulator() {
  isSimulatorMode = true;
  logger.info('Simulator mode activated');
  
  // Generate random sensor data every 2 seconds
  setInterval(() => {
    const simulatedData = generateSimulatedData();
    parseSensorData(simulatedData);
  }, 2000);
}

function generateSimulatedData(): string {
  const waterLevel = Math.floor(Math.random() * 100);
  const soilMoisture = Math.floor(Math.random() * 100);
  const rain = Math.random() > 0.7 ? 1 : 0;
  const vibration = Math.random() > 0.8 ? 1 : 0;
  const waterFlow = Math.random() > 0.6 ? 1 : 0;
  const ax = (Math.random() - 0.5) * 4;
  const ay = (Math.random() - 0.5) * 4;
  const az = (Math.random() - 0.5) * 4;

  return `WL:${waterLevel}, SM:${soilMoisture}, R:${rain}, VB:${vibration}, WF:${waterFlow}, AX:${ax.toFixed(1)}, AY:${ay.toFixed(1)}, AZ:${az.toFixed(1)}`;
}

function parseSensorData(data: string) {
  try {
    const parsed: any = {};
    
    // Parse Arduino format: "1 5 0 0 0 4.03 -3.64" (space-separated values)
    // Expected order: WaterLevel SoilMoisture Rain Vibration WaterFlow AccelX AccelY AccelZ
    const values = data.trim().split(' ').map(v => parseFloat(v));
    
    if (values.length >= 7) {
      parsed.waterLevel = Math.round(values[0] * 10); // Convert to percentage (0-100)
      parsed.soilMoisture = Math.round(values[1] * 10); // Convert to percentage (0-100)
      parsed.rain = values[2] > 0 ? 1 : 0; // Convert to 0/1
      parsed.vibration = values[3] > 0 ? 1 : 0; // Convert to 0/1
      parsed.waterFlow = values[4] > 0 ? 1 : 0; // Convert to 0/1
      parsed.accelerometer = {
        x: values[5] || 0,
        y: values[6] || 0,
        z: values[7] || 0
      };
    } else {
      // Fallback: try to parse KEY:VALUE format
      const parts = data.trim().split(', ');
      parts.forEach(part => {
        const [key, value] = part.split(':');
        switch (key) {
          case 'WL':
            parsed.waterLevel = parseInt(value || '0');
            break;
          case 'SM':
            parsed.soilMoisture = parseInt(value || '0');
            break;
          case 'R':
            parsed.rain = parseInt(value || '0');
            break;
          case 'VB':
            parsed.vibration = parseInt(value || '0');
            break;
          case 'WF':
            parsed.waterFlow = parseInt(value || '0');
            break;
          case 'AX':
            parsed.accelerometer = { ...currentData.accelerometer, x: parseFloat(value || '0') };
            break;
          case 'AY':
            parsed.accelerometer = { ...currentData.accelerometer, y: parseFloat(value || '0') };
            break;
          case 'AZ':
            parsed.accelerometer = { ...currentData.accelerometer, z: parseFloat(value || '0') };
            break;
        }
      });
    }

    // Calculate probabilities
    const floodProbability = calculateFloodProbability(
      parsed.waterLevel || currentData.waterLevel,
      parsed.rain !== undefined ? parsed.rain : currentData.rain,
      parsed.waterFlow !== undefined ? parsed.waterFlow : currentData.waterFlow
    );

    const landslideProbability = calculateLandslideProbability(
      parsed.soilMoisture || currentData.soilMoisture,
      parsed.rain !== undefined ? parsed.rain : currentData.rain,
      parsed.vibration !== undefined ? parsed.vibration : currentData.vibration
    );

    // Update current data
    currentData = {
      ...currentData,
      ...parsed,
      floodProbability,
      landslideProbability,
      timestamp: dayjs().toISOString()
    };

    // Check for alerts
    checkAlerts();

    // Broadcast to all connected clients
    io.emit('sensorData', currentData);

    logger.info('Sensor data updated:', currentData);
  } catch (error) {
    logger.error('Error parsing sensor data:', error);
  }
}

function calculateFloodProbability(waterLevel: number, rain: number, waterFlow: number): number {
  const probability = (waterLevel / 100 * 0.5) + (rain * 0.3) + (waterFlow * 0.2);
  return Math.min(Math.round(probability * 100), 100);
}

function calculateLandslideProbability(soilMoisture: number, rain: number, vibration: number): number {
  const probability = (soilMoisture / 100 * 0.4) + (rain * 0.3) + (vibration * 0.3);
  return Math.min(Math.round(probability * 100), 100);
}

function checkAlerts() {
  const now = dayjs().toISOString();
  
  // Flood alert
  if (currentData.waterLevel > settings.waterLevelThreshold) {
    const alert = {
      id: `flood-${Date.now()}`,
      type: 'flood' as const,
      message: `⚠️ Flood Alert: Water level at ${currentData.waterLevel}%`,
      timestamp: now,
      severity: (currentData.waterLevel > 90 ? 'high' : 'medium') as 'high' | 'medium'
    };
    
    if (!alerts.some(a => a.type === 'flood' && dayjs().diff(dayjs(a.timestamp), 'minute') < 5)) {
      alerts.unshift(alert);
      io.emit('alert', alert);
    }
  }

  // Landslide alert
  if (currentData.soilMoisture > settings.soilMoistureThreshold && 
      currentData.rain === 1 && 
      currentData.vibration === 1) {
    const alert = {
      id: `landslide-${Date.now()}`,
      type: 'landslide' as const,
      message: `⚠️ Landslide Warning: High soil moisture (${currentData.soilMoisture}%) + Rain + Vibration detected`,
      timestamp: now,
      severity: 'high' as 'high'
    };
    
    if (!alerts.some(a => a.type === 'landslide' && dayjs().diff(dayjs(a.timestamp), 'minute') < 5)) {
      alerts.unshift(alert);
      io.emit('alert', alert);
    }
  }

  // Keep only last 100 alerts
  if (alerts.length > 100) {
    alerts = alerts.slice(0, 100);
  }
}

// API Routes
app.get('/api/data', (req, res) => {
  res.json(currentData);
});

app.get('/api/alerts', (req, res) => {
  res.json(alerts);
});

app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

app.get('/api/status', (req, res) => {
  res.json({
    connected: !isSimulatorMode,
    simulatorMode: isSimulatorMode,
    timestamp: dayjs().toISOString()
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info('Client connected:', socket.id);
  
  // Send current data to newly connected client
  socket.emit('sensorData', currentData);
  socket.emit('alerts', alerts);
  socket.emit('settings', settings);

  socket.on('disconnect', () => {
    logger.info('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  initializeSerialPort();
});

