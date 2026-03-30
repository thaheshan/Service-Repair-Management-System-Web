"use client"

import { Briefcase, BarChart3, Bell } from "lucide-react"
import Link from "next/link"

export function SidePanelStep1() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#4338CA] px-10 py-10 text-white">
      {/* Background decorative circles */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute bottom-40 right-10 h-40 w-40 rounded-full bg-white/5" />

      {/* Logo */}
      <Link href="/" className="relative z-10 flex items-center gap-3 w-fit group">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 group-hover:scale-105 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="text-xl font-bold">RepairHub</span>
      </Link>

      {/* Main content */}
      <div className="relative z-10 mt-12">
        <h1 className="text-3xl font-bold leading-tight text-balance">
          Join Our Network of Professional Technicians
        </h1>
        <p className="mt-4 text-base leading-relaxed text-white/80">
          Connect with repair shops, manage your workload efficiently, and grow your career in the service industry.
        </p>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 mt-auto flex flex-col gap-4">
        <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#10B981]">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Work Management</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                Track repairs, update status, and manage your daily tasks seamlessly
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Performance Tracking</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                Monitor your productivity and build your professional reputation
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Real-time Updates</h3>
              <p className="mt-0.5 text-xs leading-relaxed text-white/70">
                Instant notifications for new assignments and customer updates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
