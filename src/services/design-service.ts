// services/design-service.js
// This service handles all design-related API calls to your database

import { generateId } from "@/lib/utils";

// Default API endpoint - replace with your actual API URL in production
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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
export async function getDesign(designId) {
  try {
    // const response = await fetch(`${API_URL}/designs/${designId}`)
    // return handleResponse(response)
    return {
  "title": "New",
  "description": "",
  "elements": [
    {
      "id": "card_bg",
      "type": "shape",
      "position": {
        "x": 200,
        "y": 100
      },
      "zIndex": 1,
      "data": {
        "shapeType": "rectangle",
        "width": 400,
        "height": 600,
        "backgroundColor": "#FFFFFF",
        "border": "1px solid #E5E7EB",
        "borderRadius": 12,
        "opacity": 1
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "header_bg",
      "type": "shape",
      "position": {
        "x": 200,
        "y": 100
      },
      "zIndex": 2,
      "data": {
        "shapeType": "rectangle",
        "width": 400,
        "height": 120,
        "backgroundColor": "#1E40AF",
        "border": "none",
        "borderRadius": "12px 12px 0 0",
        "opacity": 1
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "company_logo",
      "type": "shape",
      "position": {
        "x": 502,
        "y": 130
      },
      "zIndex": 3,
      "data": {
        "shapeType": "circle",
        "width": 64,
        "height": 64,
        "backgroundColor": "#FFFFFF",
        "border": "4px solid #FFFFFF",
        "borderRadius": "50%",
        "opacity": 1
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "company_name",
      "type": "text",
      "position": {
        "x": 270,
        "y": 130
      },
      "zIndex": 4,
      "data": {
        "text": "ACME CORPORATION",
        "fontSize": 24,
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "center",
        "color": "#FFFFFF",
        "width": 250,
        "height": 71
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "employee_name",
      "type": "text",
      "position": {
        "x": 260,
        "y": 500
      },
      "zIndex": 5,
      "data": {
        "text": "JOHN SMITH",
        "fontSize": 28,
        "fontWeight": "bold",
        "fontFamily": "Inter",
        "textAlign": "center",
        "color": "#111827",
        "width": 280,
        "height": 40
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "photo_bg",
      "type": "shape",
      "position": {
        "x": 316,
        "y": 280
      },
      "zIndex": 7,
      "data": {
        "shapeType": "rectangle",
        "width": 168,
        "height": 200,
        "backgroundColor": "#F3F4F6",
        "border": "1px solid #E5E7EB",
        "borderRadius": 8,
        "opacity": 1
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "employee_position",
      "type": "text",
      "position": {
        "x": 260,
        "y": 540
      },
      "zIndex": 6,
      "data": {
        "text": "SENIOR SOFTWARE ENGINEER",
        "fontSize": 16,
        "fontWeight": "normal",
        "fontFamily": "Inter",
        "textAlign": "center",
        "color": "#4B5563",
        "width": 280,
        "height": 24
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "employee_id",
      "type": "text",
      "position": {
        "x": 260,
        "y": 575
      },
      "zIndex": 8,
      "data": {
        "text": "ID: EMP12345",
        "fontSize": 14,
        "fontWeight": "normal",
        "fontFamily": "Inter",
        "textAlign": "center",
        "color": "#6B7280",
        "width": 280,
        "height": 20
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "barcode",
      "type": "shape",
      "position": {
        "x": 260,
        "y": 615
      },
      "zIndex": 9,
      "data": {
        "shapeType": "rectangle",
        "width": 280,
        "height": 50,
        "backgroundColor": "#F87171",
        "border": "3px solid #E5E7EB",
        "borderRadius": 64,
        "opacity": 1
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "validity",
      "type": "text",
      "position": {
        "x": 260,
        "y": 670
      },
      "zIndex": 10,
      "data": {
        "text": "Valid until: 31-DEC-2026",
        "fontSize": 12,
        "fontWeight": "normal",
        "fontFamily": "Inter",
        "textAlign": "center",
        "color": "#6B7280",
        "width": 280,
        "height": 18
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "accent_shape1",
      "type": "shape",
      "position": {
        "x": 200,
        "y": 230
      },
      "zIndex": 11,
      "data": {
        "shapeType": "rectangle",
        "width": 60,
        "height": 12,
        "backgroundColor": "#3B82F6",
        "border": "none",
        "borderRadius": 0,
        "opacity": 1
      },
      "isVisible": true,
      "isLocked": false
    },
    {
      "id": "accent_shape2",
      "type": "shape",
      "position": {
        "x": 540,
        "y": 230
      },
      "zIndex": 12,
      "data": {
        "shapeType": "rectangle",
        "width": 60,
        "height": 12,
        "backgroundColor": "#3B82F6",
        "border": "none",
        "borderRadius": 0,
        "opacity": 1
      },
      "isVisible": true,
      "isLocked": false
    }
  ],
  "canvasSize": {
    "width": 800,
    "height": 800
  },
  "canvasBackground": "#F3F4F6",
  "lastModified": "2025-05-18T14:45:29.235Z",
  "id": "idcard_template",
  "createdAt": "2025-05-18T14:15:00.000Z"
};
  } catch (error) {
    console.error(`Error fetching design ${designId}:`, error);
    throw error;
  }
}
async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || "An error occurred while processing your request";
    throw new Error(errorMessage);
  }

  return response.json();
}

// Create a new design
export async function createDesign(design) {
  try {
    const body = JSON.stringify({
      ...design,
      id: design.id || generateId(),
      createdAt: design.createdAt || new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });
    console.log("Creating design with body:", body);
    const response = await fetch(`${API_URL}/designs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Error creating design:", error);
    throw error;
  }
}

// Update an existing design
export async function updateDesign(designId, updates) {
  try {
    const response = await fetch(`${API_URL}/designs/${designId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...updates,
        lastModified: new Date().toISOString(),
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating design ${designId}:`, error);
    throw error;
  }
}

// Delete a design
export async function deleteDesign(designId) {
  try {
    const response = await fetch(`${API_URL}/designs/${designId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete design");
    }

    return true;
  } catch (error) {
    console.error(`Error deleting design ${designId}:`, error);
    throw error;
  }
}

// Generate a thumbnail from a design
// This is a placeholder - you might use a canvas-to-image library or backend service
export async function generateThumbnail(
  elements,
  canvasSize,
  canvasBackground
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
