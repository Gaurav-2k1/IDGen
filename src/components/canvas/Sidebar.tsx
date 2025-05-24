'use client'

import { useState, useEffect, useMemo, createContext, memo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDesignStore } from '@/lib/Store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { generateId, cn } from '@/lib/utils'
import { Suspense } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { DesignState, ElementType, CanvasSize } from '@/lib/types'
import { CARD_TEMPLATES } from '@/lib/constants'
import { Panel, PanelHeader, PanelTitle, PanelContent } from '@/components/ui/Panel'
import { PropertyEditor } from './PropertyEditor'
import { ColorPicker } from './color-picker'
import * as Icons from 'lucide-react'

// Add proper types for LayerItem props
interface LayerItemProps {
  element: ElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onLock: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

// State interfaces
interface TextSettings {
  text: string;
  fontSize: number;
  fontWeight: string;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  color: string;
}

interface ImageSettings {
  url: string;
  preserveAspectRatio: boolean;
}

interface ShapeSettings {
  type: string;
  width: number;
  height: number;
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  opacity: number;
}

// Error Fallback Component
// const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
//   <div className="p-4 text-red-500">
//     <h3 className="font-semibold">Something went wrong:</h3>
//     <pre className="text-sm mt-2">{error.message}</pre>
//     <Button onClick={resetErrorBoundary} className="mt-4">
//       Try again
//     </Button>
//   </div>
// )

// Loading Component
const LoadingState = () => (
  <div className="p-4 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
)

// Simple tooltip component
function SimpleTooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute z-50 px-2 py-1 text-xs text-white bg-black rounded-md whitespace-nowrap left-full ml-2">
          {content}
        </div>
      )}
    </div>
  );
}

// Simple media query hook
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);
    
    updateMatches();
    media.addEventListener('change', updateMatches);
    
    return () => media.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

// Layer Item Component
function LayerItem({ 
  element, 
  isSelected, 
  onSelect, 
  onToggleVisibility, 
  onLock, 
  onDelete, 
  onDuplicate 
}: LayerItemProps) {
  const { id, type, data, isVisible = true, isLocked = false } = element;
  
  const getLayerIcon = () => {
    switch (type) {
      case 'text': return <Icons.Type className="h-4 w-4" />;
      case 'image': return <Icons.Image className="h-4 w-4" />;
      case 'shape': 
        if (data.shapeType === 'rectangle') return <Icons.Square className="h-4 w-4" />;
        if (data.shapeType === 'circle') return <Icons.Circle className="h-4 w-4" />;
        if (data.shapeType === 'triangle') return <Icons.Triangle className="h-4 w-4" />;
        if (data.shapeType === 'star') return <Icons.Star className="h-4 w-4" />;
        return <Icons.Square className="h-4 w-4" />;
      default: return <Icons.Square className="h-4 w-4" />;
    }
  };
  
  const getLayerName = () => {
    switch (type) {
      case 'text': return data.text?.substring(0, 15) || 'Text';
      case 'image': return 'Image' + (data.alt ? `: ${data.alt.substring(0, 10)}` : '');
      case 'shape': return data.shapeType.charAt(0).toUpperCase() + data.shapeType.slice(1);
      default: return 'Layer';
    }
  };

  const handleVisibilityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility(id);
  };

  const handleLockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLock(id);
  };

  const handleDuplicateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div 
      className={cn(
        "flex items-center p-2 rounded-md mb-1 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        isSelected && "bg-gray-100 dark:bg-gray-800"
      )}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        {getLayerIcon()}
        <span className="text-sm truncate">{getLayerName()}</span>
        {data.isTemplateLocked && (
          <SimpleTooltip content="Template element (locked)">
            <Icons.Lock className="h-3 w-3 text-orange-500" />
          </SimpleTooltip>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <SimpleTooltip content={isVisible ? 'Hide' : 'Show'}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleVisibilityClick}
          >
            {isVisible ? <Icons.Eye className="h-3 w-3" /> : <Icons.EyeOff className="h-3 w-3" />}
          </Button>
        </SimpleTooltip>
        
        <SimpleTooltip content={isLocked ? 'Unlock' : 'Lock'}>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleLockClick}
          >
            {isLocked ? <Icons.Lock className="h-3 w-3" /> : <Icons.Unlock className="h-3 w-3" />}
          </Button>
        </SimpleTooltip>
        
        <SimpleTooltip content="Duplicate">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDuplicateClick}
          >
            <Icons.Copy className="h-3 w-3" />
          </Button>
        </SimpleTooltip>
        
        <SimpleTooltip content="Delete">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:text-red-500"
            onClick={handleDeleteClick}
          >
            <Icons.Trash className="h-3 w-3" />
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}

