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
    moveElementBackward,
    duplicateElement
  } = useDesignStore()
  
  const selectedElement = elements.find(el => el.id === selectedElementId)
  const [localElement, setLocalElement] = useState(null)
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
  const handleUpdate = (updatedData) => {
    if (!selectedElementId || !localElement) return
    
    const newData = { ...localElement.data, ...updatedData }
    setLocalElement({ ...localElement, data: newData })
    updateElement(selectedElementId, { data: newData })
  }

  // Update element position
  const handlePositionUpdate = (axis, value) => {
    if (!selectedElementId || !localElement) return

    const newPosition = { ...localElement.position, [axis]: value }
    updateElement(selectedElementId, { position: newPosition })
    setLocalElement({ ...localElement, position: newPosition })
  }
  
  // Update element visibility
  const handleVisibilityToggle = () => {
    if (!selectedElementId || !localElement) return
    
    const newVisibility = !localElement.isVisible
    updateElement(selectedElementId, { isVisible: newVisibility })
    setLocalElement({ ...localElement, isVisible: newVisibility })
  }
  
  // Update element lock state
  const handleLockToggle = () => {
    if (!selectedElementId || !localElement) return
    
    const newLockState = !localElement.isLocked
    updateElement(selectedElementId, { isLocked: newLockState })
    setLocalElement({ ...localElement, isLocked: newLockState })
  }
  
  const handleDuplicate = () => {
    if (!selectedElementId) return
    duplicateElement(selectedElementId)
    
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
                const zIndex = Number(e.target.value)
                updateElement(selectedElementId, { zIndex })
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
                      onClick={() => moveElementForward(selectedElementId)}
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
                      onClick={() => moveElementBackward(selectedElementId)}
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
    if (localElement.type !== 'text') return null
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Text Content</Label>
          <Input
            value={localElement.data.text}
            onChange={(e) => handleUpdate({ text: e.target.value })}
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
              onValueChange={(value) => handleUpdate({ fontSize: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.fontSize}
              onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Font Weight</Label>
          <Select
            value={localElement.data.fontWeight}
            onValueChange={(value) => handleUpdate({ fontWeight: value })}
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
          <Label>Font Family</Label>
          <Select
            value={localElement.data.fontFamily}
            onValueChange={(value) => handleUpdate({ fontFamily: value })}
            disabled={localElement.isLocked}
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
          <Label>Width</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.width || 100]}
              min={20}
              max={800}
              step={1}
              onValueChange={(value) => handleUpdate({ width: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.width || 100}
              onChange={(e) => handleUpdate({ width: Number(e.target.value) })}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Height</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.height || 24]}
              min={10}
              max={800}
              step={1}
              onValueChange={(value) => handleUpdate({ height: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.height || 24}
              onChange={(e) => handleUpdate({ height: Number(e.target.value) })}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Text Color</Label>
          <ColorPicker 
            color={localElement.data.color}
            onChange={(color) => handleUpdate({ color })}
            disabled={localElement.isLocked}
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
              disabled={localElement.isLocked}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={localElement.data.textAlign === 'center' ? 'default' : 'outline'}
              onClick={() => handleUpdate({ textAlign: 'center' })}
              disabled={localElement.isLocked}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant={localElement.data.textAlign === 'right' ? 'default' : 'outline'}
              onClick={() => handleUpdate({ textAlign: 'right' })}
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
    if (localElement.type !== 'image') return null
    
    return (
      <div className="space-y-4">
        <div>
          <Label>Image URL</Label>
          <Input
            value={localElement.data.src}
            onChange={(e) => handleUpdate({ src: e.target.value })}
            disabled={localElement.isLocked}
          />
        </div>
        
        <div>
          <Label>Alt Text</Label>
          <Input
            value={localElement.data.alt || ''}
            onChange={(e) => handleUpdate({ alt: e.target.value })}
            placeholder="Image description"
            disabled={localElement.isLocked}
          />
        </div>
        
        <div>
          <Label>Width</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.width]}
              min={20}
              max={800}
              step={1}
              onValueChange={(value) => handleUpdate({ width: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.width}
              onChange={(e) => handleUpdate({ width: Number(e.target.value) })}
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
              onValueChange={(value) => handleUpdate({ height: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.height}
              onChange={(e) => handleUpdate({ height: Number(e.target.value) })}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Border Radius</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.borderRadius || 0]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleUpdate({ borderRadius: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.borderRadius || 0}
              onChange={(e) => handleUpdate({ borderRadius: Number(e.target.value) })}
              className="w-20"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
        
        <div>
          <Label>Opacity</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.opacity || 1]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => handleUpdate({ opacity: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.opacity || 1}
              onChange={(e) => handleUpdate({ opacity: Number(e.target.value) })}
              className="w-20"
              min="0"
              max="1"
              step="0.01"
              disabled={localElement.isLocked}
            />
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
          <Label>Shape Type</Label>
          <Select
            value={localElement.data.shapeType}
            onValueChange={(value) => handleUpdate({ shapeType: value })}
            disabled={localElement.isLocked}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rectangle">Rectangle</SelectItem>
              <SelectItem value="circle">Circle</SelectItem>
              <SelectItem value="triangle">Triangle</SelectItem>
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
              onValueChange={(value) => handleUpdate({ width: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.width}
              onChange={(e) => handleUpdate({ width: Number(e.target.value) })}
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
              onValueChange={(value) => handleUpdate({ height: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked || localElement.data.shapeType === 'circle'}
            />
            <Input
              type="number"
              value={localElement.data.height}
              onChange={(e) => handleUpdate({ height: Number(e.target.value) })}
              className="w-20"
              disabled={localElement.isLocked || localElement.data.shapeType === 'circle'}
            />
          </div>
        </div>
        
        <div>
          <Label>Background Color</Label>
          <ColorPicker 
            color={localElement.data.backgroundColor}
            onChange={(color) => handleUpdate({ backgroundColor: color })}
            disabled={localElement.isLocked}
          />
        </div>
        
        <div>
          <Label>Border</Label>
          <Input
            value={localElement.data.border || 'none'}
            onChange={(e) => handleUpdate({ border: e.target.value })}
            placeholder="1px solid #000000"
            disabled={localElement.isLocked}
          />
        </div>
        
        <div>
          <Label>Border Radius</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.borderRadius || 0]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => handleUpdate({ borderRadius: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked || localElement.data.shapeType === 'circle'}
            />
            <Input
              type="number"
              value={localElement.data.borderRadius || 0}
              onChange={(e) => handleUpdate({ borderRadius: Number(e.target.value) })}
              className="w-20"
              disabled={localElement.isLocked || localElement.data.shapeType === 'circle'}
            />
          </div>
        </div>
        
        <div>
          <Label>Opacity</Label>
          <div className="flex items-center gap-2">
            <Slider
              value={[localElement.data.opacity || 1]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => handleUpdate({ opacity: value[0] })}
              className="flex-1"
              disabled={localElement.isLocked}
            />
            <Input
              type="number"
              value={localElement.data.opacity || 1}
              onChange={(e) => handleUpdate({ opacity: Number(e.target.value) })}
              className="w-20"
              min="0"
              max="1"
              step="0.01"
              disabled={localElement.isLocked}
            />
          </div>
        </div>
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
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium capitalize">{localElement.type} Properties</h3>
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
                  {localElement.isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Unlock className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{localElement.isLocked ? 'Unlock Element' : 'Lock Element'}</p>
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
          {localElement.type === 'text' && renderTextProperties()}
          {localElement.type === 'image' && renderImageProperties()}
          {localElement.type === 'shape' && renderShapeProperties()}
        </TabsContent>
      </Tabs>
    </div>
  )
}