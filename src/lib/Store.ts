// lib/store.ts
'use client'

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import {
  DesignState,
  ElementType,
  Position,
  CanvasSize,
  Design,
  HistoryState
} from './types'
import {
  DEFAULT_CANVAS_SIZE,
  DEFAULT_CANVAS_BACKGROUND,
  MAX_HISTORY_STATES,
  STORAGE_KEYS
} from './constants'
import { deepClone, generateId } from './utils'
import { saveDesign as saveDesignToApi } from '@/services/designService'

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
        isDragging: false, // Track if user is dragging

        // Computed properties
        get canUndo() {
          return get().historyIndex > 0;
        },
        get canRedo() {
          return get().historyIndex < get().history.length - 1;
        },

        // Methods
        setDesign: (design) => {
          if (!design) {
            set({ design: null });
            return;
          }

          set({
            design,
            elements: design.elements || [],
            canvasSize: design.canvasSize || DEFAULT_CANVAS_SIZE,
            canvasBackground: design.canvasBackground || DEFAULT_CANVAS_BACKGROUND,
            // Reset history when loading a new design
            history: [],
            historyIndex: -1
          });

          // Save initial state to history
          get().saveStateToHistory();
        },

        setSelectedElement: (id) => {
          set({ selectedElementId: id });
        },

        // Track drag start
        startDrag: () => {
          set({ isDragging: true });
        },

        // Track drag end
        endDrag: () => {
          set({ isDragging: false });
          // Save state to history after drag completes
          get().saveStateToHistory();
        },

        addElement: (element) => {
          // Save state to history before adding
          const saveHistory = get().saveStateToHistory;
          saveHistory();
          
          set((state) => ({
            elements: [...state.elements, element],
            selectedElementId: element.id
          }));
        },

        updateElement: (id, updates) => {
          // Save state to history before updating
          const saveHistory = get().saveStateToHistory;
          saveHistory();
          
          set((state) => ({
            elements: state.elements.map((element) =>
              element.id === id
                ? { ...element, ...updates }
                : element
            )
          }));
        },

        updateElementPosition: (id, position) => {
          set((state) => ({
            elements: state.elements.map((element) =>
              element.id === id
                ? { ...element, position }
                : element
            ),
            // Maintain selection during move
            selectedElementId: id
          }));
          
          // We don't save history here because we'll save after the drag completes
        },

        deleteElement: (id) => {
          // Save state to history before deleting
          const saveHistory = get().saveStateToHistory;
          saveHistory();
          
          set((state) => ({
            elements: state.elements.filter((element) => element.id !== id),
            selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
          }));
        },

        setCanvasBackground: (color) => {
          // Save state to history before changing background
          const saveHistory = get().saveStateToHistory;
          saveHistory();
          
          set({ canvasBackground: color });
        },

        setCanvasSize: (size) => {
          // Save state to history before changing size
          const saveHistory = get().saveStateToHistory;
          saveHistory();
          
          set({ canvasSize: size });
        },

        moveElementForward: (id) => {
          // Find the element to move
          const elements = get().elements;
          const elementIndex = elements.findIndex(el => el.id === id);
          if (elementIndex === -1 || elementIndex === elements.length - 1) {
            return; // Element not found or already at the top
          }

          // Save state to history before reordering
          const saveHistory = get().saveStateToHistory;
          saveHistory();
          
          // Create a new array with the element moved one position forward
          const newElements = [...elements];
          const targetZIndex = newElements[elementIndex + 1].zIndex;
          newElements[elementIndex + 1].zIndex = newElements[elementIndex].zIndex;
          newElements[elementIndex].zIndex = targetZIndex;
          
          // Sort by zIndex to maintain order
          newElements.sort((a, b) => a.zIndex - b.zIndex);
          
          set({ elements: newElements });
        },

        moveElementBackward: (id) => {
          // Find the element to move
          const elements = get().elements;
          const elementIndex = elements.findIndex(el => el.id === id);
          if (elementIndex <= 0) {
            return; // Element not found or already at the bottom
          }

          // Save state to history before reordering
          const saveHistory = get().saveStateToHistory;
          saveHistory();
          
          // Create a new array with the element moved one position backward
          const newElements = [...elements];
          const targetZIndex = newElements[elementIndex - 1].zIndex;
          newElements[elementIndex - 1].zIndex = newElements[elementIndex].zIndex;
          newElements[elementIndex].zIndex = targetZIndex;
          
          // Sort by zIndex to maintain order
          newElements.sort((a, b) => a.zIndex - b.zIndex);
          
          set({ elements: newElements });
        },

        resetDesign: () => {
          set({
            elements: [],
            selectedElementId: null,
            canvasSize: DEFAULT_CANVAS_SIZE,
            canvasBackground: DEFAULT_CANVAS_BACKGROUND,
            design: {
              title: 'Untitled Design',
              description: '',
              elements: [],
              canvasSize: DEFAULT_CANVAS_SIZE,
              canvasBackground: DEFAULT_CANVAS_BACKGROUND,
              lastModified: new Date().toISOString(),
              createdAt: new Date().toISOString()
            },
            history: [],
            historyIndex: -1
          });

          // Initialize history with empty state
          get().saveStateToHistory();
        },

        loadDesign: (design) => {
          set({
            design,
            elements: design.elements || [],
            canvasSize: design.canvasSize || DEFAULT_CANVAS_SIZE,
            canvasBackground: design.canvasBackground || DEFAULT_CANVAS_BACKGROUND,
            selectedElementId: null,
            history: [],
            historyIndex: -1
          });

          // Initialize history with loaded state
          get().saveStateToHistory();
        },

        saveDesign: async () => {
          const { design, elements, canvasSize, canvasBackground } = get();
          
          if (!design) {
            return null;
          }

          try {
            set({ isLoading: true, error: null });
            
            const updatedDesign = {
              ...design,
              elements,
              canvasSize,
              canvasBackground,
              lastModified: new Date().toISOString()
            };

            const savedDesign = await saveDesignToApi(updatedDesign);
            
            if (savedDesign?.id) {
              set({
                design: savedDesign,
                isLoading: false
              });
              return savedDesign;
            }
            
            set({ isLoading: false });
            return null;
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to save design'
            });
            return null;
          }
        },

        saveStateToHistory: () => {
          // Create a clean copy of the current state for the history
          const currentState = get();
          
          const historyState: HistoryState = {
            elements: deepClone(currentState.elements),
            canvasSize: { ...currentState.canvasSize },
            canvasBackground: currentState.canvasBackground
          };

          set(state => {
            // If we're not at the latest history point, truncate the future history
            const newHistory = state.historyIndex < state.history.length - 1
              ? state.history.slice(0, state.historyIndex + 1)
              : state.history;

            // Add current state and limit history length
            const updatedHistory = [...newHistory, historyState].slice(-MAX_HISTORY_STATES);

            return {
              history: updatedHistory,
              historyIndex: updatedHistory.length - 1
            };
          });
        },

        undo: () => {
          const { historyIndex, history } = get();
          
          if (historyIndex <= 0) return; // Nothing to undo
          
          const targetState = history[historyIndex - 1];
          
          set({
            elements: deepClone(targetState.elements),
            canvasSize: { ...targetState.canvasSize },
            canvasBackground: targetState.canvasBackground,
            historyIndex: historyIndex - 1
          });
        },

        redo: () => {
          const { historyIndex, history } = get();
          
          if (historyIndex >= history.length - 1) return; // Nothing to redo
          
          const targetState = history[historyIndex + 1];
          
          set({
            elements: deepClone(targetState.elements),
            canvasSize: { ...targetState.canvasSize },
            canvasBackground: targetState.canvasBackground,
            historyIndex: historyIndex + 1
          });
        }
      }),
      {
        name: STORAGE_KEYS.CURRENT_DESIGN,
        // Only persist certain parts of the state
        partialize: (state) => ({
          design: state.design,
          elements: state.elements,
          canvasSize: state.canvasSize,
          canvasBackground: state.canvasBackground,
          selectedElementId: state.selectedElementId // Persist selected element
        })
      }
    ),
    { name: 'design-store' }
  )
);