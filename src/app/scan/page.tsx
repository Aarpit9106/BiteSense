"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Video, Upload, ArrowLeft, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ScanMenuPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
      setCameraError(false);
    } catch {
      setCameraError(true);
      setIsCameraActive(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const processImage = useCallback(
    (base64Image: string) => {
      setIsScanning(true);
      setScanStep(0);
      void base64Image; // Future: pass to AI

      // Multi-step scanning feedback
      const steps = [
        { delay: 0, step: 0 },
        { delay: 1000, step: 1 },
        { delay: 2200, step: 2 },
      ];
      steps.forEach(({ delay, step }) => {
        setTimeout(() => setScanStep(step), delay);
      });

      setTimeout(() => {
        stopCamera();
        router.push("/results");
      }, 3500);
    },
    [stopCamera, router]
  );

  const handleCapture = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/jpeg", 0.85);
    processImage(base64Image);
    toast("Captured!", { description: "Analyzing your menu now..." });
  }, [processImage]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            processImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [processImage]
  );

  const SCAN_STEPS = ["Detecting menu...", "Extracting dishes...", "Analyzing nutrition..."];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 w-full z-50 p-5 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={() => {
            stopCamera();
            router.back();
          }}
          className="rounded-full p-2 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
          Scan Menu
        </span>
        <div className="w-10" />
      </header>

      {/* Viewfinder Area */}
      <main className="flex-grow relative flex items-center justify-center">
        {/* Camera Error State */}
        {cameraError && !isScanning && (
          <div className="flex flex-col items-center text-center p-8 max-w-xs">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <ImageOff className="w-7 h-7 text-white/50" />
            </div>
            <h3 className="font-semibold text-lg">Camera not available</h3>
            <p className="text-white/50 text-sm mt-2">
              Please allow camera access or upload a photo instead.
            </p>
            <Button variant="secondary" size="md" className="mt-5" onClick={startCamera}>
              Retry Camera
            </Button>
          </div>
        )}

        {/* Camera Initializing */}
        {!isCameraActive && !isScanning && !cameraError && (
          <div className="text-white/40 text-center p-4">
            <div className="w-8 h-8 border-2 border-white/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Initializing camera...</p>
          </div>
        )}

        {/* Video Feed */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            isCameraActive ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Scanning Overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center"
            >
              <div className="relative w-56 h-56 border-2 border-emerald-400/60 rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_4px_rgba(16,185,129,0.6)] animate-scan-line" />
              </div>
              <motion.div
                key={scanStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p className="font-semibold text-base">{SCAN_STEPS[scanStep]}</p>
                <div className="flex gap-1 mt-3 justify-center">
                  {SCAN_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i <= scanStep
                          ? "w-6 bg-emerald-400"
                          : "w-2 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Framing Guides */}
        {!isScanning && isCameraActive && (
          <div className="absolute pointer-events-none inset-0 z-10 p-10 flex items-center justify-center">
            <div className="w-full max-w-xs aspect-[3/4] relative">
              {[
                "-top-0.5 -left-0.5 border-t-2 border-l-2 rounded-tl-2xl",
                "-top-0.5 -right-0.5 border-t-2 border-r-2 rounded-tr-2xl",
                "-bottom-0.5 -left-0.5 border-b-2 border-l-2 rounded-bl-2xl",
                "-bottom-0.5 -right-0.5 border-b-2 border-r-2 rounded-br-2xl",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-10 h-10 border-emerald-400/60 ${cls}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Controls */}
      <div className="w-full z-40 bg-black/80 backdrop-blur-2xl rounded-t-[2.5rem] px-8 pt-7 pb-10">
        <div className="flex justify-evenly items-center max-w-xs mx-auto">
          {/* Upload */}
          <div className="flex flex-col items-center gap-1.5">
            <label className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors active:scale-95">
              <Upload className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <span className="text-[9px] uppercase tracking-widest opacity-50 font-medium">
              Upload
            </span>
          </div>

          {/* Shutter */}
          <button
            onClick={handleCapture}
            disabled={isScanning || !isCameraActive}
            className="relative flex items-center justify-center group disabled:opacity-40 transition-opacity active:scale-95"
          >
            <div className="absolute w-[72px] h-[72px] rounded-full border-[3px] border-white/30 group-hover:border-white/50 transition-colors" />
            <div className="w-[60px] h-[60px] rounded-full bg-white flex items-center justify-center group-hover:bg-emerald-50 transition-colors shadow-lg">
              <Camera className="w-7 h-7 text-black" />
            </div>
          </button>

          {/* Video */}
          <div className="flex flex-col items-center gap-1.5 opacity-30">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <span className="text-[9px] uppercase tracking-widest font-medium">
              Video
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
