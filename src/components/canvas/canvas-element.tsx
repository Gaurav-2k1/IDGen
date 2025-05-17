'use client'

import { useRef, useState } from 'react'
import { useDesignStore } from '@/lib/Store'

// This is an example implementation for a draggable element on the canvas
export function CanvasElement({ element }) {
  const { 
    updateElementPosition, 
    setSelectedElement, 
    selectedElementId,
    startDrag,
    endDrag
  } = useDesignStore()
  
  const elementRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  
  const isSelected = selectedElementId === element.id

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    e.stopPropagation()
    
    // Select this element
    setSelectedElement(element.id)
    
    // Start tracking drag
    startDrag()
    setIsDragging(true)
    
    // Calculate offset from mouse position to element position
    const rect = elementRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  
  // Handle mouse move during drag
  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    // Calculate new position based on mouse position and offset
    const canvasRect = elementRef.current.parentElement.getBoundingClientRect()
    const newX = e.clientX - canvasRect.left - dragOffset.x
    const newY = e.clientY - canvasRect.top - dragOffset.y
    
    // Update element position in store
    updateElementPosition(element.id, { x: newX, y: newY })
  }
  
  // Handle mouse up to end drag
  const handleMouseUp = () => {
    setIsDragging(false)
    endDrag() // Notify store that drag has ended
    
    // Clean up event listeners
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  // Prevent selection from being lost when clicking inside the element
  const handleClick = (e) => {
    e.stopPropagation()
    setSelectedElement(element.id)
  }
  
  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        left: `${element.position.x}px`,
        top: `${element.position.y}px`,
        zIndex: element.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {/* Render element based on its type */}
      {element.type === 'text' && (
        <div
          style={{
            color: element.data.color,
            fontSize: `${element.data.fontSize}px`,
            fontWeight: element.data.fontWeight,
            fontFamily: element.data.fontFamily,
            textAlign: element.data.textAlign,
          }}
        >
          {element.data.content}
        </div>
      )}
      
      {element.type === 'image' && (
        <img
          src={element.data.src}
          alt={element.data.alt}
          width={element.data.width}
          height={element.data.height}
        />
      )}
      
      {element.type === 'shape' && element.data.shapeType === 'rectangle' && (
        <div
          style={{
            width: `${element.data.width}px`,
            height: `${element.data.height}px`,
            backgroundColor: element.data.backgroundColor,
            border: element.data.border,
          }}
        />
      )}
      
      {element.type === 'shape' && element.data.shapeType === 'circle' && (
        <div
          style={{
            width: `${element.data.width}px`,
            height: `${element.data.height}px`,
            backgroundColor: element.data.backgroundColor,
            border: element.data.border,
            borderRadius: '50%',
          }}
        />
      )}
      
      {/* You can add more element types here */}
    </div>
  )
}