// Layer List Component (without memo)
function LayerList({ 
  elements, 
  selectedElementId, 
  setSelectedElement, 
  searchQuery 
}: {
  elements: ElementType[];
  selectedElementId: string | null;
  setSelectedElement: (id: string | null) => void;
  searchQuery: string;
}) {
  const filteredElements = !searchQuery.trim() 
    ? elements 
    : elements.filter(element => {
        const searchLower = searchQuery.toLowerCase()
        if (element.type.toLowerCase().includes(searchLower)) return true
        if (element.type === 'text' && element.data.text?.toLowerCase().includes(searchLower)) return true
        if (element.type === 'image' && element.data.alt?.toLowerCase().includes(searchLower)) return true
        return false
      });

  const sortedElements = [...filteredElements].sort((a, b) => b.zIndex - a.zIndex);

  if (sortedElements.length === 0) {
    return (
      <div className="text-center py-8">
        <Icons.Layers className="mx-auto h-12 w-12 text-muted-foreground opacity-40" />
        <h3 className="mt-2 font-medium">No Elements Found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {searchQuery ? 'Try another search term' : 'Add elements to your canvas'}
        </p>
      </div>
    );
  }

  return (
    <>
      {sortedElements.map((element) => (
        <LayerItem
          key={element.id}
          element={element}
          isSelected={element.id === selectedElementId}
          onSelect={setSelectedElement}
          onToggleVisibility={(id) => {
            const elem = elements.find(e => e.id === id);
            if (elem) {
              elem.isVisible = !elem.isVisible;
            }
          }}
          onLock={(id) => {
            const elem = elements.find(e => e.id === id);
            if (elem) {
              elem.isLocked = !elem.isLocked;
            }
          }}
          onDelete={(id) => {
            // Handle delete
          }}
          onDuplicate={(id) => {
            // Handle duplicate
          }}
        />
      ))}
    </>
  );
}

// Add proper types for shape types and template
type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'star';
type TemplateType = {
  name: string;
  canvasSize: { width: number; height: number; };
  background: string;
  previewImage?: string;
};

// Canvas Panel Props
interface CanvasPanelProps {
  canvasSize: { width: number; height: number };
  setCanvasSize: (size: { width: number; height: number }) => void;
  canvasBackground: string;
  setCanvasBackground: (color: string) => void;
  onReset: () => void;
}

// Memoized Panel Components
const CanvasPanel = memo(({ 
  canvasSize, 
  setCanvasSize, 
  canvasBackground, 
  setCanvasBackground,
  onReset 
}: CanvasPanelProps) => (
  <div className="space-y-4">
    <Panel>
      <PanelHeader>
        <PanelTitle>Canvas Size</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Width</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={canvasSize.width}
                min={100}
                max={2000}
                onChange={(e) => setCanvasSize({...canvasSize, width: parseInt(e.target.value) || 100})}
              />
              <span className="text-xs font-medium">px</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Height</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={canvasSize.height}
                min={100}
                max={2000}
                onChange={(e) => setCanvasSize({...canvasSize, height: parseInt(e.target.value) || 100})}
              />
              <span className="text-xs font-medium">px</span>
            </div>
          </div>
        </div>
      </PanelContent>
    </Panel>
    
    <Panel>
      <PanelHeader>
        <PanelTitle>Background</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <div className="space-y-2">
          <Label>Canvas Background</Label>
          <ColorPicker 
            color={canvasBackground} 
            onChange={setCanvasBackground}
          />
        </div>
      </PanelContent>
    </Panel>
    
    <Button variant="outline" className="w-full" onClick={onReset}>
      <Icons.RotateCcw className="mr-2 h-4 w-4" />
      Reset Canvas
    </Button>
  </div>
))

