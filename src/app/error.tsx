'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background"
    >
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Application Error</h2>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <Button
        onClick={reset}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
        aria-label="Retry loading the application"
      >
        Try Again
      </Button>
    </div>
  )
}
