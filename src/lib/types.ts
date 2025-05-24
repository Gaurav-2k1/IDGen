// lib/types.ts

// Design elements position type
export interface Position {
  x: number;
  y: number;
}

// Canvas size type
export interface CanvasSize {
  width: number;
  height: number;
}

// Base element type
export interface BaseElement {
  id: string;
  type: string;
  position: Position;
  zIndex: number;
  isLocked?: boolean;
  isVisible?: boolean;
  isTemplateLocked?: boolean;
  data: TextElementData | ImageElementData | ShapeElementData;
}

// Text element data
export interface TextElementData {
  text: string;
  fieldKey?: string;  // The field identifier (e.g., 'name', 'class', 'rollNo')
  fieldLabel?: string;  // Display label for the field (e.g., 'Student Name', 'Class')
  isField?: boolean;  // Whether this is an ID card field
  placeholder?: string;  // Placeholder text to show when empty
  fontSize: number;
  fontWeight: string;
  width: number;
  height: number;
  color: string;
  fontStyle: 'normal' | 'italic' | 'oblique';
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  isTemplateLocked?: boolean;
}

// Image element data
export interface ImageElementData {
  src: string;
  alt?: string;
  width: number;
  height: number;
  preserveAspectRatio?: boolean;
  layout: {
    type: 'square' | 'circle' | 'rectangle';
    aspectRatio?: number; // For rectangle layout
    maskPath?: string; // For custom shape masks
  };
  objectFit: 'cover' | 'contain' | 'fill';
  objectPosition: string;
  isTemplateLocked?: boolean;
}

// Shape element data for rectangles and circles
export interface ShapeElementData {
  shapeType: 'rectangle' | 'circle' | 'triangle';
  width: number;
  height: number;
  backgroundColor: string;
  border?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  opacity?: number;
  isTemplateLocked?: boolean;
}

// Typed element definitions
export interface TextElement extends BaseElement {
  type: 'text';
  data: TextElementData;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  data: ImageElementData;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  data: ShapeElementData;
}

export type ElementType = TextElement | ImageElement | ShapeElement;

// Design type for saving and loading
export interface Design {
  id?: string;
  title: string;
  description?: string;
  elements: ElementType[];
  backsideElements: ElementType[]; // Elements for the back of the ID card
  canvasSize: CanvasSize;
  canvasBackground: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  isShared?: boolean;
  createdAt?: string;
  lastModified?: string;
  userId?: string;
}

// Template type for saved designs
export interface Template extends Design {
  templateId: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  popularity?: number;
  isDefault?: boolean; // Indicates if this is a pre-built template
}

// History state for undo/redo
export interface HistoryState {
  elements: ElementType[];
  backsideElements: ElementType[];
  canvasSize: CanvasSize;
  canvasBackground: string;
}

// Template category
export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
}

// Template filter options
export interface TemplateFilter {
  categories?: string[];
  tags?: string[];
  search?: string;
  sortBy?: 'popularity' | 'newest' | 'oldest';
  isDefault?: boolean;
}

// Design store state
export interface Position {
  x: number
  y: number
}

export interface CanvasSize {
  width: number
  height: number
}

export interface Design {
  id?: string
  title: string
  elements: ElementType[]
  canvasSize: CanvasSize
  canvasBackground: string
  createdAt?: string
  lastModified?: string
  isShared?: boolean
  thumbnailUrl?: string
}

export interface HistoryState {
  elements: ElementType[]
  canvasSize: CanvasSize
  canvasBackground: string
}

export interface Template extends Omit<Design, 'id'> {
  templateId: string
}

export interface TemplateFilter {
  category?: string
  keyword?: string
}

export interface TemplateCategory {
  id: string
  name: string
}

// export interface DesignState {
//   // State
//   elements: ElementType[]
//   selectedElementId: string | null
//   canvasSize: CanvasSize
//   canvasBackground: string
//   design: Design | null
//   history: HistoryState[]
//   historyIndex: number
//   isLoading: boolean
//   error: string | null
//   isDragging: boolean

//   // Template-related state
//   templates: Template[]
//   selectedTemplate: Template | null
//   templateCategories: TemplateCategory[]
//   templateIsLoading: boolean
//   templateError: string | null

//   // Computed properties
//   canUndo: boolean
//   canRedo: boolean

//   // Actions
//   setDesign: (design: Design | null) => void
//   setSelectedElement: (id: string | null) => void
//   startDrag: () => void
//   endDrag: () => void
//   addElement: (element: ElementType) => void
//   updateElement: (id: string, updates: Partial<ElementType>) => void
//   updateElementPosition: (id: string, position: Position) => void
//   updateElementDimensions: (id: string, width: number, height: number) => void
//   deleteElement: (id: string) => void
//   duplicateElement: (id: string) => void
//   updateElementZIndex: (id: string, direction: 'up' | 'down') => void
//   setCanvasBackground: (color: string) => void
//   setCanvasSize: (size: CanvasSize) => void
//   moveElementForward: (id: string) => void
//   moveElementBackward: (id: string) => void
//   resetDesign: () => void
//   loadDesign: (design: Design) => void
//   saveDesign: () => Promise<Design | null>
//   saveStateToHistory: () => void
//   undo: () => void
//   redo: () => void

//   // Template methods
//   fetchTemplates: (filter?: TemplateFilter) => Promise<Template[]>
//   createTemplate: (template: Partial<Template>) => Promise<Template | null>
//   loadTemplate: (templateId: string) => Promise<boolean>
//   updateTemplate: (
//     templateId: string,
//     updates: Partial<Template>
//   ) => Promise<Template | null>
//   deleteTemplate: (templateId: string) => Promise<boolean>
//   fetchTemplateCategories: () => Promise<TemplateCategory[]>
//   setSelectedTemplate: (template: Template | null) => void
// }
// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultTemplateCategory?: string;
  recentTemplates?: string[]; // Array of recently used template IDs
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Constants related to the design store
export interface DesignConstants {
  MAX_HISTORY_STATES: number;
  DEFAULT_CANVAS_SIZE: CanvasSize;
  DEFAULT_CANVAS_BACKGROUND: string;
}

