// lib/Store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { generateId } from '@/lib/utils'
import {
  DesignState,
  ElementType,
  Position,
  CanvasSize,
  Design,
  HistoryState,
  Template,
  TemplateFilter,
  TemplateCategory,
  DesignFilter,
  ImageElement,
  ShapeElement,
  TextElement
} from '@/lib/types'
import {
  fetchTemplates as apiFetchTemplates,
  getTemplate as apiGetTemplate,
  createTemplate as apiCreateTemplate,
  updateTemplate as apiUpdateTemplate,
  deleteTemplate as apiDeleteTemplate,
  fetchTemplateCategories as apiFetchTemplateCategories,
  generateThumbnail as apiGenerateThumbnail
} from '@/services/template-service'
import { v4 as uuidv4 } from 'uuid'
import { toast } from '@/components/ui/use-toast'

// Constants
const MAX_HISTORY_STATES = 30
const DEFAULT_CANVAS_SIZE = { width: 800, height: 600 }
const DEFAULT_CANVAS_BACKGROUND = '#ffffff'

// Initial history state
const INITIAL_HISTORY_STATE: HistoryState = {
  elements: [],
  backsideElements: [],
  canvasSize: DEFAULT_CANVAS_SIZE,
  canvasBackground: DEFAULT_CANVAS_BACKGROUND
}

