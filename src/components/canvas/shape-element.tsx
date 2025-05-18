// components/Canvas/Elements/ShapeElement.tsx
import { ElementType } from '@/lib/types'

interface ShapeElementProps {
  element: ElementType
}

const ShapeElement = ({ element }: ShapeElementProps) => {
  const { shapeType, width, height, backgroundColor, borderRadius, borderWidth, borderColor } = element.data
  
  // Render different shape types
  const renderShape = () => {
    const commonStyles = {
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor,
      borderWidth: `${borderWidth}px`,
      borderColor,
      borderStyle: 'solid'
    }
    
    switch (shapeType) {
      case 'rectangle':
        return (
          <div
            style={{
              ...commonStyles,
              borderRadius: `${borderRadius}px`
            }}
          />
        )
      case 'circle':
        return (
          <div
            style={{
              ...commonStyles,
              borderRadius: '50%'
            }}
          />
        )
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${width / 2}px solid transparent`,
              borderRight: `${width / 2}px solid transparent`,
              borderBottom: `${height}px solid ${backgroundColor}`
            }}
          />
        )
      default:
        return (
          <div
            style={commonStyles}
          />
        )
    }
  }
  
  return (
    <div className="shape-element">
      {renderShape()}
    </div>
  )
}

export default ShapeElement