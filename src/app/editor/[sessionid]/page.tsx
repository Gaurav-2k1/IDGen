'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDesignStore } from '@/lib/Store'
import { useToast } from '@/components/ui/use-toast'
import { fetchDesignById } from '@/services/designService'
import { ErrorBoundary } from 'next/dist/client/components/error-boundary'
import { Toolbar } from '@/components/canvas/Toolbar'
import { Sidebar } from '@/components/canvas/Sidebar'
import { Canvas } from '@/components/canvas/Canvas'
//import { fetchDesignById } from '@/services/designService'

export default function CollaborativeEditorPage() {
  const { sessionId } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { loadDesign, isLoading, error } = useDesignStore()

  // Load the shared design when the component mounts
  useEffect(() => {
    const loadSharedDesign = async () => {
      try {
        if (typeof sessionId === 'string') {
          const design = await fetchDesignById(sessionId)
          if (design) {
            loadDesign(design)
            toast({
              title: "Design loaded",
              description: "Collaborative session started",
            })
          } else {
            throw new Error("Design not found")
          }
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to load design",
          description: err instanceof Error ? err.message : "Unknown error occurred",
        })
        router.push('/editor')
      }
    }

    loadSharedDesign()
  }, [sessionId, loadDesign, router, toast])

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
              An error occurred loading the shared design. Please try again.
            </p>
            <button
              onClick={() => router.push('/editor')}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Return to editor
            </button>
          </div>
        </div>
      }
    >
      <div className="flex h-screen flex-col">
        <Toolbar collaborative sessionId={sessionId as string} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto bg-muted/30">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading shared design...</p>
                </div>
              </div>
            ) : (
              <Canvas />
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}