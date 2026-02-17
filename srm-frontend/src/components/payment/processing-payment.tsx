"use client"

import { useEffect, useState } from "react"
import { Lock, ShieldCheck } from "lucide-react"

interface ProcessingPaymentProps {
  onComplete: (success: boolean) => void
}

export function ProcessingPayment({ onComplete }: ProcessingPaymentProps) {
  const [activeDot, setActiveDot] = useState(0)

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3)
    }, 500)

    const completeTimeout = setTimeout(() => {
      onComplete(true)
    }, 4000)

    return () => {
      clearInterval(dotInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#7C3AED]">
      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-[#FFFFFF] mb-3">Processing Payment</h1>
      <p className="text-sm lg:text-base text-[#FFFFFF]/70 mb-12">
        Please wait while we securely process your payment...
      </p>

      {/* Lock Icon */}
      <div className="flex h-24 w-24 lg:h-28 lg:w-28 items-center justify-center rounded-full bg-[#FFFFFF]/15 mb-8">
        <Lock className="h-10 w-10 lg:h-12 lg:w-12 text-[#FFFFFF]/70" />
      </div>

      {/* SSL Badge */}
      <div className="flex items-center gap-2 rounded-full border border-[#FFFFFF]/20 bg-[#FFFFFF]/10 px-5 py-2.5 mb-6">
        <ShieldCheck className="h-4 w-4 text-[#FFFFFF]/70" />
        <span className="text-sm text-[#FFFFFF]/80 font-medium">256-bit SSL Encrypted</span>
      </div>

      {/* Warning Text */}
      <p className="text-sm text-[#FFFFFF]/60 mb-8">Do not close or refresh this page</p>

      {/* Animated Dots */}
      <div className="flex items-center gap-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              activeDot === i
                ? "h-3.5 w-3.5 bg-[#FFFFFF]"
                : "h-2.5 w-2.5 bg-[#FFFFFF]/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
