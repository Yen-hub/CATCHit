import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function setupNotifications(): Promise<boolean> {
  let permissionGranted = await isPermissionGranted();
  console.log("Permission Granted: ", permissionGranted);
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === "granted";
  }
  return permissionGranted;
}

export async function showNotification(title: string, body: string) {
  try {
    await sendNotification({ title, body });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}

export async function sendWindowsNotification(title: string, body: string) {
  const permissionGranted = await isPermissionGranted();
  if (permissionGranted) {
    await sendNotification({
      title,
      body,
    });
    return true;
  }
  return false;
}

// Utility to check online status
export function isOnline(): boolean {
  return typeof navigator !== "undefined" ? navigator.onLine : true;
}
