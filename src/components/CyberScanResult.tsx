
import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import CyberCard from './CyberCard';

export type ThreatStatus = 'scanning' | 'safe' | 'warning' | 'danger';

interface CyberScanResultProps {
  status: ThreatStatus;
  result?: string;
  details?: string;
  className?: string;
}

const CyberScanResult = ({
  status,
  result,
  details,
  className
}: CyberScanResultProps) => {
  const statusConfig = {
    scanning: {
      icon: <Shield className="w-8 h-8 text-cyber-blue animate-pulse" />,
      title: "Scanning...",
      color: "text-cyber-blue",
      bgColor: "bg-cyber-blue/10",
      borderColor: "border-cyber-blue/30"
    },
    safe: {
      icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
      title: "Safe",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30"
    },
    warning: {
      icon: <ShieldAlert className="w-8 h-8 text-yellow-500" />,
      title: "Warning",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30"
    },
    danger: {
      icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
      title: "Danger",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30"
    }
  };

  const config = statusConfig[status];

  return (
    <CyberCard className={cn("overflow-hidden", className)}>
      <div className="flex items-start gap-4">
        <div className={cn("p-3 rounded-md", config.bgColor)}>
          {config.icon}
        </div>
        <div className="flex-1">
          <h3 className={cn("text-xl font-bold mb-1", config.color)}>
            {config.title}
          </h3>
          {result && <p className="text-gray-300 mb-2">{result}</p>}
          {details && <p className="text-sm text-gray-400">{details}</p>}
        </div>
      </div>
      
      {/* Decorative scan line */}
      {status === 'scanning' && (
        <div className="scan-line"></div>
      )}
      
      {/* Status indicator */}
      <div className="absolute top-0 right-0 mt-2 mr-2">
        <div className={cn(
          "w-3 h-3 rounded-full animate-pulse",
          status === 'scanning' && "bg-cyber-blue",
          status === 'safe' && "bg-green-500",
          status === 'warning' && "bg-yellow-500",
          status === 'danger' && "bg-red-500"
        )}></div>
      </div>
    </CyberCard>
  );
};

export default CyberScanResult;
