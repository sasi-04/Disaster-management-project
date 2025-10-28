import React from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Sensors', path: '/sensors', icon: '🌡️' },
    { name: 'Logs', path: '/logs', icon: '📋' },
    { name: 'Alerts', path: '/alerts', icon: '⚠️' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 z-50 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-white mb-8">
            IoT Monitor
          </h1>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

