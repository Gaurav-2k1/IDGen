// services/design-service.ts
// This service handles all design-related API calls to your database

import { v4 as uuidv4 } from 'uuid'
// import { generateId } from '@/lib/utils' // Unused
import { Design, TextElement, ImageElement, Position, ElementType, CanvasSize, ShapeElement } from '@/lib/types'
// import { corporateFields } from '@/lib/constants' // Unused

// Default API endpoint - replace with your actual API URL in production
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Mock design data using modern ID card template
const mockDesigns: Design[] = [
  {
    id: '1',
    title: 'Modern Corporate ID Card',
    description: 'Modern corporate ID card template with blue accent',
    elements: [
      {
        id: 'card_bg',
        type: 'shape',
        position: { x: 200, y: 100 },
        zIndex: 1,
        data: {
          shapeType: 'rectangle',
          width: 400,
          height: 600,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'header_bg',
        type: 'shape',
        position: { x: 200, y: 100 },
        zIndex: 2,
        data: {
          shapeType: 'rectangle',
          width: 400,
          height: 120,
          backgroundColor: '#1E40AF',
          border: 'none',
          borderRadius: 12,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'company_logo',
        type: 'shape',
        position: { x: 502, y: 130 },
        zIndex: 3,
        data: {
          shapeType: 'circle',
          width: 64,
          height: 64,
          backgroundColor: '#FFFFFF',
          border: '4px solid #FFFFFF',
          borderRadius: 32,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'company_name',
        type: 'text',
        position: { x: 270, y: 130 },
        zIndex: 4,
        data: {
          text: 'ACME CORPORATION',
          fontSize: 24,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'center',
          color: '#FFFFFF',
          width: 250,
          height: 71,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'employee_name',
        type: 'text',
        position: { x: 260, y: 500 },
        zIndex: 5,
        data: {
          text: 'JOHN SMITH',
          fontSize: 28,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'center',
          color: '#111827',
          width: 280,
          height: 40,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'photo_bg',
        type: 'shape',
        position: { x: 316, y: 280 },
        zIndex: 7,
        data: {
          shapeType: 'rectangle',
          width: 168,
          height: 200,
          backgroundColor: '#F3F4F6',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'employee_position',
        type: 'text',
        position: { x: 260, y: 540 },
        zIndex: 6,
        data: {
          text: 'SENIOR SOFTWARE ENGINEER',
          fontSize: 16,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'center',
          color: '#4B5563',
          width: 280,
          height: 24,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'employee_id',
        type: 'text',
        position: { x: 260, y: 575 },
        zIndex: 8,
        data: {
          isField:true,
          fieldLabel:"EMP ID",
          fieldKey:"empId",
          text: 'EMP12345',
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'center',
          color: '#6B7280',
          width: 280,
          height: 20,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'barcode',
        type: 'shape',
        position: { x: 260, y: 615 },
        zIndex: 9,
        data: {
          shapeType: 'rectangle',
          width: 280,
          height: 50,
          backgroundColor: '#F87171',
          border: '3px solid #E5E7EB',
          borderRadius: 25,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'validity',
        type: 'text',
        position: { x: 260, y: 670 },
        zIndex: 10,
        data: {
          text: 'Valid until: 31-DEC-2026',
          fontSize: 12,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'center',
          color: '#6B7280',
          width: 280,
          height: 18,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'accent_shape1',
        type: 'shape',
        position: { x: 200, y: 230 },
        zIndex: 11,
        data: {
          shapeType: 'rectangle',
          width: 60,
          height: 12,
          backgroundColor: '#3B82F6',
          border: 'none',
          borderRadius: 0,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'accent_shape2',
        type: 'shape',
        position: { x: 540, y: 230 },
        zIndex: 12,
        data: {
          shapeType: 'rectangle',
          width: 60,
          height: 12,
          backgroundColor: '#3B82F6',
          border: 'none',
          borderRadius: 0,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement
    ],
    backsideElements: [
      {
        id: 'back_card_bg',
        type: 'shape',
        position: { x: 200, y: 100 },
        zIndex: 1,
        data: {
          shapeType: 'rectangle',
          width: 400,
          height: 600,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 12,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'back_header',
        type: 'shape',
        position: { x: 200, y: 100 },
        zIndex: 2,
        data: {
          shapeType: 'rectangle',
          width: 400,
          height: 80,
          backgroundColor: '#1E40AF',
          border: 'none',
          borderRadius: 12,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'back_header_text',
        type: 'text',
        position: { x: 260, y: 125 },
        zIndex: 3,
        data: {
          text: 'EMPLOYEE INFORMATION',
          fontSize: 20,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'center',
          color: '#FFFFFF',
          width: 280,
          height: 30,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'contact_info_label',
        type: 'text',
        position: { x: 230, y: 210 },
        zIndex: 4,
        data: {
          text: 'Contact Information',
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'left',
          color: '#111827',
          width: 200,
          height: 24,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'email',
        type: 'text',
        position: { x: 230, y: 245 },
        zIndex: 4,
        data: {
          text: 'Email: john.smith@acme.com',
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'left',
          color: '#4B5563',
          width: 340,
          height: 20,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'phone',
        type: 'text',
        position: { x: 230, y: 275 },
        zIndex: 4,
        data: {
          text: 'Phone: +1 (555) 123-4567',
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'left',
          color: '#4B5563',
          width: 340,
          height: 20,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'emergency_contact_label',
        type: 'text',
        position: { x: 230, y: 325 },
        zIndex: 4,
        data: {
          text: 'Emergency Contact',
          fontSize: 16,
          fontWeight: 'bold',
          fontFamily: 'Inter',
          textAlign: 'left',
          color: '#111827',
          width: 200,
          height: 24,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'emergency_contact_name',
        type: 'text',
        position: { x: 230, y: 360 },
        zIndex: 4,
        data: {
          text: 'Name: Jane Smith',
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'left',
          color: '#4B5563',
          width: 340,
          height: 20,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'emergency_contact_phone',
        type: 'text',
        position: { x: 230, y: 390 },
        zIndex: 4,
        data: {
          text: 'Phone: +1 (555) 987-6543',
          fontSize: 14,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'left',
          color: '#4B5563',
          width: 340,
          height: 20,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'notice_box',
        type: 'shape',
        position: { x: 230, y: 450 },
        zIndex: 4,
        data: {
          shapeType: 'rectangle',
          width: 340,
          height: 120,
          backgroundColor: '#F3F4F6',
          border: '1px solid #E5E7EB',
          borderRadius: 8,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement,
      {
        id: 'notice_text',
        type: 'text',
        position: { x: 250, y: 470 },
        zIndex: 5,
        data: {
          text: 'This ID card is the property of ACME Corporation. If found, please return to:\n\nACME Corporation\n123 Business Street\nTech City, TC 12345',
          fontSize: 12,
          fontWeight: 'normal',
          fontFamily: 'Inter',
          textAlign: 'left',
          color: '#4B5563',
          width: 300,
          height: 80,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'website',
        type: 'text',
        position: { x: 260, y: 600 },
        zIndex: 4,
        data: {
          text: 'www.acmecorp.com',
          fontSize: 14,
          fontWeight: 'medium',
          fontFamily: 'Inter',
          textAlign: 'center',
          color: '#1E40AF',
          width: 280,
          height: 20,
          fontStyle: 'normal'
        },
        isVisible: true,
        isLocked: false
      } as TextElement,
      {
        id: 'back_accent_line',
        type: 'shape',
        position: { x: 230, y: 640 },
        zIndex: 4,
        data: {
          shapeType: 'rectangle',
          width: 340,
          height: 4,
          backgroundColor: '#3B82F6',
          border: 'none',
          borderRadius: 2,
          opacity: 1
        },
        isVisible: true,
        isLocked: false
      } as ShapeElement
    ],
    canvasSize: { width: 800, height: 800 },
    canvasBackground: '#F3F4F6',
    createdAt: '2025-05-18T14:15:00.000Z',
    lastModified: '2025-05-18T14:45:29.235Z'
  }
]

// Function to handle API responses and errors

// Fetch all designs for the current user
export async function fetchDesigns() {
  try {
    const response = await fetch(`${API_URL}/designs`);
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching designs:", error);
    throw error;
  }
}

// Get a single design by ID
export const getDesign = async (id: string): Promise<Design | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const design = mockDesigns.find(d => d.id === id)
  if (!design) return null
  
  return {
    ...design,
    elements: design.elements || [],
    backsideElements: design.backsideElements || []
  }
}

// Handle API response
async function handleResponse(response: Response): Promise<any> {
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'An error occurred')
  }
  return response.json()
}

// Create a new design
export const createDesign = async (design: Partial<Design>): Promise<Design | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const newDesign: Design = {
    id: Math.random().toString(36).substr(2, 9),
    title: design.title || 'Untitled Design',
    description: design.description || '',
    elements: design.elements || [],
    backsideElements: design.backsideElements || [],
    canvasSize: design.canvasSize || { width: 800, height: 500 },
    canvasBackground: design.canvasBackground || '#ffffff',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  }
  
  mockDesigns.push(newDesign)
  return newDesign
}

// Update an existing design
export const updateDesign = async (id: string, updates: Partial<Design>): Promise<Design | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const designIndex = mockDesigns.findIndex(d => d.id === id)
  if (designIndex === -1) return null
  
  const updatedDesign: Design = {
    ...mockDesigns[designIndex],
    ...updates,
    elements: updates.elements || mockDesigns[designIndex].elements,
    backsideElements: updates.backsideElements || mockDesigns[designIndex].backsideElements,
    lastModified: new Date().toISOString()
  }
  
  mockDesigns[designIndex] = updatedDesign
  return updatedDesign
}

// Delete a design
export const deleteDesign = async (id: string): Promise<boolean> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const designIndex = mockDesigns.findIndex(d => d.id === id)
  if (designIndex === -1) return false
  
  mockDesigns.splice(designIndex, 1)
  return true
}

// Create a new empty design
export const createNewDesign = async (): Promise<Design> => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: 'Untitled Design',
    description: '',
    elements: [],
    backsideElements: [],
    canvasSize: { width: 800, height: 500 },
    canvasBackground: '#ffffff',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  }
}

// Generate a thumbnail from a design
export async function generateThumbnail(
  elements: ElementType[],
  canvasSize: CanvasSize,
  canvasBackground: string
) {
  try {
    // In a real implementation, you would:
    // 1. Render the design to a canvas
    // 2. Convert canvas to base64 or blob
    // 3. Upload to your storage/CDN
    // 4. Return the URL

    // For now, we'll simulate this:
    const response = await fetch(`${API_URL}/thumbnails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ elements, canvasSize, canvasBackground }),
    });

    const data = await handleResponse(response);
    return data.thumbnailUrl;
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    // Return null instead of throwing to make this non-fatal
    return null;
  }
}

// Replace any with proper types
export async function processDesignBatch(design: Design, data: Record<string, string>[]): Promise<string[]> {
  // Implementation
  return []
}
