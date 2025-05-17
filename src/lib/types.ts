// ID Card Builder - Type Definitions

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
  content: string;
  fontSize: number;
  fontWeight: string;
  color: string;
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

// Union type for all elements
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

// History state for undo/redo
export interface HistoryState {
  elements: ElementType[];
  canvasSize: CanvasSize;
  canvasBackground: string;
}

// Design store state
export interface DesignState {
  design: Design | null;
  elements: ElementType[];
  selectedElementId: string | null;
  canvasSize: CanvasSize;
  canvasBackground: string;
  history: HistoryState[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  setDesign: (design: Design | null) => void;
  setSelectedElement: (id: string | null) => void;
  addElement: (element: ElementType) => void;
  updateElement: (id: string, updates: Partial<ElementType>) => void;
  updateElementPosition: (id: string, position: Position) => void;
  deleteElement: (id: string) => void;
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
  canUndo: boolean;
  canRedo: boolean;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}