// Storage keys for persisting data
export interface StorageKeys {
  CURRENT_DESIGN: string;
  USER_PREFERENCES: string;
  TEMPLATES: string;
}
// lib/types.ts
// Add or update these types to your existing types file

export interface DesignFilter {
  userId?: string;
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface Design {
  id?: string;
  title: string;
  description?: string;
  elements: ElementType[];
  backsideElements: ElementType[]; // Elements for the back of the ID card
  canvasSize: CanvasSize;
  canvasBackground: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  isShared?: boolean;
  createdAt?: string;
  lastModified?: string;
  userId?: string;
}

// Update the DesignState interface to include design management methods
export interface DesignState {
  // State
  elements: ElementType[];
  backsideElements: ElementType[];  // Elements for the back of the ID card
  selectedElementId: string | null;
  canvasSize: CanvasSize;
  canvasBackground: string;
  design: Design | null;
  history: HistoryState[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
  isDragging: boolean;
  
  // Template related state
  templates: Template[];
  selectedTemplate: Template | null;
  templateCategories: TemplateCategory[];
  templateIsLoading: boolean;
  templateError: string | null;
  
  // Computed properties
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  setDesign: (design: Design | null) => void;
  setSelectedElement: (id: string | null) => void;
  startDrag: () => void;
  endDrag: () => void;
  addElement: (element: ElementType, isBackside?: boolean) => void;
  updateElement: (id: string, updates: Partial<ElementType>, isBackside?: boolean) => void;
  updateElementPosition: (id: string, position: Position, isBackside?: boolean) => void;
  updateMultipleElementPositions: (updates: { id: string; position: Position }[], isBackside?: boolean) => void;
  updateElementDimensions: (id: string, width: number, height: number, isBackside?: boolean) => void;
  deleteElement: (id: string, isBackside?: boolean) => void;
  duplicateElement: (id: string, isBackside?: boolean) => void;
  updateElementZIndex: (id: string, direction: 'up' | 'down', isBackside?: boolean) => void;
  setCanvasBackground: (color: string) => void;
  setCanvasSize: (size: CanvasSize) => void;
  moveElementForward: (id: string, isBackside?: boolean) => void;
  moveElementBackward: (id: string, isBackside?: boolean) => void;
  resetDesign: () => void;
  loadDesign: (design: Design) => void;
  saveDesign: () => Promise<Design | null>;
  saveStateToHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  // Template related methods
  fetchTemplates: (filter?: TemplateFilter) => Promise<Template[]>;
  createTemplate: (template: Partial<Template>) => Promise<Template | null>;
  loadTemplate: (templateId: string) => Promise<boolean>;
  updateTemplate: (templateId: string, updates: Partial<Template>) => Promise<Template | null>;
  deleteTemplate: (templateId: string) => Promise<boolean>;
  fetchTemplateCategories: () => Promise<TemplateCategory[]>;
  setSelectedTemplate: (template: Template | null) => void;
  
  // Design related methods (new)
  fetchDesigns: (filter?: DesignFilter) => Promise<Design[]>;
  getDesign: (designId: string) => Promise<Design | null>;
  createNewDesign: (designData?: Partial<Design>) => void;
  saveDesignToDatabase: () => Promise<Design | null>;
  updateDesign: (designId: string, updates: Partial<Design>) => Promise<Design | null>;
  deleteDesign: (designId: string) => Promise<boolean>;
  autoSaveDesign: () => void;
  
  // Additional properties
  removeElement: (id: string, isBackside?: boolean) => void;
  toggleElementVisibility: (id: string, isBackside?: boolean) => void;
  toggleElementLock: (id: string, isBackside?: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  saveProject: () => Promise<void>;
  exportProject: () => Promise<void>;
}

export interface IDCardFieldDefinition {
  key: string;          // Unique identifier (e.g., 'name', 'employeeId')
  label: string;        // Display label (e.g., 'Full Name', 'Employee ID')
  type: 'text' | 'number' | 'date' | 'image' | 'qrcode' | 'barcode';
  required: boolean;
  defaultValue?: string;
  validation?: {
    pattern?: string;   // Regex pattern
    min?: number;       // For numbers/dates
    max?: number;       // For numbers/dates
    format?: string;    // Date format or specific format requirements
  };
  style?: Partial<TextElementData>;  // Default styling for this field
}

export interface IDCardTemplate extends Design {
  templateType: 'corporate' | 'student' | 'event' | 'custom';
  fields: {
    [key: string]: {
      definition: IDCardFieldDefinition;
      position: Position;
      isVisible: boolean;
    }
  };
  defaultValues?: Record<string, string>;
  layout: {
    orientation: 'portrait' | 'landscape';
    dimensions: {
      width: number;
      height: number;
      unit: 'mm' | 'inch' | 'px';
    };
  };
}

export interface IDCardData {
  templateId: string;
  values: Record<string, string>;  // Key-value pairs for the card data
  metadata?: {
    createdAt: string;
    updatedAt: string;
    status: 'draft' | 'active' | 'revoked';
    batchId?: string;
  };
}

export interface IDCardBatch {
  id: string;
  templateId: string;
  name: string;
  cards: IDCardData[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  totalCards: number;
  processedCards: number;
  failedCards: number;
}

// Replace any with more specific types
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }