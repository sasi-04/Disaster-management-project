# IoT Monitoring Dashboard

A professional IoT monitoring dashboard for Arduino Nano + ZigBee based landslide and flood detection system.

## 🌟 Features

- **Real-time Sensor Monitoring**: Water level, soil moisture, rain, vibration, water flow, and accelerometer data
- **Risk Assessment**: Automated flood and landslide probability calculations
- **Live Dashboard**: Modern dark UI with animated gauges, charts, and real-time updates
- **Alert System**: Toast notifications and persistent alert logging
- **Settings Management**: Configurable thresholds and system parameters
- **Simulator Mode**: Built-in data simulator for testing without hardware

## 🛠️ Tech Stack

### Backend
- **Node.js + Express**: REST API server
- **Socket.io**: Real-time data broadcasting
- **SerialPort**: COM17 communication with Arduino
- **TypeScript**: Type-safe development
- **Winston**: Logging system

### Frontend
- **React + Vite**: Modern frontend framework
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive charts and gauges
- **Socket.io Client**: Real-time data consumption

## 📊 Sensor Data Format

The Arduino sends data in the following format:
```
WL:65, SM:42, R:1, VB:0, WF:1, AX:2.1, AY:-1.4, AZ:0.9
```

Where:
- `WL`: Water Level (0-100%)
- `SM`: Soil Moisture (0-100%)
- `R`: Rain Detection (0 or 1)
- `VB`: Vibration Level (0 or 1)
- `WF`: Water Flow (0 or 1)
- `AX/AY/AZ`: Accelerometer axes (float values)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Arduino Nano connected to COM7 (or use simulator mode)

### Installation

1. **Clone and setup backend:**
```bash
cd backend
npm install
```

2. **Setup frontend:**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend server:**
```bash
cd backend
npm run dev
```
Server will start on `http://localhost:3001`

2. **Start the frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on `http://localhost:5173`

## 📱 Dashboard Pages

### 🏠 Dashboard
- Water level gauge with color-coded risk levels
- Probability charts for flood and landslide risks
- Sensor status cards with real-time values
- Accelerometer visualization
- Trend charts for soil moisture and rain
- Map placeholder for future GPS integration

### 🌡️ Sensors
- Detailed sensor readings
- Real-time accelerometer data
- Historical sensor values

### 📋 Logs
- Complete alert history
- System event logging
- Timestamped entries

### ⚠️ Alerts
- Active alerts (last 30 minutes)
- Alert statistics
- Priority-based color coding

### ⚙️ Settings
- Configurable thresholds
- System status monitoring
- Connection status

## 🔧 Configuration

### Serial Port Configuration

The system supports multiple ways to configure the serial port:

**Option 1: Environment Variable (Recommended)**
Create a `.env` file in the backend directory:
```bash
SERIAL_PORT=COM7
BAUD_RATE=9600
```

**Option 2: Auto-Detection**
If no `SERIAL_PORT` is specified, the system will automatically scan for Arduino/CH340 devices:
- Scans for devices with "CH340", "Arduino", or "USB-Serial" in manufacturer/friendly name
- Falls back to COM7 if no device is found

**Option 3: Manual Configuration**
Edit `backend/src/server.ts` and change the default port:
```typescript
const serialPortPath = process.env.SERIAL_PORT || 'COM7';
```

### Alert Thresholds
- **Water Level**: Default 80% (configurable)
- **Soil Moisture**: Default 70% (configurable)
- **Vibration**: High/Low detection

### Probability Calculations

**Flood Probability:**
```
floodProbability = (WaterLevel/100 * 0.5) + (Rain * 0.3) + (WaterFlow * 0.2)
```

**Landslide Probability:**
```
landslideProbability = (SoilMoisture/100 * 0.4) + (Rain * 0.3) + (Vibration * 0.3)
```

## 🔌 Hardware Setup

1. Connect Arduino Nano to COM7
2. Ensure ZigBee modules are properly paired
3. Upload sensor reading code to Arduino
4. Start the backend server

## 🎮 Simulator Mode

If COM7 is not available, the system automatically switches to simulator mode:
- Generates random sensor data every 2 seconds
- Simulates realistic sensor value ranges
- Maintains all dashboard functionality

## 📡 API Endpoints

- `GET /api/data` - Current sensor data
- `GET /api/alerts` - Alert history
- `GET /api/settings` - Current settings
- `POST /api/settings` - Update settings
- `GET /api/status` - Connection status

## 🎨 UI Features

- **Dark Theme**: Professional industrial dashboard look
- **Responsive Design**: Mobile-friendly layout
- **Smooth Animations**: Framer Motion transitions
- **Real-time Updates**: Socket.io live data streaming
- **Color-coded Alerts**: Risk-based visual indicators
- **Interactive Charts**: Recharts visualization

## 🚨 Alert System

### Flood Alerts
- Triggered when water level > threshold
- Color-coded severity levels
- Toast notifications with auto-dismiss

### Landslide Alerts
- Triggered when: High soil moisture + Rain + High vibration
- High priority alerts
- Persistent logging

## 🔍 Troubleshooting

### Backend Issues
- Check COM7 availability
- Verify Arduino connection
- Check logs in `backend/logs/`

### Frontend Issues
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify Socket.io connection

### Connection Issues
- System automatically falls back to simulator mode
- Check serial port permissions
- Verify ZigBee pairing

## 📈 Future Enhancements

- GPS integration for location mapping
- Historical data storage
- Export functionality
- Mobile app development
- Machine learning predictions
- Multi-device support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for IoT monitoring and disaster prevention**
