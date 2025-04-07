
import React, { useState } from 'react';
import CyberCard from '@/components/CyberCard';
import CyberButton from '@/components/CyberButton';
import CyberInput from '@/components/CyberInput';
import CyberScanResult from '@/components/CyberScanResult';
import { Link, File, Upload, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ScanType = 'url' | 'file';
type ScanStatus = 'idle' | 'scanning' | 'complete';

const Scan = () => {
  const [scanType, setScanType] = useState<ScanType>('url');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<'safe' | 'warning' | 'danger' | null>(null);
  const { toast } = useToast();

  const handleScan = () => {
    if (scanType === 'url' && !url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scan.",
        variant: "destructive",
      });
      return;
    }

    if (scanType === 'file' && !fileName) {
      toast({
        title: "File Required",
        description: "Please select a file to scan.",
        variant: "destructive", 
      });
      return;
    }

    setScanStatus('scanning');
    toast({
      title: `Scanning ${scanType === 'url' ? 'URL' : 'File'}`,
      description: `Analyzing ${scanType === 'url' ? url : fileName} for threats...`,
    });

    // Simulate scanning process
    setTimeout(() => {
      // For demo purposes, randomly determine if it's safe or not
      const outcomes: ('safe' | 'warning' | 'danger')[] = ['safe', 'warning', 'danger'];
      const scanOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      
      setResult(scanOutcome);
      setScanStatus('complete');
      
      toast({
        title: "Scan Complete",
        description: `${scanType === 'url' ? 'URL' : 'File'} analysis finished.`,
      });
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const resetScan = () => {
    setScanStatus('idle');
    setResult(null);
    if (scanType === 'url') {
      setUrl('');
    } else {
      setFileName('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold cyber-text-glow mb-6">Scan</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CyberCard className="mb-6">
            <div className="mb-6 border-b border-cyber-purple/20 pb-4">
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    scanType === 'url' 
                      ? 'border-cyber-purple bg-cyber-purple/10 text-cyber-purple-light' 
                      : 'border-gray-700 text-gray-400 hover:border-cyber-purple/30'
                  }`}
                  onClick={() => {setScanType('url'); resetScan();}}
                >
                  <div className="flex items-center">
                    <Link className="h-4 w-4 mr-2" />
                    URL Scan
                  </div>
                </button>
                <button
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    scanType === 'file' 
                      ? 'border-cyber-purple bg-cyber-purple/10 text-cyber-purple-light' 
                      : 'border-gray-700 text-gray-400 hover:border-cyber-purple/30'
                  }`}
                  onClick={() => {setScanType('file'); resetScan();}}
                >
                  <div className="flex items-center">
                    <File className="h-4 w-4 mr-2" />
                    File Scan
                  </div>
                </button>
              </div>
            </div>
            
            {scanStatus === 'idle' && (
              <div>
                {scanType === 'url' ? (
                  <div className="mb-6">
                    <label htmlFor="url" className="block text-gray-400 mb-2">Enter URL to scan</label>
                    <CyberInput
                      id="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    <p className="text-gray-500 text-sm mt-2">Scan any suspicious URL for malware, phishing, and other threats.</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label htmlFor="file" className="block text-gray-400 mb-2">Select file to scan</label>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1 overflow-hidden">
                        <CyberInput
                          id="fileName"
                          placeholder="No file selected"
                          value={fileName}
                          readOnly
                        />
                      </div>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <CyberButton size="sm" variant="accent">
                          <Upload className="h-4 w-4 mr-1" /> Browse
                        </CyberButton>
                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">Scan any file for viruses, malware, and other threats.</p>
                  </div>
                )}
                
                <div className="text-center">
                  <CyberButton size="sm" variant="primary" onClick={handleScan}>
                    Start Scan
                  </CyberButton>
                </div>
              </div>
            )}
            
            {scanStatus === 'scanning' && (
              <div className="text-center py-8">
                <Shield className="h-16 w-16 text-cyber-purple animate-pulse mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Scanning in progress...</h3>
                <p className="text-gray-400">Analyzing {scanType === 'url' ? url : fileName}</p>
              </div>
            )}
            
            {scanStatus === 'complete' && result && (
              <div>
                <CyberScanResult 
                  status={result} 
                  result={scanType === 'url' ? url : fileName}
                  details={
                    result === 'safe' 
                      ? 'No threats detected. This content appears to be safe.' 
                      : result === 'warning' 
                        ? 'Potential risks detected. Exercise caution.' 
                        : 'Dangerous content detected! Access blocked for your protection.'
                  }
                />
                
                <div className="flex justify-center mt-6 space-x-4">
                  <CyberButton size="sm" onClick={resetScan}>
                    New Scan
                  </CyberButton>
                  
                  {result !== 'safe' && (
                    <CyberButton size="sm" variant="accent">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Submit for Analysis
                    </CyberButton>
                  )}
                  
                  <CyberButton size="sm">
                    View Details
                  </CyberButton>
                </div>
              </div>
            )}
          </CyberCard>
        </div>
        
        <div className="lg:col-span-1">
          <CyberCard>
            <h2 className="text-xl font-bold cyber-text-glow mb-4">Scan Guide</h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-cyber-dark/50 rounded-md">
                <h3 className="font-semibold mb-1 flex items-center">
                  <Link className="h-4 w-4 mr-2 text-cyber-blue" />
                  URL Scanning
                </h3>
                <p className="text-gray-400 text-sm">
                  Enter any suspicious URL to check if it's safe. Our scanner detects phishing attempts, malware distribution, and other web threats.
                </p>
              </div>
              
              <div className="p-3 bg-cyber-dark/50 rounded-md">
                <h3 className="font-semibold mb-1 flex items-center">
                  <File className="h-4 w-4 mr-2 text-cyber-orange" />
                  File Scanning
                </h3>
                <p className="text-gray-400 text-sm">
                  Upload any file to check for viruses, malware, and other threats. Our scanner analyzes the content to ensure it's safe to open.
                </p>
              </div>
              
              <div className="p-3 bg-cyber-dark/50 rounded-md">
                <h3 className="font-semibold mb-1 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-cyber-purple" />
                  Scan Technology
                </h3>
                <p className="text-gray-400 text-sm">
                  Our advanced scanning technology uses AI and threat intelligence to detect even the newest threats with high accuracy.
                </p>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default Scan;
