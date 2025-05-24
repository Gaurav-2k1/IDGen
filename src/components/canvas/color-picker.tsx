'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// Default color options
const DEFAULT_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#F87171', // Red
  '#FBBF24', // Orange
  '#34D399', // Green
  '#60A5FA', // Blue
  '#A78BFA', // Purple
  '#F472B6', // Pink
  '#6B7280', // Gray
  '#1E293B', // Dark blue
]

interface ColorPickerProps {
  color: string | null
  onChange: (color: string) => void
  className?: string
  colors?: string[]
}

export function ColorPicker({
  color,
  onChange,
  className,
  colors = DEFAULT_COLORS,
}: ColorPickerProps) {
  const [localColor, setLocalColor] = React.useState(color ?? '#000000')

  // Update local color when prop changes
  React.useEffect(() => {
    setLocalColor(color ?? '#000000')
  }, [color])

  // Handle color change from input
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setLocalColor(newColor)
    onChange(newColor)
  }

  // Handle selecting a preset color
  const handleSelectColor = (selectedColor: string) => {
    setLocalColor(selectedColor)
    onChange(selectedColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'h-8 w-8 rounded-md border border-input flex items-center justify-center',
            className
          )}
          style={{ backgroundColor: localColor }}
          aria-label="Pick a color"
        >
          <span className="sr-only">Pick a color</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div
              className="h-8 w-8 rounded-md border border-input"
              style={{ backgroundColor: localColor }}
            />
            <input
              type="color"
              value={localColor}
              onChange={handleColorChange}
              className="h-8"
              id="color-picker"
            />
            <input
              type="text"
              value={localColor}
              onChange={handleColorChange}
              className="h-8 w-full rounded-md border border-input px-3 py-1 text-sm"
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>

          <div className="grid grid-cols-5 gap-2 pt-2">
            {colors.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  'h-6 w-6 rounded-md border border-input',
                  localColor === presetColor && 'ring-2 ring-primary ring-offset-1'
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => handleSelectColor(presetColor)}
                aria-label={`Select color ${presetColor}`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}