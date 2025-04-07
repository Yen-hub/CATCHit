
import React from 'react';
import CyberCard from '@/components/CyberCard';
import { History as HistoryIcon, Search, Calendar, Download, Filter } from 'lucide-react';
import CyberButton from '@/components/CyberButton';

const History = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold cyber-text-glow">Activity History</h1>
        <div className="flex space-x-2">
          <CyberButton>
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </div>
          </CyberButton>
          <CyberButton variant="accent">
            <div className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export
            </div>
          </CyberButton>
        </div>
      </div>
      
      <CyberCard className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <input 
                type="text" 
                className="cyber-input pl-10 w-full" 
                placeholder="Search history..."
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-48">
              <select className="cyber-input w-full">
                <option>All Activities</option>
                <option>Scans</option>
                <option>Threats</option>
                <option>Updates</option>
              </select>
            </div>
            
            <div className="w-48 flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <select className="cyber-input w-full">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
        </div>
      </CyberCard>
      
      <CyberCard>
        <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
          <HistoryIcon className="mr-2 h-5 w-5 text-cyber-purple-light" />
          Activity Log
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-purple/20">
                <th className="text-left p-4 text-gray-400">Time</th>
                <th className="text-left p-4 text-gray-400">Activity</th>
                <th className="text-left p-4 text-gray-400">Details</th>
                <th className="text-left p-4 text-gray-400">Result</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '2025-04-05 15:32', activity: 'URL Scan', details: 'https://example.com/login', result: 'Safe' },
                { time: '2025-04-05 14:45', activity: 'File Scan', details: 'report.pdf', result: 'Safe' },
                { time: '2025-04-05 14:32', activity: 'Malware Detection', details: 'update.exe', result: 'Threat Detected' },
                { time: '2025-04-05 12:15', activity: 'URL Blocked', details: 'https://suspicious-bank.com', result: 'Threat Blocked' },
                { time: '2025-04-05 10:45', activity: 'System Scan', details: 'Quick Scan', result: 'Completed' },
                { time: '2025-04-05 09:30', activity: 'Definitions Update', details: 'Virus Definitions', result: 'Updated' },
                { time: '2025-04-04 22:13', activity: 'PUP Detection', details: 'free-tool.dmg', result: 'Quarantined' },
                { time: '2025-04-04 18:05', activity: 'Application Started', details: 'CATCHit Guardian', result: 'Success' },
                { time: '2025-04-04 15:40', activity: 'Settings Changed', details: 'Scan Schedule: Daily', result: 'Applied' },
                { time: '2025-04-04 14:22', activity: 'Deep Scan', details: 'Full System Scan', result: 'Completed' },
              ].map((item, index) => (
                <tr key={index} className="border-b border-cyber-purple/10 hover:bg-cyber-purple/10">
                  <td className="p-4 text-gray-400">{item.time}</td>
                  <td className="p-4">{item.activity}</td>
                  <td className="p-4 text-gray-400 max-w-xs truncate">{item.details}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.result === 'Threat Detected' || item.result === 'Threat Blocked' ? 'bg-red-500/20 text-red-400' : 
                      item.result === 'Quarantined' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {item.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between mt-4">
          <span className="text-gray-400">Showing 1-10 of 145 entries</span>
          <div className="flex space-x-2">
            <CyberButton size="sm">Previous</CyberButton>
            <CyberButton size="sm">Next</CyberButton>
          </div>
        </div>
      </CyberCard>
    </div>
  );
};

export default History;
