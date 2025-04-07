
import React from 'react';
import { Link } from 'react-router-dom';
import CyberCard from '@/components/CyberCard';
import { AlertTriangle, Shield, Eye } from 'lucide-react';
import CyberButton from '@/components/CyberButton';

const Threats = () => {
  const threatItems = [
    { id: '1', name: 'Trojan.Emotet', type: 'Malware', location: 'C:/Downloads/update.exe', status: 'Quarantined', severity: 'high' },
    { id: '2', name: 'FakeBank.html', type: 'Phishing', location: 'Browser Cache', status: 'Blocked', severity: 'high' },
    { id: '3', name: 'Adware.PUP', type: 'PUP', location: 'C:/Program Files/FreeTool', status: 'Active', severity: 'medium' },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold cyber-text-glow">Threats</h1>
        <CyberButton variant="primary">
          <div className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            Scan Now
          </div>
        </CyberButton>
      </div>
      
      <CyberCard className="mb-8">
        <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
          Active Threats
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cyber-purple/20">
                <th className="text-left p-4 text-gray-400">Threat</th>
                <th className="text-left p-4 text-gray-400">Type</th>
                <th className="text-left p-4 text-gray-400">Location</th>
                <th className="text-left p-4 text-gray-400">Status</th>
                <th className="text-left p-4 text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {threatItems.map((item) => (
                <tr key={item.id} className="border-b border-cyber-purple/10 hover:bg-cyber-purple/10">
                  <td className="p-4 font-medium text-red-400">{item.name}</td>
                  <td className="p-4 text-gray-400">{item.type}</td>
                  <td className="p-4 text-gray-400 max-w-xs truncate">{item.location}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'Active' ? 'bg-red-500/20 text-red-400' : 
                      item.status === 'Quarantined' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <CyberButton size="sm">Remove</CyberButton>
                      <Link to={`/threat/${item.id}`}>
                        <CyberButton size="sm" variant="accent">Details</CyberButton>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberCard>
      
      <CyberCard>
        <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
          <Eye className="mr-2 h-5 w-5 text-cyber-blue" />
          Threat Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-cyber-dark/30 p-4 rounded-md">
            <h3 className="font-bold text-white mb-1">Threats Detected</h3>
            <p className="text-3xl font-bold text-red-500">24</p>
            <p className="text-gray-400 text-sm">This month</p>
          </div>
          
          <div className="bg-cyber-dark/30 p-4 rounded-md">
            <h3 className="font-bold text-white mb-1">Threats Resolved</h3>
            <p className="text-3xl font-bold text-green-500">21</p>
            <p className="text-gray-400 text-sm">This month</p>
          </div>
          
          <div className="bg-cyber-dark/30 p-4 rounded-md">
            <h3 className="font-bold text-white mb-1">Active Threats</h3>
            <p className="text-3xl font-bold text-yellow-500">3</p>
            <p className="text-gray-400 text-sm">Require attention</p>
          </div>
        </div>
      </CyberCard>
    </div>
  );
};

export default Threats;
