
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import CyberScanResult from '@/components/CyberScanResult';
import { ArrowLeft, Code, Shield, AlertTriangle, Clock, Link, File, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock scan detail data
const mockScanDetails = {
  url: {
    id: '1',
    target: 'https://example-legitimate-site.com',
    timestamp: '2025-04-06 14:32',
    status: 'safe',
    type: 'url',
    details: 'No threats detected. This URL appears to be legitimate.',
    securityScore: 98,
    metadata: {
      ipAddress: '192.168.1.1',
      server: 'nginx/1.18.0',
      registeredTo: 'Example Organization',
      contentType: 'text/html; charset=UTF-8'
    }
  },
  file: {
    id: '2',
    target: 'suspicious-invoice.pdf',
    timestamp: '2025-04-06 12:15',
    status: 'danger',
    type: 'file',
    details: 'Potential malware detected. The file contains suspicious code patterns commonly associated with ransomware.',
    securityScore: 12,
    metadata: {
      fileSize: '245 KB',
      fileType: 'PDF Document',
      md5: 'a1b2c3d4e5f6g7h8i9j0',
      detectedThreats: ['Trojan.PDF.Cryptor', 'Suspicious.Script']
    }
  }
};

const ScanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scanData, setScanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch data based on the ID
    // For now, we'll just simulate loading and use mock data
    setLoading(true);
    setTimeout(() => {
      // Choose random mock data for demo purposes
      setScanData(id === '1' ? mockScanDetails.url : mockScanDetails.file);
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Shield className="h-16 w-16 text-cyber-purple animate-pulse" />
      </div>
    );
  }

  if (!scanData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CyberCard className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-cyber-orange mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Scan Not Found</h2>
          <p className="text-gray-400 mb-6">The scan report you're looking for doesn't exist or has been removed.</p>
          <CyberButton onClick={() => navigate('/history')}>
            Return to History
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
          <h1 className="text-2xl md:text-3xl font-bold cyber-text-glow">Scan Details</h1>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">{scanData.timestamp}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CyberScanResult 
            status={scanData.status as any} 
            result={scanData.target}
            details={scanData.details}
            className="mb-6"
          />

          <CyberCard className="mb-6">
            <h2 className="text-xl font-bold cyber-text-glow mb-4">Technical Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-400 text-sm mb-1">Type</h3>
                <div className="flex items-center">
                  {scanData.type === 'url' ? (
                    <Link className="h-4 w-4 mr-2 text-cyber-blue" />
                  ) : (
                    <File className="h-4 w-4 mr-2 text-cyber-orange" />
                  )}
                  <p className="text-white capitalize">{scanData.type} Scan</p>
                </div>
              </div>

              <div>
                <h3 className="text-gray-400 text-sm mb-1">Security Score</h3>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-cyber-dark/70 h-2 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full", 
                        scanData.securityScore > 80 ? "bg-green-500" : 
                        scanData.securityScore > 50 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{width: `${scanData.securityScore}%`}}
                    ></div>
                  </div>
                  <span 
                    className={cn(
                      "font-bold",
                      scanData.securityScore > 80 ? "text-green-500" : 
                      scanData.securityScore > 50 ? "text-yellow-500" : "text-red-500"
                    )}
                  >
                    {scanData.securityScore}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-cyber-dark/40 p-4 rounded-md">
              <h3 className="font-bold mb-2">Metadata</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(scanData.metadata).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <h4 className="text-gray-400 text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                    <p className="text-white">{Array.isArray(value) ? value.join(', ') : value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CyberCard>
        </div>

        <div className="lg:col-span-1">
          <CyberCard className="mb-6">
            <h2 className="text-xl font-bold cyber-text-glow mb-4">Actions</h2>
            
            <div className="space-y-4">
              <CyberButton variant="primary" className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                {scanData.status === 'safe' ? 'Add to Trusted' : 'Block Permanently'}
              </CyberButton>
              
              <CyberButton className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </CyberButton>
              
              {scanData.status !== 'safe' && (
                <CyberButton variant="accent" className="w-full">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Submit for Analysis
                </CyberButton>
              )}
            </div>
          </CyberCard>

          <CyberCard>
            <h2 className="text-xl font-bold cyber-text-glow mb-4">Recommendations</h2>
            
            <div className="space-y-3">
              {scanData.status === 'safe' ? (
                <>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md">
                    <p className="text-green-400 text-sm">This content appears to be safe. No action required.</p>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Always maintain caution when visiting websites or downloading files, even when they appear safe.
                  </p>
                </>
              ) : (
                <>
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
                    <p className="text-red-400 text-sm">We recommend you avoid this content as it may be harmful.</p>
                  </div>
                  <div className="p-3 bg-cyber-dark/40 rounded-md">
                    <p className="text-sm text-gray-300">
                      If you believe this is a false positive, you can submit it for further analysis.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default ScanDetail;
