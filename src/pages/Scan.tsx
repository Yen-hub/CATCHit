import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  scanUrl,
  scanFile,
  clearScan,
  clearError,
  cancelScan,
} from "@/store/scanSlice";
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
import { useNavigate } from "react-router-dom";
import { saveScanResult } from "@/lib/scanStorage";

type ScanType = "url" | "file";

const Scan = () => {
  const dispatch = useAppDispatch();
  const { currentScan, loading, error } = useAppSelector((state) => state.scan);
  const [scanType, setScanType] = useState<ScanType>("url");
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [showIterateDialog, setShowIterateDialog] = useState(false);
  const navigate = useNavigate();
  const [wasCancelled, setWasCancelled] = useState(false);
  const [useCustomFileScanner, setUseCustomFileScanner] = useState(false);

  useEffect(() => {
    if (error) {
      if (error === "Scan cancelled by user") {
        setWasCancelled(true);
      } else {
        setWasCancelled(false);
        toast({
          title: "Scan Error",
          description: error,
          variant: "destructive",
        });
      }
      // dispatch(clearError()); // <-- REMOVE THIS LINE
    }
  }, [error, toast, dispatch]);

  // Error UI for scan errors or cancellation
  const renderError = () => {
    // Custom message for VirusTotal busy case
    const isVTBusy =
      error &&
      error.includes(
        "VirusTotal did not return a valid or complete file analysis"
      );
    return (
      <CyberCard
        className={`my-8 text-center border ${
          wasCancelled
            ? "border-yellow-500 bg-yellow-500/10"
            : "border-red-500 bg-red-500/10"
        }`}
      >
        <AlertTriangle
          className={`h-10 w-10 mx-auto mb-2 ${
            wasCancelled ? "text-yellow-500" : "text-red-500"
          }`}
        />
        <h2
          className={`text-xl font-bold mb-2 ${
            wasCancelled ? "text-yellow-400" : "text-red-400"
          }`}
        >
          {wasCancelled ? "Scan Cancelled" : "Scan Failed"}
        </h2>
        <p className="text-gray-300 mb-4">
          {wasCancelled ? (
            "The scan was cancelled. You can retry or start a new scan."
          ) : isVTBusy ? (
            <>
              VirusTotal scanners are likely busy and could not process your
              file at this time.
              <br />
              Please try again later, or submit a different file.
            </>
          ) : (
            error
          )}
        </p>
        <CyberButton onClick={resetScan}>Try Again</CyberButton>
      </CyberCard>
    );
  };

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
      let scanPayload;
      if (scanType === "url") {
        scanPayload = await dispatch(scanUrl(url)).unwrap();
        console.log("[Scan] URL scan result:", scanPayload);
      } else if (selectedFile) {
        scanPayload = await dispatch(
          scanFile({ file: selectedFile, forceBackend: useCustomFileScanner })
        ).unwrap();
        console.log("[Scan] File scan result:", scanPayload);
      }
      // Do NOT call saveScanResult here; Redux state is already synced from SQLite by the thunk
    } catch (error) {
      // Error handling is done through the error state
      console.error("[Scan] Error during scan:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes

      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description:
            "Maximum file size is 100MB. Please select a smaller file.",
          variant: "destructive",
        });
        e.target.value = ""; // Clear the file input
        return;
      }

      setSelectedFile(file);
    }
  };

  const resetScan = () => {
    dispatch(clearScan());
    if (scanType === "url") {
      setUrl("");
    } else {
      setSelectedFile(null);
    }
    dispatch(clearError());
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

        {error ? (
          renderError()
        ) : (
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
                        <label
                          htmlFor="url"
                          className="block text-gray-400 mb-2"
                        >
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
                          Scan any suspicious URL for malware, phishing, and
                          other threats.
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
                              loading.scan
                                ? "opacity-50 pointer-events-none"
                                : ""
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

                    {/* File scan warning and toggle (only for file scan UI) */}
                    {scanType === "file" && (
                      <div className="mb-4">
                        <CyberCard className="bg-yellow-900/20 border-yellow-600 text-yellow-300 flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4">
                          <div>
                            <strong>Notice:</strong> You are online and by
                            default file scans use VirusTotal's cloud antivirus
                            engines.
                            <br />
                            <span className="text-yellow-200">
                              VirusTotal scanners are often very busy and your
                              file may be queued for a long time or not scanned
                              at all.
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <label
                              htmlFor="toggle-custom-scanner"
                              className="text-sm font-medium"
                            >
                              Use custom file scanner instead
                            </label>
                            <input
                              id="toggle-custom-scanner"
                              type="checkbox"
                              checked={useCustomFileScanner}
                              onChange={() =>
                                setUseCustomFileScanner((v) => !v)
                              }
                              className="accent-cyber-purple h-5 w-5"
                            />
                          </div>
                        </CyberCard>
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
                    {/* Show 'queued' message if file scan is waiting in VirusTotal queue */}
                    {currentScan?.queued && (
                      <CyberCard className="mb-4 border-cyber-blue bg-cyber-blue/10 text-cyber-blue text-center">
                        <h3 className="font-bold mb-2">
                          File Accepted & Queued
                        </h3>
                        <p className="text-sm">
                          Your file has been accepted and is waiting to be
                          scanned by VirusTotal.
                          <br />
                          This may take a few moments if scanners are busy.
                        </p>
                      </CyberCard>
                    )}
                    {currentScan?.progress && (
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{currentScan.progress.stage}</span>
                          <span>{currentScan.progress.percent}%</span>
                        </div>
                        <Progress
                          value={currentScan.progress.percent}
                          className="h-2 bg-gray-800"
                        />
                      </div>
                    )}
                    <CyberSkeleton type="details" />
                    <div className="flex justify-center mt-6">
                      <CyberButton
                        size="sm"
                        variant="accent"
                        onClick={() => {
                          dispatch(cancelScan());
                        }}
                      >
                        Stop Scan
                      </CyberButton>
                    </div>
                  </div>
                )}

                {/* Show queued message after scan if still queued */}
                {!loading.scan && currentScan?.queued && (
                  <CyberCard className="my-8 border-cyber-blue bg-cyber-blue/10 text-cyber-blue text-center">
                    <h3 className="font-bold mb-2">File Accepted & Queued</h3>
                    <p className="text-sm">
                      Your file is still waiting in the VirusTotal scan queue.
                      <br />
                      This may take a few minutes if scanners are busy. If this
                      message persists, please try again later.
                    </p>
                  </CyberCard>
                )}

                {/* Existing scan result and summary UI */}
                {!loading.scan &&
                  currentScan?.status &&
                  !currentScan?.queued && (
                    <div>
                      <CyberScanResult
                        status={currentScan.status}
                        result={currentScan.target}
                        details={currentScan.result}
                        onIterate={() => setShowIterateDialog(true)}
                      />

                      {/* Show extra details for VirusTotal or backend */}
                      {(() => {
                        const scan = currentScan as any;
                        if (
                          scan.source === "virustotal" &&
                          scan.metadata?.summary
                        ) {
                          const summary = scan.metadata.summary;
                          return (
                            <CyberCard className="mt-4">
                              <h3 className="font-bold mb-2 text-cyber-blue">
                                VirusTotal Summary
                              </h3>
                              <div className="text-xs text-gray-300 break-all">
                                {summary.scanDate && (
                                  <div className="mb-2">
                                    <span className="font-semibold">
                                      Scan Date:
                                    </span>{" "}
                                    {summary.scanDate}
                                  </div>
                                )}
                                <div className="mb-2">
                                  <span className="font-semibold">
                                    Malicious Engines:
                                  </span>{" "}
                                  {summary.maliciousCount}
                                </div>
                                <div className="mb-2">
                                  <span className="font-semibold">
                                    Suspicious Engines:
                                  </span>{" "}
                                  {summary.suspiciousCount}
                                </div>
                                <div className="mb-2">
                                  <span className="font-semibold">
                                    Harmless Engines:
                                  </span>{" "}
                                  {summary.harmlessCount}
                                </div>
                                {summary.flaggedEngines.length > 0 && (
                                  <div className="mb-2">
                                    <span className="font-semibold">
                                      Flagged by:
                                    </span>
                                    <ul className="list-disc ml-6">
                                      {summary.flaggedEngines.map(
                                        (engine: any) => (
                                          <li key={engine.engine}>
                                            <span className="font-semibold">
                                              {engine.engine}:
                                            </span>{" "}
                                            {engine.category}
                                            {engine.result
                                              ? ` - ${engine.result}`
                                              : ""}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                                {summary.permalink && (
                                  <div className="mb-2">
                                    <a
                                      href={summary.permalink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-cyber-blue underline"
                                    >
                                      View full VirusTotal report
                                    </a>
                                  </div>
                                )}
                              </div>
                            </CyberCard>
                          );
                        }
                        if (scan.source === "backend" && scan.metadata) {
                          return (
                            <CyberCard className="mt-4">
                              <h3 className="font-bold mb-2 text-cyber-purple">
                                Backend Details
                              </h3>
                              <div className="text-xs text-gray-300 break-all">
                                <pre className="whitespace-pre-wrap">
                                  {JSON.stringify(scan.metadata, null, 2)}
                                </pre>
                              </div>
                            </CyberCard>
                          );
                        }
                        return null;
                      })()}

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
                      Enter any suspicious URL to check if it's safe. Our
                      scanner detects phishing attempts, malware distribution,
                      and other web threats.
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
        )}
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
