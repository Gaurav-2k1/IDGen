// components/Canvas/CanvasElement.tsx
import { useState, useRef, useEffect, useCallback, memo } from 'react'
import { ElementType, Position, TextElement as TextElementType, ImageElement as ImageElementType, ShapeElement as ShapeElementType } from '@/lib/types'
import { useDesignStore } from '@/lib/Store'
import TextElement from './text-element'
import ImageElement from './image-element'
import ShapeElementComponent from './shape-element'
import ResizeHandles from './resizeHandles'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface CanvasElementProps {
  element: ElementType;
  isSelected: boolean;
  readOnly: boolean;
  selectedElements?: ElementType[];
  onDragStart: () => void;
  onDrag: (position: Position) => void;
  onDragEnd: () => void;
  onClick: () => void;
  isBackside?: boolean;
}

// Error Fallback component for individual elements
const ElementErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div 
    className="relative p-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/20"
    style={{ minWidth: '100px', minHeight: '100px' }}
  >
    <p className="text-sm text-red-600 dark:text-red-400">Failed to render element</p>
    <button
      onClick={resetErrorBoundary}
      className="mt-2 text-xs text-red-600 dark:text-red-400 underline"
    >
      Try again
    </button>
  </div>
)

const CanvasElement = memo(function CanvasElement({ 
  element,
  isSelected, 
  readOnly,
  selectedElements = [],
  onDragStart, 
  onDrag, 
  onDragEnd, 
  onClick,
  isBackside = false
}: CanvasElementProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  
  const { updateElementDimensions } = useDesignStore()

  // Type guards
  const isTextElement = (el: ElementType): el is TextElementType => el.type === 'text'
  const isImageElement = (el: ElementType): el is ImageElementType => el.type === 'image'
  const isShapeElement = (el: ElementType): el is ShapeElementType => el.type === 'shape'

  // Memoized handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (readOnly || element.isLocked) return
    
    e.stopPropagation()
    onClick()
    
    // Start dragging only on direct element click (not on resize handles)
    if ((e.target as HTMLElement).getAttribute('data-resize-handle') !== 'true') {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      onDragStart()
    }
  }, [readOnly, element.isLocked, onClick, onDragStart])

  // Memoized mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart) return
    
    // Calculate position difference from drag start
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    
    // Update element position
    onDrag({
      x: element.position.x + dx,
      y: element.position.y + dy
    })
    
    // Update drag start point
    setDragStart({ x: e.clientX, y: e.clientY })
  }, [isDragging, dragStart, element.position, onDrag])

  // Memoized mouse up handler
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      onDragEnd()
    }
  }, [isDragging, onDragEnd])

  // Effect for mouse event listeners with cleanup
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      
      // Add a class to the body to prevent text selection while dragging
      document.body.classList.add('dragging')
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('dragging')
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Memoized resize handler
  const handleResize = useCallback((width: number, height: number) => {
    updateElementDimensions(element.id, width, height)
  }, [element.id, updateElementDimensions])

  // Memoized group resize handler
  const handleGroupResize = useCallback((updates: { id: string; width: number; height: number }[]) => {
    updates.forEach(update => {
      updateElementDimensions(update.id, update.width, update.height)
    })
  }, [updateElementDimensions])

  // Memoized element renderer
  const renderElement = useCallback(() => {
    const commonProps = {
      isSelected,
      readOnly,
      isBackside
    }

    try {
      const elementType = element.type as 'text' | 'image' | 'shape'
      switch (elementType) {
        case 'text':
          return <TextElement element={element as TextElementType} {...commonProps} />
        case 'image':
          return <ImageElement element={element as ImageElementType} {...commonProps} />
        case 'shape':
          return <ShapeElementComponent element={element as ShapeElementType} {...commonProps} />
        default:
          console.warn(`Unknown element type: ${elementType}`)
          return <div>Unknown element type</div>
      }
    } catch (error) {
      console.error(`Error rendering element:`, error)
      throw error // Let ErrorBoundary handle it
    }
  }, [element, isSelected, readOnly, isBackside])

  return (
    <ErrorBoundary 
      fallback={(
        <ElementErrorFallback 
          error={new Error('Failed to render element')} 
          resetErrorBoundary={() => {}} 
        />
      )}
    >
      <div
        ref={elementRef}
        className={`absolute transition-transform ${isSelected && !readOnly ? 'element-selected' : ''}`}
        style={{
          left: `${element.position.x}px`,
          top: `${element.position.y}px`,
          zIndex: element.zIndex,
          cursor: readOnly ? 'default' : isDragging ? 'grabbing' : 'grab',
          outline: isSelected && !readOnly ? '2px solid blue' : 'none',
          transform: isBackside ? 'rotateY(180deg)' : 'none',
          opacity: element.isVisible ? 1 : 0.5,
          pointerEvents: element.isLocked ? 'none' : 'auto'
        }}
        onMouseDown={handleMouseDown}
        data-element-id={element.id}
        data-element-type={element.type}
      >
        {renderElement()}
        
        {isSelected && !readOnly && (
          <ResizeHandles
            element={element}
            selectedElements={selectedElements}
            onResize={handleResize}
            onGroupResize={handleGroupResize}
          />
        )}
      </div>
    </ErrorBoundary>
  )
})

// Add display name for better debugging
CanvasElement.displayName = 'CanvasElement'

export default CanvasElement