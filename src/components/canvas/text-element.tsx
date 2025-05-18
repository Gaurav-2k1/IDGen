import { useState, useEffect, useRef, useCallback } from 'react'
import { TextElement as TextElementType } from '@/lib/types'
import { useDesignStore } from '@/lib/Store'

interface TextElementProps {
  element: TextElementType
  isSelected: boolean
  readOnly: boolean
}

const TextElement = ({ element, isSelected, readOnly }: TextElementProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [initialText, setInitialText] = useState('')
  const textRef = useRef<HTMLDivElement>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  
  // Resize state
  const [resizing, setResizing] = useState(false)
  const [resizeStartX, setResizeStartX] = useState(0)
  const [resizeStartY, setResizeStartY] = useState(0)
  const [initialWidth, setInitialWidth] = useState(0)
  const [initialHeight, setInitialHeight] = useState(0)
  
  const { 
    updateElement, 
    isDragging, 
    startDrag, 
    endDrag,
    saveStateToHistory 
  } = useDesignStore()
  
  const { 
    text, 
    fontSize = 16, 
    fontFamily = 'Arial', 
    color = '#000000', 
    fontWeight = 'normal', 
    fontStyle = 'normal', 
    textAlign = 'left',
    width = 100,
    height = 50
  } = element.data

  // Handle double click to start editing
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (readOnly) return
    
    e.stopPropagation()
    setIsEditing(true)
    setInitialText(text || '')
    
    // Prevent dragging while editing
    if (isDragging) {
      endDrag()
    }
  }

  // Handle text change
  const handleTextChange = useCallback(() => {
    if (!textRef.current) return
    
    const newText = textRef.current.innerText
    
    // Only update if text has changed
    if (newText !== initialText) {
      updateElement(element.id, {
        data: {
          ...element.data,
          text: newText
        }
      })
      
      // Save state to history after text edit
      saveStateToHistory()
    }
  }, [element.id, element.data, initialText, updateElement, saveStateToHistory])

  // Focus the text input when editing starts
  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus()
      
      // Set cursor at the end
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(textRef.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [isEditing])

  // Handle click outside to stop editing
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (textRef.current && !textRef.current.contains(e.target as Node)) {
        if (isEditing) {
          handleTextChange()
          setIsEditing(false)
        }
      }
    }
    
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isEditing, handleTextChange])

  // Handle keyboard shortcuts for text formatting
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Enter key press (without shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleTextChange()
      setIsEditing(false)
      return
    }
    
    // Handle common text formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'b': 
          e.preventDefault()
          updateElement(element.id, {
            data: {
              ...element.data,
              fontWeight: element.data.fontWeight === 'bold' ? 'normal' : 'bold'
            }
          })
          break
        case 'i':
          e.preventDefault()
          updateElement(element.id, {
            data: {
              ...element.data,
              fontStyle: element.data.fontStyle === 'italic' ? 'normal' : 'italic'
            }
          })
          break
        default:
          break
      }
    }
  }

  // RESIZE FUNCTIONALITY
  const startResize = (e: React.MouseEvent) => {
    if (readOnly || isEditing) return

    e.stopPropagation()
    e.preventDefault()
    
    setResizing(true)
    setResizeStartX(e.clientX)
    setResizeStartY(e.clientY)
    setInitialWidth(width)
    setInitialHeight(height)
    
    // Add global event listeners
    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
  }
  
  const handleResize = useCallback((e: MouseEvent) => {
    if (!resizing) return
    
    const deltaX = e.clientX - resizeStartX
    const deltaY = e.clientY - resizeStartY
    
    const newWidth = Math.max(50, initialWidth + deltaX)
    const newHeight = Math.max(20, initialHeight + deltaY)
    
    updateElement(element.id, {
      data: {
        ...element.data,
        width: newWidth,
        height: newHeight
      }
    })
  }, [resizing, resizeStartX, resizeStartY, initialWidth, initialHeight, element.id, element.data, updateElement])
  
  const stopResize = useCallback(() => {
    setResizing(false)
    saveStateToHistory()
    
    // Remove global event listeners
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
  }, [handleResize, saveStateToHistory])
  
  // Cleanup event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResize)
    }
  }, [handleResize, stopResize])

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (readOnly || isEditing) return
    
    // Prevent default to avoid text selection during dragging
    e.preventDefault()
    
    // Signal drag start to parent
    startDrag()
  }

  // Create styles for the element
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    outline: isSelected && !readOnly ? '1px solid #007bff' : 'none'
  }
  
  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontFamily,
    color,
    fontWeight,
    fontStyle,
    textAlign: textAlign as any,
    width: '100%',
    height: '100%',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    overflow: 'visible',
    userSelect: readOnly ? 'none' : 'text',
    cursor: readOnly ? 'default' : isEditing ? 'text' : 'move',
    padding: '4px'
  }
  
  // Resize handle styles
  const resizeHandleStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-5px',
    right: '-5px',
    width: '10px',
    height: '10px',
    background: '#007bff',
    borderRadius: '50%',
    cursor: 'nwse-resize',
    zIndex: 100
  }

  return (
    <div 
      ref={elementRef}
      style={containerStyle}
      data-element-id={element.id}
    >
      <div
        ref={textRef}
        contentEditable={isEditing && !readOnly}
        suppressContentEditableWarning
        style={textStyle}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onBlur={() => {
          if (isEditing) {
            handleTextChange()
            setIsEditing(false)
          }
        }}
        onKeyDown={handleKeyDown}
        onPaste={(e) => {
          // Handle paste to strip formatting
          if (isEditing) {
            e.preventDefault()
            const text = e.clipboardData.getData('text/plain')
            document.execCommand('insertText', false, text)
          }
        }}
        aria-label={`Text element: ${text?.substring(0, 20)}${text?.length > 20 ? '...' : ''}`}
      >
        {text}
      </div>
      
      {/* Resize handle - only show when selected and not in read-only mode */}
      {isSelected && !readOnly && !isEditing && (
        <div 
          style={resizeHandleStyle}
          onMouseDown={startResize}
        />
      )}
    </div>
  )
}

export default TextElement