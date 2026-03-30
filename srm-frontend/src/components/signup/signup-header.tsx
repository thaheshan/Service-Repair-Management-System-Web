import { Wrench } from 'lucide-react'
import Link from 'next/link'

export function SignupHeader() {
  return (
    <div className="text-center mb-16">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Link href="/" className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 shadow-lg hover:scale-105 transition-transform cursor-pointer">
          <Wrench className="w-8 h-8 text-white" strokeWidth={2.5} />
        </Link>
      </div>
      
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-balance">
        Join Service Repair Management
      </h1>
      
      {/* Subtitle */}
      <p className="text-lg text-gray-600 text-balance">
        Choose your account type to get started
      </p>
    </div>
  )
}
