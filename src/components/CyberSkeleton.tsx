import React from "react";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface CyberSkeletonProps {
  className?: string;
  type?: "card" | "text" | "table" | "details";
}

const CyberSkeleton = ({ className, type = "card" }: CyberSkeletonProps) => {
  if (type === "text") {
    return (
      <div
        className={cn(
          "h-4 bg-cyber-purple/10 rounded animate-pulse",
          className
        )}
      />
    );
  }

  if (type === "table") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-8 bg-cyber-purple/10 rounded animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-cyber-purple/5 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === "details") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-cyber-purple/10 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-cyber-purple/10 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-cyber-purple/5 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-20 bg-cyber-purple/5 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-cyber-purple/5 rounded animate-pulse" />
            <div className="h-12 bg-cyber-purple/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-6 border border-cyber-purple/20 rounded-md bg-cyber-dark/75 backdrop-blur-sm relative overflow-hidden",
        className
      )}
    >
      <div className="flex justify-center items-center h-full min-h-[200px]">
        <Shield className="h-16 w-16 text-cyber-purple animate-pulse" />
      </div>
      <div className="absolute inset-0 cyber-grid-bg opacity-5" />
      <div className="data-stream" />
    </div>
  );
};

export default CyberSkeleton;
