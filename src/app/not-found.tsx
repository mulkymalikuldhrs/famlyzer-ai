import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-background"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground text-sm max-w-md mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button
        asChild
        className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
      >
        <Link href="/" aria-label="Return to the home page">
          Go Home
        </Link>
      </Button>
    </div>
  )
}
