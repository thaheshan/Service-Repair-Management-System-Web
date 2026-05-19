"use client"

import { CheckCircle2, Shield, CreditCard } from "lucide-react"
import Link from "next/link"

export function SidePanelStep3() {
  const steps = [
    { label: "Account", done: true },
    { label: "Shop Details", done: true },
    { label: "Choose Plan", done: false, active: true },
  ]

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#4338CA] px-10 py-10 text-white">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/5" />

      {/* Logo */}
      <div className="relative z-10 flex justify-center items-center h-16 w-full overflow-visible">
        <Link href="/">
          <img 
            src="/all-fix-logo.png" 
            alt="All Fix Logo" 
            className="h-16 w-auto object-contain" 
            style={{ transform: 'scale(2.7)', transformOrigin: 'center center' }}
          />
        </Link>
      </div>

      {/* Vertical Stepper — properly centred with icon-aligned connector */}
      <div className="relative z-10 mt-12 flex flex-col items-start w-[180px] mx-auto">
        {steps.map((step, idx) => (
          <div key={idx} className="flex flex-col">
            {/* Step row: icon + label */}
            <div className="flex items-center gap-4">
              {/* Icon circle */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  step.done
                    ? "border-white bg-white"
                    : step.active
                    ? "border-white bg-white/20"
                    : "border-white/40 bg-transparent"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="h-[22px] w-[22px] text-[#4F46E5]" strokeWidth={2.5} />
                ) : step.active ? (
                  <CreditCard className="h-[22px] w-[22px] text-white" strokeWidth={2} />
                ) : null}
              </div>
              {/* Label */}
              <p
                className={`text-[15px] font-bold min-w-[110px] ${
                  step.done || step.active ? "text-white" : "text-white/50"
                }`}
              >
                {step.label}
              </p>
            </div>
            {/* Connector — sits below icon, centred on its 44px width */}
            {idx < steps.length - 1 && (
              <div
                className="bg-white/40"
                style={{ width: 2, height: 36, marginLeft: 0, alignSelf: "flex-start", marginTop: 2, marginBottom: 2, transform: "translateX(21px)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Illustration card */}
      <div className="relative z-10 mt-4 overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5">
        {/* Colourful blob background for card */}
        <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-gradient-to-br from-[#FDE68A] to-[#F59E0B] opacity-30 blur-xl" />
        <div className="absolute -top-4 -left-4 h-20 w-20 rounded-full bg-gradient-to-br from-[#A5B4FC] to-[#6366F1] opacity-30 blur-xl" />
        {/* Illustration placeholder (phone + stars vibe from figma) */}
        <div className="relative flex items-center justify-center py-3">
          <div className="flex flex-col items-center gap-2">
            {/* Mock phone illustration using CSS */}
            <div className="relative">
              <div className="h-24 w-14 rounded-xl border-2 border-white/40 bg-white/20 shadow-lg flex items-center justify-center">
                <div className="h-16 w-10 rounded-lg bg-white/30 flex flex-col gap-1 items-center justify-center p-1">
                  <div className="h-1.5 w-7 rounded bg-white/60" />
                  <div className="h-1.5 w-5 rounded bg-white/40" />
                  <div className="h-1.5 w-6 rounded bg-white/50" />
                  <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981]/80">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              {/* Stars */}
              <div className="absolute -right-4 -top-2 text-yellow-300 text-lg leading-none">★</div>
              <div className="absolute -left-3 bottom-2 text-yellow-200 text-sm leading-none">★</div>
              <div className="absolute right-0 -bottom-2 text-yellow-400 text-xs leading-none">★</div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefit bullets */}
      <div className="relative z-10 mt-8 flex flex-col gap-4">
        {[
          "14-day free trial with full access",
          "No credit card required to start",
          "Upgrade or downgrade anytime",
        ].map((benefit, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981]">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-medium text-white/90">{benefit}</span>
          </div>
        ))}
      </div>

      <div className="flex-1" />
    </div>
  )
}
