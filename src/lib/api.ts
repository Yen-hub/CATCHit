import { ThreatStatus } from "@/components/CyberScanResult";
import { invoke } from "@tauri-apps/api/core";

const API_BASE_URL = "http://127.0.0.1:5000";

interface ScanUrlResponse {
  confidence: number;
  features: {
    fragment_length: number;
    has_archive: number;
    has_balanced_slashes: number;
    has_common_domain: number;
    has_common_path: number;
    has_common_tld: number;
    has_doc: number;
    has_executable: number;
    has_https: number;
    has_port: number;
    has_redirect: number;
    has_script: number;
    has_standard_chars: number;
    has_standard_port: number;
    has_standard_scheme: number;
    has_standard_subdomain: number;
    has_suspicious_domain: number;
    has_suspicious_path: number;
    has_suspicious_query: number;
    has_suspicious_tld: number;
    has_suspicious_words: number;
    is_ip: number;
    is_short_url: number;
    length: number;
    num_digits: number;
    num_dots: number;
    num_special: number;
    path_length: number;
    query_length: number;
    subdomain_depth: number;
  };
  is_malicious: boolean;
  type: string;
}

interface FileResponse {
  overall_safe: boolean;
  scan_details: {
    ExtensionScanner: {
      extension: string;
      is_high_risk: boolean;
    };
    MimeTypeScanner: {
      mime_type: string;
    };
    SignatureScanner: {
      detected_signature: string;
    };
    HashScanner: {
      sha256: string;
    };
    ArchiveScanner: {
      is_archive: boolean;
      compression_bomb_check?: boolean;
      nested_archive_check?: boolean;
    };
    CodeInjectionScanner: {
      reason: string;
    };
  };
  warnings: string[];
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
  async scanUrl(url: string): Promise<ScanUrlResponse> {
    try {
      console.log("Sending URL scan request:", { url });
      const response = await fetch(`${API_BASE_URL}/scan/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await handleResponse<ScanUrlResponse>(response);
      console.log("URL scan response:", data);
      return data;
    } catch (error) {
      console.error("URL scan error:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to connect to scan service");
    }
  },

  async scanFile(file: File): Promise<FileResponse> {
    try {
      console.log("Sending file scan request:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      // First use Tauri to read the file and get metadata
      const buffer = await file.arrayBuffer();
      const fileData = Array.from(new Uint8Array(buffer));

      // Create form data to send to Flask backend
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/scan/file`, {
        method: "POST",
        body: formData,
      });

      const data = await handleResponse<FileResponse>(response);
      console.log("File scan response:", data);
      return data;
    } catch (error) {
      console.error("File scan error:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to scan file");
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
