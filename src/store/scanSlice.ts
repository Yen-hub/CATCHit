import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ThreatStatus } from "@/components/CyberScanResult";
import { api } from "@/lib/api";
import { storage } from "@/lib/store";

interface ScanState {
  history: Array<{
    id: string | number;
    target: string;
    timestamp: string;
    status: ThreatStatus;
    threatType?: string;
    [key: string]: any;
  }>;
  currentScan: {
    isScanning: boolean;
    status?: ThreatStatus;
    target?: string;
    result?: string;
    progress?: {
      stage: string;
      percent: number;
    };
    queued?: boolean; // <-- allow queued property for VirusTotal file scans
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

// Utility to check online status
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}

// Load persisted state (history) from JSON store
export const loadPersistedState = createAsyncThunk(
  "scan/loadPersistedState",
  async () => {
    const state = await storage.getState();
    // Return the array directly
    return Array.isArray(state.history) ? state.history : [];
  }
);

// Thunk: Load scan history from JSON store and set Redux state
export const syncHistoryFromJSONStore = createAsyncThunk(
  "scan/syncHistoryFromJSONStore",
  async () => {
    const state = await storage.getState();
    return state.history || [];
  }
);

// --- Scan cancellation support ---
let currentAbortController: AbortController | null = null;

const cancelScan = () => (dispatch: any) => {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
  dispatch(scanSlice.actions.scanCancelled());
};

// --- Updated scanUrl thunk with JSON store persistence ---
export const scanUrl = createAsyncThunk(
  "scan/scanUrl",
  async (url: string, { dispatch, signal, rejectWithValue }) => {
    console.log("Starting URL scan for:", url);
    let response;
    let scanResult;
    const abortController = new AbortController();
    currentAbortController = abortController;
    signal.addEventListener("abort", () => abortController.abort());
    try {
      if (isOnline()) {
        // Use VirusTotal API for URL scanning
        const apiKey = import.meta.env.VITE_VIRUS_TOTAL_API_KEY;
        response = await fetch("https://www.virustotal.com/api/v3/urls", {
          method: "POST",
          headers: {
            "x-apikey": apiKey,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `url=${encodeURIComponent(url)}`,
          signal: abortController.signal,
        }).then((res) => res.json());
        if (signal.aborted) throw new Error("Scan cancelled");
        console.log("[VirusTotal] URL scan POST response:", response);
        const analysisId = response.data?.id;
        if (!analysisId) {
          // Malformed or empty response
          throw new Error(
            "VirusTotal did not return a valid analysis ID. Please try again later."
          );
        }
        // Poll the analysis endpoint until completed
        let analysisResult = null;
        let pollCount = 0;
        while (pollCount < 10) {
          // up to ~20s
          if (signal.aborted) throw new Error("Scan cancelled");
          const analysisResp = await fetch(
            `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
            {
              headers: { "x-apikey": apiKey },
              signal: abortController.signal,
            }
          ).then((res) => res.json());
          if (signal.aborted) throw new Error("Scan cancelled");
          console.log("[VirusTotal] URL analysis poll:", analysisResp);
          if (!analysisResp.data) {
            throw new Error(
              "VirusTotal returned an invalid analysis response. Please try again later."
            );
          }
          if (analysisResp.data?.attributes?.status === "completed") {
            analysisResult = analysisResp;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
          pollCount++;
        }
        // Default to scanning if not completed
        let status: ThreatStatus = "warning";
        let result = "Analysis incomplete or scanner not found.";
        let details = "No details available.";
        let securityScore = 50;
        if (analysisResult) {
          const scanner =
            analysisResult.data?.attributes?.results?.["Google Safebrowsing"];
          if (scanner) {
            // Map category to ThreatStatus
            if (scanner.category === "harmless" || scanner.result === "clean") {
              status = "safe";
              result = "Clean (Google Safebrowsing)";
              details = scanner.result;
              securityScore = 100;
            } else if (scanner.category === "malicious") {
              status = "danger";
              result = "Malicious (Google Safebrowsing)";
              details = scanner.result;
              securityScore = 10;
            } else if (scanner.category === "suspicious") {
              status = "warning";
              result = "Suspicious (Google Safebrowsing)";
              details = scanner.result;
              securityScore = 50;
            } else {
              status = "warning";
              result = `Unknown (${scanner.category})`;
              details = scanner.result;
              securityScore = 50;
            }
          }
        }
        // After polling, summarize the results for the UI
        let summary = {
          scanDate: analysisResult?.data?.attributes?.date
            ? new Date(
                analysisResult.data.attributes.date * 1000
              ).toLocaleString()
            : undefined,
          permalink:
            analysisResult?.data?.links?.self || response?.data?.links?.self,
          maliciousCount: 0,
          suspiciousCount: 0,
          harmlessCount: 0,
          flaggedEngines: [] as Array<{
            engine: string;
            category: string;
            result: string;
          }>,
        };
        const results = analysisResult?.data?.attributes?.results || {};
        for (const [engine, resRaw] of Object.entries(results)) {
          const res = resRaw as any;
          if (res.category === "malicious") {
            summary.maliciousCount++;
            summary.flaggedEngines.push({
              engine,
              category: res.category,
              result: res.result,
            });
          } else if (res.category === "suspicious") {
            summary.suspiciousCount++;
            summary.flaggedEngines.push({
              engine,
              category: res.category,
              result: res.result,
            });
          } else if (res.category === "harmless") {
            summary.harmlessCount++;
          }
        }
        scanResult = {
          id: analysisId || Date.now().toString(),
          target: url,
          status,
          result,
          timestamp: new Date().toISOString(),
          metadata: {
            summary,
            // Keep the full analysisResult for debugging, but UI should use summary
            raw: analysisResult || response,
          },
          type: "url" as const,
          details,
          securityScore,
          source: "virustotal",
        };
      } else {
        // Use custom backend
        response = await api.scanUrl(url);
        scanResult = {
          id: Date.now().toString(),
          target: url,
          status: mapApiResponseToThreatStatus(
            response.is_malicious,
            response.confidence
          ) as ThreatStatus,
          result: `${response.type} (${(response.confidence * 100).toFixed(
            1
          )}% confidence)`,
          timestamp: new Date().toISOString(),
          metadata: response,
          type: "url" as const,
          details: `URL Analysis: ${response.type}`,
          securityScore: Math.round((1 - response.confidence) * 100),
          source: "backend",
        };
      }
      await storage.addToHistory({ ...scanResult });
      await dispatch(loadPersistedState());
      currentAbortController = null;
      return scanResult;
    } catch (err: any) {
      currentAbortController = null;
      if (err.name === "AbortError" || err.message === "Scan cancelled") {
        return rejectWithValue("Scan cancelled by user");
      }
      throw err;
    }
  }
);

// --- Updated scanFile thunk with JSON store persistence ---
export const scanFile = createAsyncThunk(
  "scan/scanFile",
  async (
    arg: { file: File; forceBackend?: boolean },
    { dispatch, signal, rejectWithValue }
  ) => {
    const { file, forceBackend } = arg;
    console.log(
      "Starting file scan for:",
      file.name,
      forceBackend ? "(force backend)" : ""
    );
    let response;
    let scanResult;
    const abortController = new AbortController();
    currentAbortController = abortController;
    signal.addEventListener("abort", () => abortController.abort());
    try {
      if (isOnline() && !forceBackend) {
        // Use VirusTotal API
        const apiKey = import.meta.env.VITE_VIRUS_TOTAL_API_KEY;
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch("https://www.virustotal.com/api/v3/files", {
          method: "POST",
          headers: {
            "x-apikey": apiKey,
          },
          body: formData,
          signal: abortController.signal,
        }).then((res) => res.json());
        if (signal.aborted) throw new Error("Scan cancelled");
        console.log("[VirusTotal] File scan POST response:", response);
        const analysisId = response.data?.id;
        // Poll the analysis endpoint until completed
        let analysisResult = null;
        let pollCount = 0;
        let lastStatus = "queued";
        while (pollCount < 10) {
          // up to ~20s
          if (signal.aborted) throw new Error("Scan cancelled");
          const analysisResp = await fetch(
            `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
            {
              headers: { "x-apikey": apiKey },
              signal: abortController.signal,
            }
          ).then((res) => res.json());
          if (signal.aborted) throw new Error("Scan cancelled");
          // --- DEBUG LOGGING ---
          console.log("[VirusTotal] File analysis poll (raw):", analysisResp);
          console.log(
            "[VirusTotal] File analysis poll data:",
            analysisResp.data
          );
          console.log(
            "[VirusTotal] File analysis poll attributes:",
            analysisResp.data?.attributes
          );
          // --- END DEBUG LOGGING ---
          lastStatus = analysisResp.data?.attributes?.status;
          if (lastStatus === "completed") {
            analysisResult = analysisResp;
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
          pollCount++;
        }
        // --- DEBUG LOGGING ---
        console.log(
          "[VirusTotal] Final analysisResult after polling:",
          analysisResult
        );
        // --- END DEBUG LOGGING ---
        // If still queued after polling, set a queued flag and error
        if (lastStatus === "queued" && !analysisResult) {
          // Set a special error and a queued scan result
          const queuedResult = {
            id: analysisId || Date.now().toString(),
            target: file.name,
            status: "warning" as ThreatStatus,
            result: "File is queued and waiting to be scanned by VirusTotal.",
            timestamp: new Date().toISOString(),
            metadata: {
              summary: {
                scanDate: undefined,
                permalink: response?.data?.links?.self,
                maliciousCount: 0,
                suspiciousCount: 0,
                harmlessCount: 0,
                flaggedEngines: [],
              },
              raw: response,
            },
            type: "file" as const,
            details:
              "Your file has been accepted and is waiting in the VirusTotal scan queue. This may take a few minutes if scanners are busy.",
            securityScore: 50,
            source: "virustotal",
            queued: true,
          };
          await storage.addToHistory({ ...queuedResult });
          await dispatch(loadPersistedState());
          currentAbortController = null;
          // Set a user-friendly error for the UI
          return rejectWithValue(
            "VirusTotal scanners are busy. Your file is queued and was not scanned in time. Please try again later."
          );
        }
        // --- END NEW ---
        if (
          !analysisResult ||
          !analysisResult.data ||
          !analysisResult.data.attributes
        ) {
          console.error(
            "[VirusTotal] analysisResult missing or incomplete (about to throw):",
            analysisResult
          );
          throw new Error(
            "VirusTotal did not return a valid or complete file analysis. Please try again later."
          );
        }
        // --- END NEW ---
        // Default to scanning if not completed
        let status: ThreatStatus = "warning";
        let result = "Analysis incomplete or scanner not found.";
        let details = "No details available.";
        let securityScore = 50;
        if (analysisResult) {
          // For files, use a common AV scanner result, e.g., "Microsoft" or "Kaspersky" if available
          const scanners = analysisResult.data?.attributes?.results || {};
          // Prefer Microsoft, then Kaspersky, then first available
          let scanner =
            scanners["Microsoft"] ||
            scanners["Kaspersky"] ||
            Object.values(scanners)[0];
          if (scanner) {
            if (scanner.category === "harmless" || scanner.result === "clean") {
              status = "safe";
              result = `Clean (${scanner.engine_name})`;
              details = scanner.result;
              securityScore = 100;
            } else if (scanner.category === "malicious") {
              status = "danger";
              result = `Malicious (${scanner.engine_name})`;
              details = scanner.result;
              securityScore = 10;
            } else if (scanner.category === "suspicious") {
              status = "warning";
              result = `Suspicious (${scanner.engine_name})`;
              details = scanner.result;
              securityScore = 50;
            } else {
              status = "warning";
              result = `Unknown (${scanner.category})`;
              details = scanner.result;
              securityScore = 50;
            }
          }
        }
        // Build summary for VirusTotal file scan
        let summary = {
          scanDate: analysisResult?.data?.attributes?.date
            ? new Date(
                analysisResult.data.attributes.date * 1000
              ).toLocaleString()
            : undefined,
          permalink:
            analysisResult?.data?.links?.self || response?.data?.links?.self,
          maliciousCount: 0,
          suspiciousCount: 0,
          harmlessCount: 0,
          flaggedEngines: [] as Array<{
            engine: string;
            category: string;
            result: string;
          }>,
        };
        const results = analysisResult?.data?.attributes?.results || {};
        for (const [engine, resRaw] of Object.entries(results)) {
          const res = resRaw as any;
          if (res.category === "malicious") {
            summary.maliciousCount++;
            summary.flaggedEngines.push({
              engine,
              category: res.category,
              result: res.result,
            });
          } else if (res.category === "suspicious") {
            summary.suspiciousCount++;
            summary.flaggedEngines.push({
              engine,
              category: res.category,
              result: res.result,
            });
          } else if (res.category === "harmless") {
            summary.harmlessCount++;
          }
        }
        scanResult = {
          id: analysisId || Date.now().toString(),
          target: file.name,
          status,
          result,
          timestamp: new Date().toISOString(),
          metadata: {
            summary,
            raw: analysisResult || response,
          },
          type: "file" as const,
          details,
          securityScore,
          source: "virustotal",
        };
      } else {
        // Use custom backend
        response = await api.scanFile(file);
        // Defensive: handle possible missing or unexpected fields
        const threatStatus =
          response?.overall_safe === true
            ? "safe"
            : response?.scan_details?.ExtensionScanner?.is_high_risk
            ? "danger"
            : "warning";
        const formattedWarnings = Array.isArray(response?.warnings)
          ? response.warnings
              .map((warning) =>
                typeof warning === "object" ? JSON.stringify(warning) : warning
              )
              .join(". ")
          : "";
        scanResult = {
          id: (response && response.id) || Date.now().toString(),
          target: file.name,
          status: threatStatus as ThreatStatus,
          result: response?.scan_details?.MimeTypeScanner?.mime_type
            ? `File Analysis: ${response.scan_details.MimeTypeScanner.mime_type}`
            : "File Analysis",
          timestamp: new Date().toISOString(),
          metadata: response,
          type: "file" as const,
          details: formattedWarnings || "No warnings detected",
          securityScore:
            response?.overall_safe === true
              ? 100
              : response?.scan_details?.ExtensionScanner?.is_high_risk
              ? 20
              : 50,
          source: "backend",
        };
      }
      await storage.addToHistory({ ...scanResult });
      await dispatch(loadPersistedState());
      currentAbortController = null;
      return scanResult;
    } catch (err: any) {
      console.error("[scanFile thunk] Caught error:", err);
      currentAbortController = null;
      if (err.name === "AbortError" || err.message === "Scan cancelled") {
        return rejectWithValue("Scan cancelled by user");
      }
      throw err;
    }
  }
);

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
    scanCancelled: (state) => {
      state.loading.scan = false;
      state.currentScan.isScanning = false;
      state.error = "Scan cancelled by user";
    },
  },
  extraReducers: (builder) => {
    // Load persisted state
    builder.addCase(loadPersistedState.fulfilled, (state, action) => {
      state.history = Array.isArray(action.payload) ? action.payload : [];
    });

    // URL Scan
    builder.addCase(scanUrl.pending, (state) => {
      state.loading.scan = true;
      state.currentScan.isScanning = true;
      state.error = null;
    });
    builder.addCase(scanUrl.fulfilled, (state, action) => {
      state.loading.scan = false;
      // Log the payload for debugging
      console.log("[Redux] scanUrl.fulfilled payload:", action.payload);
      state.currentScan = {
        ...action.payload,
        isScanning: false,
        progress: undefined,
      };
      // Do NOT update state.history here; syncHistoryFromSQLite will handle it
    });
    builder.addCase(scanUrl.rejected, (state, action) => {
      state.loading.scan = false;
      state.currentScan.isScanning = false;
      state.error =
        (action.payload as string) ||
        action.error.message ||
        "Failed to scan URL";
    });

    // File Scan
    builder.addCase(scanFile.pending, (state) => {
      state.loading.scan = true;
      state.currentScan.isScanning = true;
      state.error = null;
    });
    builder.addCase(scanFile.fulfilled, (state, action) => {
      state.loading.scan = false;
      // Log the payload for debugging
      console.log("[Redux] scanFile.fulfilled payload:", action.payload);
      state.currentScan = {
        ...action.payload,
        isScanning: false,
        progress: undefined,
      };
      // Do NOT update state.history here; syncHistoryFromSQLite will handle it
    });
    builder.addCase(scanFile.rejected, (state, action) => {
      console.error(
        "[Redux] scanFile.rejected: error set in state",
        action.payload,
        action.error
      );
      state.loading.scan = false;
      state.currentScan.isScanning = false;
      state.error =
        (action.payload as string) ||
        action.error.message ||
        "Failed to scan file";
    });

    // Scan Details
    builder.addCase(fetchScanDetails.pending, (state) => {
      state.loading.details = true;
      state.error = null;
    });
    builder.addCase(fetchScanDetails.fulfilled, (state, action) => {
      state.loading.details = false;
      // Defensive: only set if payload has required ScanResult fields
      const payload = action.payload as any;
      if (
        payload &&
        typeof payload.id === "string" &&
        typeof payload.target === "string" &&
        typeof payload.status === "string" &&
        typeof payload.result === "string" &&
        typeof payload.timestamp === "string"
      ) {
        state.currentScanDetails = payload;
      } else {
        state.currentScanDetails = null;
      }
    });
    builder.addCase(fetchScanDetails.rejected, (state, action) => {
      state.loading.details = false;
      state.error = action.error.message || "Failed to fetch scan details";
    });

    // Submit for Analysis
    builder.addCase(submitForAnalysis.rejected, (state, action) => {
      state.error = action.error.message || "Failed to submit for analysis";
    });

    // Sync History from JSON Store
    builder.addCase(syncHistoryFromJSONStore.fulfilled, (state, action) => {
      state.history = Array.isArray(action.payload)
        ? (action.payload as any[])
        : [];
    });
  },
});

export const { clearScan, clearError, updateProgress, scanCancelled } =
  scanSlice.actions;
export { cancelScan };

export default scanSlice.reducer;
