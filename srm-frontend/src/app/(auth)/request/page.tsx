'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RequestPending } from '@/components/Request/request-pending'
import { RequestSuccessful } from '@/components/Request/request-successful'

type RequestStatus = 'pending' | 'approved'

export default function RequestStatusPage() {
  const [status, setStatus] = useState<RequestStatus>('pending')
  const router = useRouter()

  // Auto-navigate to approved after 5 seconds
  useEffect(() => {
    if (status === 'pending') {
      const timer = setTimeout(() => {
        setStatus('approved')
      }, 5000)

      return () => clearTimeout(timer) // cleanup on unmount
    }
  }, [status])

  if (status === 'pending') {
    return (
      <RequestPending
        onCheckStatus={() => setStatus('approved')}
        onGoHome={() => router.push('/')}
      />
    )
  }

  return (
    <RequestSuccessful
      onProceedToPayment={() => router.push('/payment')}
      onStartDemo={() => router.push('/login')}
    />
  )
}