
import React, { useState } from 'react';
import { Link, Search, Upload, Zap } from 'lucide-react';
import CyberButton from './CyberButton';
import CyberInput from './CyberInput';
import CyberScanResult from './CyberScanResult';
import { ThreatStatus } from './CyberScanResult';

const HeroSection = () => {
  const [inputValue, setInputValue] = useState('');
  const [scanStatus, setScanStatus] = useState<ThreatStatus | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    if (!inputValue) return;
    
    setIsScanning(true);
    setScanStatus('scanning');
    
    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false);
      
      // Demo logic to simulate different scan results
      if (inputValue.includes('malware') || inputValue.includes('virus')) {
        setScanStatus('danger');
      } else if (inputValue.includes('suspicious') || inputValue.includes('warning')) {
        setScanStatus('warning');
      } else {
        setScanStatus('safe');
      }
    }, 2500);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Cyberpunk background elements */}
      <div className="absolute inset-0 cyber-grid-bg opacity-5 z-0"></div>
      <div className="data-stream"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 cyber-text-glow">
              Shield Your Digital Life
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Real-time threat detection for safer browsing, downloads, and online interactions.
            </p>
            <p className="text-gray-400 mb-8">
              Don't be a target. CATCHit scans, predicts, and shields you from cyber threats before they strike.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <CyberButton variant="primary">
                Get Started
              </CyberButton>
              <CyberButton>
                How It Works
              </CyberButton>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 text-center">
              {[
                { value: '99.8%', label: 'Detection Rate' },
                { value: '24/7', label: 'Protection' },
                { value: '0.1s', label: 'Response Time' }
              ].map((stat, index) => (
                <div key={index} className="cyber-panel p-4">
                  <div className="text-2xl font-bold cyber-text-glow">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Content - Scanner UI */}
          <div className="flex-1 w-full max-w-md">
            <div className="cyber-panel p-6 relative overflow-hidden">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 cyber-text-glow">Threat Scanner</h2>
                <p className="text-sm text-gray-400">Enter a URL or upload a file to scan for threats</p>
              </div>
              
              {/* Scan Input */}
              <div className="mb-4">
                <CyberInput
                  placeholder="Enter URL or paste content to scan..."
                  icon={<Link className="h-5 w-5" />}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <CyberButton 
                  variant="primary" 
                  className="flex-1 py-3"
                  onClick={handleScan}
                  disabled={isScanning || !inputValue}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Scan Now
                </CyberButton>
                <CyberButton className="px-3 py-3">
                  <Upload className="h-4 w-4" />
                </CyberButton>
              </div>
              
              {/* Scan Results */}
              {scanStatus && (
                <CyberScanResult 
                  status={scanStatus}
                  result={scanStatus === 'scanning' 
                    ? 'Analyzing content and checking threat databases...' 
                    : scanStatus === 'safe'
                    ? 'No threats detected. This content appears to be safe.'
                    : scanStatus === 'warning'
                    ? 'Potential risks identified. Proceed with caution.'
                    : 'Dangerous content detected! Access blocked for your safety.'
                  }
                  details={scanStatus !== 'scanning' ? 'Scan completed in 0.8 seconds' : undefined}
                />
              )}
              
              {/* Scanner Decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyber-blue/30 to-transparent"></div>
              <div className="absolute top-2 right-3 flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`h-1 w-1 rounded-full ${i === 1 ? 'bg-cyber-orange' : i === 2 ? 'bg-cyber-purple-light' : 'bg-cyber-blue'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
