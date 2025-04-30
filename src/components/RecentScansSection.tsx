import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Link } from "react-router-dom";
import CyberCard from "./CyberCard";
import CyberSkeleton from "./CyberSkeleton";
import CyberScanResult from "./CyberScanResult";

const RecentScansSection = () => {
  const { history, loading } = useSelector((state: RootState) => state.scan);
  const recentScans = history.slice(0, 5); // Show only the 5 most recent scans

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold cyber-text-glow">Recent Scans</h2>
        <Link
          to="/dashboard/history"
          className="text-cyber-purple-light hover:text-cyber-purple transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid gap-4">
        {loading.history ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <CyberCard key={i} className="p-4">
              <CyberSkeleton className="h-16" />
            </CyberCard>
          ))
        ) : recentScans.length > 0 ? (
          recentScans.map((scan) => (
            <Link
              key={scan.id}
              to={`/dashboard/scan/${scan.id}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <CyberScanResult
                status={scan.status}
                result={scan.target}
                details={`Scanned on ${new Date(
                  scan.timestamp
                ).toLocaleString()}`}
              />
            </Link>
          ))
        ) : (
          <CyberCard className="p-6 text-center">
            <p className="text-gray-400">No scans performed yet</p>
            <Link
              to="/dashboard/scan"
              className="inline-block mt-4 text-cyber-purple-light hover:text-cyber-purple transition-colors"
            >
              Start your first scan
            </Link>
          </CyberCard>
        )}
      </div>
    </section>
  );
};

export default RecentScansSection;
