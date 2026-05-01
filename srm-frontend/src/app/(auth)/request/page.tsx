'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RequestPending } from '@/components/Request/request-pending'
import { RequestSuccessful } from '@/components/Request/request-successful'
import { useGetRegistrationStatusQuery } from '@/services/api/authApiSlice'
import { Loader2 } from 'lucide-react'

export default function RequestStatusPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestId = searchParams.get('id')
  
  const { data: request, isLoading, refetch } = useGetRegistrationStatusQuery(requestId, {
    skip: !requestId,
    pollingInterval: 10000, // Poll every 10 seconds
  })

  if (!requestId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl font-bold">Invalid Request ID</h1>
        <p className="text-muted-foreground mt-2">Please return to the signup page.</p>
        <button onClick={() => router.push('/signup')} className="mt-4 text-primary underline">Go to Signup</button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (request?.status === 'APPROVED') {
    return (
      <RequestSuccessful
        onProceedToPayment={() => router.push(`/payment?id=${requestId}`)}
        onStartDemo={() => router.push('/login')}
      />
    )
  }

  return (
    <RequestPending
      onCheckStatus={() => refetch()}
      onGoHome={() => router.push('/')}
    />
  )
}