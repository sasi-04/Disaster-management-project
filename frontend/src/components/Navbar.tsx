import React from 'react';
import { useConnectionStatus } from '../hooks/useSocket';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const status = useConnectionStatus();
  const currentTime = new Date().toLocaleString();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-xl font-semibold text-white">
            Landslide & Flood Monitoring Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-400">
            {currentTime}
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status?.connected ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <span className={`text-sm font-medium ${
              status?.connected ? 'text-green-400' : 'text-red-400'
            }`}>
              {status?.connected ? 'Connected' : 'Disconnected'}
            </span>
            {status?.simulatorMode && (
              <span className="text-xs text-yellow-400 ml-2">(Simulator)</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