// Create the store
export const useDesignStore = create<DesignState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        elements: [],
        backsideElements: [],
        selectedElementId: null,
        canvasSize: DEFAULT_CANVAS_SIZE,
        canvasBackground: DEFAULT_CANVAS_BACKGROUND,
        design: null,
        history: [INITIAL_HISTORY_STATE],
        historyIndex: 0,
        isLoading: false,
        error: null,
        isDragging: false,
        
        // Template related state
        templates: [],
        selectedTemplate: null,
        templateCategories: [],
        templateIsLoading: false,
        templateError: null,
        
        // Design related state
        designs: [] as Design[],
        designIsLoading: false,
        designError: null,
        
        // Additional required properties
        removeElement: (id: string, isBackside?: boolean) => {
          get().deleteElement(id, isBackside)
        },
        toggleElementVisibility: (id: string, isBackside?: boolean) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          const element = elements.find(el => el.id === id)
          if (element) {
            get().updateElement(id, { isVisible: !element.isVisible }, isBackside)
          }
        },
        toggleElementLock: (id: string, isBackside?: boolean) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          const element = elements.find(el => el.id === id)
          if (element) {
            get().updateElement(id, { isLocked: !element.isLocked }, isBackside)
          }
        },
        zoomLevel: 1,
        setZoomLevel: (level: number) => set({ zoomLevel: level }),
        saveProject: async () => {
          await get().saveDesignToDatabase()
        },
        exportProject: async () => {
          // Implement export logic here
          return Promise.resolve()
        },
        
        // Computed properties
        get canUndo() {
          const state = get()
          return state.historyIndex > 0 && state.history.length > 1
        },
        get canRedo() {
          const state = get()
          return state.historyIndex < state.history.length - 1
        },
        
        // Methods
        setDesign: (design) => set({ design }),
        
        setSelectedElement: (id) => set({ selectedElementId: id }),
        
        startDrag: () => set({ isDragging: true }),
        
        endDrag: () => set({ isDragging: false }),
        
        addElement: (element, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          set({ 
            [isBackside ? 'backsideElements' : 'elements']: [...elements, element]
          })
        },
        
        updateElement: (id, updates, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          set({
            [isBackside ? 'backsideElements' : 'elements']: elements.map(el => 
              el.id === id ? { ...el, ...updates } : el
            )
          })
        },
        
        updateElementPosition: (id, position, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          set({
            [isBackside ? 'backsideElements' : 'elements']: elements.map(el =>
              el.id === id ? { ...el, position } : el
            )
          })
        },
        
        updateMultipleElementPositions: (updates, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          set({
            [isBackside ? 'backsideElements' : 'elements']: elements.map(el => {
              const update = updates.find(u => u.id === el.id)
              return update ? { ...el, position: update.position } : el
            })
          })
        },
        
        updateElementDimensions: (id, width, height, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          set({
            [isBackside ? 'backsideElements' : 'elements']: elements.map(el =>
              el.id === id ? { ...el, data: { ...el.data, width, height } } : el
            )
          })
        },
        
        deleteElement: (id, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          set({
            [isBackside ? 'backsideElements' : 'elements']: elements.filter(el => el.id !== id)
          })
        },
        
        duplicateElement: (id, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          const element = elements.find(el => el.id === id)
          if (element) {
            const newElement = {
              ...element,
              id: Math.random().toString(36).substr(2, 9),
              position: {
                x: element.position.x + 20,
                y: element.position.y + 20
              }
            }
            set({
              [isBackside ? 'backsideElements' : 'elements']: [...elements, newElement]
            })
          }
        },
        
        updateElementZIndex: (id, direction, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          const element = elements.find(el => el.id === id)
          if (element) {
            const newZIndex = direction === 'up' ? element.zIndex + 1 : element.zIndex - 1
            set({
              [isBackside ? 'backsideElements' : 'elements']: elements.map(el =>
                el.id === id ? { ...el, zIndex: newZIndex } : el
              )
            })
          }
        },
        
        setCanvasBackground: (color) => {
          set({ canvasBackground: color })
        },
        
        setCanvasSize: (size) => {
          set({ canvasSize: size })
        },
        
        moveElementForward: (id, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          const maxZIndex = Math.max(...elements.map(el => el.zIndex))
          set({
            [isBackside ? 'backsideElements' : 'elements']: elements.map(el =>
              el.id === id ? { ...el, zIndex: maxZIndex + 1 } : el
            )
          })
        },
        
        moveElementBackward: (id, isBackside = false) => {
          const state = get()
          const elements = isBackside ? state.backsideElements : state.elements
          const minZIndex = Math.min(...elements.map(el => el.zIndex))
          set({
            [isBackside ? 'backsideElements' : 'elements']: elements.map(el =>
              el.id === id ? { ...el, zIndex: minZIndex - 1 } : el
            )
          })
        },
        
        resetDesign: () => {
          set({
            elements: [],
            backsideElements: [],
            selectedElementId: null,
            canvasSize: DEFAULT_CANVAS_SIZE,
            canvasBackground: DEFAULT_CANVAS_BACKGROUND,
            design: null,
            history: [],
            historyIndex: -1
          })
        },
        
        loadDesign: (design) => {
          set({
            elements: design.elements || [],
            backsideElements: design.backsideElements || [],
            canvasSize: design.canvasSize,
            canvasBackground: design.canvasBackground,
            design
          })
        },
        
        saveDesign: async () => {
          const state = get()
          const design = {
            ...state.design,
            title: state.design?.title || 'Untitled Design',
            elements: state.elements,
            backsideElements: state.backsideElements,
            canvasSize: state.canvasSize,
            canvasBackground: state.canvasBackground,
            lastModified: new Date().toISOString()
          }
          set({ design })
          return design
        },
        
        saveStateToHistory: () => {
          const state = get()
          const newState: HistoryState = {
            elements: state.elements,
            backsideElements: state.backsideElements,
            canvasSize: state.canvasSize,
            canvasBackground: state.canvasBackground
          }
          
          // Remove future states if we're not at the end of history
          const newHistory = state.history.slice(0, state.historyIndex + 1)
          
          set({
            history: [...newHistory, newState],
            historyIndex: state.historyIndex + 1,
            canUndo: true,
            canRedo: false
          })
        },
        
        undo: () => {
          const state = get()
          if (state.historyIndex > 0) {
            const previousState = state.history[state.historyIndex - 1]
            set({
              elements: previousState.elements,
              backsideElements: previousState.backsideElements,
              canvasSize: previousState.canvasSize,
              canvasBackground: previousState.canvasBackground,
              historyIndex: state.historyIndex - 1,
              canUndo: state.historyIndex - 1 > 0,
              canRedo: true
            })
          }
        },
        
        redo: () => {
          const state = get()
          if (state.historyIndex < state.history.length - 1) {
            const nextState = state.history[state.historyIndex + 1]
            set({
              elements: nextState.elements,
              backsideElements: nextState.backsideElements,
              canvasSize: nextState.canvasSize,
              canvasBackground: nextState.canvasBackground,
              historyIndex: state.historyIndex + 1,
              canUndo: true,
              canRedo: state.historyIndex + 1 < state.history.length - 1
            })
          }
        },
        
        // Template related methods
        fetchTemplates: async (filter?: TemplateFilter) => {
          set({ templateIsLoading: true, templateError: null })
          
          try {
            const templates = await apiFetchTemplates(filter)
            set({ templates, templateIsLoading: false })
            return templates
          } catch (error) {
            set({ 
              templateError: (error as Error).message, 
              templateIsLoading: false 
            })
            return []
          }
        },
        
        createTemplate: async (template) => {
          set({ templateIsLoading: true, templateError: null })
          
          try {
            // Generate thumbnail from current design if none provided
            if (!template.thumbnailUrl) {
              const { elements, canvasSize, canvasBackground } = get()
              const thumbnailUrl = await apiGenerateThumbnail(
                elements,
                canvasSize,
                canvasBackground
              )
              if (thumbnailUrl) {
                template.thumbnailUrl = thumbnailUrl
              }
            }
            
            // Create template with design data
            const newTemplate = await apiCreateTemplate({
              ...template,
              elements: get().elements,
              canvasSize: get().canvasSize,
              canvasBackground: get().canvasBackground,
              createdAt: new Date().toISOString(),
              lastModified: new Date().toISOString()
            })
            
            if (newTemplate) {
              // Add to local templates
              set(state => ({
                templates: [...state.templates, newTemplate],
                templateIsLoading: false,
                selectedTemplate: newTemplate
              }))
              return newTemplate
            }
            
            set({ templateIsLoading: false })
            return null
            
          } catch (error) {
            set({ 
              templateError: (error as Error).message, 
              templateIsLoading: false 
            })
            return null
          }
        },
        
        loadTemplate: async (templateId) => {
          set({ templateIsLoading: true, templateError: null })
          
          try {
            // First try to find in existing templates
            let template = get().templates.find(t => t.templateId === templateId)
            
            // If not found, fetch from API
            if (!template) {
              const apiTemplate = await apiGetTemplate(templateId)
              if (apiTemplate) {
                template = apiTemplate
              }
            }
            
            if (template) {
              // Load the template into design
              get().loadDesign({
                ...template,
                id: generateId(), // Generate a new design ID
                title: `Design from ${template.title}`,
                isShared: false // New design is not shared by default
              })
              
              set({ 
                selectedTemplate: template,
                templateIsLoading: false 
              })
              return true
            }
            
            set({ templateIsLoading: false })
            return false
            
          } catch (error) {
            set({ 
              templateError: (error as Error).message, 
              templateIsLoading: false 
            })
            return false
          }
        },
        
        updateTemplate: async (templateId, updates) => {
          set({ templateIsLoading: true, templateError: null })
          
          try {
            // If updating with current design
            if (updates.elements === undefined) {
              updates = {
                ...updates,
                elements: get().elements,
                canvasSize: get().canvasSize,
                canvasBackground: get().canvasBackground,
                lastModified: new Date().toISOString()
              }
            }
            
            const updatedTemplate = await apiUpdateTemplate(templateId, updates)
            
            if (updatedTemplate) {
              // Update in local templates
              set(state => ({
                templates: state.templates.map(t => 
                  t.templateId === templateId ? updatedTemplate : t
                ),
                templateIsLoading: false,
                selectedTemplate: updatedTemplate
              }))
              return updatedTemplate
            }
            
            set({ templateIsLoading: false })
            return null
            
          } catch (error) {
            set({ 
              templateError: (error as Error).message, 
              templateIsLoading: false 
            })
            return null
          }
        },
        
        deleteTemplate: async (templateId) => {
          set({ templateIsLoading: true, templateError: null })
          
          try {
            const success = await apiDeleteTemplate(templateId)
            
            if (success) {
              // Remove from local templates
              set(state => ({
                templates: state.templates.filter(t => t.templateId !== templateId),
                selectedTemplate: state.selectedTemplate?.templateId === templateId 
                  ? null 
                  : state.selectedTemplate,
                templateIsLoading: false
              }))
              return true
            }
            
            set({ templateIsLoading: false })
            return false
            
          } catch (error) {
            set({ 
              templateError: (error as Error).message, 
              templateIsLoading: false 
            })
            return false
          }
        },
        
        fetchTemplateCategories: async () => {
          set({ templateIsLoading: true, templateError: null })
          
          try {
            const categories = await apiFetchTemplateCategories()
            set({ templateCategories: categories, templateIsLoading: false })
            return categories
          } catch (error) {
            set({ 
              templateError: (error as Error).message, 
              templateIsLoading: false 
            })
            return []
          }
        },
        
        setSelectedTemplate: (template) => {
          set({ selectedTemplate: template })
        },
        
        // Design related methods
        fetchDesigns: async (filter?: DesignFilter) => {
          try {
            // Placeholder: Replace with actual API call
            const designs: Design[] = []
            return designs
          } catch (error) {
            return []
          }
        },
        
        getDesign: async (designId: string) => {
          try {
            // Placeholder: Replace with actual API call
            const design = get().design
            return design
          } catch (error) {
            return null
          }
        },
        
        updateDesign: async (designId: string, updates: Partial<Design>) => {
          try {
            // Placeholder: Replace with actual API call
            const design = get().design
            if (!design) return null
            const updatedDesign = { ...design, ...updates }
            return updatedDesign
          } catch (error) {
            return null
          }
        },
        
        deleteDesign: async (designId: string) => {
          try {
            // Placeholder: Replace with actual API call
            return true
          } catch (error) {
            return false
          }
        },
        
        createNewDesign: (designData?: Partial<Design>) => {
          const newDesign: Design = {
            id: generateId(),
            title: designData?.title || 'Untitled Design',
            elements: [],
            backsideElements: [],
            canvasSize: designData?.canvasSize || DEFAULT_CANVAS_SIZE,
            canvasBackground: designData?.canvasBackground || DEFAULT_CANVAS_BACKGROUND,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            description: designData?.description || '',
            isShared: false,
            category: designData?.category,
            tags: designData?.tags || [],
            thumbnailUrl: designData?.thumbnailUrl
          }
          set({ design: newDesign })
          get().loadDesign(newDesign)
        },
        
        saveDesignToDatabase: async () => {
          try {
            // Placeholder: Replace with actual API call
            const design = get().design
            if (!design) return null
            return design
          } catch (error) {
            return null
          }
        },
        
        autoSaveDesign: () => {
          // Implement auto-save logic here
          get().saveDesignToDatabase()
        }
      }),
      {
        name: 'design-store', // Name for localStorage
        partialize: (state) => ({
          // Save only essential parts to localStorage
          elements: state.elements,
          canvasSize: state.canvasSize,
          canvasBackground: state.canvasBackground,
          design: state.design
        })
      }
    )
  )
)

// Fix filter parameter usage
export const filterTemplates = (templates: Template[], filter?: string) => {
  if (!filter) return templates
  return templates.filter(template => 
    template.title.toLowerCase().includes(filter.toLowerCase()) ||
    (template.description?.toLowerCase() || '').includes(filter.toLowerCase())
  )
}

// Fix designId parameter usage
export const deleteDesign = async (designId: string) => {
  try {
    await fetch(`/api/designs/${designId}`, {
      method: 'DELETE',
    })
    return true
  } catch (error) {
    console.error('Failed to delete design:', error)
    return false
  }
}