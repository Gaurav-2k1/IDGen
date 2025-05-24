'use client'

import { useEffect, useState, Suspense, memo } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Sidebar } from '@/components/canvas/Sidebar'
import { useDesignStore } from '@/lib/Store'
import { Canvas } from '@/components/canvas/Canvas'
import { Toolbar } from '@/components/canvas/Toolbar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Loader2 } from 'lucide-react'

// Loading component with animation
const LoadingSpinner = memo(() => (
  <div className="flex h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading editor...</p>
    </div>
  </div>
))

LoadingSpinner.displayName = 'LoadingSpinner'

// Error fallback component
const EditorErrorFallback = memo(({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex h-screen items-center justify-center p-4 text-center">
    <div className="max-w-md">
      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">
        {error.message || 'An error occurred in the editor. Please try refreshing the page.'}
      </p>
      <div className="mt-4 space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Refresh page
        </button>
        <button
          onClick={resetErrorBoundary}
          className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
))

EditorErrorFallback.displayName = 'EditorErrorFallback'

// Main editor component
function EditorPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { resetDesign, error, isLoading } = useDesignStore()
  const [showBackside, setShowBackside] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize editor
  useEffect(() => {
    const initializeEditor = async () => {
      try {
        await resetDesign()
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize editor:', error)
        toast({
          variant: "destructive",
          title: "Initialization failed",
          description: "Failed to initialize the editor. Please try refreshing the page.",
        })
      }
    }

    initializeEditor()
  }, [resetDesign, toast])

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

  // Handle toggling backside view
  const handleToggleBackside = () => {
    setShowBackside(!showBackside)
  }

  // Show loading state while initializing
  if (!isInitialized || isLoading) {
    return <LoadingSpinner />
  }

  return (
    <ErrorBoundary
      FallbackComponent={EditorErrorFallback}
      onReset={() => {
        // Reset the error boundary state
        resetDesign()
      }}
    >
      <div className="flex h-screen flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <Toolbar 
            onToggleBackside={handleToggleBackside}
            showBackside={showBackside}
          />
        </Suspense>
        
        <div className="flex flex-1 overflow-hidden">
          <Suspense fallback={<LoadingSpinner />}>
            <Sidebar />
          </Suspense>
          
          <main className="flex-1 p-6 overflow-auto bg-muted/30">
            <Suspense fallback={<LoadingSpinner />}>
              <Canvas showBackside={showBackside} />
            </Suspense>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default memo(EditorPage)