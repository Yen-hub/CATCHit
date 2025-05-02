import React, { useState, useEffect } from "react";
import CyberCard from "@/components/CyberCard";
import {
  Shield,
  Save,
  Bell,
  Clock,
  Lock,
  Monitor,
  Cpu,
  RefreshCw,
} from "lucide-react";
import CyberButton from "@/components/CyberButton";
import { useToast } from "@/hooks/use-toast";
import { setupNotifications, sendWindowsNotification } from "../lib/utils";
import { Button } from "../components/ui/button";

const Settings = () => {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState("daily");
  const [notifications, setNotifications] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [deepScan, setDeepScan] = useState(false);
  const [startupScan, setStartupScan] = useState(true);

  useEffect(() => {
    // Check notification permission on component mount
    setupNotifications().then((granted) => {
      setNotifications(granted);
    });
  }, []);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleNotificationToggle = async () => {
    if (!notifications) {
      const granted = await setupNotifications();
      setNotifications(granted);
    } else {
      setNotifications(false);
    }
  };

  const testNotification = async () => {
    if (notifications) {
      await sendWindowsNotification(
        "CATCHit Test Notification",
        "Your Windows notifications are working correctly!"
      );
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold cyber-text-glow">Settings</h1>
        <CyberButton variant="primary" onClick={handleSaveSettings}>
          <div className="flex items-center">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </div>
        </CyberButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Scan Settings */}
        <div className="col-span-1">
          <CyberCard className="mb-6">
            <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-cyber-purple-light" />
              Scan Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">
                  Scan Schedule
                </label>
                <select
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="cyber-input w-full bg-cyber-dark/50"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Once Daily</option>
                  <option value="weekly">Once Weekly</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-400">Deep Scan</label>
                <div
                  className={`relative w-12 h-6 transition-colors duration-300 rounded-full ${
                    deepScan ? "bg-cyber-purple" : "bg-cyber-dark"
                  } cursor-pointer`}
                  onClick={() => setDeepScan(!deepScan)}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-300 rounded-full bg-white ${
                      deepScan ? "transform translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-400">Scan on Startup</label>
                <div
                  className={`relative w-12 h-6 transition-colors duration-300 rounded-full ${
                    startupScan ? "bg-cyber-purple" : "bg-cyber-dark"
                  } cursor-pointer`}
                  onClick={() => setStartupScan(!startupScan)}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-300 rounded-full bg-white ${
                      startupScan ? "transform translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Exclusions</label>
                <textarea
                  className="cyber-input w-full h-24 bg-cyber-dark/50"
                  placeholder="Enter file paths or URLs to exclude from scanning, one per line"
                ></textarea>
              </div>
            </div>
          </CyberCard>

          <CyberCard>
            <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-cyber-purple-light" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-400">Enable Notifications</label>
                <div
                  className={`relative w-12 h-6 transition-colors duration-300 rounded-full ${
                    notifications ? "bg-cyber-purple" : "bg-cyber-dark"
                  } cursor-pointer`}
                  onClick={handleNotificationToggle}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-300 rounded-full bg-white ${
                      notifications ? "transform translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>

              {notifications && (
                <Button
                  onClick={testNotification}
                  className="mt-2"
                  variant="outline"
                >
                  Test Notification
                </Button>
              )}

              <div>
                <label className="block text-gray-400 mb-2">
                  Notification Level
                </label>
                <select className="cyber-input w-full bg-cyber-dark/50">
                  <option>All Events</option>
                  <option>Threats Only</option>
                  <option>Critical Only</option>
                </select>
              </div>
            </div>
          </CyberCard>
        </div>

        {/* Middle Column - System Settings */}
        <div className="col-span-1">
          <CyberCard className="mb-6">
            <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
              <Cpu className="mr-2 h-5 w-5 text-cyber-purple-light" />
              System Settings
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-400">Auto-Update Definitions</label>
                <div
                  className={`relative w-12 h-6 transition-colors duration-300 rounded-full ${
                    autoUpdate ? "bg-cyber-purple" : "bg-cyber-dark"
                  } cursor-pointer`}
                  onClick={() => setAutoUpdate(!autoUpdate)}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-300 rounded-full bg-white ${
                      autoUpdate ? "transform translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  Threat Database
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">
                    Last updated: 2025-04-05
                  </span>
                  <CyberButton size="sm">
                    <RefreshCw className="h-4 w-4 mr-1" /> Update Now
                  </CyberButton>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">CPU Usage</label>
                <select className="cyber-input w-full bg-cyber-dark/50">
                  <option>Low (Background)</option>
                  <option>Medium (Balanced)</option>
                  <option>High (Fast Scanning)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">
                  Storage Management
                </label>
                <div className="bg-cyber-dark/30 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-400">Quarantine Size</span>
                    <span className="text-cyber-blue">28.4 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Logs Size</span>
                    <span className="text-cyber-blue">156.2 MB</span>
                  </div>
                  <div className="mt-2">
                    <CyberButton size="sm" className="w-full">
                      Clear Non-essential Data
                    </CyberButton>
                  </div>
                </div>
              </div>
            </div>
          </CyberCard>

          <CyberCard>
            <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-cyber-purple-light" />
              History Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">
                  Keep History For
                </label>
                <select className="cyber-input w-full bg-cyber-dark/50">
                  <option>30 Days</option>
                  <option>60 Days</option>
                  <option>90 Days</option>
                  <option>Indefinitely</option>
                </select>
              </div>

              <div>
                <CyberButton size="sm" className="w-full">
                  Clear Scan History
                </CyberButton>
              </div>
            </div>
          </CyberCard>
        </div>

        {/* Right Column - App Settings */}
        <div className="col-span-1">
          <CyberCard className="mb-6">
            <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
              <Monitor className="mr-2 h-5 w-5 text-cyber-purple-light" />
              Application Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Theme</label>
                <select className="cyber-input w-full bg-cyber-dark/50">
                  <option>Cyberpunk (Default)</option>
                  <option>Dark Minimal</option>
                  <option>Neon Blue</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-400">Launch at Startup</label>
                <div
                  className={`relative w-12 h-6 transition-colors duration-300 rounded-full bg-cyber-purple cursor-pointer`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-300 rounded-full bg-white transform translate-x-6`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-400">Minimize to Tray</label>
                <div
                  className={`relative w-12 h-6 transition-colors duration-300 rounded-full bg-cyber-purple cursor-pointer`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 transition-transform duration-300 rounded-full bg-white transform translate-x-6`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Language</label>
                <select className="cyber-input w-full bg-cyber-dark/50">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Japanese</option>
                </select>
              </div>
            </div>
          </CyberCard>

          <CyberCard>
            <h2 className="text-xl font-bold cyber-text-glow mb-4 flex items-center">
              <Lock className="mr-2 h-5 w-5 text-cyber-purple-light" />
              About
            </h2>

            <div className="space-y-4">
              <div className="bg-cyber-dark/30 p-4 rounded-md">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="h-12 w-12 text-cyber-purple animate-pulse-glow" />
                </div>
                <p className="text-center text-lg font-bold cyber-text-glow">
                  CATCH<span className="text-cyber-orange">it</span>
                </p>
                <p className="text-center text-xs text-gray-400 mb-2">
                  CYBER GUARDIAN SHIELD
                </p>
                <p className="text-center text-sm text-gray-400">
                  Version 1.0.0
                </p>
                <p className="text-center text-sm text-gray-400">
                  Build 2025.04.05.1
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  © 2025 CATCHit Security
                </p>
                <div className="flex justify-center space-x-3">
                  <a
                    href="#"
                    className="text-cyber-purple-light text-sm hover:underline"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="text-cyber-purple-light text-sm hover:underline"
                  >
                    License
                  </a>
                  <a
                    href="#"
                    className="text-cyber-purple-light text-sm hover:underline"
                  >
                    Support
                  </a>
                </div>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;
