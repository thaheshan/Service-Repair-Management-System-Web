'use client'

import { CheckCircle2, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ApprovalSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 size={48} />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Request Approved!
        </h1>
        
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          The registration request has been approved. The shop owner has been notified via email to proceed with the payment.
        </p>
        
        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200"
          >
            <Home size={20} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
