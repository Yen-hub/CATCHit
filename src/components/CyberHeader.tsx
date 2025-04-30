import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu } from 'lucide-react';
import CyberButton from './CyberButton';
import { cn } from '@/lib/utils';

interface CyberHeaderProps {
  onMenuToggle?: () => void;
}

const CyberHeader = ({ onMenuToggle }: CyberHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-cyber-black/80 backdrop-blur-md border-b border-cyber-purple/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-cyber-purple animate-pulse-glow" />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider cyber-text-glow">
                CATCH<span className="text-cyber-orange">it</span>
              </span>
              <span className="text-[10px] text-gray-400 -mt-1">CYBER GUARDIAN SHIELD</span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {['Features', 'How It Works', 'About'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-gray-300 hover:text-cyber-purple-light transition-colors duration-200"
              >
                {item}
              </a>
            ))}
            <Link to="/dashboard">
              <CyberButton variant="primary">
                Launch App
              </CyberButton>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 text-gray-300 hover:text-cyber-purple-light transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Decorative header line */}
      <div className="neon-line"></div>
    </header>
  );
};

export default CyberHeader;
