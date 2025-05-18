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
  TemplateCategory
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

// Constants
const MAX_HISTORY_STATES = 30
const DEFAULT_CANVAS_SIZE = { width: 800, height: 600 }
const DEFAULT_CANVAS_BACKGROUND = '#ffffff'

// Create the store
export const useDesignStore = create<DesignState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        elements: [],
        selectedElementId: null,
        canvasSize: DEFAULT_CANVAS_SIZE,
        canvasBackground: DEFAULT_CANVAS_BACKGROUND,
        design: null,
        history: [],
        historyIndex: -1,
        isLoading: false,
        error: null,
        isDragging: false,
        
        // Template related state
        templates: [],
        selectedTemplate: null,
        templateCategories: [],
        templateIsLoading: false,
        templateError: null,
        
        // Computed properties
        get canUndo() {
          return get().historyIndex > 0
        },
        get canRedo() {
          return get().historyIndex < get().history.length - 1
        },
        
        // Methods
        setDesign: (design) => set({ design }),
        
        setSelectedElement: (id) => set({ selectedElementId: id }),
        
        startDrag: () => set({ isDragging: true }),
        
        endDrag: () => set({ isDragging: false }),
        
        addElement: (element) => {
          set((state) => {
            // First save the current state to history
            const currentState = {
              elements: [...state.elements],
              canvasSize: { ...state.canvasSize },
              canvasBackground: state.canvasBackground
            }
            
            // Add new element
            const newElements = [...state.elements, element]
            
            // Save to history
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), currentState]
            
            return {
              elements: newElements,
              selectedElementId: element.id,
              history: newHistory,
              historyIndex: newHistory.length - 1
            }
          })
        },
        
        updateElement: (id, updates) => {
          set((state) => {
            const elementIndex = state.elements.findIndex(el => el.id === id)
            if (elementIndex === -1) return state
            
            const updatedElements = [...state.elements]
            updatedElements[elementIndex] = { ...updatedElements[elementIndex], ...updates }
            
            return { elements: updatedElements }
          })
        },
        
        updateElementPosition: (id, position) => {
          set((state) => {
            const elementIndex = state.elements.findIndex(el => el.id === id)
            if (elementIndex === -1) return state
            
            const updatedElements = [...state.elements]
            updatedElements[elementIndex] = {
              ...updatedElements[elementIndex],
              position: { ...position }
            }
            
            return { elements: updatedElements }
          })
        },
        
        updateElementDimensions: (id, width, height) => {
          set((state) => {
            const elementIndex = state.elements.findIndex(el => el.id === id)
            if (elementIndex === -1) return state
            
            const element = state.elements[elementIndex]
            const updatedElements = [...state.elements]
            
            // Update based on element type
            if (element.type === 'image' || element.type === 'shape') {
              updatedElements[elementIndex] = {
                ...element,
                data: {
                  ...element.data,
                  width,
                  height
                }
              }
            }
            
            return { elements: updatedElements }
          })
        },
        
        deleteElement: (id) => {
          set((state) => {
            // First save the current state to history before deleting
            const currentState = {
              elements: [...state.elements],
              canvasSize: { ...state.canvasSize },
              canvasBackground: state.canvasBackground
            }
            
            // Filter out the element to delete
            const newElements = state.elements.filter(el => el.id !== id)
            
            // Save to history
            const newHistory = [...state.history.slice(0, state.historyIndex + 1), currentState]
            
            return {
              elements: newElements,
              selectedElementId: null, // Clear selection
              history: newHistory,
              historyIndex: newHistory.length - 1
            }
          })
        },
        
        duplicateElement: (id) => {
          set((state) => {
            const elementToDuplicate = state.elements.find(el => el.id === id)
            if (!elementToDuplicate) return state
            
            // Create a copy with a new ID and slightly offset position
            const duplicatedElement: ElementType = {
              ...JSON.parse(JSON.stringify(elementToDuplicate)),
              id: generateId(),
              position: {
                x: elementToDuplicate.position.x + 20,
                y: elementToDuplicate.position.y + 20
              }
            }
            
            // Add the duplicated element
            return {
              elements: [...state.elements, duplicatedElement],
              selectedElementId: duplicatedElement.id
            }
          })
        },
        
        updateElementZIndex: (id, direction) => {
          set((state) => {
            const elements = [...state.elements]
            const elementIndex = elements.findIndex(el => el.id === id)
            if (elementIndex === -1) return state
            
            // Sort elements by zIndex first
            elements.sort((a, b) => a.zIndex - b.zIndex)
            
            // Find the current index after sorting
            const sortedIndex = elements.findIndex(el => el.id === id)
            
            if (direction === 'up' && sortedIndex < elements.length - 1) {
              // Swap zIndex with next element
              const nextElement = elements[sortedIndex + 1]
              const temp = elements[sortedIndex].zIndex
              elements[sortedIndex].zIndex = nextElement.zIndex
              nextElement.zIndex = temp
            } else if (direction === 'down' && sortedIndex > 0) {
              // Swap zIndex with previous element
              const prevElement = elements[sortedIndex - 1]
              const temp = elements[sortedIndex].zIndex
              elements[sortedIndex].zIndex = prevElement.zIndex
              prevElement.zIndex = temp
            }
            
            return { elements }
          })
        },
        
        setCanvasBackground: (color) => {
          set({ canvasBackground: color })
        },
        
        setCanvasSize: (size) => {
          set({ canvasSize: size })
        },
        
        moveElementForward: (id) => {
          get().updateElementZIndex(id, 'up')
        },
        
        moveElementBackward: (id) => {
          get().updateElementZIndex(id, 'down')
        },
        
        resetDesign: () => {
          set({
            elements: [],
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
            canvasSize: design.canvasSize || DEFAULT_CANVAS_SIZE,
            canvasBackground: design.canvasBackground || DEFAULT_CANVAS_BACKGROUND,
            design,
            selectedElementId: null,
            history: [], // Clear history
            historyIndex: -1
          })
          
          // Add initial state to history
          get().saveStateToHistory()
        },
        
        saveDesign: async () => {
          const { elements, canvasSize, canvasBackground, design } = get()
          
          // Create a new design from current state
          const updatedDesign: Design = {
            ...(design || {}),
            id: design?.id || generateId(),
            title: design?.title || 'Untitled Design',
            elements,
            canvasSize,
            canvasBackground,
            lastModified: new Date().toISOString()
          }
          
          try {
            set({ isLoading: true, error: null })
            
            // Here you would typically save to an API or database
            // For now, just updating the local state
            set({ design: updatedDesign, isLoading: false })
            
            // Return the saved design
            return updatedDesign
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false })
            return null
          }
        },
        
        saveStateToHistory: () => {
          set((state) => {
            // Current state to save
            const currentState: HistoryState = {
              elements: [...state.elements],
              canvasSize: { ...state.canvasSize },
              canvasBackground: state.canvasBackground
            }
            
            // Add to history, removing future states if we're not at the end
            const newHistory = [
              ...state.history.slice(0, state.historyIndex + 1),
              currentState
            ]
            
            // Limit history size
            if (newHistory.length > MAX_HISTORY_STATES) {
              newHistory.shift() // Remove oldest state
            }
            
            return {
              history: newHistory,
              historyIndex: newHistory.length - 1
            }
          })
        },
        
        undo: () => {
          set((state) => {
            if (state.historyIndex <= 0) return state
            
            const newIndex = state.historyIndex - 1
            const prevState = state.history[newIndex]
            
            return {
              elements: [...prevState.elements],
              canvasSize: { ...prevState.canvasSize },
              canvasBackground: prevState.canvasBackground,
              historyIndex: newIndex
            }
          })
        },
        
        redo: () => {
          set((state) => {
            if (state.historyIndex >= state.history.length - 1) return state
            
            const newIndex = state.historyIndex + 1
            const nextState = state.history[newIndex]
            
            return {
              elements: [...nextState.elements],
              canvasSize: { ...nextState.canvasSize },
              canvasBackground: nextState.canvasBackground,
              historyIndex: newIndex
            }
          })
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
              template = await apiGetTemplate(templateId)
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