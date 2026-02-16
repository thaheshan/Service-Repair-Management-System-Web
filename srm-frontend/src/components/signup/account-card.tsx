'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AccountCardProps {
  title: string
  description: string
  color: 'indigo' | 'orange' | 'emerald'
  buttonText: string
  features: string[]
}

const colorConfig = {
  indigo: {
    bg: 'bg-indigo-600',
    lightBg: 'bg-indigo-50',
    text: 'text-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  },
  orange: {
    bg: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    text: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600 text-white',
  },
  emerald: {
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    text: 'text-emerald-500',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
}

export function AccountCard({
  title,
  description,
  color,
  buttonText,
  features,
}: AccountCardProps) {
  const config = colorConfig[color]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Icon Container */}
      <div className="p-8 flex justify-center">
        <div className={`${config.bg} rounded-2xl p-4 shadow-md`}>
          {color === 'indigo' && (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          )}
          {color === 'orange' && (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm6-8h-1V7h-2V5h-2v2h-2V5h-2v2h-1c-1.11 0-1.99.9-1.99 2L4 19c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
            </svg>
          )}
          {color === 'emerald' && (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="px-8 pb-8">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 h-10">
          {description}
        </p>
        
        {/* Features List */}
        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} />
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Button */}
        <button
          className={`w-full ${config.button} font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
        >
          {buttonText}
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  )
}
