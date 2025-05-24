// components/Canvas/CanvasElement.tsx
import { useState, useRef, useEffect } from 'react'
import { ElementType, Position, TextElement as TextElementType, ImageElement as ImageElementType, ShapeElement as ShapeElementType } from '@/lib/types'

import { useDesignStore } from '@/lib/Store'
import TextElement from './text-element'
import ImageElement from './image-element'
import ShapeElementComponent from './shape-element'
import ResizeHandles from './resizeHandles'

interface CanvasElementProps {
  element: ElementType
  isSelected: boolean
  readOnly: boolean
  selectedElements?: ElementType[]
  onDragStart: () => void
  onDrag: (position: Position) => void
  onDragEnd: () => void
  onClick: () => void
  isBackside?: boolean
}

const CanvasElement = ({ 
  element, 
  isSelected, 
  readOnly,
  selectedElements = [],
  onDragStart, 
  onDrag, 
  onDragEnd, 
  onClick,
  isBackside = false
}: CanvasElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  
  const { updateElementDimensions } = useDesignStore()

  // Handle mouse down on element
  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly || element.isLocked) return
    
    e.stopPropagation()
    onClick()
    
    // Start dragging only on direct element click (not on resize handles)
    if ((e.target as HTMLElement).getAttribute('data-resize-handle') !== 'true') {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      onDragStart()
    }
  }

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
    }
    
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        onDragEnd()
      }
    }
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, onDrag, onDragEnd, element.position])

  // Handle resize
  const handleResize = (width: number, height: number) => {
    updateElementDimensions(element.id, width, height)
  }

  // Handle group resize
  const handleGroupResize = (updates: { id: string; width: number; height: number }[]) => {
    updates.forEach(update => {
      updateElementDimensions(update.id, update.width, update.height)
    })
  }

  // Render element based on type
  const renderElement = () => {
    const commonProps = {
      isSelected,
      readOnly,
      isBackside
    }

    switch (element.type) {
      case 'text':
        return <TextElement element={element as TextElementType} {...commonProps} />
      case 'image':
        return <ImageElement element={element as ImageElementType} {...commonProps} />
      case 'shape':
        return <ShapeElementComponent element={element as ShapeElementType} {...commonProps} />
      default:
        return <div>Unknown element type</div>
    }
  }

  return (
    <div
      ref={elementRef}
      className={`absolute ${isSelected && !readOnly ? 'element-selected' : ''}`}
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        zIndex: element.zIndex,
        cursor: readOnly ? 'default' : 'move',
        outline: isSelected && !readOnly ? '2px solid blue' : 'none',
        transform: isBackside ? 'rotateY(180deg)' : 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      { renderElement()}
      
      {/* Resize handles shown only when selected and not read-only */}
      {isSelected && !readOnly && (
        <ResizeHandles
          element={element}
          selectedElements={selectedElements}
          onResize={handleResize}
          onGroupResize={handleGroupResize}
        />
      )}
    </div>
  )
}

export default CanvasElement