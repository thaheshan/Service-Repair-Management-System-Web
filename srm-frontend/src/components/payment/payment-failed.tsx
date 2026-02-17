"use client"

import { XCircle, AlertCircle, Headphones } from "lucide-react"

interface PaymentFailedProps {
  onTryAgain: () => void
  onUseDifferentMethod: () => void
}

export function PaymentFailed({ onTryAgain, onUseDifferentMethod }: PaymentFailedProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-12 px-4 bg-[#FFFFFF]">
      {/* Error Icon */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#EF4444]/20 bg-[#FEE2E2] mb-4">
        <XCircle className="h-12 w-12 text-[#EF4444]" />
      </div>

      <h1 className="text-3xl lg:text-4xl font-bold text-[#DC2626] mb-2 text-balance text-center">
        Payment Failed!
      </h1>
      <p className="text-sm text-[#6B7280] mb-8">{"We couldn't process your payment"}</p>

      {/* Error Details */}
      <div className="w-full max-w-lg rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-semibold text-[#111827]">Error Code:</span>
          <span className="font-mono text-sm text-[#EF4444]">PAYMENT_DECLINED_001</span>
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-[#FEE2E2]/50 p-3">
          <AlertCircle className="h-4 w-4 text-[#EF4444] mt-0.5 shrink-0" />
          <p className="text-sm text-[#B91C1C]">
            Your card was declined by your bank. Please check your card details or try a different payment method.
          </p>
        </div>
      </div>

      {/* Common Issues */}
      <div className="w-full max-w-lg rounded-xl bg-[#F9FAFB] p-5 mb-10">
        <h3 className="text-base font-bold text-[#111827] mb-4">Common Issues</h3>
        <ul className="space-y-3">
          {[
            "Insufficient funds in your account",
            "Incorrect card details entered",
            "Card expired or blocked",
            "Transaction limit exceeded",
          ].map((issue, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="h-2 w-2 shrink-0 rounded-full bg-[#111827]" />
              <span className="text-sm text-[#374151]">{issue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-lg space-y-3">
        <button
          onClick={onTryAgain}
          className="w-full rounded-xl bg-[#4F46E5] px-6 py-3.5 text-sm font-semibold text-[#FFFFFF] hover:bg-[#4338CA] transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onUseDifferentMethod}
          className="w-full rounded-xl border border-[#E5E7EB] px-6 py-3.5 text-sm font-semibold text-[#111827] hover:bg-[#F3F4F6] transition-colors bg-[#FFFFFF]"
        >
          Use Different Payment Method
        </button>
      </div>

      <button className="flex items-center gap-1.5 text-sm font-medium text-[#4F46E5] hover:underline mt-6">
        <Headphones className="h-4 w-4" />
        Contact Support
      </button>
    </div>
  )
}
