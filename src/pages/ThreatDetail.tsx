
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import { ArrowLeft, Shield, AlertTriangle, Clock, File, Download, FileText, Activity, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock threat detail data
const mockThreatDetails = {
  '1': {
    id: '1',
    name: 'Trojan.Emotet',
    type: 'Malware',
    detectedAt: '2025-04-06 14:32',
    location: 'C:/Downloads/update.exe',
    status: 'Quarantined',
    severity: 'high',
    description: 'Emotet is a sophisticated banking Trojan that primarily functions as a downloader or dropper of other banking Trojans. It uses multiple methods to maintain persistence and evasion techniques to avoid detection.',
    potentialImpact: 'Data theft, installation of additional malware, system corruption, and network infection.',
    remediationSteps: [
      'Keep isolated in quarantine',
      'Run a full system scan',
      'Change all passwords from a clean device',
      'Monitor accounts for suspicious activity'
    ]
  },
  '2': {
    id: '2',
    name: 'FakeBank.html',
    type: 'Phishing',
    detectedAt: '2025-04-06 12:15',
    location: 'Browser Cache',
    status: 'Blocked',
    severity: 'high',
    description: 'A sophisticated phishing attempt designed to steal banking credentials. The page mimics a legitimate banking website to trick users into entering their login information.',
    potentialImpact: 'Theft of banking credentials, financial loss, and identity theft.',
    remediationSteps: [
      'No action required - the threat was blocked before it could execute',
      'Review recent account activity',
      'Consider enabling two-factor authentication on sensitive accounts'
    ]
  }
};

const ThreatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [threatData, setThreatData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch data based on the ID
    // For now, we'll just simulate loading and use mock data
    setLoading(true);
    setTimeout(() => {
      setThreatData(mockThreatDetails[id as keyof typeof mockThreatDetails]);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <AlertTriangle className="h-16 w-16 text-cyber-orange animate-pulse" />
      </div>
    );
  }

  if (!threatData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CyberCard className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-cyber-orange mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Threat Not Found</h2>
          <p className="text-gray-400 mb-6">The threat report you're looking for doesn't exist or has been removed.</p>
          <CyberButton onClick={() => navigate('/threats')}>
            Return to Threats
          </CyberButton>
        </CyberCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <CyberButton 
          size="sm" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </CyberButton>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <AlertTriangle className={cn(
              "h-6 w-6 mr-3",
              threatData.severity === 'high' ? "text-red-500" : 
              threatData.severity === 'medium' ? "text-yellow-500" : "text-blue-500"
            )} />
            <h1 className="text-2xl md:text-3xl font-bold cyber-text-glow">{threatData.name}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">Detected: {threatData.detectedAt}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CyberCard className="mb-6">
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h3 className="text-gray-400 text-sm">Type</h3>
                <p className="text-lg font-semibold">{threatData.type}</p>
              </div>
              
              <div className="mb-4 md:mb-0">
                <h3 className="text-gray-400 text-sm">Status</h3>
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm inline-flex items-center",
                  threatData.status === 'Active' ? "bg-red-500/20 text-red-400" : 
                  threatData.status === 'Quarantined' ? "bg-yellow-500/20 text-yellow-400" : 
                  "bg-green-500/20 text-green-400"
                )}>
                  {threatData.status === 'Active' && <Activity className="h-3 w-3 mr-1" />}
                  {threatData.status === 'Quarantined' && <Shield className="h-3 w-3 mr-1" />}
                  {threatData.status === 'Blocked' && <Check className="h-3 w-3 mr-1" />}
                  {threatData.status}
                </span>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm">Location</h3>
                <p className="text-white font-mono text-sm truncate max-w-xs">{threatData.location}</p>
              </div>
            </div>

            <div className="bg-cyber-dark/40 p-4 rounded-md mb-4">
              <h3 className="font-bold mb-2">Description</h3>
              <p className="text-gray-300">{threatData.description}</p>
            </div>

            <div className="bg-cyber-dark/40 p-4 rounded-md">
              <h3 className="font-bold mb-2">Potential Impact</h3>
              <p className="text-gray-300">{threatData.potentialImpact}</p>
            </div>
          </CyberCard>

          <CyberCard>
            <h2 className="text-xl font-bold cyber-text-glow mb-4">Remediation Steps</h2>
            
            <ul className="space-y-3">
              {threatData.remediationSteps.map((step: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="bg-cyber-purple/20 text-cyber-purple-light rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="ml-3 text-gray-300">{step}</span>
                </li>
              ))}
            </ul>
          </CyberCard>
        </div>

        <div className="lg:col-span-1">
          <CyberCard className="mb-6">
            <h2 className="text-xl font-bold cyber-text-glow mb-4">Actions</h2>
            
            <div className="space-y-4">
              {threatData.status === 'Active' && (
                <CyberButton variant="primary" className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Quarantine Now
                </CyberButton>
              )}
              
              {threatData.status === 'Quarantined' && (
                <>
                  <CyberButton variant="primary" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Permanently
                  </CyberButton>
                  <CyberButton className="w-full">
                    <Check className="mr-2 h-4 w-4" />
                    Restore (Advanced)
                  </CyberButton>
                </>
              )}
              
              <CyberButton className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Scan Related Files
              </CyberButton>
              
              <CyberButton variant="accent" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </CyberButton>
            </div>
          </CyberCard>

          <CyberCard>
            <h2 className="text-xl font-bold cyber-text-glow mb-4">Threat Intelligence</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">First Detected</h3>
                <p className="text-white">2024-12-20</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Prevalence</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-cyber-dark/70 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{width: '75%'}}
                    ></div>
                  </div>
                  <span className="text-red-500 font-bold">High</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Distribution</h3>
                <p className="text-white">Global</p>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Technical Details</h3>
                <CyberButton size="sm" className="mt-1">
                  <File className="mr-2 h-4 w-4" />
                  View Full Report
                </CyberButton>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default ThreatDetail;
