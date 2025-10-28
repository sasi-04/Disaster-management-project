export interface SensorData {
  waterLevel: number;
  soilMoisture: number;
  rain: number;
  vibration: number;
  waterFlow: number;
  accelerometer: {
    x: number;
    y: number;
    z: number;
  };
  floodProbability: number;
  landslideProbability: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'flood' | 'landslide';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Settings {
  waterLevelThreshold: number;
  soilMoistureThreshold: number;
  vibrationThreshold: number;
}

export interface ConnectionStatus {
  connected: boolean;
  simulatorMode: boolean;
  timestamp: string;
}

