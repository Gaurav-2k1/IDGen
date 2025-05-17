'use client'

import { useState, useEffect } from 'react'
import { useDesignStore } from '@/lib/Store'
import { Trash2, ArrowUp, ArrowDown, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ElementType } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'
import { ColorPicker } from './color-picker'

export function PropertyEditor() {
  const { toast } = useToast()
  const { 
    elements, 
    selectedElementId, 
    updateElement, 
    deleteElement, 
    moveElementForward, 
    moveElementBackward 
  } = useDesignStore()
  
  const selectedElement = elements.find(el => el.id === selectedElementId)
  const [localElement, setLocalElement] = useState<ElementType | null>(null)
  
  // Sync local state with store
  useEffect(() => {
    if (selectedElement) {
      setLocalElement({ ...selectedElement })
    } else {
      setLocalElement(null)
    }
  }, [selectedElement])
  
  // Update element when local state changes
  const handleUpdate = (updatedData: any) => {
    if (!selectedElementId || !localElement) return
    
    const newData = { ...localElement.data, ...updatedData }
    setLocalElement({ ...localElement, data: newData })
    updateElement(selectedElementId, { data: newData })
  }
  
  if (!localElement) return null
  
  // Handle text element properties
  const renderTextProperties = () => {
    if (localElement.type !== 'text') return null
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Text Content</Label>
          <Input
            value={localElement.data.content}
            onChange={(e) => handleUpdate({ content: e.target.value })}
          />
        </div>
        
        <div>
          <Label>Font Size</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.fontSize]}
              min={8}
              max={72}
              step={1}
              onValueChange={(value) => handleUpdate({ fontSize: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-right">{localElement.data.fontSize}px</span>
          </div>
        </div>
        
        <div>
          <Label>Font Weight</Label>
          <Select
            value={localElement.data.fontWeight}
            onValueChange={(value) => handleUpdate({ fontWeight: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
              <SelectItem value="lighter">Light</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Family</Label>
          <Select
            value={localElement.data.fontFamily}
            onValueChange={(value) => handleUpdate({ fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Courier New">Courier New</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Text Color</Label>
          <ColorPicker 
            color={localElement.data.color}
            onChange={(color) => handleUpdate({ color })}
          />
        </div>
        
        <div>
          <Label>Text Alignment</Label>
          <div className="flex gap-2 mt-2">
            <Button
              type="button"
              size="sm"
              variant={localElement.data.textAlign === 'left' ? 'default' : 'outline'}
              onClick={() => handleUpdate({ textAlign: 'left' })}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={localElement.data.textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => handleUpdate({ textAlign: 'center' })}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={localElement.data.textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => handleUpdate({ textAlign: 'right' })}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  // Handle image element properties
  const renderImageProperties = () => {
    if (localElement.type !== 'image') return null
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Image URL</Label>
          <Input
            value={localElement.data.src}
            onChange={(e) => handleUpdate({ src: e.target.value })}
          />
        </div>
        
        <div>
          <Label>Alt Text</Label>
          <Input
            value={localElement.data.alt || ''}
            onChange={(e) => handleUpdate({ alt: e.target.value })}
            placeholder="Image description"
          />
        </div>
        
        <div>
          <Label>Width</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.width]}
              min={20}
              max={500}
              step={1}
              onValueChange={(value) => handleUpdate({ width: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-right">{localElement.data.width}px</span>
          </div>
        </div>
        
        <div>
          <Label>Height</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.height]}
              min={20}
              max={500}
              step={1}
              onValueChange={(value) => handleUpdate({ height: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-right">{localElement.data.height}px</span>
          </div>
        </div>
      </div>
    )
  }
  
  // Handle shape element properties
  const renderShapeProperties = () => {
    if (localElement.type !== 'shape') return null
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Width</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.width]}
              min={10}
              max={500}
              step={1}
              onValueChange={(value) => handleUpdate({ width: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-right">{localElement.data.width}px</span>
          </div>
        </div>
        
        {localElement.data.shapeType === 'rectangle' && (
          <div>
            <Label>Height</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[localElement.data.height]}
                min={10}
                max={500}
                step={1}
                onValueChange={(value) => handleUpdate({ height: value[0] })}
                className="flex-1"
              />
              <span className="w-12 text-right">{localElement.data.height}px</span>
            </div>
          </div>
        )}
        
        <div>
          <Label>Background Color</Label>
          <ColorPicker 
            color={localElement.data.backgroundColor}
            onChange={(color) => handleUpdate({ backgroundColor: color })}
          />
        </div>
        
        {localElement.data.shapeType === 'rectangle' && (
          <div>
            <Label>Border Radius</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[localElement.data.borderRadius || 0]}
                min={0}
                max={50}
                step={1}
                onValueChange={(value) => handleUpdate({ borderRadius: value[0] })}
                className="flex-1"
              />
              <span className="w-12 text-right">{localElement.data.borderRadius || 0}px</span>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  // Handle element deletion with confirmation
  const handleDelete = () => {
    if (!selectedElementId) return
    
    toast({
      title: "Element deleted",
      description: "The element has been removed from your design"
    })
    
    deleteElement(selectedElementId)
  }
  
  // Handle layer movement (z-index)
  const handleMoveUp = () => {
    if (!selectedElementId) return
    moveElementForward(selectedElementId)
  }
  
  const handleMoveDown = () => {
    if (!selectedElementId) return
    moveElementBackward(selectedElementId)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium capitalize">{localElement.type} Properties</h3>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMoveUp}
            title="Move Forward"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMoveDown}
            title="Move Backward"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
            title="Delete Element"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <Label>Position X</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[localElement.position.x]}
            min={0}
            max={500}
            step={1}
            onValueChange={(value) => {
              updateElement(selectedElementId!, { 
                position: { ...localElement.position, x: value[0] } 
              })
              setLocalElement({
                ...localElement,
                position: { ...localElement.position, x: value[0] }
              })
            }}
            className="flex-1"
          />
          <span className="w-12 text-right">{localElement.position.x}px</span>
        </div>
      </div>
      
      <div>
        <Label>Position Y</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[localElement.position.y]}
            min={0}
            max={500}
            step={1}
            onValueChange={(value) => {
              updateElement(selectedElementId!, { 
                position: { ...localElement.position, y: value[0] } 
              })
              setLocalElement({
                ...localElement,
                position: { ...localElement.position, y: value[0] }
              })
            }}
            className="flex-1"
          />
          <span className="w-12 text-right">{localElement.position.y}px</span>
        </div>
      </div>
      
      <Separator />
      
      {renderTextProperties()}
      {renderImageProperties()}
      {renderShapeProperties()}
    </div>
  )
}