
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CyberCard from '@/components/CyberCard';
import { Shield, Eye, Zap, Bell, AlertTriangle, Cpu, Link as LinkIcon, File, Check, Activity } from 'lucide-react';
import CyberButton from '@/components/CyberButton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');
  
  React.useEffect(() => {
    // Show welcome toast on load
    toast({
      title: "CATCHit Desktop",
      description: "Your cybersecurity guardian is active and monitoring.",
    });
  }, []);

  const stats = [
    { label: 'Threats Detected', value: '24', icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Scans Today', value: '87', icon: Shield, color: 'text-cyber-purple-light' },
    { label: 'System Status', value: 'Protected', icon: Cpu, color: 'text-green-500' },
    { label: 'Last Scan', value: '4m ago', icon: Eye, color: 'text-cyber-blue' },
  ];

  const recentActivity = [
    { type: 'URL Scan', target: 'https://example.com/login', time: '4m ago', result: 'Safe' },
    { type: 'File Scan', target: 'report.pdf', time: '15m ago', result: 'Safe' },
    { type: 'Malware', target: 'update.exe', time: '1h ago', result: 'Blocked', severity: 'high' },
    { type: 'Phishing', target: 'https://fake-bank.com', time: '3h ago', result: 'Blocked', severity: 'high' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold cyber-text-glow">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <CyberButton
            onClick={() => {
              toast({
                title: "Quick Scan",
                description: "Scanning your most vulnerable areas...",
              });
            }}
          >
            <Shield className="mr-2 h-4 w-4" />
            Quick Scan
          </CyberButton>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {stats.map((stat, index) => (
          <CyberCard key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400">{stat.label}</p>
                <p className={`text-xl md:text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-cyber-dark/50 border border-cyber-purple/30 ${stat.color}`}>
                <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
            </div>
          </CyberCard>
        ))}
      </div>
      
      {/* Main Scan Widget */}
      <CyberCard className="mb-6">
        <div className="p-6">
          <h2 className="text-2xl font-bold cyber-text-glow mb-2">Cyber Guardian Active</h2>
          <p className="text-gray-400 mb-6">
            Your system is protected and being monitored for suspicious activities.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/scan" className="w-full">
              <CyberButton variant="primary" className="w-full">
                <LinkIcon className="mr-2 h-4 w-4" />
                Scan URL
              </CyberButton>
            </Link>
            <Link to="/scan" className="w-full">
              <CyberButton className="w-full">
                <File className="mr-2 h-4 w-4" />
                Scan File
              </CyberButton>
            </Link>
          </div>
        </div>
      </CyberCard>
      
      {/* Activity & Threats Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-cyber-purple/20 mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              "py-2 px-4 font-medium border-b-2 transition-colors",
              activeTab === 'overview' 
                ? "text-cyber-purple-light border-cyber-purple" 
                : "text-gray-400 border-transparent hover:text-gray-300 hover:border-cyber-purple/30"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={cn(
              "py-2 px-4 font-medium border-b-2 transition-colors",
              activeTab === 'activity' 
                ? "text-cyber-purple-light border-cyber-purple" 
                : "text-gray-400 border-transparent hover:text-gray-300 hover:border-cyber-purple/30"
            )}
          >
            Recent Activity
          </button>
        </div>
        
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Threats */}
            <CyberCard>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold cyber-text-glow flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  Recent Threats
                </h2>
                <Link to="/threats">
                  <CyberButton size="sm">View All</CyberButton>
                </Link>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Trojan.Emotet', type: 'Malware', location: 'C:/Downloads/update.exe', severity: 'high' },
                  { name: 'FakeBank.html', type: 'Phishing', location: 'Browser Cache', severity: 'high' },
                ].map((item, index) => (
                  <Link to={`/threat/${index + 1}`} key={index} className="block">
                    <div className="p-3 bg-cyber-dark/50 rounded-md border border-cyber-purple/10 hover:border-cyber-purple/30 transition-colors">
                      <div className="flex justify-between">
                        <div className="flex items-start">
                          <AlertTriangle className={cn(
                            "h-5 w-5 mr-3 mt-0.5",
                            item.severity === 'high' ? "text-red-500" : 
                            item.severity === 'medium' ? "text-yellow-500" : "text-blue-500"
                          )} />
                          <div>
                            <h3 className="font-semibold text-red-400">{item.name}</h3>
                            <p className="text-gray-400 text-sm">{item.type} - {item.location}</p>
                          </div>
                        </div>
                        <div className="text-xs bg-red-500/20 text-red-400 py-1 px-2 rounded-full h-fit">
                          Blocked
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CyberCard>
            
            {/* Protection Features */}
            <CyberCard>
              <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5 text-cyber-purple-light" />
                Protection Status
              </h2>
              
              <div className="space-y-4">
                {[
                  { feature: 'Real-time URL Shield', status: 'Active', icon: LinkIcon, color: 'text-cyber-blue' },
                  { feature: 'File Guardian', status: 'Active', icon: File, color: 'text-cyber-orange' },
                  { feature: 'Phishing Protection', status: 'Active', icon: AlertTriangle, color: 'text-cyber-purple-light' },
                  { feature: 'Intelligent Alerts', status: 'Active', icon: Bell, color: 'text-green-500' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-cyber-dark/30 rounded-md">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full bg-cyber-dark/50 ${item.color} mr-3`}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span>{item.feature}</span>
                    </div>
                    <span className="bg-green-500/20 text-green-400 flex items-center px-2 py-0.5 rounded-full text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </CyberCard>
          </div>
        ) : (
          <CyberCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyber-purple/20">
                    <th className="text-left p-3 text-gray-400 font-normal">Type</th>
                    <th className="text-left p-3 text-gray-400 font-normal">Target</th>
                    <th className="text-left p-3 text-gray-400 font-normal">Time</th>
                    <th className="text-left p-3 text-gray-400 font-normal">Result</th>
                    <th className="text-left p-3 text-gray-400 font-normal">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((item, index) => (
                    <tr key={index} className="border-b border-cyber-purple/10 hover:bg-cyber-purple/5">
                      <td className="p-3">
                        <div className="flex items-center">
                          {item.type === 'URL Scan' ? (
                            <LinkIcon className="h-4 w-4 text-cyber-blue mr-2" />
                          ) : item.type === 'File Scan' ? (
                            <File className="h-4 w-4 text-cyber-orange mr-2" />
                          ) : (
                            <AlertTriangle className={`h-4 w-4 mr-2 ${
                              item.severity === 'high' ? "text-red-500" : "text-yellow-500"
                            }`} />
                          )}
                          {item.type}
                        </div>
                      </td>
                      <td className="p-3 text-gray-400 max-w-[200px] truncate">{item.target}</td>
                      <td className="p-3 text-gray-400">{item.time}</td>
                      <td className="p-3">
                        <span className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          item.result === 'Safe' ? "bg-green-500/20 text-green-400" : 
                          "bg-red-500/20 text-red-400"
                        )}>
                          {item.result === 'Safe' ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <Activity className="h-3 w-3 mr-1" />
                          )}
                          {item.result}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link to={`/scan/${index + 1}`}>
                          <CyberButton size="sm">Details</CyberButton>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CyberCard>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
