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
  data: any;
}

// Text element data
export interface TextElementData {
  text: string;
  fontSize: number;
  fontWeight: string;
  width: number;
  height: number;
  color: string;
  fontStyle: 'normal' | 'italic' | 'oblique';
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
}

// Image element data
export interface ImageElementData {
  src: string;
  alt?: string;
  width: number;
  height: number;
}

// Shape element data for rectangles and circles
export interface ShapeElementData {
  shapeType: 'rectangle' | 'circle';
  width: number;
  height: number;
  backgroundColor: string;
  border?: string;
  borderRadius?: number;
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
  canvasSize: CanvasSize;
  canvasBackground: string;
  createdAt?: string;
  lastModified?: string;
  userId?: string;
  isShared?: boolean;
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
  // Existing state properties
  elements: ElementType[];
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
  
  // Design related state (new)
  designs: Design[];
  designIsLoading: boolean;
  designError: string | null;
  
  // Computed properties
  canUndo: boolean;
  canRedo: boolean;
  
  // Existing methods
  setDesign: (design: Design | null) => void;
  setSelectedElement: (id: string | null) => void;
  startDrag: () => void;
  endDrag: () => void;
  addElement: (element: ElementType) => void;
  updateElement: (id: string, updates: Partial<ElementType>) => void;
  updateElementPosition: (id: string, position: Position) => void;
  updateElementDimensions: (id: string, width: number, height: number) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  updateElementZIndex: (id: string, direction: 'up' | 'down') => void;
  setCanvasBackground: (color: string) => void;
  setCanvasSize: (size: CanvasSize) => void;
  moveElementForward: (id: string) => void;
  moveElementBackward: (id: string) => void;
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
}