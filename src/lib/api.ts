import { ThreatStatus } from "@/components/CyberScanResult";

const API_BASE_URL = "http://127.0.0.1:5000";

interface ScanUrlResponse {
  url: string;
  classification: string;
  is_malicious: boolean;
  confidence: number;
}

interface FileResponse {
  file_name: string;
  file_size: number;
  hashes: {
    md5: string;
    sha1: string;
    sha256: string;
  };
  is_malicious: boolean;
  scan_results: {
    check: string;
    status: string;
    severity: string;
    message: string;
  }[];
  threat_level: string;
}

interface ScanHistoryItem {
  id: number;
  target: string;
  timestamp: string;
  status: ThreatStatus;
  threatType?: string;
}

interface ErrorResponse {
  error: string;
  message: string;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({
      error: "Unknown Error",
      message: "An unexpected error occurred",
    }));

    if (response.status === 429) {
      throw new ApiError(
        "Rate limit exceeded. Please try again later.",
        response.status
      );
    }

    throw new ApiError(errorData.message || "Request failed", response.status);
  }

  return response.json();
}

export const api = {
  async scanUrl(url: string): Promise<Response> {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ url }),
      });

      return handleResponse<Response>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to connect to scan service");
    }
  },

  async scanFile(file: File): Promise<FileResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/scan/file`, {
        method: "POST",
        body: formData,
      });
      return handleResponse<FileResponse>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to upload file for scanning");
    }
  },

  async getHistory(): Promise<ScanHistoryItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/history`);
      return handleResponse<ScanHistoryItem[]>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch scan history");
    }
  },

  async getScanDetails(id: string): Promise<FileResponse | ScanUrlResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/${id}`);
      return handleResponse<FileResponse | ScanUrlResponse>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch scan details");
    }
  },

  async submitForAnalysis(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/scan/${id}/analyze`, {
        method: "POST",
      });
      return handleResponse<{ message: string }>(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to submit for analysis");
    }
  },
};
