"use client"

import { useState, useCallback } from "react"
import { ArrowLeft, Building2, Copy, Star, Upload, Check, Info, Lock, CheckCircle2 } from "lucide-react"
import { OrderSummary } from "./order-summary"

interface BankTransferProps {
  onBack: () => void
  onComplete: () => void
  onCancel: () => void
}

const bankDetails = [
  { label: "Bank Name", value: "HDFC Bank" },
  { label: "Account Name", value: "Service Repair Management Ltd." },
  { label: "Account Number", value: "5020 0012 3456 78" },
  { label: "IFSC Code", value: "HDFC0001234" },
  { label: "Branch", value: "Mumbai Main Branch" },
]

export function BankTransfer({ onBack, onComplete, onCancel }: BankTransferProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const handleCopy = useCallback((value: string, label: string) => {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopiedField(label)
    setTimeout(() => setCopiedField(null), 2000)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Payment Methods
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
              <Building2 className="h-5 w-5 text-[#4F46E5]" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827]">Bank Transfer</h1>
          </div>
          <p className="text-sm text-[#6B7280] mb-6">
            Transfer the payment directly to our bank account. Please use your Order ID as the payment reference.
          </p>

          {/* Bank Account Details */}
          <div className="rounded-xl border-2 border-[#10B981]/30 bg-[#FFFFFF] p-6 mb-6">
            <h3 className="text-base font-bold text-[#111827] mb-4">Bank Account Details</h3>
            <div className="space-y-3">
              {bankDetails.map((detail) => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between rounded-lg border border-[#E5E7EB] px-4 py-3 bg-[#FFFFFF]"
                >
                  <div>
                    <p className="text-xs text-[#6B7280]">{detail.label}</p>
                    <p className="text-sm font-semibold text-[#111827] mt-0.5">{detail.value}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(detail.value, detail.label)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors"
                    aria-label={"Copy " + detail.label}
                  >
                    {copiedField === detail.label ? (
                      <Check className="h-4 w-4 text-[#10B981]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Payment Reference */}
            <div className="mt-4 rounded-lg border-2 border-[#F59E0B]/40 bg-[#FEF3C7]/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-[#F59E0B]" />
                    <p className="text-xs font-semibold text-[#F59E0B]">Payment Reference (Important)</p>
                  </div>
                  <p className="text-lg font-bold text-[#111827] mt-1">ORD-2026-8472</p>
                  <p className="text-xs text-[#6B7280]">Use this as reference to identify your payment</p>
                </div>
                <button
                  onClick={() => handleCopy("ORD-2026-8472", "reference")}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#4F46E5] hover:bg-[#EEF2FF] transition-colors"
                  aria-label="Copy reference"
                >
                  {copiedField === "reference" ? (
                    <Check className="h-4 w-4 text-[#10B981]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Upload Payment Proof */}
          <div className="mb-6">
            <h3 className="text-base font-bold text-[#111827] mb-1">Upload Payment Proof (Optional)</h3>
            <p className="text-xs text-[#6B7280] mb-3">Upload your bank transfer receipt to help us verify your payment faster.</p>

            <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#FFFFFF] p-8 cursor-pointer hover:border-[#4F46E5] transition-colors">
              <input type="file" className="hidden" accept=".png,.jpg,.pdf" onChange={handleFileChange} />
              {uploadedFile ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-[#10B981]" />
                  <span className="text-sm text-[#111827] font-medium">{uploadedFile}</span>
                </div>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F4F6] mb-3">
                    <Upload className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <p className="text-sm text-[#111827] font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#9CA3AF] mt-1">PNG, JPG, PDF up to 5MB</p>
                </>
              )}
            </label>
          </div>

          {/* Important Instructions */}
          <div className="rounded-xl border border-[#DBEAFE] bg-[#EEF2FF]/30 p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-[#3B82F6]" />
              <h4 className="text-sm font-bold text-[#111827]">Important Instructions</h4>
            </div>
            <div className="space-y-2.5">
              {[
                <>{"Transfer the exact amount of "}<strong>Rs. 9,050</strong>{" to avoid payment delays"}</>,
                <>{"Use Order ID "}<strong>ORD-2026-8472</strong>{" as payment reference/remark"}</>,
                "Payment verification may take 2-4 business hours",
                "You'll receive a confirmation email once payment is verified",
                "Keep your bank transfer receipt for reference",
              ].map((instruction, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#374151]">{instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onComplete}
              className="flex-1 rounded-xl bg-[#10B981] px-6 py-3.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#059669] transition-colors"
            >
              {"I've Completed the Transfer"}
            </button>
            <button
              onClick={onCancel}
              className="rounded-xl border border-[#E5E7EB] px-6 py-3.5 text-sm font-semibold text-[#111827] hover:bg-[#F3F4F6] transition-colors bg-[#FFFFFF]"
            >
              Cancel
            </button>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <Lock className="h-3 w-3" />
            <span>Your transaction is secure. We never store your banking credentials.</span>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-[380px]">
          <OrderSummary
            planName="iPhone 13 Pro Screen Replacement"
            planPrice={8500}
            quantity={1}
            shipping={200}
            tax={850}
            discount={500}
            discountCode="SUMMER20"
            showPromoInput={false}
            showWhatHappensNext={true}
            showNeedHelp={true}
          />
        </div>
      </div>
    </div>
  )
}
