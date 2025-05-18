// services/templateService.ts

import {  TemplateFilter, TemplateCategory, ApiResponse, Template } from '@/lib/types';
import { generateId } from '@/lib/utils';

// Base API URL - replace with your actual API endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Get all templates with optional filtering
export async function fetchTemplates(filter?: TemplateFilter): Promise<Template[]> {
  try {
    // Build query string from filter
    let queryParams = '';
    
    if (filter) {
      const params = new URLSearchParams();
      
      if (filter.categories && filter.categories.length > 0) {
        filter.categories.forEach(cat => params.append('category', cat));
      }
      
      if (filter.tags && filter.tags.length > 0) {
        filter.tags.forEach(tag => params.append('tag', tag));
      }
      
      if (filter.search) {
        params.append('search', filter.search);
      }
      
      if (filter.sortBy) {
        params.append('sortBy', filter.sortBy);
      }
      
      if (filter.isDefault !== undefined) {
        params.append('isDefault', filter.isDefault.toString());
      }
      
      queryParams = `?${params.toString()}`;
    }
    
    const response = await fetch(`${API_URL}/templates${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.status}`);
    }
    
    const data: ApiResponse<Template[]> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch templates');
    }
    
    return data.data || [];
    
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

// Get a specific template by ID
export async function getTemplate(templateId: string): Promise<Template | null> {
  try {
    const response = await fetch(`${API_URL}/templates/${templateId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template: ${response.status}`);
    }
    
    const data: ApiResponse<Template> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to fetch template');
    }
    
    return data.data;
    
  } catch (error) {
    console.error(`Error fetching template ${templateId}:`, error);
    return null;
  }
}

// Create a new template
export async function createTemplate(template: Partial<Template>): Promise<Template | null> {
  try {
    // Generate thumbnail if not provided
    let thumbnailUrl = template.thumbnailUrl;
    
    if (!thumbnailUrl && template.elements) {
      // You could implement thumbnail generation here
      // For now, we'll just use a placeholder
      thumbnailUrl = `/api/thumbnails/generate?templateId=${generateId()}`;
    }
    
    // Prepare the template data
    const templateData = {
      ...template,
      templateId: template.templateId || generateId(),
      thumbnailUrl,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };
    
    const response = await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create template: ${response.status}`);
    }
    
    const data: ApiResponse<Template> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to create template');
    }
    
    return data.data;
    
  } catch (error) {
    console.error('Error creating template:', error);
    return null;
  }
}

// Update an existing template
export async function updateTemplate(templateId: string, updates: Partial<Template>): Promise<Template | null> {
  try {
    // Prepare the update data
    const updateData = {
      ...updates,
      lastModified: new Date().toISOString(),
    };
    
    const response = await fetch(`${API_URL}/templates/${templateId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update template: ${response.status}`);
    }
    
    const data: ApiResponse<Template> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to update template');
    }
    
    return data.data;
    
  } catch (error) {
    console.error(`Error updating template ${templateId}:`, error);
    return null;
  }
}

// Delete a template
export async function deleteTemplate(templateId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/templates/${templateId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete template: ${response.status}`);
    }
    
    const data: ApiResponse<{ deleted: boolean }> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to delete template');
    }
    
    return data.data?.deleted || false;
    
  } catch (error) {
    console.error(`Error deleting template ${templateId}:`, error);
    return false;
  }
}

// Fetch template categories
export async function fetchTemplateCategories(): Promise<TemplateCategory[]> {
  try {
    const response = await fetch(`${API_URL}/templates/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch template categories: ${response.status}`);
    }
    
    const data: ApiResponse<TemplateCategory[]> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch template categories');
    }
    
    return data.data || [];
    
  } catch (error) {
    console.error('Error fetching template categories:', error);
    return [];
  }
}

// Generate thumbnail for a design
export async function generateThumbnail(designElements: any, canvasSize: any, background: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/thumbnails/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        elements: designElements,
        canvasSize,
        background
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to generate thumbnail: ${response.status}`);
    }
    
    const data: ApiResponse<{ url: string }> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || 'Failed to generate thumbnail');
    }
    
    return data.data.url;
    
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}