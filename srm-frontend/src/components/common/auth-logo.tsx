"use client"

import Link from "next/link"
import { Wrench } from "lucide-react"

export function AuthLogo() {
  return (
    <Link 
      href="/" 
      className="relative flex items-center h-12 w-48 justify-center mx-auto group pt-2 mt-4"
    >
      <img 
        src="/all-fix-logo-black.png" 
        alt="All Fix Logo" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
        style={{ transform: 'translate(-50%, -50%) scale(2.8)' }}
      />
    </Link>
  )
}
