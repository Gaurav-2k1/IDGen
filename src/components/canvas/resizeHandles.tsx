// components/Canvas/ResizeHandles.tsx
import { useEffect, useState } from 'react'
import { ElementType } from '@/lib/types'

interface ResizeHandlesProps {
  element: ElementType
  onResize: (width: number, height: number) => void
}

const ResizeHandles = ({ element, onResize }: ResizeHandlesProps) => {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 })

  // Get element dimensions based on type
  const getElementDimensions = () => {
    switch (element.type) {
      case 'text':
        return {
          width: element.data.width || 100,
          height: element.data.height || 50
        }
      case 'image':
      case 'shape':
        return {
          width: element.data.width,
          height: element.data.height
        }
      default:
        return { width: 100, height: 100 }
    }
  }

  const { width, height } = getElementDimensions()

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeHandle(handle)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartDimensions({ width, height })
  }

  // Handle resizing with mouse move
  useEffect(() => {
    if (!isResizing || !resizeHandle) return

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      
      const dx = e.clientX - startPos.x
      const dy = e.clientY - startPos.y
      
      let newWidth = startDimensions.width
      let newHeight = startDimensions.height
      
      // Update dimensions based on which handle is being dragged
      switch (resizeHandle) {
        case 'e': // right
          newWidth = Math.max(20, startDimensions.width + dx)
          break
        case 'w': // left
          newWidth = Math.max(20, startDimensions.width - dx)
          break
        case 's': // bottom
          newHeight = Math.max(20, startDimensions.height + dy)
          break
        case 'n': // top
          newHeight = Math.max(20, startDimensions.height - dy)
          break
        case 'se': // bottom-right
          newWidth = Math.max(20, startDimensions.width + dx)
          newHeight = Math.max(20, startDimensions.height + dy)
          break
        case 'sw': // bottom-left
          newWidth = Math.max(20, startDimensions.width - dx)
          newHeight = Math.max(20, startDimensions.height + dy)
          break
        case 'ne': // top-right
          newWidth = Math.max(20, startDimensions.width + dx)
          newHeight = Math.max(20, startDimensions.height - dy)
          break
        case 'nw': // top-left
          newWidth = Math.max(20, startDimensions.width - dx)
          newHeight = Math.max(20, startDimensions.height - dy)
          break
      }
      
      onResize(newWidth, newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeHandle, startPos, startDimensions, onResize])

  return (
    <>
      {/* Corner handles */}
      <div
        data-resize-handle="true"
        className="absolute w-3 h-3 bg-blue-500 rounded-full -top-1.5 -left-1.5 cursor-nw-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      <div
        data-resize-handle="true"
        className="absolute w-3 h-3 bg-blue-500 rounded-full -top-1.5 -right-1.5 cursor-ne-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      <div
        data-resize-handle="true"
        className="absolute w-3 h-3 bg-blue-500 rounded-full -bottom-1.5 -left-1.5 cursor-sw-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
      <div
        data-resize-handle="true"
        className="absolute w-3 h-3 bg-blue-500 rounded-full -bottom-1.5 -right-1.5 cursor-se-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />
      
      {/* Middle edge handles */}
      <div
        data-resize-handle="true"
        className="absolute w-3 h-3 bg-blue-500 rounded-full top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      <div
        data-resize-handle="true"
        className="absolute w-3 h-3 bg-blue-500 rounded-full top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />
      <div
        data-resize-handle="true"
        className="absolute w-3 h-3 bg-blue-500 rounded-full left-1/2 -top-1.5 -translate-x-1/2 cursor-n-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      <div
        data-resize-handle="true"
        className="absolute w-3 h-3 bg-blue-500 rounded-full left-1/2 -bottom-1.5 -translate-x-1/2 cursor-s-resize z-50"
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
    </>
  )
}

export default ResizeHandles