// Memoize handlers at the top level
const handleApplyTemplate = (index: number, setCanvasSize: any, setCanvasBackground: any, toast: any) => {
  const template = CARD_TEMPLATES[index]
  if (!template) return

  setCanvasSize(template.canvasSize)
  setCanvasBackground(template.background)
  
  toast({
    title: `"${template.name}" template applied`,
    description: `Canvas size: ${template.canvasSize.width}×${template.canvasSize.height}px`,
    variant: "success",
    duration: 3000
  })
}

// Create stable selectors with proper types
const selectElements = (state: DesignState): ElementType[] => state.elements
const selectSelectedElementId = (state: DesignState): string | null => state.selectedElementId
const selectCanvasBackground = (state: DesignState): string => state.canvasBackground
const selectCanvasSize = (state: DesignState): CanvasSize => state.canvasSize
const selectSetSelectedElement = (state: DesignState): ((id: string | null) => void) => state.setSelectedElement
const selectSetCanvasBackground = (state: DesignState): ((color: string) => void) => state.setCanvasBackground
const selectSetCanvasSize = (state: DesignState): ((size: CanvasSize) => void) => state.setCanvasSize
const selectAddElement = (state: DesignState): ((element: ElementType, isBackside?: boolean) => void) => state.addElement
const selectUpdateElement = (state: DesignState): ((id: string, updates: Partial<ElementType>, isBackside?: boolean) => void) => state.updateElement
const selectRemoveElement = (state: DesignState): ((id: string, isBackside?: boolean) => void) => state.deleteElement
const selectDuplicateElement = (state: DesignState): ((id: string, isBackside?: boolean) => void) => state.duplicateElement

