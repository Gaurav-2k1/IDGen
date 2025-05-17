// ID Card Builder - Utility Functions
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ElementType, Position } from './types';

/**
 * Combines class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID for elements
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Check if two positions are close enough to be considered the same
 */
export function isSamePosition(pos1: Position, pos2: Position, threshold = 5): boolean {
  return (
    Math.abs(pos1.x - pos2.x) <= threshold && Math.abs(pos1.y - pos2.y) <= threshold
  );
}

/**
 * Check if a position is within an element's bounds
 */
export function isWithinElementBounds(
  position: Position,
  element: ElementType
): boolean {
  let width = 0;
  let height = 0;

  // Get element dimensions based on type
  if (element.type === 'text') {
    // Estimate text width (could be improved with actual measurement)
    width = element.data.content.length * (element.data.fontSize / 2);
    height = element.data.fontSize * 1.2;
  } else if (element.type === 'image') {
    width = element.data.width;
    height = element.data.height;
  } else if (element.type === 'shape') {
    width = element.data.width;
    height = element.data.shapeType === 'circle' ? element.data.width : element.data.height;
  }

  return (
    position.x >= element.position.x &&
    position.x <= element.position.x + width &&
    position.y >= element.position.y &&
    position.y <= element.position.y + height
  );
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Convert a hex color value to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Get font weight value for CSS
 */
export function getFontWeightValue(fontWeight: string): number | string {
  const weights: { [key: string]: number | string } = {
    lighter: 300,
    normal: 400,
    medium: 500,
    bold: 700,
  };
  
  return weights[fontWeight] || fontWeight;
}

/**
 * Download a file from a data URL
 */
export function downloadFromDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convert canvas to image data URL
 */
export function canvasToDataUrl(
  canvas: HTMLElement | null, 
  options = { type: 'image/png', quality: 1 }
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!canvas) {
      reject(new Error('Canvas element not found'));
      return;
    }

    // Use html2canvas or other library for implementation
    // This is a placeholder for the actual implementation
    // html2canvas(canvas).then(canvas => {
    //   resolve(canvas.toDataURL(options.type, options.quality));
    // }).catch(reject);
    
    // Simulated response for now
    setTimeout(() => {
      resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
    }, 500);
  });
}

/**
 * Debounce function to limit the rate at which a function can fire
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...funcArgs: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Get text color that will contrast with the background
 */
export function getContrastTextColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  
  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Handle errors with proper logging
 */
export function handleError(error: unknown, fallbackMessage: string): string {
  let message = fallbackMessage;
  
  if (error instanceof Error) {
    console.error(`${fallbackMessage}: ${error.message}`, error);
    message = error.message;
  } else {
    console.error(fallbackMessage, error);
  }
  
  return message;
}