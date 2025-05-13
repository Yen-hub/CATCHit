import React from "react";
import {
  Shield,
  Menu,
  Settings,
  LayoutDashboard,
  Search,
  AlertTriangle,
  ShieldAlert,
  History,
} from "lucide-react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const location = useLocation();

  React.useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: ShieldAlert, label: "Scan", path: "/dashboard/scan" },
    { icon: AlertTriangle, label: "Threats", path: "/dashboard/threats" },
    { icon: History, label: "History", path: "/dashboard/history" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-black">
      {/* Mobile menu button - only visible on small screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-cyber-dark/90 p-2 rounded-md border border-cyber-purple/30"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-6 w-6 text-cyber-purple-light" />
      </button>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - desktop version and mobile version */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40 bg-cyber-dark border-r border-cyber-purple/20 h-full transition-all duration-300 flex flex-col",
          collapsed ? "w-16" : "w-64",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-4 flex items-center">
          <Shield
            className={cn(
              "h-8 w-8 text-cyber-purple animate-pulse-glow",
              collapsed ? "mx-auto" : "mr-3"
            )}
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider cyber-text-glow">
                CATCH<span className="text-cyber-orange">it</span>
              </span>
              <span className="text-[10px] text-gray-400 -mt-1">
                CYBER GUARDIAN
              </span>
            </div>
          )}
        </div>

        <div className="neon-line my-2"></div>

        {/* Online/Offline Indicator */}
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2",
            collapsed ? "justify-center" : "justify-start"
          )}
          title={isOnline ? "Online" : "Offline"}
        >
          <span
            className={cn(
              "w-3 h-3 rounded-full",
              isOnline ? "bg-green-500" : "bg-red-500",
              "border border-cyber-purple/40"
            )}
          ></span>
          {!collapsed && (
            <span
              className={cn(
                "text-xs font-semibold",
                isOnline ? "text-green-400" : "text-red-400"
              )}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          )}
        </div>

        <div className="neon-line my-2"></div>

        {/* Nav Menu */}
        <nav className="flex-1 mt-6 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-cyber-purple/20 scrollbar-track-transparent">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center p-2 rounded-md transition-colors group",
                      isActive
                        ? "bg-cyber-purple/20 text-cyber-purple-light"
                        : "text-gray-400 hover:bg-cyber-purple/10 hover:text-cyber-purple-light",
                      collapsed && "justify-center"
                    )
                  }
                >
                  <item.icon
                    className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle button - only visible on desktop */}
        <div className="p-4 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="cyber-button w-full flex items-center justify-center p-2"
          >
            <Menu className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="cyber-grid-bg min-h-screen">
          <div className="scan-line"></div>
          <div className="data-stream"></div>
          <div className="py-4 lg:py-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
