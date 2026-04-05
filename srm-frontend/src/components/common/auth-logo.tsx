"use client"

import Link from "next/link"
import { Wrench } from "lucide-react"

export function AuthLogo() {
  return (
    <Link 
      href="/" 
      className="inline-flex items-center gap-2.5 group transition-all hover:opacity-80"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] shadow-lg shadow-[#4F46E5]/20 group-hover:scale-105 transition-transform">
        <Wrench className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-black text-[#111827] tracking-tight">SRM</span>
    </Link>
  )
}