// Main Sidebar Component
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [activeTab, setActiveTab] = useState('elements')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAccordion, setExpandedAccordion] = useState(['text', 'shapes', 'images'])
  const [layerPanelExpanded, setLayerPanelExpanded] = useState(true)
  
  const { toast } = useToast()

  // Access store values with individual selectors
  const elements = useDesignStore(selectElements)
  const selectedElementId = useDesignStore(selectSelectedElementId)
  const canvasBackground = useDesignStore(selectCanvasBackground)
  const canvasSize = useDesignStore(selectCanvasSize)
  const setSelectedElement = useDesignStore(selectSetSelectedElement)
  const setCanvasBackground = useDesignStore(selectSetCanvasBackground)
  const setCanvasSize = useDesignStore(selectSetCanvasSize)
  const addElement = useDesignStore(selectAddElement)
  const updateElement = useDesignStore(selectUpdateElement)
  const removeElement = useDesignStore(selectRemoveElement)
  const duplicateElement = useDesignStore(selectDuplicateElement)

  // Settings state
  const [textSettings, setTextSettings] = useState<TextSettings>({
    text: '',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'Inter',
    textAlign: 'left',
    color: '#000000',
  })
  
  const [imageSettings, setImageSettings] = useState<ImageSettings>({
    url: '',
    preserveAspectRatio: true,
  })
  
  const [shapeSettings, setShapeSettings] = useState<ShapeSettings>({
    type: 'rectangle',
    width: 100,
    height: 100,
    backgroundColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 0,
    opacity: 100,
  })

  // Memoize callbacks
  const memoizedHandlers = useMemo(() => ({
    handleAddText: () => {
      const { text, fontSize, fontWeight, fontFamily, textAlign, color } = textSettings;
      addElement({
        id: generateId(),
        type: 'text',
        position: { x: 50, y: 50 },
        zIndex: elements.length + 1,
        data: {
          text: text.trim() || 'Sample Text',
          fontSize,
          fontWeight,
          fontFamily,
          textAlign,
          color,
          width: 200,
          height: 30,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false,
      });
      
      toast({
        title: "Text element added",
        variant: "success",
        duration: 2000
      });
    },

    handleAddImage: () => {
      if (!imageSettings.url.trim()) {
        toast({
          title: "Image URL required",
          description: "Please enter a valid image URL",
          variant: "destructive",
          duration: 3000
        });
        return;
      }
      
      addElement({
        id: generateId(),
        type: 'image',
        position: { x: 50, y: 50 },
        zIndex: elements.length + 1,
        data: {
          src: imageSettings.url,
          alt: 'User uploaded image',
          width: 150,
          height: 150,
          layout: { type: 'rectangle' },
          objectFit: 'cover',
          objectPosition: 'center center',
          preserveAspectRatio: imageSettings.preserveAspectRatio
        },
        isVisible: true,
        isLocked: false,
      });
      
      toast({
        title: "Image element added",
        variant: "success",
        duration: 2000
      });
    },

    handleAddShape: (shapeType: ShapeType) => {
      const { width, height, backgroundColor, borderWidth, borderColor, borderRadius, opacity } = shapeSettings;
      
      const adjustedWidth = shapeType === 'circle' ? width : width;
      const adjustedHeight = shapeType === 'circle' ? width : height;
      
      addElement({
        id: generateId(),
        type: 'shape',
        position: { x: 50, y: 50 },
        zIndex: elements.length + 1,
        data: {
          shapeType: shapeType === 'circle' ? 'circle' : 'rectangle',
          width: adjustedWidth,
          height: adjustedHeight,
          backgroundColor,
          border: `${borderWidth}px solid ${borderColor}`,
          borderRadius: shapeType === 'circle' ? undefined : borderRadius,
          opacity: opacity / 100,
        },
        isVisible: true,
        isLocked: false,
      });
      
      toast({
        title: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} added`,
        variant: "success",
        duration: 2000
      });
    },

    handleResetCanvas: () => {
      setCanvasSize({ width: 600, height: 400 });
      setCanvasBackground('#ffffff');
      
      toast({
        title: "Canvas reset",
        description: "Canvas settings have been reset to default",
        variant: "default",
        duration: 3000
      });
    }
  }), [textSettings, imageSettings, shapeSettings, elements.length, addElement, setCanvasSize, setCanvasBackground, toast]);

  // Memoize the ScrollArea content
  const scrollAreaContent = useMemo(() => (
    <ScrollArea className="flex-1">
      <div className="px-3 py-3">
        <TabsContent value="elements" className="mt-0">
          {selectedElementId ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Element Properties</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedElement(null)}
                  className="h-8 px-2 text-xs"
                >
                  Deselect
                </Button>
              </div>
              <PropertyEditor />
            </div>
          ) : (
            <>
              <div className="relative mb-3">
                <Icons.Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search layers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 absolute right-1 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchQuery('')}
                  >
                    <Icons.X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="mb-4">
                <div 
                  className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={() => setLayerPanelExpanded(!layerPanelExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <Icons.Layers className="h-4 w-4" />
                    <h3 className="font-medium">Layers ({elements.length})</h3>
                  </div>
                  {layerPanelExpanded ? (
                    <Icons.ChevronDown className="h-4 w-4" />
                  ) : (
                    <Icons.ChevronRight className="h-4 w-4" />
                  )}
                </div>
                
                {layerPanelExpanded && (
                  <div className="mt-2">
                    <LayerList 
                      elements={elements}
                      selectedElementId={selectedElementId}
                      setSelectedElement={setSelectedElement}
                      searchQuery={searchQuery}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="add" className="mt-0">
          <Accordion
            type="multiple" 
            defaultValue={expandedAccordion}
            onValueChange={setExpandedAccordion}
            className="space-y-2"
          >
            {/* Text Accordion Item */}
            <AccordionItem value="text" className="border rounded-md">
              <AccordionTrigger className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-md">
                <div className="flex items-center">
                  <Icons.Type className="mr-2 h-4 w-4" />
                  <span>Text</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-3 pt-0 space-y-3">
                <div className="space-y-3">
                  <Textarea
                    placeholder="Enter text content"
                    value={textSettings.text}
                    onChange={(e) => setTextSettings({...textSettings, text: e.target.value})}
                    className="min-h-[80px]"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select 
                        value={textSettings.fontFamily}
                        onValueChange={(value) => setTextSettings({...textSettings, fontFamily: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Helvetica">Helvetica</SelectItem>
                          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Font Size</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[textSettings.fontSize]}
                          min={8}
                          max={72}
                          step={1}
                          onValueChange={(value) => setTextSettings({...textSettings, fontSize: value[0]})}
                          className="flex-1"
                        />
                        <span className="text-xs font-medium w-8 text-right">{textSettings.fontSize}px</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Font Weight</Label>
                      <Select 
                        value={textSettings.fontWeight}
                        onValueChange={(value) => setTextSettings({...textSettings, fontWeight: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                          <SelectItem value="lighter">Lighter</SelectItem>
                          <SelectItem value="bolder">Bolder</SelectItem>
                          {/* Font weight options */}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Text Align</Label>
                      <div className="flex border rounded-md p-1">
                        <Button
                          type="button"
                          variant={textSettings.textAlign === 'left' ? 'default' : 'ghost'} 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setTextSettings({...textSettings, textAlign: 'left'})}
                        >
                          <Icons.AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant={textSettings.textAlign === 'center' ? 'default' : 'ghost'} 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setTextSettings({...textSettings, textAlign: 'center'})}
                        >
                          <Icons.AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant={textSettings.textAlign === 'right' ? 'default' : 'ghost'} 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setTextSettings({...textSettings, textAlign: 'right'})}
                        >
                          <Icons.AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <ColorPicker 
                      color={textSettings.color} 
                      onChange={(color) => setTextSettings({...textSettings, color})}
                    />
                  </div>
                  
                  <Button className="w-full" onClick={memoizedHandlers.handleAddText}>
                    <Icons.Type className="mr-2 h-4 w-4" />
                    Add Text
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Shapes Accordion Item */}
            <AccordionItem value="shapes" className="border rounded-md">
              <AccordionTrigger className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-md">
                <div className="flex items-center">
                  <Icons.Square className="mr-2 h-4 w-4" />
                  <span>Shapes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-3 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button className="flex flex-col py-6" variant="outline" onClick={() => memoizedHandlers.handleAddShape('rectangle')}>
                    <Icons.Square className="h-8 w-8 mb-1" />
                    Rectangle
                  </Button>
                  <Button className="flex flex-col py-6" variant="outline" onClick={() => memoizedHandlers.handleAddShape('circle')}>
                    <Icons.Circle className="h-8 w-8 mb-1" />
                    Circle
                  </Button>
                  <Button className="flex flex-col py-6" variant="outline" onClick={() => memoizedHandlers.handleAddShape('triangle')}>
                    <Icons.Triangle className="h-8 w-8 mb-1" />
                    Triangle
                  </Button>
                  <Button className="flex flex-col py-6" variant="outline" onClick={() => memoizedHandlers.handleAddShape('star')}>
                    <Icons.Star className="h-8 w-8 mb-1" />
                    Star
                  </Button>
                </div>
                
                {/* Shape settings controls */}
                <div className="space-y-4">
                  {/* Width and Height controls */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Width</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[shapeSettings.width]}
                          min={10}
                          max={500}
                          step={1}
                          onValueChange={(value) => setShapeSettings({...shapeSettings, width: value[0]})}
                          className="flex-1"
                        />
                        <span className="text-xs font-medium w-8 text-right">{shapeSettings.width}px</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[shapeSettings.height]}
                          min={10}
                          max={500}
                          step={1}
                          onValueChange={(value) => setShapeSettings({...shapeSettings, height: value[0]})}
                          className="flex-1"
                        />
                        <span className="text-xs font-medium w-8 text-right">{shapeSettings.height}px</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Other shape settings */}
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <ColorPicker 
                      color={shapeSettings.backgroundColor} 
                      onChange={(color) => setShapeSettings({...shapeSettings, backgroundColor: color})}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            {/* Images Accordion Item */}
            <AccordionItem value="images" className="border rounded-md">
              <AccordionTrigger className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-md">
                <div className="flex items-center">
                  <Icons.Image className="mr-2 h-4 w-4" />
                  <span>Images</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-3 pt-0 space-y-3">
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    placeholder="Enter image URL"
                    value={imageSettings.url}
                    onChange={(e) => setImageSettings({...imageSettings, url: e.target.value})}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserve-aspect-ratio"
                    checked={imageSettings.preserveAspectRatio}
                    onCheckedChange={(checked) => 
                      setImageSettings({...imageSettings, preserveAspectRatio: checked})
                    }
                  />
                  <Label htmlFor="preserve-aspect-ratio">Preserve aspect ratio</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button className="w-full" onClick={memoizedHandlers.handleAddImage}>
                    <Icons.Image className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                  
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm font-medium"
                  >
                    <Icons.Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const objectUrl = URL.createObjectURL(file);
                        setImageSettings({
                          ...imageSettings,
                          url: objectUrl
                        });
                      }
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        <TabsContent value="canvas" className="mt-0">
          <CanvasPanel 
            canvasSize={canvasSize}
            setCanvasSize={setCanvasSize}
            canvasBackground={canvasBackground}
            setCanvasBackground={setCanvasBackground}
            onReset={memoizedHandlers.handleResetCanvas}
          />
        </TabsContent>
        
        <TabsContent value="templates" className="mt-0">
          <div className="space-y-3">
            <h3 className="font-medium">Choose a Template</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {CARD_TEMPLATES.map((template, index) => (
                <div 
                  key={index}
                  className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleApplyTemplate(index, setCanvasSize, setCanvasBackground, toast)}
                >
                  <div 
                    className="aspect-video relative overflow-hidden rounded-md"
                    style={{ 
                      backgroundColor: template.background,
                      backgroundImage: template.previewImage ? `url(${template.previewImage})` : 'none'
                    }}
                  >
                    <img 
                      src={template.previewImage || ''} 
                      alt={`Preview of ${template.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <h4 className="text-sm font-medium">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {template.canvasSize.width} × {template.canvasSize.height}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </div>
    </ScrollArea>
  ), [
    elements,
    selectedElementId,
    searchQuery,
    layerPanelExpanded,
    expandedAccordion,
    textSettings,
    imageSettings,
    shapeSettings,
    canvasSize,
    canvasBackground,
    setSelectedElement,
    setSearchQuery,
    setLayerPanelExpanded,
    memoizedHandlers,
    handleApplyTemplate,
    toast
  ]);

  // Effect for mobile responsiveness
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    }
  }, [isMobile])

  // Effect for selected element
  useEffect(() => {
    if (selectedElementId) {
      setActiveTab('elements')
    }
  }, [selectedElementId])

  return (
    <div className="relative">
      <aside 
        className={cn(
          'border-r bg-background transition-all duration-300 flex flex-col h-screen',
          isCollapsed ? 'w-16' : 'w-[450px]',
          isMobile && 'absolute z-50'
        )}
        role="complementary"
        aria-label="Design Tools Sidebar"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-3 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-900">
          <h2 className="font-semibold text-lg flex items-center">
            <Icons.Settings className="mr-2 h-5 w-5" />
            Design Studio
          </h2>
          <div className="flex items-center space-x-1">
            <SimpleTooltip content={isCollapsed ? 'Expand' : 'Collapse'}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
              </Button>
            </SimpleTooltip>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex-shrink-0 flex items-center gap-1 p-2 border-b">
          <SimpleTooltip content="Undo">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icons.Undo className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
          
          <SimpleTooltip content="Redo">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icons.Redo className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
          
          <div className="h-6 w-px bg-gray-200 mx-1"></div>
          
          <SimpleTooltip content="Save Project">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icons.Save className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
          
          <SimpleTooltip content="Export Design">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icons.Download className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
          
          <div className="ml-auto">
            <Button variant="outline" size="sm" className="h-8">
              <Icons.MessageCircle className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <Suspense fallback={<LoadingState />}>
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="flex flex-col h-full"
            >
              <div className="flex-shrink-0 border-b">
                <TabsList className="grid grid-cols-4 gap-2 p-2">
                  <TabsTrigger value="elements">
                    <Icons.Layers className="mr-2 h-4 w-4" />
                    Layers
                  </TabsTrigger>
                  <TabsTrigger value="add">
                    <Icons.Plus className="mr-2 h-4 w-4" />
                    Add
                  </TabsTrigger>
                  <TabsTrigger value="canvas">
                    <Icons.Layout className="mr-2 h-4 w-4" />
                    Canvas
                  </TabsTrigger>
                  <TabsTrigger value="templates">
                    <Icons.LayoutGrid className="mr-2 h-4 w-4" />
                    Templates
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 min-h-0">
                {scrollAreaContent}
              </div>
            </Tabs>
          </Suspense>
        </div>
      </aside>
    </div>
  );
}

// Add prop types for better documentation
Sidebar.displayName = 'Sidebar'

// Export memoized components for reuse
export const MemoizedLayerItem = LayerItem
export const MemoizedCanvasPanel = CanvasPanel