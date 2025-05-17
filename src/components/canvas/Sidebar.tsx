'use client'

import { useState, useEffect, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDesignStore } from '@/lib/Store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { generateId } from '@/lib/utils'
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  FileImage,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  PenTool,
  Triangle,
  Star,
  Settings,
  Eye,
  EyeOff,
  Upload,
  Copy,
  Trash2,
  Undo,
  Redo,
  Layout,
  Grid,
  Save,
  UploadCloud,
  Download,
  History,
  Lock,
  Unlock,
  Move,
  Maximize,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Search,
  Plus,
  Minus,
  Palette,
  FolderOpen,
  LayoutGrid,
  MessageCircle,
  X
} from 'lucide-react'
import { CARD_TEMPLATES } from '@/lib/constants'
import { Panel, PanelHeader, PanelTitle, PanelContent } from '@/components/ui/Panel'
import { PropertyEditor } from './PropertyEditor'
import { ColorPicker } from './color-picker'
import { useToast } from '../ui/use-toast'

// New component for the layer panel item
const LayerItem = ({ element, isSelected, onSelect, onToggleVisibility, onLock, onDelete, onDuplicate }) => {
  const { id, type, data, position, isVisible = true, isLocked = false } = element;
  
  const getLayerIcon = () => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4" />;
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'shape': 
        if (data.shapeType === 'rectangle') return <Square className="h-4 w-4" />;
        if (data.shapeType === 'circle') return <Circle className="h-4 w-4" />;
        if (data.shapeType === 'triangle') return <Triangle className="h-4 w-4" />;
        if (data.shapeType === 'star') return <Star className="h-4 w-4" />;
        return <Square className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };
  
  const getLayerName = () => {
    switch (type) {
      case 'text': return data.content?.substring(0, 15) || 'Text';
      case 'image': return 'Image' + (data.alt ? `: ${data.alt.substring(0, 10)}` : '');
      case 'shape': return data.shapeType.charAt(0).toUpperCase() + data.shapeType.slice(1);
      default: return 'Layer';
    }
  };

  return (
    <div 
      className={`flex items-center p-2 rounded-md mb-1 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
        isSelected ? 'bg-gray-100 dark:bg-gray-800' : ''
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        {getLayerIcon()}
        <span className="text-sm truncate">{getLayerName()}</span>
        {data.isTemplateLocked && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Lock className="h-3 w-3 text-orange-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Template element (locked)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(id);
                }}
              >
                {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isVisible ? 'Hide' : 'Show'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onLock(id);
                }}
              >
                {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLocked ? 'Unlock' : 'Lock'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(id);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Duplicate</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export function Sidebar() {
  // Store access with additional functionality
  const {
    addElement,
    elements,
    selectedElementId,
    setSelectedElement,
    setCanvasBackground,
    canvasBackground,
    setCanvasSize,
    canvasSize,
    updateElement,
    removeElement,
    // New store functions that would need to be added
    duplicateElement = (id) => {
      const element = elements.find(el => el.id === id);
      if (!element) return;
      
      const newElement = {
        ...element,
        id: generateId(),
        position: { 
          x: element.position.x + 20, 
          y: element.position.y + 20 
        },
        zIndex: Math.max(...elements.map(e => e.zIndex)) + 1
      };
      
      addElement(newElement);
      setSelectedElement(newElement.id);
      toast({
        title: "Element duplicated",
        variant: "success",
        duration: 2000
      });
    },
    toggleElementVisibility = (id) => {
      const element = elements.find(el => el.id === id);
      if (!element) return;
      
      updateElement(id, {
        ...element,
        isVisible: element.isVisible === false // Handle undefined case
          ? true
          : false
      });
    },
    toggleElementLock = (id) => {
      const element = elements.find(el => el.id === id);
      if (!element) return;
      
      updateElement(id, {
        ...element,
        isLocked: element.isLocked === true ? false : true
      });
    },
    // History management functions (would need to be implemented in the store)
    canUndo = true,
    canRedo = true,
    undo = () => {},
    redo = () => {},
    // Canvas zoom functions
    zoomLevel = 100,
    setZoomLevel = () => {},
    // Project management functions
    saveProject = () => {},
    exportProject = () => {},
  } = useDesignStore()
  
  // Access toast functionality
  const { toast } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState('elements')
  const [textSettings, setTextSettings] = useState({
    content: '',
    fontSize: 16,
    fontWeight: 'normal',
    fontFamily: 'Inter',
    textAlign: 'left',
    color: '#000000',
  })
  const [imageSettings, setImageSettings] = useState({
    url: '',
    preserveAspectRatio: true,
  })
  const [shapeSettings, setShapeSettings] = useState({
    type: 'rectangle',
    width: 100,
    height: 100,
    backgroundColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 0,
    opacity: 100,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedAccordion, setExpandedAccordion] = useState(['text', 'shapes', 'images'])
  const [layerPanelExpanded, setLayerPanelExpanded] = useState(true)
  
  // Switch to elements tab when an element is selected
  useEffect(() => {
    if (selectedElementId) {
      setActiveTab('elements')
    }
  }, [selectedElementId])

  // Filtered elements for search
  const filteredElements = useMemo(() => {
    if (!searchQuery.trim()) return elements;
    
    return elements.filter(element => {
      // Search by type
      if (element.type.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      
      // Search by content for text elements
      if (element.type === 'text' && 
          element.data.content && 
          element.data.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      
      // Search by alt text for image elements
      if (element.type === 'image' && 
          element.data.alt && 
          element.data.alt.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }
      
      return false;
    });
  }, [elements, searchQuery]);
  
  // Sort elements by z-index for layer panel
  const sortedElements = useMemo(() => {
    return [...filteredElements].sort((a, b) => b.zIndex - a.zIndex);
  }, [filteredElements]);
  
  // Add text element
  const handleAddText = () => {
    const { content, fontSize, fontWeight, fontFamily, textAlign, color } = textSettings;
    
    addElement({
      id: generateId(),
      type: 'text',
      position: { x: 50, y: 50 },
      zIndex: elements.length + 1,
      data: {
        content: content.trim() || 'Sample Text',
        fontSize,
        fontWeight,
        fontFamily,
        textAlign,
        color,
      },
      isVisible: true,
      isLocked: false,
    });
    
    toast({
      title: "Text element added",
      variant: "success",
      duration: 2000
    });
  }
  
  // Add image element
  const handleAddImage = () => {
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
        preserveAspectRatio: imageSettings.preserveAspectRatio,
      },
      isVisible: true,
      isLocked: false,
    });
    
    toast({
      title: "Image element added",
      variant: "success",
      duration: 2000
    });
  }
  
  // Add shape element
  const handleAddShape = (shapeType) => {
    const { width, height, backgroundColor, borderWidth, borderColor, borderRadius, opacity } = shapeSettings;
    
    // Ensure equal dimensions for circle
    const adjustedWidth = shapeType === 'circle' ? width : width;
    const adjustedHeight = shapeType === 'circle' ? width : height;
    
    addElement({
      id: generateId(),
      type: 'shape',
      position: { x: 50, y: 50 },
      zIndex: elements.length + 1,
      data: {
        shapeType,
        width: adjustedWidth,
        height: adjustedHeight,
        backgroundColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: shapeType === 'circle' ? '50%' : borderRadius,
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
  }

  // Apply a template with enhanced feedback
  const applyTemplate = (templateIndex) => {
    const template = CARD_TEMPLATES[templateIndex];
    setCanvasSize(template.canvasSize);
    setCanvasBackground(template.background);
    
    // Provide visual feedback on template application
    toast({
      title: `"${template.name}" template applied`,
      description: `Canvas size: ${template.canvasSize.width}×${template.canvasSize.height}px`,
      variant: "success",
      duration: 3000
    });
  }
  
  // Handle file upload for images
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // In a real application, you'd upload this to a server
    // Here we'll just create a local object URL as a demonstration
    const objectUrl = URL.createObjectURL(file);
    setImageSettings({
      ...imageSettings,
      url: objectUrl
    });
    
    toast({
      title: "Image uploaded",
      description: `File: ${file.name}`,
      variant: "success",
      duration: 3000
    });
  }
  
  // Reset all settings
  const handleResetCanvas = () => {
    // In a real app, you'd have a confirmation dialog here
    setCanvasSize({ width: 600, height: 400 });
    setCanvasBackground('#ffffff');
    
    toast({
      title: "Canvas reset",
      description: "Canvas settings have been reset to default",
      variant: "default",
      duration: 3000
    });
  }

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 10, 200));
  }
  
  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 10, 50));
  }
  
  const handleZoomReset = () => {
    setZoomLevel(100);
  }

  return (
    <div className="w-120 border-r bg-background flex flex-col h-full shadow-sm overflow-hidden">
      <div className="p-3 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-900">
        <h2 className="font-semibold text-lg flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Design Studio
        </h2>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                  <Minus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span className="text-xs font-medium w-12 text-center">{zoomLevel}%</span>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomReset}>
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset Zoom</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex items-center gap-1 p-2 border-b">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={undo}
                disabled={!canUndo}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={redo}
                disabled={!canRedo}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-6 w-px bg-gray-200 mx-1"></div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={saveProject}>
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save Project</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={exportProject}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export Design</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="h-8">
            <MessageCircle className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-y-scroll">
        <TabsList className="grid grid-cols-4 gap-2"> {/* Added gap-2 to separate tabs */}
          <TabsTrigger value="elements">
            <Layers className="mr-2 h-4 w-4" />
            Layers
          </TabsTrigger>
          <TabsTrigger value="add">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </TabsTrigger>
          <TabsTrigger value="canvas">
            <Layout className="mr-2 h-4 w-4" />
            Canvas
          </TabsTrigger>
          <TabsTrigger value="templates">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>
       
        <ScrollArea className="flex-1">
          <TabsContent value="elements" className="p-3">
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
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
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
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="mb-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    onClick={() => setLayerPanelExpanded(!layerPanelExpanded)}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      <h3 className="font-medium">Layers ({elements.length})</h3>
                    </div>
                    {layerPanelExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                  
                  {layerPanelExpanded && (
                    <div className="mt-2">
                      {sortedElements.length > 0 ? (
                        sortedElements.map((element) => (
                          <LayerItem
                            key={element.id}
                            element={element}
                            isSelected={element.id === selectedElementId}
                            onSelect={setSelectedElement}
                            onToggleVisibility={toggleElementVisibility}
                            onLock={toggleElementLock}
                            onDelete={removeElement}
                            onDuplicate={duplicateElement}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Layers className="mx-auto h-12 w-12 text-muted-foreground opacity-40" />
                          <h3 className="mt-2 font-medium">No Elements Found</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {searchQuery ? 'Try another search term' : 'Add elements to your canvas'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>
         
          <TabsContent value="add" className="p-3">
            <Accordion
              type="multiple" 
              defaultValue={expandedAccordion}
              onValueChange={setExpandedAccordion}
              className="space-y-2"
            >
              <AccordionItem value="text" className="border rounded-md">
                <AccordionTrigger className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-md">
                  <div className="flex items-center">
                    <Type className="mr-2 h-4 w-4" />
                    <span>Text</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-3 pt-0 space-y-3">
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Enter text content"
                      value={textSettings.content}
                      onChange={(e) => setTextSettings({...textSettings, content: e.target.value})}
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
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="200">200</SelectItem>
                            <SelectItem value="300">300</SelectItem>
                            <SelectItem value="400">400</SelectItem>
                            <SelectItem value="500">500</SelectItem>
                            <SelectItem value="600">600</SelectItem>
                            <SelectItem value="700">700</SelectItem>
                            <SelectItem value="800">800</SelectItem>
                            <SelectItem value="900">900</SelectItem>
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
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant={textSettings.textAlign === 'center' ? 'default' : 'ghost'} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setTextSettings({...textSettings, textAlign: 'center'})}
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant={textSettings.textAlign === 'right' ? 'default' : 'ghost'} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setTextSettings({...textSettings, textAlign: 'right'})}
                          >
                            <AlignRight className="h-4 w-4" />
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
                    
                    <Button className="w-full" onClick={handleAddText}>
                      <Type className="mr-2 h-4 w-4" />
                      Add Text
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="shapes" className="border rounded-md">
                <AccordionTrigger className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-md">
                  <div className="flex items-center">
                    <Square className="mr-2 h-4 w-4" />
                    <span>Shapes</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-3 pt-0 space-y-3">
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
                  
                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[shapeSettings.borderRadius]}
                        min={0}
                        max={50}
                        step={1}
                        onValueChange={(value) => setShapeSettings({...shapeSettings, borderRadius: value[0]})}
                        className="flex-1"
                      />
                      <span className="text-xs font-medium w-8 text-right">{shapeSettings.borderRadius}px</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <ColorPicker 
                        color={shapeSettings.backgroundColor} 
                        onChange={(color) => setShapeSettings({...shapeSettings, backgroundColor: color})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Border Color</Label>
                      <ColorPicker 
                        color={shapeSettings.borderColor} 
                        onChange={(color) => setShapeSettings({...shapeSettings, borderColor: color})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Border Width</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[shapeSettings.borderWidth]}
                          min={0}
                          max={20}
                          step={1}
                          onValueChange={(value) => setShapeSettings({...shapeSettings, borderWidth: value[0]})}
                          className="flex-1"
                        />
                        <span className="text-xs font-medium w-8 text-right">{shapeSettings.borderWidth}px</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Opacity</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[shapeSettings.opacity]}
                          min={10}
                          max={100}
                          step={1}
                          onValueChange={(value) => setShapeSettings({...shapeSettings, opacity: value[0]})}
                          className="flex-1"
                        />
                        <span className="text-xs font-medium w-8 text-right">{shapeSettings.opacity}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="flex flex-col py-6" variant="outline" onClick={() => handleAddShape('rectangle')}>
                      <Square className="h-8 w-8 mb-1" />
                      Rectangle
                    </Button>
                    <Button className="flex flex-col py-6" variant="outline" onClick={() => handleAddShape('circle')}>
                      <Circle className="h-8 w-8 mb-1" />
                      Circle
                    </Button>
                    <Button className="flex flex-col py-6" variant="outline" onClick={() => handleAddShape('triangle')}>
                      <Triangle className="h-8 w-8 mb-1" />
                      Triangle
                    </Button>
                    <Button className="flex flex-col py-6" variant="outline" onClick={() => handleAddShape('star')}>
                      <Star className="h-8 w-8 mb-1" />
                      Star
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="images" className="border rounded-md">
                <AccordionTrigger className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-md">
                  <div className="flex items-center">
                    <ImageIcon className="mr-2 h-4 w-4" />
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
                    <Button className="w-full" onClick={handleAddImage}>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                    
                    <Label
                      htmlFor="image-upload"
                      className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer text-sm font-medium"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="canvas" className="p-3">
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
              
              <Button variant="outline" className="w-full" onClick={handleResetCanvas}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Canvas
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="p-3">
            <div className="space-y-3">
              <h3 className="font-medium">Choose a Template</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {CARD_TEMPLATES.map((template, index) => (
                  <div 
                    key={index}
                    className="border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-colors"
                    onClick={() => applyTemplate(index)}
                  >
                    <div 
                      className="aspect-video bg-cover bg-center"
                      style={{ 
                        backgroundColor: template.background,
                        backgroundImage: template.previewImage ? `url(${template.previewImage})` : 'none'
                      }}
                    ></div>
                    <div className="p-2">
                      <h4 className="text-sm font-medium">{template.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {template.canvasSize.width} × {template.canvasSize.height}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full flex items-center justify-center" onClick={() => {
                setActiveTab('canvas');
              }}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Custom Size & Background
              </Button>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}