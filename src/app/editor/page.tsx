'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Canvas } from '@/components/canvas/Canvas'
import { Toolbar } from '@/components/canvas/Toolbar'
import { Sidebar } from '@/components/canvas/Sidebar'
import ErrorBoundary from '@/components/ui/error-boundary'
import { useDesignStore } from '@/lib/Store'

export default function EditorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { resetDesign, loadDesign, saveDesign, isLoading, error } = useDesignStore()

  // Reset the design when the editor is loaded
  useEffect(() => {
    resetDesign()
    // This could also try to load from localStorage or URL params
    // if we want to restore previous sessions
  }, [resetDesign])

  // Handle error states
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
  }, [error, toast])

  return (
    <ErrorBoundary
      fallback={
        <div className="flex h-screen items-center justify-center p-4 text-center">
          <div>
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">
              An error occurred in the editor. Please try refreshing the page.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Return to home
            </button>
          </div>
        </div>
      }
    >
      <div className="flex h-screen flex-col">
        <Toolbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto bg-muted/30">
            <Canvas />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}