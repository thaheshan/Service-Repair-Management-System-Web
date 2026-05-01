"use client"

import { useEffect, useState } from "react"
import { Lock, ShieldCheck } from "lucide-react"

import axios from "axios"
import { useSearchParams } from "next/navigation"

interface ProcessingPaymentProps {
  onComplete: (success: boolean) => void
}

export function ProcessingPayment({ onComplete }: ProcessingPaymentProps) {
  const [activeDot, setActiveDot] = useState(0)
  const searchParams = useSearchParams()
  const requestId = searchParams.get('id')

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3)
    }, 600)

    const finalize = async () => {
      try {
        // We send a mock payment ID for now since it's development
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/onboarding/finalize`, {
          requestId,
          paymentIntentId: "MOCK_CARD_PAYMENT_" + Date.now()
        });

        if (response.status === 200) {
          onComplete(true)
        } else {
          onComplete(false)
        }
      } catch (error) {
        console.error("Finalization error:", error)
        onComplete(false)
      }
    }

    finalize()

    return () => {
      clearInterval(dotInterval)
    }
  }, [onComplete, requestId])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#312E81] via-[#4338CA] to-[#3730A3]">
      {/* Subtle radial glow in center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Content — sits above the glow */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Title */}
        <h1 className="text-[32px] lg:text-[36px] font-bold text-white mb-3 tracking-tight">
          Processing Payment
        </h1>
        <p className="text-[15px] text-white/65 mb-14">
          Please wait while we securely process your payment...
        </p>

        {/* Lock circle — matches Figma: medium-large frosted circle */}
        <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white/[0.12] mb-8 shadow-[0_0_40px_rgba(99,102,241,0.4)]">
          <Lock className="h-[38px] w-[38px] text-white" strokeWidth={2} />
        </div>

        {/* SSL Badge pill */}
        <div className="flex items-center gap-2.5 rounded-full border border-white/25 bg-white/[0.10] px-6 py-2.5 mb-5 backdrop-blur-sm">
          <ShieldCheck className="h-[16px] w-[16px] text-white/80" strokeWidth={2} />
          <span className="text-[13px] font-semibold text-white/85 tracking-wide">
            256-bit SSL Encrypted
          </span>
        </div>

        {/* Do not close warning */}
        <p className="text-[13px] text-white/55 mb-10">
          Do not close or refresh this page
        </p>

        {/* Animated dots — exact Figma style: 3 dots, active one is larger & brighter */}
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500"
              style={{
                width:  activeDot === i ? 12 : 9,
                height: activeDot === i ? 12 : 9,
                backgroundColor: activeDot === i ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.30)",
                transitionProperty: "width, height, background-color",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
