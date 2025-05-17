'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ElementType, Position } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { useDesignStore } from '@/lib/Store'
import { 
  Move, 
  ArrowUp, 
  ArrowDown, 
  Grid, 
  Lock, 
  Unlock, 
  Copy, 
  Trash2 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Grid constants
const GRID_SIZE = 10
const SNAP_THRESHOLD = 5

// Keyboard command constants
const KEYBOARD_COMMANDS = {
  DELETE: ['Delete', 'Backspace'],
  DUPLICATE: ['d'],
  BRING_FORWARD: ['ArrowUp'],
  SEND_BACKWARD: ['ArrowDown'],
  SELECT_ALL: ['a'],
  UNDO: ['z'],
  REDO: ['y'],
  GROUP: ['g'],
  UNGROUP: ['u'],
}

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const {
    elements,
    selectedElementId,
    setSelectedElement,
    updateElementPosition,
    canvasSize,
    canvasBackground,
    saveStateToHistory,
    deleteElement,
    duplicateElement,
    updateElementZIndex,
    undo,
    redo
  } = useDesignStore()
  const { toast } = useToast()
  
  // Enhanced state management
  const [dragging, setDragging] = useState<{
    id: string
    startX: number
    startY: number
    startElementX: number
    startElementY: number
  } | null>(null)
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [showGrid, setShowGrid] = useState<boolean>(false)
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true)
  const [isResizing, setIsResizing] = useState<{
    id: string
    handle: string
    startX: number
    startY: number
    startWidth: number
    startHeight: number
  } | null>(null)
  const [lockedElements, setLockedElements] = useState<string[]>([])

  // Update selected elements when selectedElementId changes
  useEffect(() => {
    if (selectedElementId) {
      if (!selectedElements.includes(selectedElementId)) {
        setSelectedElements([selectedElementId])
      }
    } else {
      setSelectedElements([])
    }
  }, [selectedElementId])

  // Handle selection of elements with Shift for multi-select
  const handleElementSelection = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation()
    
    // If element is locked, only select it (no dragging)
    if (lockedElements.includes(elementId)) {
      setSelectedElement(elementId)
      return
    }
    
    if (e.shiftKey) {
      // Multi-select with Shift key
      setSelectedElements(prev => {
        if (prev.includes(elementId)) {
          return prev.filter(id => id !== elementId)
        } else {
          setSelectedElement(elementId) // Still update primary selection
          return [...prev, elementId]
        }
      })
    } else {
      // Single select without Shift key
      setSelectedElements([elementId])
      setSelectedElement(elementId)
    }
  }

  // Handle mouse down on an element for dragging
  const handleElementMouseDown = (
    e: React.MouseEvent,
    elementId: string,
    position: Position
  ) => {
    e.stopPropagation()
    
    // If element is locked, only select it (no dragging)
    if (lockedElements.includes(elementId)) {
      setSelectedElement(elementId)
      return
    }
    
    handleElementSelection(e, elementId)
    
    setDragging({
      id: elementId,
      startX: e.clientX,
      startY: e.clientY,
      startElementX: position.x,
      startElementY: position.y,
    })
  }

  // Find closest grid snap position
  const getSnapPosition = (position: number): number => {
    if (!snapToGrid) return position
    return Math.round(position / GRID_SIZE) * GRID_SIZE
  }

  // Handle canvas click to deselect elements
  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if it's a direct click on the canvas (not on an element or during a drag)
    if (e.target === canvasRef.current) {
      setSelectedElement(null)
      setSelectedElements([])
    }
  }

  // Start resizing an element
  const startResizing = (
    e: React.MouseEvent,
    elementId: string,
    handle: string,
    width: number,
    height: number
  ) => {
    e.stopPropagation()
    e.preventDefault()
    
    setIsResizing({
      id: elementId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: width,
      startHeight: height,
    })
  }

  // Toggle element lock status
  const toggleElementLock = (elementId: string) => {
    setLockedElements(prev => {
      if (prev.includes(elementId)) {
        return prev.filter(id => id !== elementId)
      } else {
        return [...prev, elementId]
      }
    })
  }

  // Handle mouse move for dragging elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect()
        
        // Find the element being dragged
        const draggedElement = elements.find(el => el.id === dragging.id)
        if (!draggedElement) return
        
        // Calculate delta movement
        const deltaX = e.clientX - dragging.startX
        const deltaY = e.clientY - dragging.startY
        
        // Calculate new position with optional grid snapping
        let newX = dragging.startElementX + deltaX
        let newY = dragging.startElementY + deltaY
        
        if (snapToGrid) {
          newX = getSnapPosition(newX)
          newY = getSnapPosition(newY)
        }
        
        // Constrain to canvas bounds
        newX = Math.max(0, Math.min(newX, canvasSize.width - 10))
        newY = Math.max(0, Math.min(newY, canvasSize.height - 10))
        
        // Move the dragged element
        updateElementPosition(dragging.id, { x: newX, y: newY })
        
        // Move all other selected elements in sync (maintaining relative positions)
        if (selectedElements.length > 1) {
          selectedElements.forEach(id => {
            if (id !== dragging.id) {
              const element = elements.find(el => el.id === id)
              if (element) {
                const relativeX = element.position.x + deltaX
                const relativeY = element.position.y + deltaY
                
                const constrainedX = Math.max(0, Math.min(relativeX, canvasSize.width - 10))
                const constrainedY = Math.max(0, Math.min(relativeY, canvasSize.height - 10))
                
                let finalX = snapToGrid ? getSnapPosition(constrainedX) : constrainedX
                let finalY = snapToGrid ? getSnapPosition(constrainedY) : constrainedY
                
                updateElementPosition(id, { x: finalX, y: finalY })
              }
            }
          })
        }
      } else if (isResizing && canvasRef.current) {
        // Handle resizing logic
        const element = elements.find(el => el.id === isResizing.id)
        if (!element) return
        
        // Calculate delta movement
        const deltaX = e.clientX - isResizing.startX
        const deltaY = e.clientY - isResizing.startY
        
        // Get initial dimensions (may be in element.data)
        let width = isResizing.startWidth
        let height = isResizing.startHeight
        
        // Adjust dimensions based on which resize handle is being dragged
        switch (isResizing.handle) {
          case 'top-left':
            width = Math.max(20, isResizing.startWidth - deltaX)
            height = Math.max(20, isResizing.startHeight - deltaY)
            break
          case 'top-right':
            width = Math.max(20, isResizing.startWidth + deltaX)
            height = Math.max(20, isResizing.startHeight - deltaY)
            break
          case 'bottom-left':
            width = Math.max(20, isResizing.startWidth - deltaX)
            height = Math.max(20, isResizing.startHeight + deltaY)
            break
          case 'bottom-right':
            width = Math.max(20, isResizing.startWidth + deltaX)
            height = Math.max(20, isResizing.startHeight + deltaY)
            break
        }
        
        // Apply snapping if enabled
        if (snapToGrid) {
          width = getSnapPosition(width)
          height = getSnapPosition(height)
        }
        
        // Update element dimensions
        // Note: This would need to be implemented in your store
        // updateElementDimensions(isResizing.id, width, height)
        
        // For now, let's assume we have a way to update the element data directly
        const updatedElement = { ...element }
        if (element.type === 'image' || element.type === 'shape') {
          updatedElement.data = {
            ...updatedElement.data,
            width,
            height
          }
        }
        
        // We would need a method to update the element in the store
        // updateElement(updatedElement)
      }
    }

    const handleMouseUp = () => {
      // Save state to history when drag or resize ends
      if (dragging || isResizing) {
        saveStateToHistory()
      }
      setDragging(null)
      setIsResizing(null)
    }

    if (dragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragging, isResizing, elements, selectedElements, updateElementPosition, canvasSize, saveStateToHistory, snapToGrid])

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if we're focusing an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      
      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === KEYBOARD_COMMANDS.UNDO[0]) {
          e.preventDefault()
          undo()
        } else if (e.key === KEYBOARD_COMMANDS.REDO[0]) {
          e.preventDefault()
          redo()
        } else if (e.key === KEYBOARD_COMMANDS.SELECT_ALL[0]) {
          e.preventDefault()
          setSelectedElements(elements.map(el => el.id))
          if (elements.length > 0) {
            setSelectedElement(elements[0].id)
          }
        } else if (e.key === KEYBOARD_COMMANDS.DUPLICATE[0] && selectedElements.length > 0) {
          e.preventDefault()
          selectedElements.forEach(id => duplicateElement(id))
          saveStateToHistory()
        }
      } else {
        // Non-modifier key commands
        if (KEYBOARD_COMMANDS.DELETE.includes(e.key) && selectedElements.length > 0) {
          e.preventDefault()
          selectedElements.forEach(id => deleteElement(id))
          setSelectedElements([])
          setSelectedElement(null)
          saveStateToHistory()
        } else if (e.key === KEYBOARD_COMMANDS.BRING_FORWARD[0] && selectedElementId) {
          e.preventDefault()
          updateElementZIndex(selectedElementId, 'up')
          saveStateToHistory()
        } else if (e.key === KEYBOARD_COMMANDS.SEND_BACKWARD[0] && selectedElementId) {
          e.preventDefault()
          updateElementZIndex(selectedElementId, 'down')
          saveStateToHistory()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedElements, selectedElementId, elements, undo, redo, deleteElement, duplicateElement, updateElementZIndex, saveStateToHistory])

  // Render grid lines
  const renderGrid = useCallback(() => {
    if (!showGrid) return null
    
    const gridLines = []
    
    // Horizontal lines
    for (let y = 0; y <= canvasSize.height; y += GRID_SIZE) {
      gridLines.push(
        <div
          key={`h-${y}`}
          className="absolute left-0 right-0 border-t border-gray-200 pointer-events-none"
          style={{ top: `${y}px` }}
        />
      )
    }
    
    // Vertical lines
    for (let x = 0; x <= canvasSize.width; x += GRID_SIZE) {
      gridLines.push(
        <div
          key={`v-${x}`}
          className="absolute top-0 bottom-0 border-l border-gray-200 pointer-events-none"
          style={{ left: `${x}px` }}
        />
      )
    }
    
    return gridLines
  }, [showGrid, canvasSize.height, canvasSize.width])

  // Render resize handles for selected elements
  const renderResizeHandles = (element: ElementType) => {
    if (element.type === 'text') return null // Text doesn't get resize handles
    if (lockedElements.includes(element.id)) return null
    
    const handles = [
      { className: 'top-0 left-0 cursor-nwse-resize', id: 'top-left' },
      { className: 'top-0 right-0 cursor-nesw-resize', id: 'top-right' },
      { className: 'bottom-0 left-0 cursor-nesw-resize', id: 'bottom-left' },
      { className: 'bottom-0 right-0 cursor-nwse-resize', id: 'bottom-right' },
    ]
    
    let width = 100
    let height = 100
    
    if (element.type === 'image' || element.type === 'shape') {
      width = element.data.width
      height = element.data.height
    }
    
    return handles.map(handle => (
      <div
        key={handle.id}
        className={`absolute w-3 h-3 bg-primary border border-white rounded-full ${handle.className}`}
        style={{ transform: 'translate(-50%, -50%)' }}
        onMouseDown={(e) => startResizing(e, element.id, handle.id, width, height)}
      />
    ))
  }

  // Render each element based on its type
  const renderElement = (element: ElementType) => {
    const isSelected = selectedElements.includes(element.id)
    const isLocked = lockedElements.includes(element.id)
    
    const elementProps = {
      className: cn(
        'absolute transition-all',
        isSelected && 'ring-2 ring-primary ring-offset-1',
        isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-move'
      ),
      style: {
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        zIndex: element.zIndex,
      },
      onMouseDown: (e: React.MouseEvent) => 
        handleElementMouseDown(e, element.id, element.position),
      onClick: (e: React.MouseEvent) => handleElementSelection(e, element.id),
    }

    let renderedElement

    switch (element.type) {
      case 'text':
        renderedElement = (
          <div
            key={element.id}
            {...elementProps}
            style={{
              ...elementProps.style,
              fontSize: `${element.data.fontSize}px`,
              fontWeight: element.data.fontWeight,
              color: element.data.color,
              fontFamily: element.data.fontFamily,
              textAlign: element.data.textAlign as any,
              padding: '4px',
              minWidth: '20px',
              minHeight: '20px',
            }}
          >
            {element.data.content}
          </div>
        )
        break
        
      case 'image':
        renderedElement = (
          <div key={element.id} {...elementProps}>
            <img
              src={element.data.src}
              alt={element.data.alt || 'ID Card Image'}
              style={{
                width: `${element.data.width}px`,
                height: `${element.data.height}px`,
                objectFit: 'contain',
              }}
              onError={() => {
                toast({
                  variant: "destructive",
                  title: "Image error",
                  description: "Failed to load image",
                })
              }}
              draggable="false"
            />
          </div>
        )
        break
        
      case 'shape':
        // Render different shapes based on the shape type
        switch (element.data.shapeType) {
          case 'rectangle':
            renderedElement = (
              <div
                key={element.id}
                {...elementProps}
                style={{
                  ...elementProps.style,
                  width: `${element.data.width}px`,
                  height: `${element.data.height}px`,
                  backgroundColor: element.data.backgroundColor,
                  border: element.data.border,
                  borderRadius: `${element.data.borderRadius}px`,
                }}
              />
            )
            break
            
          case 'circle':
            renderedElement = (
              <div
                key={element.id}
                {...elementProps}
                style={{
                  ...elementProps.style,
                  width: `${element.data.width}px`,
                  height: `${element.data.width}px`, // Using width for height to make a perfect circle
                  backgroundColor: element.data.backgroundColor,
                  border: element.data.border,
                  borderRadius: '50%',
                }}
              />
            )
            break
            
          default:
            renderedElement = null
        }
        break
        
      default:
        renderedElement = null
    }

    // Wrapper to add resize handles if selected
    return (
      <div key={element.id} className="relative">
        {renderedElement}
        {isSelected && renderResizeHandles(element)}
      </div>
    )
  }

  // Quick actions toolbar for canvas
  const CanvasToolbar = () => (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-background shadow-lg rounded-lg border border-border flex items-center gap-1 p-1 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid size={16} className={showGrid ? "text-primary" : "text-muted-foreground"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Grid</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setSnapToGrid(!snapToGrid)}
            >
              <Move size={16} className={snapToGrid ? "text-primary" : "text-muted-foreground"} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Snap to Grid</p>
          </TooltipContent>
        </Tooltip>

        {selectedElementId && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => {
                    updateElementZIndex(selectedElementId, 'up')
                    saveStateToHistory()
                  }}
                >
                  <ArrowUp size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bring Forward</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => {
                    updateElementZIndex(selectedElementId, 'down')
                    saveStateToHistory()
                  }}
                >
                  <ArrowDown size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send Backward</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => toggleElementLock(selectedElementId)}
                >
                  {lockedElements.includes(selectedElementId) ? (
                    <Lock size={16} />
                  ) : (
                    <Unlock size={16} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{lockedElements.includes(selectedElementId) ? 'Unlock Element' : 'Lock Element'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => {
                    duplicateElement(selectedElementId)
                    saveStateToHistory()
                  }}
                >
                  <Copy size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duplicate</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => {
                    deleteElement(selectedElementId)
                    setSelectedElement(null)
                    setSelectedElements([])
                    saveStateToHistory()
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </TooltipProvider>
    </div>
  )

  // Selection info display
  const SelectionInfo = () => {
    if (selectedElements.length === 0) return null
    
    return (
      <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm p-2 rounded text-xs text-muted-foreground">
        {selectedElements.length === 1 ? (
          <>Selected: {selectedElementId}</>
        ) : (
          <>Selected: {selectedElements.length} elements</>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex items-center justify-center">
      <Card className="shadow-lg relative">
        <CardContent className="p-0">
          <div
            ref={canvasRef}
            className="relative overflow-hidden"
            style={{
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
              backgroundColor: canvasBackground,
              backgroundImage: canvasBackground.startsWith('#') ? 'none' : `url(${canvasBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={handleCanvasClick}
          >
            {/* Grid lines */}
            {renderGrid()}
            
            {/* Elements */}
            {elements.map(renderElement)}
            
            {/* Selection info */}
            <SelectionInfo />
            
            {/* Canvas toolbar */}
            <CanvasToolbar />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}