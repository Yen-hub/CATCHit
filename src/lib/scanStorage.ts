// Clean storage module for scan results using Tauri's invoke API
// import { invoke } from '@tauri-apps/api/tauri';
import { invoke } from "@tauri-apps/api/core";

export interface ScanResult {
  id: string;
  target: string;
  status: string;
  result: string;
  threatType?: string;
  timestamp: string;
  [key: string]: any;
}

// Save a scan result to SQLite
export async function saveScanResult(
  scan: Omit<ScanResult, "id">
): Promise<string> {
  if (!(window as any).__TAURI__ || typeof invoke !== "function") {
    // Not running in Tauri, skip saving and return a mock id
    console.warn("[scanStorage] saveScanResult called in browser, skipping.");
    return Promise.resolve("browser-mock-id");
  }
  // Returns the inserted scan's ID
  return await invoke<string>("save_scan_result", { scan });
}

// Get all scan history from SQLite
export async function getScanHistory(): Promise<ScanResult[]> {
  if (!(window as any).__TAURI__ || typeof invoke !== "function") {
    // Not running in Tauri, return empty array or mock data
    return [];
  }
  return await invoke<ScanResult[]>("get_scan_history");
}

// Get a scan by ID from SQLite
export async function getScanById(id: string): Promise<ScanResult | null> {
  if (!(window as any).__TAURI__ || typeof invoke !== "function") {
    return null;
  }
  return await invoke<ScanResult | null>("get_scan_by_id", { id });
}
