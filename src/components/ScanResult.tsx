import React from "react";
import { ScanResult as ScanResultType } from "../types/scan";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface ScanResultProps {
  result: ScanResultType;
}

export const ScanResult: React.FC<ScanResultProps> = ({ result }) => {
  const getStatusIcon = () => {
    switch (result.status) {
      case "safe":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "danger":
        return <Shield className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case "safe":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "danger":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Scan Results</CardTitle>
          <Badge className={getStatusColor()}>
            {result.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div>
              <h3 className="font-semibold">Target</h3>
              <p className="text-sm text-gray-600">{result.target}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Analysis Result</h3>
            <p className="text-sm text-gray-600">{result.result}</p>
          </div>

          {result.details && (
            <Alert className={getStatusColor()}>
              <AlertTitle>Details</AlertTitle>
              <AlertDescription>{result.details}</AlertDescription>
            </Alert>
          )}

          <div>
            <h3 className="font-semibold">Security Score</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  result.securityScore >= 80
                    ? "bg-green-500"
                    : result.securityScore >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${result.securityScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {result.securityScore}% Secure
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Timestamp</h3>
            <p className="text-sm text-gray-600">
              {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
