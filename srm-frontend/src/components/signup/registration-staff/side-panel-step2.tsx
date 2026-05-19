"use client"

import { Building2, Search, ArrowRight } from "lucide-react"
import { Check } from "lucide-react"
import Link from "next/link"

export function SidePanelStep2() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#4338CA] px-10 py-10 text-white">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute bottom-40 right-10 h-40 w-40 rounded-full bg-white/5" />

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

      {/* Main content */}
      <div className="relative z-10 mt-12">
        <h1 className="text-3xl font-bold leading-tight text-balance">
          Join as a Technician
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/80">
          Connect with repair shops and manage repairs efficiently with our comprehensive platform
        </p>
      </div>

      {/* Feature list */}
      <div className="relative z-10 mt-12 flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Real-time Job Updates</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-white/70">
              Stay updated with repair status and customer notifications
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Digital Documentation</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-white/70">
              Capture device photos and maintain complete repair history
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Check className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Performance Analytics</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-white/70">
              Track your repair metrics and improve efficiency
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-auto pt-8">
        <p className="text-xs text-white/50">{"© 2024 RepairHub. All rights reserved."}</p>
      </div>
    </div>
  )
}
