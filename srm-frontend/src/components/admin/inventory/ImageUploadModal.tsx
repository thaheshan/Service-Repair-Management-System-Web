"use client";

import React, { useState, useRef } from "react";
import { Camera, Image as ImageIcon, X, RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (base64Url: string) => void;
  title?: string;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = "Upload Product Image",
}) => {
  const [activeTab, setActiveTab] = useState<"gallery" | "camera">("gallery");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleClose = () => {
    stopCamera();
    setPreviewUrl(null);
    onClose();
  };

  const compressAndSetImage = (dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 600;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.75);
        setPreviewUrl(compressed);
      } else {
        setPreviewUrl(dataUrl);
      }
    };
    img.src = dataUrl;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        compressAndSetImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setActiveTab("camera");
    setPreviewUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 640 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      toast.error("Could not access camera. Please check permissions or upload from gallery.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 400;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      compressAndSetImage(dataUrl);
      stopCamera();
    }
  };

  const handleSave = () => {
    if (!previewUrl) {
      toast.error("Please select or capture an image first.");
      return;
    }
    onSelectImage(previewUrl);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 font-medium">Select photo from gallery or snap with camera</p>
          </div>
          <button
            onClick={handleClose}
            className="h-8 w-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1">
          <button
            onClick={() => {
              stopCamera();
              setActiveTab("gallery");
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === "gallery"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <ImageIcon className="h-4 w-4 text-purple-600" />
            <span>Upload from Gallery</span>
          </button>
          <button
            onClick={startCamera}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              activeTab === "camera"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Camera className="h-4 w-4 text-emerald-600" />
            <span>Capture Camera</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[260px] bg-slate-50/50">
          {activeTab === "gallery" && (
            <div className="w-full flex flex-col items-center">
              {previewUrl ? (
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-md group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-purple-500 hover:bg-purple-50/30 transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-black text-slate-800 mb-1">Click to browse image file</p>
                  <p className="text-[10px] text-slate-400 font-bold">Supports PNG, JPG, WEBP (Max 5MB)</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {activeTab === "camera" && (
            <div className="w-full flex flex-col items-center">
              {previewUrl ? (
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md">
                  <img src={previewUrl} alt="Captured" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      startCamera();
                    }}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 text-white rounded-full text-[10px] font-bold flex items-center gap-1 hover:bg-black transition-colors"
                  >
                    <RefreshCw className="h-3 w-3 animate-spin-once" /> Retake
                  </button>
                </div>
              ) : (
                <div className="relative w-full max-w-xs h-56 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-inner">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />

                  {isCameraActive && (
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-3 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Take Photo</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!previewUrl}
            onClick={handleSave}
            className="px-6 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all"
          >
            <Check className="h-4 w-4" />
            <span>Use This Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
