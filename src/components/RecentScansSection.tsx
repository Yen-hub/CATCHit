
import React from 'react';
import { Activity } from 'lucide-react';
import CyberCard from './CyberCard';
import { ThreatStatus } from './CyberScanResult';

interface ScanEntry {
  id: number;
  target: string;
  timestamp: string;
  status: ThreatStatus;
  threatType?: string;
}

const RecentScansSection = () => {
  // Mock data for recent scans
  const recentScans: ScanEntry[] = [
    {
      id: 1,
      target: "https://example-legitimate-site.com",
      timestamp: "2 min ago",
      status: "safe"
    },
    {
      id: 2,
      target: "download-suspicious-file.exe",
      timestamp: "15 min ago",
      status: "warning",
      threatType: "Potentially unwanted program"
    },
    {
      id: 3,
      target: "https://malicious-phishing-attempt.com",
      timestamp: "1 hour ago",
      status: "danger",
      threatType: "Phishing attempt"
    },
    {
      id: 4,
      target: "invoice-document.pdf",
      timestamp: "3 hours ago",
      status: "safe"
    }
  ];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold cyber-text-glow">Recent Scans</h2>
            <p className="text-gray-400">Latest threat detection activity</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-cyber-purple-light">
            <Activity className="h-4 w-4" />
            <span>Live Feed</span>
          </div>
        </div>
        
        <CyberCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-purple/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-normal">Target</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-normal">Time</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-normal">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-normal">Details</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan) => (
                  <tr key={scan.id} className="border-b border-cyber-purple/10 hover:bg-cyber-purple/5 transition-colors">
                    <td className="py-3 px-4 text-gray-300 truncate max-w-[200px]">{scan.target}</td>
                    <td className="py-3 px-4 text-gray-400">{scan.timestamp}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        scan.status === 'safe' ? 'bg-green-500/10 text-green-500' :
                        scan.status === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{scan.threatType || "No threats detected"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CyberCard>
      </div>
    </section>
  );
};

export default RecentScansSection;
