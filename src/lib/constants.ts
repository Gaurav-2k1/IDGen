// ID Card Builder - Constants

// Default canvas settings
export const DEFAULT_CANVAS_SIZE = {
  width: 350,
  height: 500,
};

export const DEFAULT_CANVAS_BACKGROUND = '#ffffff';

// Available fonts for text elements
export const FONTS = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Courier New', value: 'Courier New' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Roboto', value: 'Roboto' },
];

// Available font weights
export const FONT_WEIGHTS = [
  { name: 'Light', value: 'lighter' },
  { name: 'Normal', value: 'normal' },
  { name: 'Medium', value: '500' },
  { name: 'Bold', value: 'bold' },
];

// Text alignment options
export const TEXT_ALIGNMENTS = [
  { name: 'Left', value: 'left' },
  { name: 'Center', value: 'center' },
  { name: 'Right', value: 'right' },
];

// Default element data
export const DEFAULT_TEXT_ELEMENT = {
  content: 'Sample Text',
  fontSize: 16,
  fontWeight: 'normal',
  color: '#000000',
  fontFamily: 'Inter',
  textAlign: 'left' as const,
};

export const DEFAULT_IMAGE_ELEMENT = {
  src: '/placeholder.png',
  alt: 'Image',
  width: 150,
  height: 150,
};

export const DEFAULT_SHAPE_ELEMENT = {
  shapeType: 'rectangle' as const,
  width: 100,
  height: 100,
  backgroundColor: '#3B82F6',
  border: '1px solid #000000',
  borderRadius: 0,
};

export interface CardTemplate {
  name: string;
  canvasSize: { width: number; height: number; };
  background: string;
  previewImage?: string;
}

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    name: 'Default Template',
    canvasSize: { width: 600, height: 400 },
    background: '#ffffff',
    previewImage: '/templates/default.png'
  },
  // Add more templates as needed
];

// Local storage keys
export const STORAGE_KEYS = {
  CURRENT_DESIGN: 'id-card-builder-current-design',
  USER_PREFERENCES: 'id-card-builder-preferences',
};

// API endpoints
export const API_ENDPOINTS = {
  DESIGNS: '/api/designs',
  DESIGN: (id: string) => `/api/designs/${id}`,
  SHARE: (id: string) => `/api/designs/${id}/share`,
};

// Error messages
export const ERROR_MESSAGES = {
  LOAD_DESIGN: 'Failed to load design. Please try again.',
  SAVE_DESIGN: 'Failed to save design. Please try again.',
  DELETE_DESIGN: 'Failed to delete design. Please try again.',
  SHARE_DESIGN: 'Failed to share design. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNKNOWN: 'An unknown error occurred. Please try again.',
};

// Maximum history states
export const MAX_HISTORY_STATES = 30;