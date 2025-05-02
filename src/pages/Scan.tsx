import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { scanUrl, scanFile, clearScan, clearError } from "@/store/scanSlice";
import CyberCard from "@/components/CyberCard";
import CyberButton from "@/components/CyberButton";
import CyberInput from "@/components/CyberInput";
import CyberScanResult from "@/components/CyberScanResult";
import CyberSkeleton from "@/components/CyberSkeleton";
import { Link, File, Upload, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ScanType = "url" | "file";

const Scan = () => {
  const dispatch = useAppDispatch();
  const { currentScan, loading, error } = useAppSelector((state) => state.scan);
  const [scanType, setScanType] = useState<ScanType>("url");
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [showIterateDialog, setShowIterateDialog] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        title: "Scan Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  const handleScan = async () => {
    if (scanType === "url" && !url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scan.",
        variant: "destructive",
      });
      return;
    }

    if (scanType === "file" && !selectedFile) {
      toast({
        title: "File Required",
        description: "Please select a file to scan.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Scanning ${scanType === "url" ? "URL" : "File"}`,
      description: `Analyzing ${
        scanType === "url" ? url : selectedFile?.name
      } for threats...`,
    });

    try {
      if (scanType === "url") {
        await dispatch(scanUrl(url)).unwrap();
      } else if (selectedFile) {
        await dispatch(scanFile(selectedFile)).unwrap();
      }
      setShowIterateDialog(true);
    } catch (error) {
      // Error handling is done through the error state
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetScan = () => {
    dispatch(clearScan());
    if (scanType === "url") {
      setUrl("");
    } else {
      setSelectedFile(null);
    }
  };

  const handleIterate = () => {
    setShowIterateDialog(false);
    resetScan();
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl md:text-3xl font-bold cyber-text-glow mb-6">
          Scan
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CyberCard className="mb-6">
              <div className="mb-6 border-b border-cyber-purple/20 pb-4">
                <div className="flex space-x-2">
                  <button
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      scanType === "url"
                        ? "border-cyber-purple bg-cyber-purple/10 text-cyber-purple-light"
                        : "border-gray-700 text-gray-400 hover:border-cyber-purple/30"
                    }`}
                    onClick={() => {
                      setScanType("url");
                      resetScan();
                    }}
                    disabled={loading.scan}
                  >
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      URL Scan
                    </div>
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      scanType === "file"
                        ? "border-cyber-purple bg-cyber-purple/10 text-cyber-purple-light"
                        : "border-gray-700 text-gray-400 hover:border-cyber-purple/30"
                    }`}
                    onClick={() => {
                      setScanType("file");
                      resetScan();
                    }}
                    disabled={loading.scan}
                  >
                    <div className="flex items-center">
                      <File className="h-4 w-4 mr-2" />
                      File Scan
                    </div>
                  </button>
                </div>
              </div>

              {!currentScan.isScanning && !currentScan.status && (
                <div>
                  {scanType === "url" ? (
                    <div className="mb-6">
                      <label htmlFor="url" className="block text-gray-400 mb-2">
                        Enter URL to scan
                      </label>
                      <CyberInput
                        id="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading.scan}
                      />
                      <p className="text-gray-500 text-sm mt-2">
                        Scan any suspicious URL for malware, phishing, and other
                        threats.
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <label
                        htmlFor="file"
                        className="block text-gray-400 mb-2"
                      >
                        Select file to scan
                      </label>
                      <div className="flex gap-4 items-center">
                        <div className="flex-1 overflow-hidden">
                          <CyberInput
                            id="fileName"
                            placeholder="No file selected"
                            value={selectedFile?.name || ""}
                            readOnly
                            disabled={loading.scan}
                          />
                        </div>
                        <label
                          htmlFor="file-upload"
                          className={`inline-flex cursor-pointer ${
                            loading.scan ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          <CyberButton
                            size="sm"
                            variant="accent"
                            type="button"
                            onClick={() => {
                              document.getElementById("file-upload")?.click();
                            }}
                          >
                            <Upload className="h-4 w-4 mr-1" /> Browse
                          </CyberButton>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="hidden"
                            accept="*/*"
                            onChange={handleFileChange}
                            disabled={loading.scan}
                          />
                        </label>
                      </div>
                      <p className="text-gray-500 text-sm mt-2">
                        Scan any file for viruses, malware, and other threats.
                      </p>
                    </div>
                  )}

                  <div className="text-center">
                    <CyberButton
                      size="sm"
                      variant="primary"
                      onClick={handleScan}
                      disabled={loading.scan}
                    >
                      Start Scan
                    </CyberButton>
                  </div>
                </div>
              )}

              {loading.scan && (
                <div className="py-8">
                  {currentScan.progress && (
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{currentScan.progress.stage}</span>
                        <span>{currentScan.progress.percent}%</span>
                      </div>
                      <Progress
                        value={currentScan.progress.percent}
                        className="w-full"
                      />
                    </div>
                  )}
                  <CyberSkeleton type="details" />
                </div>
              )}

              {!loading.scan && currentScan.status && (
                <div>
                  <CyberScanResult
                    status={currentScan.status}
                    result={currentScan.target}
                    details={currentScan.result}
                    onIterate={() => setShowIterateDialog(true)}
                  />

                  <div className="flex justify-center mt-6 space-x-4">
                    <CyberButton size="sm" onClick={resetScan}>
                      New Scan
                    </CyberButton>

                    {currentScan.status !== "safe" && (
                      <CyberButton size="sm" variant="accent">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Submit for Analysis
                      </CyberButton>
                    )}
                  </div>
                </div>
              )}
            </CyberCard>
          </div>

          <div className="lg:col-span-1">
            <CyberCard>
              <h2 className="text-xl font-bold cyber-text-glow mb-4">
                Scan Guide
              </h2>

              <div className="space-y-4">
                <div className="p-3 bg-cyber-dark/50 rounded-md">
                  <h3 className="font-semibold mb-1 flex items-center">
                    <Link className="h-4 w-4 mr-2 text-cyber-blue" />
                    URL Scanning
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Enter any suspicious URL to check if it's safe. Our scanner
                    detects phishing attempts, malware distribution, and other
                    web threats.
                  </p>
                </div>

                <div className="p-3 bg-cyber-dark/50 rounded-md">
                  <h3 className="font-semibold mb-1 flex items-center">
                    <File className="h-4 w-4 mr-2 text-cyber-orange" />
                    File Scanning
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Upload any file to check for viruses, malware, and other
                    threats. Our scanner analyzes the content to ensure it's
                    safe to open.
                  </p>
                </div>

                <div className="p-3 bg-cyber-dark/50 rounded-md">
                  <h3 className="font-semibold mb-1 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-cyber-purple" />
                    Scan Technology
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Our advanced scanning technology uses AI and threat
                    intelligence to detect even the newest threats with high
                    accuracy.
                  </p>
                </div>
              </div>
            </CyberCard>
          </div>
        </div>
      </div>

      <AlertDialog open={showIterateDialog} onOpenChange={setShowIterateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Continue Scanning?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to perform another{" "}
              {scanType === "url" ? "URL" : "file"} scan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowIterateDialog(false)}>
              No, I'm done
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleIterate}>
              Yes, continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Scan;
