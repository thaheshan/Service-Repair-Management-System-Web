"use client"

import { Check, CheckCircle2, Info } from "lucide-react"
import Link from "next/link"

interface RegistrationSuccessProps {
  userData: {
    fullName: string
    email: string
    role: string
  }
}

export function RegistrationSuccess({ userData }: RegistrationSuccessProps) {
  const handleResendEmail = () => {
    // TODO: Connect to your API to resend verification email
    alert(`Verification email resent to ${userData.email}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] px-4 py-10">
      <div className="w-full max-w-[580px] rounded-2xl bg-white px-8 py-10 shadow-lg">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#10B981]">
            <Check className="h-10 w-10 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Title */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold leading-tight text-[#111827] text-balance">
            Account Created Successfully!
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Welcome to Service Repair Management System
          </p>
        </div>

        {/* Account Details */}
        <div className="mt-8 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
            <span className="text-sm text-[#6B7280]">Full Name</span>
            <span className="text-sm font-semibold text-[#111827]">
              {userData.fullName || "John Michael Smith"}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
            <span className="text-sm text-[#6B7280]">Email Address</span>
            <span className="text-sm font-semibold text-[#111827]">
              {userData.email || "john.smith@example.com"}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
            <span className="text-sm text-[#6B7280]">Account Role</span>
            <span className="text-sm font-semibold text-[#4F46E5] underline">
              {userData.role || "Shop Manager"}
            </span>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-[#6B7280]">Account Status</span>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
              <span className="text-sm font-semibold text-[#10B981]">Active</span>
            </div>
          </div>
        </div>

        {/* Verification Email Notice */}
        <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-[#DBEAFE] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]">
              <Info className="h-3.5 w-3.5 text-white" />
            </div>
            <p className="text-sm leading-relaxed text-[#374151]">
              A verification email has been sent to{" "}
              <span className="font-semibold text-[#111827]">
                {userData.email || "john.smith@example.com"}
              </span>
              . Please check your inbox and verify your email address within 24
              hours to activate your account fully.
            </p>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white px-6 py-5">
          <h3 className="text-base font-bold text-[#111827]">{"What's Next?"}</h3>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
                1
              </div>
              <p className="pt-0.5 text-sm text-[#374151]">
                Verify your email address by clicking the link sent to your inbox
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
                2
              </div>
              <p className="pt-0.5 text-sm text-[#374151]">
                Log in to your account using your email and password
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
                3
              </div>
              <p className="pt-0.5 text-sm text-[#374151]">
                Complete your profile setup and configure your account preferences
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-xs font-bold text-white">
                4
              </div>
              <p className="pt-0.5 text-sm text-[#374151]">
                Start managing your repair business with our powerful tools
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          {/* ✅ Go to Login Button */}
          <Link href="/login">
            <button className="flex h-12 w-full items-center justify-center rounded-lg bg-[#4F46E5] text-sm font-semibold text-white transition-colors hover:bg-[#4338CA]">
              Go to Login
            </button>
          </Link>

          {/* ✅ Resend Verification Email Button */}
          <Link href="/resend-verification">
            <button className="flex h-12 w-full items-center justify-center rounded-lg border-2 border-[#4F46E5] bg-white text-sm font-semibold text-[#4F46E5] transition-colors hover:bg-[#EEF2FF]">
              Resend Verification Email
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}