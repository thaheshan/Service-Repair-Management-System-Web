"use client"

import { Bell, Camera, BarChart3 } from "lucide-react"
import { Check } from "lucide-react"

export function SidePanelStep2() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#4338CA] px-10 py-10 text-white">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/5" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xl font-bold">RepairHub</span>
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
