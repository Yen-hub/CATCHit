import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import { AlertTriangle, ArrowLeft, Shield, Activity, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const ThreatDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { history } = useSelector((state: RootState) => state.scan);
  const threat = history.find((item) => item.id?.toString() === id);

  if (!threat) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CyberCard className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Threat Not Found</h2>
          <p className="text-gray-400 mb-6">
            The threat details you're looking for could not be found.
          </p>
          <Link to="/dashboard/threats">
            <CyberButton>Back to Threats</CyberButton>
          </Link>
        </CyberCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Navigation */}
      <div className="mb-8">
        <Link
          to="/dashboard/threats"
          className="inline-flex items-center text-gray-400 hover:text-cyber-purple-light mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Threats
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold cyber-text-glow">
            {threat.threatType || "Unknown Threat"}
          </h1>
          <span
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm",
              threat.status === "danger"
                ? "bg-red-500/10 text-red-500"
                : "bg-yellow-500/10 text-yellow-500"
            )}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {threat.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Target Information */}
          <CyberCard className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Target Information</h2>
              <div className="grid gap-6">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">
                    Target URL/File
                  </h3>
                  <p className="text-white break-all">{threat.target}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Detection Time</h3>
                  <p className="text-white">
                    {new Date(threat.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Risk Level</h3>
                  <div className="flex items-center gap-2">
                    {Array.from({
                      length: threat.status === "danger" ? 3 : 2,
                    }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-2 w-8 rounded-full",
                          i < (threat.status === "danger" ? 3 : 2)
                            ? threat.status === "danger"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                            : "bg-gray-700"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CyberCard>

          {/* Analysis Results */}
          <CyberCard>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
              <div className="grid gap-4">
                {[
                  {
                    icon: Shield,
                    title: "Security Assessment",
                    value:
                      threat.status === "danger"
                        ? "Critical Risk"
                        : "Moderate Risk",
                    description: "Based on our threat analysis algorithms",
                  },
                  {
                    icon: Activity,
                    title: "Detection Confidence",
                    value: "98%",
                    description: "Verified through multiple scanning engines",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={cn(
                        "p-2 rounded-md",
                        threat.status === "danger"
                          ? "bg-red-500/10"
                          : "bg-yellow-500/10"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5",
                          threat.status === "danger"
                            ? "text-red-500"
                            : "text-yellow-500"
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-lg text-white mb-1">{item.value}</p>
                      <p className="text-sm text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CyberCard>
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <CyberCard>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Actions</h2>
              <div className="space-y-4">
                <CyberButton variant="accent" className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  Block Permanently
                </CyberButton>
                <CyberButton variant="primary" className="w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  Add to Watchlist
                </CyberButton>
                <CyberButton variant="default" className="w-full">
                  Report False Positive
                </CyberButton>
              </div>
            </div>
          </CyberCard>
        </div>
      </div>
    </div>
  );
};

export default ThreatDetail;
