// components/Canvas/Canvas.tsx
'use client '
import { useRef, useEffect, useState, useCallback } from 'react'
import { useDesignStore } from '@/lib/Store'
import { ElementType, Position } from '@/lib/types'
import { useToast } from '../ui/use-toast'
import CanvasElement from './canvas-element'
import { getDesign } from '@/services/design-service'
import { useRouter } from 'next/navigation'

interface CanvasProps {
  designId?: string
  readOnly?: boolean
  showBackside?: boolean
}

export function Canvas({ designId, readOnly = false, showBackside = false }: CanvasProps) {
  const router = useRouter();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(designId ? true : false)
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [isGroupDragging, setIsGroupDragging] = useState(false)
  const [groupDragStart, setGroupDragStart] = useState<Position | null>(null)
  
  // Get design state and methods from store
  const {
    elements,
    backsideElements,
    selectedElementId,
    canvasSize,
    canvasBackground,
    setSelectedElement,
    updateElementPosition,
    updateMultipleElementPositions,
    saveDesign,
    loadDesign,
    startDrag,
    endDrag,
    saveStateToHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useDesignStore()

  // Get current elements based on side
  const currentElements = showBackside ? backsideElements : elements

  // Wrap handleSaveDesign in useCallback
  const handleSaveDesign = useCallback(async () => {
    if (readOnly || elements.length === 0) return
    
    try {
      const saved = await saveDesign()
      if (saved) {
        toast({
          title: 'Design saved successfully'
        })
        return true
      }
    } catch (error) {
      console.error('Error saving design:', error)
      toast({
        title: 'Failed to save design'
      })
      return false
    }
  }, [readOnly, elements.length, saveDesign, toast])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when canvas is in focus and not in read-only mode
      if (readOnly) return

      // Ctrl+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey && canUndo) {
        e.preventDefault()
        undo()
      }
      
      // Ctrl+Shift+Z or Ctrl+Y for redo
      if ((e.ctrlKey || e.metaKey) && ((e.key === 'z' && e.shiftKey) || e.key === 'y') && canRedo) {
        e.preventDefault()
        redo()
      }

      // Ctrl+A for select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        if (!readOnly) {
          const allElementIds = elements.map(el => el.id)
          setSelectedElements(allElementIds)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [elements, readOnly, undo, redo, canUndo, canRedo])

  // Handle multi-select with Ctrl+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        if (!readOnly) {
          const allElementIds = elements.map(el => el.id)
          setSelectedElements(allElementIds)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [elements, readOnly])

  // Handle element drag start
  const handleElementDragStart = (id: string) => {
    if (!selectedElements.includes(id)) {
      setSelectedElements([id])
    }
    setSelectedElement(id)
    startDrag()
  }

  // Handle element drag
  const handleElementDrag = (id: string, position: Position) => {
    if (selectedElements.length > 1) {
      // If multiple elements are selected, move them all together
      const mainElement = currentElements.find(el => el.id === id)
      if (!mainElement) return

      const dx = position.x - mainElement.position.x
      const dy = position.y - mainElement.position.y

      const validElements = selectedElements
        .map(elementId => currentElements.find(el => el.id === elementId))
        .filter((el): el is ElementType => el !== undefined)

      const updates = validElements.map(element => ({
        id: element.id,
        position: {
          x: element.position.x + dx,
          y: element.position.y + dy
        }
      }))

      updateMultipleElementPositions(updates, showBackside)
    } else {
      updateElementPosition(id, position, showBackside)
    }
  }

  // Handle element drag end
  const handleElementDragEnd = () => {
    endDrag()
    saveStateToHistory()
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null)
      setSelectedElements([])
    }
  }

  // Handle group dragging
  const handleGroupDrag = (e: React.MouseEvent) => {
    if (isGroupDragging && groupDragStart && selectedElements.length > 0) {
      const dx = e.clientX - groupDragStart.x
      const dy = e.clientY - groupDragStart.y

      // Update positions of all selected elements
      const updates = selectedElements.map(id => {
        const element = currentElements.find(el => el.id === id)
        if (!element) return null
        return {
          id,
          position: {
            x: element.position.x + dx,
            y: element.position.y + dy
          }
        }
      }).filter((update): update is { id: string; position: Position } => update !== null)

      updateMultipleElementPositions(updates, showBackside)
      setGroupDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Handle group drag end
  const handleGroupDragEnd = () => {
    if (isGroupDragging) {
      setIsGroupDragging(false)
      setGroupDragStart(null)
      endDrag()
      saveStateToHistory()
    }
  }

  // Handle group drag start
  const handleGroupDragStart = (e: React.MouseEvent) => {
    if (selectedElements.length > 0) {
      setIsGroupDragging(true)
      setGroupDragStart({ x: e.clientX, y: e.clientY })
      startDrag()
    }
  }

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
          toast({title:'Design not found'})
          router.push('/designs')
        }
      } catch (error) {
        console.error('Error loading design:', error)
        toast({title:'Failed to load design'})
      } finally {
        setIsLoading(false)
      }
    }

    fetchDesign()
    
    // Clean up function to reset design state when unmounting
    return () => {
      if (!readOnly) {
        handleSaveDesign()
      }
    }
  }, [designId, loadDesign, router, readOnly, handleSaveDesign, toast])

  // Update useEffect dependencies
  useEffect(() => {
    if (!readOnly) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
          e.preventDefault()
          handleSaveDesign()
          toast({
            title: 'Design saved',
            description: 'Your design has been saved successfully.',
          })
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSaveDesign, readOnly, toast])

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div 
      className="canvas-container relative overflow-auto w-full h-full flex-1 flex items-center justify-center p-8"
      onMouseMove={handleGroupDrag}
      onMouseUp={handleGroupDragEnd}
    >
      <div
        ref={canvasRef}
        className="canvas relative shadow-lg"
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          backgroundColor: canvasBackground,
          cursor: readOnly ? 'default' : 'pointer',
          transform: showBackside ? 'rotateY(180deg)' : 'none',
          transition: 'transform 0.5s ease-in-out'
        }}
        onClick={!readOnly ? handleCanvasClick : undefined}
        onMouseDown={!readOnly ? handleGroupDragStart : undefined}
      >
        {currentElements.map((element: ElementType) => {
          const selectedElementsList = selectedElements.length > 0 
            ? currentElements.filter(el => selectedElements.includes(el.id))
            : []

          return (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={element.id === selectedElementId || selectedElements.includes(element.id)}
              readOnly={readOnly}
              selectedElements={selectedElementsList}
              onDragStart={() => handleElementDragStart(element.id)}
              onDrag={(position) => handleElementDrag(element.id, position)}
              onDragEnd={handleElementDragEnd}
              onClick={() => {
                if (!selectedElements.includes(element.id)) {
                  setSelectedElements([...selectedElements, element.id])
                }
                setSelectedElement(element.id)
              }}
              isBackside={showBackside}
            />
          )
        })}
      </div>
    </div>
  )
}

;