// components/Canvas/Canvas.tsx
'use client '
import { useRef, useEffect, useState } from 'react'
import { useDesignStore } from '@/lib/Store'
import { ElementType, Position } from '@/lib/types'
import { useToast } from '../ui/use-toast'
import CanvasElement from './canvas-element'
import { getDesign } from '@/services/design-service'
import { useRouter } from 'next/navigation'

interface CanvasProps {
  designId?: string
  readOnly?: boolean
}

export  function Canvas({ designId, readOnly = false }: CanvasProps) {
  const router = useRouter();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(designId ? true : false)
  
  // Get design state and methods from store
  const {
    elements,
    selectedElementId,
    canvasSize,
    canvasBackground,
    setSelectedElement,
    updateElementPosition,
    saveDesign,
    loadDesign,
    resetDesign,
    startDrag,
    endDrag,
    saveStateToHistory
  } = useDesignStore()

  // Load design if designId is provided
  useEffect(() => {
    const fetchDesign = async () => {
      if (!designId) return
      
      try {
        setIsLoading(true)
        const designData = await getDesign(designId)
        
        if (designData) {
          loadDesign(designData)
          toast({title:'Design loaded successfully'})
        } else {
          toast({title:'Design not found',})
          router.push('/designs')
        }
      } catch (error) {
        console.error('Error loading design:', error)
        toast({title:'Failed to load design'});
      } finally {
        setIsLoading(false)
      }
    }

    fetchDesign()
    
    // Clean up function to reset design state when unmounting
    return () => {
      if (!readOnly) {
        // Auto-save on component unmount if not in read-only mode
        handleSaveDesign()
      }
    }
  }, [designId, loadDesign, router])

  // Handle saving design
  const handleSaveDesign = async () => {
    if (readOnly || elements.length === 0) return
    
    try {
      const saved = await saveDesign()
      if (saved) {
        toast({title:'Design saved successfully'})
        // If it's a new design and saved for the first time, update the URL
        // if (!designId && saved.id) {
        //   router.replace(`/designs/${saved.id}`, undefined, { shallow: true })
        // }
        return true
      }
    } catch (error) {
      console.error('Error saving design:', error)
      toast({title:'Failed to save design'})
      return false
    }
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only handle clicks directly on the canvas (not on elements)
    if (e.target === canvasRef.current) {
      setSelectedElement(null)
    }
  }

  // Handle element drag start
  const handleElementDragStart = (id: string) => {
    setSelectedElement(id)
    startDrag()
  }

  // Handle element drag
  const handleElementDrag = (id: string, position: Position) => {
    updateElementPosition(id, position)
  }

  // Handle element drag end
  const handleElementDragEnd = () => {
    endDrag()
    saveStateToHistory()
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when canvas is in focus
      if (!canvasRef.current?.contains(document.activeElement)) return
      
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && !readOnly) {
        e.preventDefault()
        handleSaveDesign()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [readOnly])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (readOnly) return

    const autoSaveInterval = setInterval(() => {
      if (elements.length > 0) {
        handleSaveDesign()
      }
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [elements, readOnly])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div 
      className="canvas-container relative overflow-auto  w-full h-full flex-1 flex items-center justify-center p-8"
    >
      <div
        ref={canvasRef}
        className="canvas relative shadow-lg"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          backgroundColor: canvasBackground,
          cursor: readOnly ? 'default' : 'pointer'
        }}
        onClick={!readOnly ? handleCanvasClick : undefined}
      >
        {elements.map((element: ElementType) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            readOnly={readOnly}
            onDragStart={() => handleElementDragStart(element.id)}
            onDrag={(position) => handleElementDrag(element.id, position)}
            onDragEnd={handleElementDragEnd}
            onClick={() => setSelectedElement(element.id)}
          />
        ))}
      </div>
    </div>
  )
}

;