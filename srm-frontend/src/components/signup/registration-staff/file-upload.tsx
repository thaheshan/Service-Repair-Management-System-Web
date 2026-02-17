"use client"

import { useCallback, useState, useRef } from "react"
import { Upload, Award, X, FileText } from "lucide-react"

interface FileUploadProps {
  label: string
  required?: boolean
  helpText?: string
  icon?: "upload" | "certificate"
  onFileSelect?: (file: File | null) => void
}

export function FileUpload({ label, required, helpText, icon = "upload", onFileSelect }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      onFileSelect?.(file)
    }
  }, [onFileSelect])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    onFileSelect?.(file)
  }

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    onFileSelect?.(null)
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#111827]">
        {label}
        {required && <span className="ml-1 text-[#EF4444]">*</span>}
      </label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
          dragOver
            ? "border-[#4F46E5] bg-[#EEF2FF]"
            : selectedFile
            ? "border-[#10B981] bg-[#F0FDF4]"
            : "border-[#D1D5DB] bg-[#F9FAFB] hover:border-[#4F46E5] hover:bg-[#EEF2FF]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileChange}
        />
        {selectedFile ? (
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#10B981]" />
            <div className="text-sm">
              <p className="font-medium text-[#111827]">{selectedFile.name}</p>
              <p className="text-[#6B7280]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={removeFile} className="ml-2 rounded-full p-1 hover:bg-[#FEE2E2]" aria-label="Remove file">
              <X className="h-4 w-4 text-[#EF4444]" />
            </button>
          </div>
        ) : (
          <>
            {icon === "certificate" ? (
              <Award className="mb-2 h-10 w-10 text-[#9CA3AF]" />
            ) : (
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF2FF]">
                <Upload className="h-5 w-5 text-[#4F46E5]" />
              </div>
            )}
            <p className="text-sm font-medium text-[#374151]">
              {icon === "certificate" ? "Upload repair certification" : "Click to upload or drag and drop"}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              {helpText || "PNG, JPG or PDF (max. 5MB)"}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
