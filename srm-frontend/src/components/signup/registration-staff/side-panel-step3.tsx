"use client"

import { Clock, Smartphone, BarChart3 } from "lucide-react"
import Link from "next/link"

export function SidePanelStep3() {
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

      {/* Main content */}
      <div className="relative z-10 mt-12">
        <h1 className="text-3xl font-bold leading-tight text-balance">
          Join Our Network of Expert Technicians
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/80">
          Streamline your repair workflow and grow your career
        </p>
      </div>

      {/* Feature list */}
      <div className="relative z-10 mt-12 flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Real-time Job Tracking</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-white/70">
              Manage all repairs efficiently with instant status updates
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Mobile-First Design</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-white/70">
              Access your dashboard anywhere, anytime
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Performance Analytics</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-white/70">
              Track your productivity and earnings
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1" />
    </div>
  )
}
