// components/Canvas/Elements/ImageElement.tsx
import { ElementType } from '@/lib/types'
import Image from 'next/image'

interface ImageElementProps {
  element: ElementType
}

const ImageElement = ({ element }: ImageElementProps) => {
  const { src, width, height, alt } = element.data
  
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <Image
        src={src}
        alt={alt || 'Design element'}
        fill
        style={{ objectFit: 'cover' }}
        draggable={false}
        priority
      />
    </div>
  )
}

export default ImageElement