import { Wrench } from 'lucide-react'
import Link from 'next/link'

export function SignupHeader() {
  return (
    <div className="text-center mb-16 pt-8">
      
      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-balance">
        Join All Fix
      </h1>
      
      {/* Subtitle */}
      <p className="text-lg text-gray-600 text-balance">
        Choose your account type to get started
      </p>
    </div>
  )
}
