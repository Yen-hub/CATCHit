import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ThreatStatus } from "@/components/CyberScanResult";
import { api } from "@/lib/api";
import { storage } from "@/lib/store";

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
    status?: ThreatStatus;
    target?: string;
    result?: string;
    progress?: {
      stage: string;
      percent: number;
    };
  };
  loading: {
    scan: boolean;
    history: boolean;
    details: boolean;
  };
  error: string | null;
  currentScanDetails: any | null;
}

const initialState: ScanState = {
  history: [],
  currentScan: {
    isScanning: false,
    progress: { stage: "", percent: 0 },
  },
  loading: {
    scan: false,
    history: false,
    details: false,
  },
  error: null,
  currentScanDetails: null,
};

const mapApiResponseToThreatStatus = (
  ismalicious: boolean,
  confidence?: number
): ThreatStatus => {
  if (ismalicious) {
    return confidence && confidence > 0.8 ? "danger" : "warning";
  }
  return "safe";
};

// Load persisted state
export const loadPersistedState = createAsyncThunk(
  "scan/loadPersistedState",
  async () => {
    return await storage.getState();
  }
);

export const scanUrl = createAsyncThunk(
  "scan/scanUrl",
  async (url: string, { dispatch }) => {
    const response = await api.scanUrl(url);

    // Create ReadableStream from the response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      try {
        const data = JSON.parse(chunk);
        if (data.progress) {
          dispatch(updateProgress(data.progress));
        }
        if (data.result) {
          return {
            target: url,
            status: mapApiResponseToThreatStatus(
              data.result.is_malicious,
              data.result.confidence
            ) as ThreatStatus,
            result: `${data.result.classification} (${(
              data.result.confidence * 100
            ).toFixed(1)}% confidence)`,
            timestamp: new Date().toISOString(),
            metadata: data.result,
          };
        }
      } catch (e) {
        console.error("Failed to parse progress data:", e);
      }
    }
  }
);

export const scanFile = createAsyncThunk(
  "scan/scanFile",
  async (file: File) => {
    const response = await api.scanFile(file);
    const threatStatus =
      response.threat_level === "high"
        ? "danger"
        : response.threat_level === "medium"
        ? "warning"
        : "safe";

    const scanResult = {
      target: file.name,
      status: threatStatus as ThreatStatus,
      result: response.scan_results.map((r) => r.message).join(". "),
      timestamp: new Date().toISOString(),
      metadata: response,
    };

    // Add to persistent storage
    await storage.addToHistory({
      id: Date.now(),
      target: file.name,
      timestamp: scanResult.timestamp,
      status: scanResult.status,
      threatType: response.threat_level,
    });

    if (response.is_malicious) {
      await storage.addThreat({
        id: Date.now().toString(),
        type: response.threat_level,
        target: file.name,
        timestamp: scanResult.timestamp,
        status: scanResult.status,
        details: scanResult.result,
        securityScore: response.scan_results.length,
        metadata: response,
      });
    }

    return scanResult;
  }
);

export const fetchHistory = createAsyncThunk("scan/fetchHistory", async () => {
  return await api.getHistory();
});

export const fetchScanDetails = createAsyncThunk(
  "scan/fetchDetails",
  async (id: string) => {
    return await api.getScanDetails(id);
  }
);

export const submitForAnalysis = createAsyncThunk(
  "scan/submitForAnalysis",
  async (id: string) => {
    return await api.submitForAnalysis(id);
  }
);

const scanSlice = createSlice({
  name: "scan",
  initialState,
  reducers: {
    clearScan: (state) => {
      state.currentScan = initialState.currentScan;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProgress: (
      state,
      action: PayloadAction<{ stage: string; percent: number }>
    ) => {
      state.currentScan.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Load persisted state
    builder.addCase(loadPersistedState.fulfilled, (state, action) => {
      state.history = action.payload.history;
      // Update any additional state from storage
    });

    // URL Scan
    builder.addCase(scanUrl.pending, (state) => {
      state.loading.scan = true;
      state.currentScan.isScanning = true;
      state.error = null;
    });
    builder.addCase(scanUrl.fulfilled, (state, action) => {
      state.loading.scan = false;
      state.currentScan = {
        ...action.payload,
        isScanning: false,
      };
      // Add to history
      state.history.unshift({
        id: Date.now(),
        target: action.payload.target,
        timestamp: action.payload.timestamp,
        status: action.payload.status,
        threatType: action.payload.metadata.classification,
      });
    });
    builder.addCase(scanUrl.rejected, (state, action) => {
      state.loading.scan = false;
      state.currentScan.isScanning = false;
      state.error = action.error.message || "Failed to scan URL";
    });

    // File Scan
    builder.addCase(scanFile.pending, (state) => {
      state.loading.scan = true;
      state.currentScan.isScanning = true;
      state.error = null;
    });
    builder.addCase(scanFile.fulfilled, (state, action) => {
      state.loading.scan = false;
      state.currentScan = {
        ...action.payload,
        isScanning: false,
      };
      // Add to history
      state.history.unshift({
        id: Date.now(),
        target: action.payload.target,
        timestamp: action.payload.timestamp,
        status: action.payload.status,
        threatType: action.payload.metadata.threat_level,
      });
    });
    builder.addCase(scanFile.rejected, (state, action) => {
      state.loading.scan = false;
      state.currentScan.isScanning = false;
      state.error = action.error.message || "Failed to scan file";
    });

    // History
    builder.addCase(fetchHistory.pending, (state) => {
      state.loading.history = true;
      state.error = null;
    });
    builder.addCase(fetchHistory.fulfilled, (state, action) => {
      state.loading.history = false;
      state.history = action.payload;
    });
    builder.addCase(fetchHistory.rejected, (state, action) => {
      state.loading.history = false;
      state.error = action.error.message || "Failed to fetch scan history";
    });

    // Scan Details
    builder.addCase(fetchScanDetails.pending, (state) => {
      state.loading.details = true;
      state.error = null;
    });
    builder.addCase(fetchScanDetails.fulfilled, (state, action) => {
      state.loading.details = false;
      state.currentScanDetails = action.payload;
    });
    builder.addCase(fetchScanDetails.rejected, (state, action) => {
      state.loading.details = false;
      state.error = action.error.message || "Failed to fetch scan details";
    });

    // Submit for Analysis
    builder.addCase(submitForAnalysis.rejected, (state, action) => {
      state.error = action.error.message || "Failed to submit for analysis";
    });
  },
});

export const { clearScan, clearError, updateProgress } = scanSlice.actions;

export default scanSlice.reducer;
