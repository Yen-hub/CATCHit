
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import CyberButton from './CyberButton';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative h-full w-full flex flex-col overflow-hidden">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Menu content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              className="flex flex-col h-full bg-cyber-dark border-r border-cyber-purple/30 w-4/5 max-w-sm p-6"
            >
              <div className="py-10">
                <div className="text-xl font-bold tracking-wider cyber-text-glow mb-10">
                  CATCH<span className="text-cyber-orange">it</span>
                </div>

                <nav className="flex flex-col space-y-6">
                  {['Home', 'Features', 'How It Works', 'About'].map((item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-lg text-gray-300 hover:text-cyber-purple-light border-b border-cyber-purple/10 pb-2 transition-colors duration-200"
                      onClick={onClose}
                    >
                      {item}
                    </a>
                  ))}
                </nav>

                <div className="mt-12">
                  <CyberButton variant="primary" className="w-full">
                    Sign In
                  </CyberButton>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
