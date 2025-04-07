
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThreatStatus } from '@/components/CyberScanResult';

interface ScanState {
  history: {
    id: number;
    target: string;
    timestamp: string;
    status: ThreatStatus;
    threatType?: string;
  }[];
  currentScan: {
    isScanning: boolean;
    target: string;
    status: ThreatStatus | null;
    result: string;
    timestamp: string;
  };
}

const initialState: ScanState = {
  history: [
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
  ],
  currentScan: {
    isScanning: false,
    target: "",
    status: null,
    result: "",
    timestamp: ""
  }
};

export const scanSlice = createSlice({
  name: 'scan',
  initialState,
  reducers: {
    startScan: (state, action: PayloadAction<string>) => {
      state.currentScan = {
        isScanning: true,
        target: action.payload,
        status: "scanning",
        result: "Analyzing content and checking threat databases...",
        timestamp: new Date().toISOString()
      };
    },
    completeScan: (state, action: PayloadAction<{
      status: ThreatStatus;
      result: string;
      threatType?: string;
    }>) => {
      state.currentScan.isScanning = false;
      state.currentScan.status = action.payload.status;
      state.currentScan.result = action.payload.result;
      
      // Add to history
      const newScanId = state.history.length > 0 
        ? Math.max(...state.history.map(item => item.id)) + 1 
        : 1;
        
      state.history.unshift({
        id: newScanId,
        target: state.currentScan.target,
        timestamp: "Just now",
        status: action.payload.status,
        threatType: action.payload.threatType
      });
    },
    clearScan: (state) => {
      state.currentScan = {
        isScanning: false,
        target: "",
        status: null,
        result: "",
        timestamp: ""
      };
    }
  },
});

export const { startScan, completeScan, clearScan } = scanSlice.actions;

export default scanSlice.reducer;
