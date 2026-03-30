'use client'

import Link from 'next/link'
import { Check, UserCog, Store, ArrowRight } from 'lucide-react'

interface AccountCardProps {
  title: string
  description: string
  color: 'indigo' | 'orange' | 'emerald'
  buttonText: string
  features: string[]
  link: string
}

const colorConfig = {
  indigo: {
    bg: 'bg-indigo-600',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  },
  orange: {
    bg: 'bg-[#FF9500]', // Adjusting closely to the distinct Figma gold/orange tone
    button: 'bg-[#FF9500] hover:bg-[#e08200] text-white',
  },
  emerald: {
    bg: 'bg-[#10B981]',
    button: 'bg-[#10B981] hover:bg-[#0ea5e9] text-white hover:bg-emerald-600 transition-colors',
  },
}

export function AccountCard({
  title,
  description,
  color,
  buttonText,
  features,
  link,
}: AccountCardProps) {
  const config = colorConfig[color] || colorConfig.indigo

  return (
    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden w-full max-w-[360px] flex flex-col items-center">
      
      {/* Icon Container (Centered Top) */}
      <div className="pt-10 pb-6 flex justify-center w-full">
        <div className={`${config.bg} rounded-2xl w-20 h-20 flex items-center justify-center shadow-md`}>
          {color === 'orange' && <UserCog className="w-9 h-9 text-white" />}
          {color === 'emerald' && <Store className="w-9 h-9 text-white" />}
          {color === 'indigo' && <Check className="w-9 h-9 text-white" />}
        </div>
      </div>
      
      {/* Content */}
      <div className="px-8 pb-8 w-full flex flex-col items-center text-center">
        
        {/* Title */}
        <h3 className="text-[22px] font-bold text-gray-900 mb-2 tracking-tight">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-500 text-[14px] font-medium mb-8">
          {description}
        </p>
        
        {/* Features List (Left Aligned internally, but block centered) */}
        <div className="w-full max-w-[280px] space-y-3.5 mb-10 text-left">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check className="w-[18px] h-[18px] text-[#10B981] flex-shrink-0" strokeWidth={3} />
              <span className="text-gray-600 text-[13.5px] font-medium">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Button with Navigation */}
        <div className="w-full mt-auto">
          <Link href={link}>
            <button
              className={`w-full ${config.button} font-semibold text-[15px] py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2`}
            >
              {buttonText}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
