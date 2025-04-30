import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Link } from "react-router-dom";
import CyberCard from "@/components/CyberCard";
import CyberSkeleton from "@/components/CyberSkeleton";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const Threats = () => {
  const { history, loading } = useSelector((state: RootState) => state.scan);

  // Filter and sort threats by severity and date
  const threats = React.useMemo(() => {
    return history
      .filter((scan) => scan.status === "danger" || scan.status === "warning")
      .sort((a, b) => {
        // Sort by severity first (danger before warning)
        if (a.status !== b.status) {
          return a.status === "danger" ? -1 : 1;
        }
        // Then by date (newest first)
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
  }, [history]);

  if (loading.history) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <CyberSkeleton className="h-8 w-48" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <CyberCard key={i} className="mb-4 p-4">
            <CyberSkeleton className="h-24" />
          </CyberCard>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <ShieldAlert className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold cyber-text-glow">Detected Threats</h1>
      </div>

      {threats.length === 0 ? (
        <CyberCard className="p-6">
          <div className="text-center">
            <div className="inline-flex p-3 rounded-full bg-green-500/10 mb-4">
              <AlertTriangle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-green-500">
              All Clear
            </h3>
            <p className="text-gray-400 mb-4">
              No threats have been detected in your scans
            </p>
            <Link
              to="/dashboard/scan"
              className="text-cyber-purple-light hover:text-cyber-purple transition-colors"
            >
              Run a new scan
            </Link>
          </div>
        </CyberCard>
      ) : (
        <div className="grid gap-4">
          {threats.map((threat) => (
            <Link
              key={threat.id}
              to={`/dashboard/scan/${threat.id}`}
              className="block transition-transform hover:scale-[1.01]"
            >
              <CyberCard
                className={cn(
                  "p-6 border-2",
                  threat.status === "danger"
                    ? "border-red-500/30 bg-red-500/5"
                    : "border-yellow-500/30 bg-yellow-500/5"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-md",
                      threat.status === "danger"
                        ? "bg-red-500/10"
                        : "bg-yellow-500/10"
                    )}
                  >
                    <AlertTriangle
                      className={cn(
                        "h-8 w-8",
                        threat.status === "danger"
                          ? "text-red-500"
                          : "text-yellow-500"
                      )}
                    />
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "text-xl font-bold mb-1",
                        threat.status === "danger"
                          ? "text-red-500"
                          : "text-yellow-500"
                      )}
                    >
                      {threat.threatType || "Unknown Threat"}
                    </h3>
                    <p className="text-gray-300 mb-2">{threat.target}</p>
                    <p className="text-sm text-gray-400">
                      Detected on {new Date(threat.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CyberCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Threats;
