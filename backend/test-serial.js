const { SerialPort } = require('serialport');
const SerialPortList = require('@serialport/list');

async function testSerialConnection() {
  console.log('🔍 Testing Serial Port Connection...\n');
  
  try {
    // List all available ports
    console.log('📋 Available Serial Ports:');
    const ports = await SerialPortList.list();
    ports.forEach(port => {
      console.log(`  - ${port.path}: ${port.manufacturer || 'Unknown'} (${port.friendlyName || 'No friendly name'})`);
    });
    
    console.log('\n🔍 Looking for Arduino/CH340 devices...');
    const arduino = ports.find(p => 
      /CH340|Arduino|USB.*Serial/i.test(p.manufacturer || '') ||
      /CH340|Arduino/i.test(p.friendlyName || '')
    );
    
    if (arduino) {
      console.log(`✅ Found Arduino device: ${arduino.path}`);
      console.log(`   Manufacturer: ${arduino.manufacturer || 'Unknown'}`);
      console.log(`   Friendly Name: ${arduino.friendlyName || 'Unknown'}`);
      
      // Try to connect
      console.log(`\n🔌 Attempting to connect to ${arduino.path}...`);
      const serialPort = new SerialPort({
        path: arduino.path,
        baudRate: 9600,
      });
      
      serialPort.on('open', () => {
        console.log('✅ Successfully connected to serial port!');
        serialPort.close();
        process.exit(0);
      });
      
      serialPort.on('error', (err) => {
        console.log('❌ Serial port error:', err.message);
        process.exit(1);
      });
      
      // Timeout after 5 seconds
      setTimeout(() => {
        console.log('⏰ Connection timeout');
        serialPort.close();
        process.exit(1);
      }, 5000);
      
    } else {
      console.log('❌ No Arduino/CH340 device found');
      console.log('\n💡 Troubleshooting tips:');
      console.log('  1. Make sure your Arduino is connected via USB');
      console.log('  2. Check Device Manager for COM port assignment');
      console.log('  3. Try a different USB cable or port');
      console.log('  4. Install CH340 drivers if needed');
      process.exit(1);
    }
    
  } catch (error) {
    console.log('❌ Error:', error);
    process.exit(1);
  }
}

testSerialConnection();
