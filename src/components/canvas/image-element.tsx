// components/Canvas/Elements/ImageElement.tsx
import { ImageElement as ImageElementType } from '@/lib/types'

interface ImageElementProps {
  element: ImageElementType
  isSelected?: boolean
  readOnly?: boolean
}

const ImageElement = ({ element, isSelected, readOnly }: ImageElementProps) => {
  const { src, alt, width, height, layout, objectFit = 'cover', objectPosition = 'center' } = element.data

  // Generate clip path based on layout type
  const getClipPath = () => {
    switch (layout?.type) {
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'square':
        const size = Math.min(width, height);
        const x = (width - size) / 2;
        const y = (height - size) / 2;
        return `polygon(${x}px ${y}px, ${x + size}px ${y}px, ${x + size}px ${y + size}px, ${x}px ${y + size}px)`;
      case 'rectangle':
        return undefined; // No clip path needed for rectangle
      default:
        return undefined;
    }
  }

  // Calculate container styles based on layout
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    overflow: 'hidden',
    clipPath: getClipPath(),
    borderRadius: layout?.type === 'circle' ? '50%' : undefined,
    outline: isSelected && !readOnly ? '2px solid #007bff' : 'none',
  }

  // Calculate image styles
  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition,
  }

  // Placeholder for empty state
  if (!src) {
    return (
      <div 
        style={{
          ...containerStyle,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px',
        }}
      >
        Drop image here
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || 'Image'}
        style={imageStyle}
        draggable={false}
      />
    </div>
  )
}

export default ImageElement