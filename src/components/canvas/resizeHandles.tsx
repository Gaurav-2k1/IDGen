// components/Canvas/ResizeHandles.tsx
import { useState, useEffect, useCallback } from 'react'
import { ElementType, Position } from '@/lib/types'

interface ResizeHandlesProps {
  element: ElementType
  selectedElements?: ElementType[]
  onResize: (width: number, height: number) => void
  onGroupResize?: (elements: { id: string; width: number; height: number }[]) => void
}

const ResizeHandles = ({ 
  element, 
  selectedElements = [], 
  onResize,
  onGroupResize 
}: ResizeHandlesProps) => {
  const [isResizing, setIsResizing] = useState(false)
  const [startPos, setStartPos] = useState<Position | null>(null)
  const [startDimensions, setStartDimensions] = useState<{ width: number; height: number } | null>(null)
  const [groupStartDimensions, setGroupStartDimensions] = useState<Array<{ id: string; width: number; height: number }>>([])
  
  const handleResizeStart = (e: React.MouseEvent) => {
    if (element.isLocked) return
    
    e.stopPropagation()
    e.preventDefault()
    
    setIsResizing(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    
    // Store initial dimensions for the main element
    const width = 'width' in element.data ? element.data.width : 100
    const height = 'height' in element.data ? element.data.height : 50
    setStartDimensions({ width, height })
    
    // Store initial dimensions for all selected elements
    if (selectedElements.length > 1) {
      const dimensions = selectedElements.map(el => ({
        id: el.id,
        width: 'width' in el.data ? el.data.width : 100,
        height: 'height' in el.data ? el.data.height : 50
      }))
      setGroupStartDimensions(dimensions)
    }
  }

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !startPos || !startDimensions) return
    
    const dx = e.clientX - startPos.x
    const dy = e.clientY - startPos.y
    
    // Calculate scale factors
    const scaleX = (startDimensions.width + dx) / startDimensions.width
    const scaleY = (startDimensions.height + dy) / startDimensions.height
    
    if (selectedElements.length > 1 && onGroupResize) {
      // Resize all selected elements proportionally
      const resizedElements = groupStartDimensions.map(el => ({
        id: el.id,
        width: Math.max(20, el.width * scaleX),
        height: Math.max(20, el.height * scaleY)
      }))
      onGroupResize(resizedElements)
    } else {
      // Resize single element
      const newWidth = Math.max(20, startDimensions.width + dx)
      const newHeight = Math.max(20, startDimensions.height + dy)
      onResize(newWidth, newHeight)
    }
  }, [isResizing, startPos, startDimensions, selectedElements, onGroupResize, groupStartDimensions, onResize])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResize)
      window.addEventListener('mouseup', () => {
        setIsResizing(false)
        setStartPos(null)
        setStartDimensions(null)
        setGroupStartDimensions([])
      })
    }
    return () => {
      window.removeEventListener('mousemove', handleResize)
      window.removeEventListener('mouseup', () => {})
    }
  }, [isResizing, handleResize])

  const resizeHandleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '10px',
    height: '10px',
    backgroundColor: '#007bff',
    borderRadius: '50%',
    cursor: 'nwse-resize',
    zIndex: 1000
  }

  return (
    <>
      {/* Bottom-right resize handle */}
      <div
        style={{
          ...resizeHandleStyle,
          bottom: '-5px',
          right: '-5px'
        }}
        onMouseDown={handleResizeStart}
        data-resize-handle="true"
      />
      
      {/* Bottom-left resize handle */}
      <div
        style={{
          ...resizeHandleStyle,
          bottom: '-5px',
          left: '-5px',
          cursor: 'sw-resize'
        }}
        onMouseDown={handleResizeStart}
        data-resize-handle="true"
      />
      
      {/* Top-right resize handle */}
      <div
        style={{
          ...resizeHandleStyle,
          top: '-5px',
          right: '-5px',
          cursor: 'ne-resize'
        }}
        onMouseDown={handleResizeStart}
        data-resize-handle="true"
      />
      
      {/* Top-left resize handle */}
      <div
        style={{
          ...resizeHandleStyle,
          top: '-5px',
          left: '-5px',
          cursor: 'nw-resize'
        }}
        onMouseDown={handleResizeStart}
        data-resize-handle="true"
      />
    </>
  )
}

export default ResizeHandles