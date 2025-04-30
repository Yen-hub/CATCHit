import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { loadPersistedState } from "@/store/scanSlice";
import CyberCard from "@/components/CyberCard";
import { Link } from "react-router-dom";
import { Shield, Zap, AlertTriangle } from "lucide-react";
import RecentScansSection from "@/components/RecentScansSection";
import CyberSkeleton from "@/components/CyberSkeleton";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { history, loading } = useSelector((state: RootState) => state.scan);

  React.useEffect(() => {
    dispatch(loadPersistedState());
  }, [dispatch]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalScans = history.length;
    const threatsDetected = history.filter(
      (scan) => scan.status === "danger" || scan.status === "warning"
    ).length;
    const safeScans = history.filter((scan) => scan.status === "safe").length;

    return {
      totalScans,
      threatsDetected,
      safeScans,
      threatPercentage: totalScans
        ? ((threatsDetected / totalScans) * 100).toFixed(1)
        : "0",
    };
  }, [history]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 cyber-text-glow">
        Security Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CyberCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-cyber-purple/10">
              <Shield className="h-8 w-8 text-cyber-purple" />
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Total Scans</h3>
              {loading.history ? (
                <CyberSkeleton className="h-8 w-20 mt-1" />
              ) : (
                <p className="text-2xl font-bold cyber-text-glow">
                  {stats.totalScans}
                </p>
              )}
            </div>
          </div>
        </CyberCard>

        <CyberCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-red-500/10">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Threats Detected</h3>
              {loading.history ? (
                <CyberSkeleton className="h-8 w-20 mt-1" />
              ) : (
                <div>
                  <p className="text-2xl font-bold cyber-text-glow">
                    {stats.threatsDetected}
                  </p>
                  <p className="text-sm text-gray-400">
                    {stats.threatPercentage}% of all scans
                  </p>
                </div>
              )}
            </div>
          </div>
        </CyberCard>

        <CyberCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-md bg-green-500/10">
              <Zap className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-sm text-gray-400">Safe Scans</h3>
              {loading.history ? (
                <CyberSkeleton className="h-8 w-20 mt-1" />
              ) : (
                <p className="text-2xl font-bold cyber-text-glow">
                  {stats.safeScans}
                </p>
              )}
            </div>
          </div>
        </CyberCard>
      </div>

      {/* Recent Scans */}
      <RecentScansSection />
    </div>
  );
};

export default Dashboard;
