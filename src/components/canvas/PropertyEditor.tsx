'use client'

import { useState, useEffect } from 'react'
import { useDesignStore } from '@/lib/Store'
import { 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Lock, 
  Unlock,
  Copy,
  Move,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  ElementType,
  TextElement,
  ImageElement,
  ShapeElement,
  Position,
  TextElementData,
  ImageElementData,
  ShapeElementData
} from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'
import { ColorPicker } from './color-picker'

type ElementData = TextElementData | ImageElementData | ShapeElementData

// Type guards
const isTextElement = (element: ElementType): element is TextElement => element.type === 'text'
const isImageElement = (element: ElementType): element is ImageElement => element.type === 'image'
const isShapeElement = (element: ElementType): element is ShapeElement => element.type === 'shape'

// Type-safe update helpers
const updateTextElement = (element: TextElement, updates: Partial<TextElementData>) => ({
  ...element,
  data: { ...element.data, ...updates }
})

const updateImageElement = (element: ImageElement, updates: Partial<ImageElementData>) => ({
  ...element,
  data: { ...element.data, ...updates }
})

const updateShapeElement = (element: ShapeElement, updates: Partial<ShapeElementData>) => ({
  ...element,
  data: { ...element.data, ...updates }
})

// Type-safe update types
type TextElementUpdate = { type: 'text' } & Partial<TextElementData>
type ImageElementUpdate = { type: 'image' } & Partial<ImageElementData>
type ShapeElementUpdate = { type: 'shape' } & Partial<ShapeElementData>
type ElementUpdate = TextElementUpdate | ImageElementUpdate | ShapeElementUpdate

interface ColorPickerProps {
  color: string | null;
  onChange: (color: string) => void;
  className?: string;
}

