"use client"

import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import Webcam from 'react-webcam';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (url: string) => void;
  repairId?: string;
}

export function PhotoUploadModal({ isOpen, onClose, onUploadSuccess, repairId }: PhotoUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const uploadCapturedImage = async () => {
    if (!capturedImage) return;
    const res = await fetch(capturedImage);
    const blob = await res.blob();
    const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      if (repairId) {
        formData.append('repairId', repairId);
      }
      formData.append('photo', file);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      const response = await fetch(`${API_URL}/v1/uploads/image`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        onUploadSuccess(data.url);
        onClose();
        setCapturedImage(null);
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-foreground">Upload Device Photo</h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'upload' ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]' : 'text-muted-foreground hover:bg-muted/50'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload File
          </button>
          <button
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'camera' ? 'text-[#4F46E5] border-b-2 border-[#4F46E5]' : 'text-muted-foreground hover:bg-muted/50'}`}
            onClick={() => setActiveTab('camera')}
          >
            Use Webcam
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'upload' ? (
            <div className="flex flex-col items-center justify-center py-8">
              <label className={`w-full h-40 border-2 border-dashed border-border rounded-xl bg-[#F8FAFC] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <div className="flex items-center justify-center h-12 w-12 bg-white rounded-full shadow-sm text-[#4F46E5]">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-center mt-2">
                  <span className="text-[14px] font-bold text-foreground">{isUploading ? 'Uploading...' : 'Click to select a file'}</span>
                  <p className="text-[12px] text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
                </div>
              </label>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full">
              {!capturedImage ? (
                <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      onClick={capture}
                      className="h-12 w-12 bg-white rounded-full border-4 border-muted-foreground/30 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                    >
                      <Camera className="h-5 w-5 text-black" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex gap-3 justify-center">
                    <button
                      onClick={retake}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-semibold backdrop-blur-md transition-colors"
                      disabled={isUploading}
                    >
                      Retake
                    </button>
                    <button
                      onClick={uploadCapturedImage}
                      className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-lg text-sm font-semibold flex items-center gap-1 transition-colors shadow-sm"
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : <><Check className="h-4 w-4" /> Use Photo</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default PhotoUploadModal;