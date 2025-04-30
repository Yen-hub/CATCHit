import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberSkeleton from "@/components/CyberSkeleton";
import CyberScanResult from "@/components/CyberScanResult";
import { Shield } from "lucide-react";

const History = () => {
  const { history, loading } = useSelector((state: RootState) => state.scan);

  // Group scans by date
  const groupedScans = React.useMemo(() => {
    const groups = history.reduce((acc, scan) => {
      const date = new Date(scan.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(scan);
      return acc;
    }, {} as Record<string, typeof history>);

    return Object.entries(groups).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  }, [history]);

  if (loading.history) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <CyberSkeleton className="h-8 w-48" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <CyberCard key={i} className="mb-4 p-4">
            <CyberSkeleton className="h-16" />
          </CyberCard>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Shield className="h-8 w-8 text-cyber-purple" />
        <h1 className="text-3xl font-bold cyber-text-glow">Scan History</h1>
      </div>

      {history.length === 0 ? (
        <CyberCard className="p-6 text-center">
          <p className="text-gray-400 mb-4">No scan history available</p>
          <Link
            to="/dashboard/scan"
            className="inline-block text-cyber-purple-light hover:text-cyber-purple transition-colors"
          >
            Start your first scan
          </Link>
        </CyberCard>
      ) : (
        <div className="space-y-8">
          {groupedScans.map(([date, scans]) => (
            <div key={date}>
              <h2 className="text-xl font-semibold mb-4 text-gray-300">
                {date}
              </h2>
              <div className="grid gap-4">
                {scans.map((scan) => (
                  <Link
                    key={scan.id}
                    to={`/dashboard/scan/${scan.id}`}
                    className="block transition-transform hover:scale-[1.01]"
                  >
                    <CyberScanResult
                      status={scan.status}
                      result={scan.target}
                      details={`Scanned at ${new Date(
                        scan.timestamp
                      ).toLocaleTimeString()} • ${
                        scan.threatType || "Unknown type"
                      }`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
