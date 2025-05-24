'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useDesignStore } from '@/lib/Store'
import { useToast } from '@/components/ui/use-toast'
import { Sidebar } from '@/components/canvas/Sidebar'
import { Canvas } from '@/components/canvas/Canvas'
import { getDesign } from '@/services/design-service'
import { Toolbar } from '@/components/canvas/Toolbar'
import { Component, ReactNode } from 'react'
//import { fetchDesignById } from '@/services/designService'

// Custom Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by error boundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center p-4 text-center">
          <div>
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">
              An error occurred loading the shared design. Please try again.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function CollaborativeEditorPage() {
  const params = useParams()
  const sessionId = params?.sessionId as string
  const router = useRouter()
  const { toast } = useToast()
  const [showBackside, setShowBackside] = useState(false)

  const { loadDesign, isLoading, error } = useDesignStore()

  // Load the shared design when the component mounts
  useEffect(() => {
    const loadSharedDesign = async () => {
      console.log('Loading shared design with sessionId:', sessionId)
      try {
        if (typeof sessionId === 'string') {
          const design = await getDesign(sessionId)
          console.log('Design fetched:', design)
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

  const handleToggleBackside = () => {
    console.log('Toggle backside')
    setShowBackside(!showBackside)
  }

  return (
    <ErrorBoundary
    >
      <div className="flex h-screen flex-col">
        <Toolbar
          collaborative sessionId={sessionId as string}
          onToggleBackside={handleToggleBackside}
          showBackside={showBackside}
        />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6  bg-muted/30">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading shared design...</p>
                </div>
              </div>
            ) : (
              <Canvas showBackside={showBackside} />
            )}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}