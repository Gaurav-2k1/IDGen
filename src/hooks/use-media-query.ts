import { useSyncExternalStore } from 'react'

// Global cache for media query states to prevent infinite loops
const globalCache = {
  serverSnapshot: new Map<string, boolean>(),
  mediaQueries: new Map<string, MediaQueryList>(),
  listeners: new Map<string, Set<() => void>>()
}

function getServerSnapshot(query: string): boolean {
  return globalCache.serverSnapshot.get(query) ?? false
}

function getMediaQuery(query: string): MediaQueryList | null {
  if (typeof window === 'undefined') return null
  
  if (!globalCache.mediaQueries.has(query)) {
    try {
      globalCache.mediaQueries.set(query, window.matchMedia(query))
    } catch (e) {
      return null
    }
  }
  return globalCache.mediaQueries.get(query) ?? null
}

function getSnapshot(query: string): boolean {
  const mediaQuery = getMediaQuery(query)
  if (!mediaQuery) return getServerSnapshot(query)
  return mediaQuery.matches
}

function subscribe(query: string, callback: () => void): () => void {
  const mediaQuery = getMediaQuery(query)
  if (!mediaQuery) return () => {}

  // Get or create listener set for this query
  if (!globalCache.listeners.has(query)) {
    globalCache.listeners.set(query, new Set())
  }
  const listeners = globalCache.listeners.get(query)!
  
  // Add the callback to our set of listeners
  listeners.add(callback)

  // Create the change handler
  const onChange = () => {
    // Update server snapshot cache
    globalCache.serverSnapshot.set(query, mediaQuery.matches)
    // Notify all listeners
    listeners.forEach(listener => listener())
  }

  // Attach the listener using the appropriate method
  if (mediaQuery.addListener) {
    mediaQuery.addListener(onChange)
  } else {
    mediaQuery.addEventListener('change', onChange)
  }

  // Return cleanup function
  return () => {
    listeners.delete(callback)
    if (mediaQuery.removeListener) {
      mediaQuery.removeListener(onChange)
    } else {
      mediaQuery.removeEventListener('change', onChange)
    }
    
    // Clean up if no more listeners
    if (listeners.size === 0) {
      globalCache.listeners.delete(query)
      globalCache.mediaQueries.delete(query)
    }
  }
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => getSnapshot(query),
    () => getServerSnapshot(query)
  )
} 