export function PropertyEditor() {
  const { toast } = useToast()
  const { 
    elements,
    backsideElements, 
    selectedElementId,
    updateElement,
    deleteElement,
    moveElementForward,
    moveElementBackward,
    duplicateElement
  } = useDesignStore()
  
  const [isEditingBackside, setIsEditingBackside] = useState(false)
  const selectedElement = isEditingBackside 
    ? backsideElements?.find(el => el.id === selectedElementId)
    : elements?.find(el => el.id === selectedElementId)

  const [localElement, setLocalElement] = useState<ElementType | null>(null)
  const [activeTab, setActiveTab] = useState('general')
  
  // Sync local state with store
  useEffect(() => {
    if (selectedElement) {
      setLocalElement({ ...selectedElement })
    } else {
      setLocalElement(null)
    }
  }, [selectedElement])
  
  // Update element when local state changes
  const handleUpdate = (updatedData: Partial<ElementData>) => {
    if (!selectedElementId || !localElement) return
    
    let updatedElement: ElementType | null = null
    
    if (isTextElement(localElement)) {
      const textUpdate: TextElementUpdate = { type: 'text', ...updatedData }
      updatedElement = updateTextElement(localElement, textUpdate)
    } else if (isImageElement(localElement)) {
      const imageUpdate: ImageElementUpdate = { type: 'image', ...updatedData }
      updatedElement = updateImageElement(localElement, imageUpdate)
    } else if (isShapeElement(localElement)) {
      const shapeUpdate: ShapeElementUpdate = { type: 'shape', ...updatedData }
      updatedElement = updateShapeElement(localElement, shapeUpdate)
    }
    
    if (updatedElement && selectedElementId) {
      setLocalElement(updatedElement)
      updateElement(selectedElementId, { data: updatedElement.data } as Partial<typeof updatedElement>, isEditingBackside)
    }
  }

  // Update element position
  const handlePositionUpdate = (axis: keyof Position, value: number) => {
    if (!selectedElementId || !localElement) return

    const newPosition = { ...localElement.position, [axis]: value }
    updateElement(selectedElementId, { position: newPosition }, isEditingBackside)
    setLocalElement({ ...localElement, position: newPosition })
  }
  
  // Update element visibility
  const handleVisibilityToggle = () => {
    if (!selectedElementId || !localElement) return
    
    const newVisibility = !localElement.isVisible
    updateElement(selectedElementId, { isVisible: newVisibility }, isEditingBackside)
    setLocalElement({ ...localElement, isVisible: newVisibility })
  }
  
  // Update element lock state
  const handleLockToggle = () => {
    if (!selectedElementId || !localElement) return
    
    const newLockState = !localElement.isLocked
    updateElement(selectedElementId, { isLocked: newLockState }, isEditingBackside)
    setLocalElement({ ...localElement, isLocked: newLockState })
  }
  
  const handleDuplicate = () => {
    if (!selectedElementId) return
    
    duplicateElement(selectedElementId, isEditingBackside)
    
    toast({
      title: "Element duplicated",
      description: "A copy of the element has been created"
    })
  }
  
  if (!localElement) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Select an element to edit its properties</p>
      </div>
    )
  }
  
  // Handle common properties for all elements
  const renderGeneralProperties = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label>Position X</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.position.x]}
              min={0}
              max={800}
              step={1}
              onValueChange={(value) => handlePositionUpdate('x', value[0])}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.position.x}
              onChange={(e) => handlePositionUpdate('x', Number(e.target.value))}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Position Y</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.position.y]}
              min={0}
              max={800}
              step={1}
              onValueChange={(value) => handlePositionUpdate('y', value[0])}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.position.y}
              onChange={(e) => handlePositionUpdate('y', Number(e.target.value))}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Z-Index</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={localElement.zIndex}
              onChange={(e) => {
                if (!selectedElementId) return
                const zIndex = Number(e.target.value)
                updateElement(selectedElementId, { zIndex }, isEditingBackside)
                setLocalElement({ ...localElement, zIndex })
              }}
              className="w-20"
              disabled={localElement.isLocked}
            />
            <div className="flex items-center gap-1 ml-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (!selectedElementId) return
                        moveElementForward(selectedElementId, isEditingBackside)
                      }}
                      disabled={localElement.isLocked}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bring Forward</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (!selectedElementId) return
                        moveElementBackward(selectedElementId, isEditingBackside)
                      }}
                      disabled={localElement.isLocked}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send Backward</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={localElement.isVisible}
              onCheckedChange={handleVisibilityToggle}
              id="element-visibility"
            />
            <Label htmlFor="element-visibility">Visible</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={localElement.isLocked}
              onCheckedChange={handleLockToggle}
              id="element-lock"
            />
            <Label htmlFor="element-lock">Locked</Label>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <Label className="font-medium">Element ID: {localElement.id}</Label>
        </div>
      </div>
    )
  }
  
  // Handle text element properties
  const renderTextProperties = () => {
    if (!localElement || !isTextElement(localElement)) return null
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Text Content</Label>
          <Input
            value={localElement.data.text}
            onChange={(e) => handleUpdate({ text: e.target.value } as Partial<TextElementData>)}
            disabled={localElement.isLocked}
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
              onValueChange={(value) => handleUpdate({ fontSize: value[0] } as Partial<TextElementData>)}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.fontSize}
              onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) } as Partial<TextElementData>)}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Font Family</Label>
          <Select
            value={localElement.data.fontFamily}
            onValueChange={(value) => handleUpdate({ fontFamily: value } as Partial<TextElementData>)}
            disabled={localElement.isLocked}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Font Weight</Label>
          <Select
            value={localElement.data.fontWeight}
            onValueChange={(value) => handleUpdate({ fontWeight: value } as Partial<TextElementData>)}
            disabled={localElement.isLocked}
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
          <Label>Font Style</Label>
          <Select
            value={localElement.data.fontStyle}
            onValueChange={(value: 'normal' | 'italic' | 'oblique') => handleUpdate({ fontStyle: value } as Partial<TextElementData>)}
            disabled={localElement.isLocked}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="italic">Italic</SelectItem>
              <SelectItem value="oblique">Oblique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Text Color</Label>
          <ColorPicker
            color={localElement.data.color ?? '#000000'}
            onChange={(color) => handleUpdate({ color } as Partial<TextElementData>)}
          />
        </div>
        
        <div>
          <Label>Text Alignment</Label>
          <div className="flex items-center gap-2">
            <Button
              variant={localElement.data.textAlign === 'left' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleUpdate({ textAlign: 'left' } as Partial<TextElementData>)}
              disabled={localElement.isLocked}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={localElement.data.textAlign === 'center' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleUpdate({ textAlign: 'center' } as Partial<TextElementData>)}
              disabled={localElement.isLocked}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={localElement.data.textAlign === 'right' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleUpdate({ textAlign: 'right' } as Partial<TextElementData>)}
              disabled={localElement.isLocked}
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
    if (!localElement || !isImageElement(localElement)) return null
    
    const defaultLayout: ImageElementData['layout'] = { type: 'rectangle' }
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Image URL</Label>
          <Input
            value={localElement.data.src}
            onChange={(e) => handleUpdate({ src: e.target.value } as Partial<ImageElementData>)}
            disabled={localElement.isLocked}
          />
        </div>
        
        <div>
          <Label>Alt Text</Label>
          <Input
            value={localElement.data.alt ?? ''}
            onChange={(e) => {
              const value = e.target.value
              handleUpdate({ alt: value || undefined } as Partial<ImageElementData>)
            }}
            placeholder="Image description"
            disabled={localElement.isLocked}
          />
        </div>

        <div>
          <Label>Layout Type</Label>
          <Select
            value={localElement.data.layout?.type ?? defaultLayout.type}
            onValueChange={(value: 'rectangle' | 'square' | 'circle') => handleUpdate({ 
              layout: { 
                ...localElement.data.layout,
                type: value 
              }
            } as Partial<ImageElementData>)}
            disabled={localElement.isLocked}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Object Fit</Label>
          <Select
            value={localElement.data.objectFit ?? 'cover'}
            onValueChange={(value: 'cover' | 'contain' | 'fill') => handleUpdate({ 
              objectFit: value 
            } as Partial<ImageElementData>)}
            disabled={localElement.isLocked}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select fit mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cover">Cover</SelectItem>
              <SelectItem value="contain">Contain</SelectItem>
              <SelectItem value="fill">Fill</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Width</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.width]}
              min={20}
              max={800}
              step={1}
              onValueChange={(value) => handleUpdate({ width: value[0] } as Partial<ImageElementData>)}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.width}
              onChange={(e) => handleUpdate({ width: Number(e.target.value) } as Partial<ImageElementData>)}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Height</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.height]}
              min={20}
              max={800}
              step={1}
              onValueChange={(value) => handleUpdate({ height: value[0] } as Partial<ImageElementData>)}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.height}
              onChange={(e) => handleUpdate({ height: Number(e.target.value) } as Partial<ImageElementData>)}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>

        <div>
          <Label>Object Position</Label>
          <Input
            value={localElement.data.objectPosition}
            onChange={(e) => handleUpdate({ objectPosition: e.target.value } as Partial<ImageElementData>)}
            placeholder="center center"
            disabled={localElement.isLocked}
          />
        </div>
      </div>
    )
  }
  
  // Handle shape element properties
  const renderShapeProperties = () => {
    if (!localElement || !isShapeElement(localElement)) return null
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Shape Type</Label>
          <Select
            value={localElement.data.shapeType}
            onValueChange={(value: 'rectangle' | 'circle') => handleUpdate({ shapeType: value } as Partial<ShapeElementData>)}
            disabled={localElement.isLocked}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Width</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.width]}
              min={10}
              max={800}
              step={1}
              onValueChange={(value) => handleUpdate({ width: value[0] } as Partial<ShapeElementData>)}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.width}
              onChange={(e) => handleUpdate({ width: Number(e.target.value) } as Partial<ShapeElementData>)}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Height</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.height]}
              min={10}
              max={800}
              step={1}
              onValueChange={(value) => handleUpdate({ height: value[0] } as Partial<ShapeElementData>)}
              className="flex-1"
              disabled={localElement.isLocked || localElement.data.shapeType === 'circle'}
            />
            <Input
              type="number"
              value={localElement.data.height}
              onChange={(e) => handleUpdate({ height: Number(e.target.value) } as Partial<ShapeElementData>)}
              className="w-20"
              disabled={localElement.isLocked || localElement.data.shapeType === 'circle'}
            />
          </div>
        </div>
        
        <div>
          <Label>Background Color</Label>
          <ColorPicker
            color={localElement.data.backgroundColor ?? '#FFFFFF'}
            onChange={(color) => handleUpdate({ backgroundColor: color } as Partial<ShapeElementData>)}
          />
        </div>
        
        <div>
          <Label>Border</Label>
          <Input
            value={localElement.data.border ?? 'none'}
            onChange={(e) => handleUpdate({ border: e.target.value || undefined } as Partial<ShapeElementData>)}
            placeholder="1px solid #000000"
            disabled={localElement.isLocked}
          />
        </div>
        
        <div>
          <Label>Border Radius</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.borderRadius ?? 0]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleUpdate({ borderRadius: value[0] } as Partial<ShapeElementData>)}
              className="flex-1"
              disabled={localElement.isLocked || localElement.data.shapeType === 'circle'}
            />
            <Input
              type="number"
              value={localElement.data.borderRadius ?? 0}
              onChange={(e) => handleUpdate({ borderRadius: Number(e.target.value) } as Partial<ShapeElementData>)}
              className="w-20"
              disabled={localElement.isLocked || localElement.data.shapeType === 'circle'}
            />
          </div>
        </div>
      </div>
    )
  }
  
  // Handle element deletion with confirmation
  const handleDelete = () => {
    if (!selectedElementId) return
    
    deleteElement(selectedElementId, isEditingBackside)
    
    toast({
      title: "Element deleted",
      description: "The element has been removed from your design"
    })
  }
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium capitalize">
          {localElement?.type} Properties {isEditingBackside ? '(Backside)' : ''}
        </h3>
        <div className="flex items-center gap-2">
          <Switch
            checked={isEditingBackside}
            onCheckedChange={setIsEditingBackside}
            id="side-toggle"
          />
          <Label htmlFor="side-toggle">Edit Backside</Label>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDuplicate}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Duplicate Element</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLockToggle}
              >
                {localElement?.isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{localElement?.isLocked ? 'Unlock Element' : 'Lock Element'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Element</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Move className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="specific" className="flex items-center gap-1">
            <Layers className="h-4 w-4" /> Specific
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-0">
          {renderGeneralProperties()}
        </TabsContent>
        
        <TabsContent value="specific" className="mt-0">
          {localElement?.type === 'text' && renderTextProperties()}
          {localElement?.type === 'image' && renderImageProperties()}
          {localElement?.type === 'shape' && renderShapeProperties()}
        </TabsContent>
      </Tabs>
    </div>
  )
}