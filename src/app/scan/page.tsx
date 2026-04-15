"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Video, Upload, ArrowLeft } from "lucide-react";

export default function ScanMenuPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    
    // Create a canvas to capture the frame
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    const base64Image = canvas.toDataURL("image/jpeg");
    processImage(base64Image);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const processImage = (base64Image: string) => {
    setIsScanning(true);
    console.log(base64Image.substring(0, 20));
    
    // Simulating API call... in the MVP, we just navigate to results after 3s
    setTimeout(() => {
      // Pass image metadata if needed, but for now we just push.
      // E.g., localStorage.setItem('lastScan', base64Image);
      stopCamera();
      router.push("/results");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background bio-luminous-bg text-foreground flex flex-col relative overflow-hidden">
      {/* Top Header */}
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={() => router.back()} className="text-white hover:opacity-80 drop-shadow-md">
          <ArrowLeft className="w-8 h-8" />
        </button>
        <span className="text-white font-semibold tracking-wider text-sm drop-shadow-md">
          SCAN MENU
        </span>
        <div className="w-8 h-8" /> {/* Spacer */}
      </header>

      {/* Viewfinder Area */}
      <main className="flex-grow relative bg-black/90 flex items-center justify-center">
        {!isCameraActive && !isScanning && (
          <div className="text-white/50 text-center animate-pulse p-4">
            Initializing camera...<br/>
            <span className="text-xs">Please allow camera permissions.</span>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute w-full h-full object-cover transition-opacity duration-700 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Scanning Overlay Animation */}
        {isScanning && (
          <div className="absolute inset-0 bg-emerald-900/30 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 border-2 border-emerald-400 rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-white shadow-[0_0_20px_4px_rgba(16,185,129,0.8)] animate-[scan_2s_ease-in-out_infinite_alternate]" />
            </div>
            <div className="mt-8 text-white font-semibold text-xl tracking-wide drop-shadow-lg animate-pulse">
              Analyzing menu...
            </div>
            <p className="mt-2 text-white/70 text-sm">Extracting dishes & matching nutrition</p>
          </div>
        )}

        {/* Framing Guides */}
        {!isScanning && (
          <div className="absolute pointer-events-none inset-0 z-10 p-8 flex items-center justify-center">
            <div className="w-full max-w-sm aspect-[3/4] border-2 border-white/20 rounded-3xl relative">
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-3xl opacity-70" />
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-3xl opacity-70" />
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-3xl opacity-70" />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-3xl opacity-70" />
            </div>
          </div>
        )}
      </main>

      {/* Controls Container */}
      <div className="w-full z-40 bg-background/80 backdrop-blur-2xl rounded-t-[3rem] p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="flex justify-evenly items-center max-w-sm mx-auto">
          {/* Upload Button */}
          <div className="flex flex-col items-center gap-2">
            <label className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary cursor-pointer hover:bg-emerald-50 transition-colors">
              <Upload className="w-6 h-6" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Upload</span>
          </div>

          {/* Primary Shutter Button */}
          <button 
            onClick={handleCapture}
            disabled={isScanning}
            className="relative flex items-center justify-center group disabled:opacity-50 transition-opacity"
          >
            <div className="absolute w-20 h-20 rounded-full border-[3px] border-emerald-500/50" />
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:bg-primary-container transition-colors shadow-lg shadow-emerald-500/20">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </button>

          {/* Video Button (Decorative for MVP) */}
          <div className="flex flex-col items-center gap-2">
            <button className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-emerald-50 transition-colors pointer-events-none opacity-50">
              <Video className="w-6 h-6" />
            </button>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold opacity-50">Video</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
      `}</style>
    </div>
  );
}
