import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SensorData, Alert, Settings, ConnectionStatus } from '../types';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    
    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, connected };
};

export const useSensorData = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('sensorData', (newData: SensorData) => {
      setData(newData);
    });

    return () => {
      socket.off('sensorData');
    };
  }, [socket]);

  return data;
};

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('alerts', (newAlerts: Alert[]) => {
      setAlerts(newAlerts);
    });

    socket.on('alert', (newAlert: Alert) => {
      setAlerts(prev => [newAlert, ...prev]);
    });

    return () => {
      socket.off('alerts');
      socket.off('alert');
    };
  }, [socket]);

  return alerts;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on('settings', (newSettings: Settings) => {
      setSettings(newSettings);
    });

    return () => {
      socket.off('settings');
    };
  }, [socket]);

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const response = await fetch('http://localhost:3001/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      
      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return { settings, updateSettings };
};

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to fetch connection status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return status;
};

