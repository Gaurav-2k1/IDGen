// ID Card Builder - Custom React Hooks
import { useEffect, useState, useRef, useCallback } from 'react';
import { debounce } from './utils';

/**
 * Hook to manage local storage state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      if (typeof window === 'undefined') {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a client`
        );
      }

      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Listen for changes to this localStorage value from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook for tracking outside clicks
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

/**
 * Hook for delayed state updates (debounce)
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number
): [T, (value: T) => void, T] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  const debouncedSetValue = useCallback(
    debounce((value: T) => {
      setDebouncedValue(value);
    }, delay),
    [delay]
  );

  const handleSetValue = (newValue: T) => {
    setValue(newValue);
    debouncedSetValue(newValue);
  };

  return [value, handleSetValue, debouncedValue];
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options: { ctrl?: boolean; alt?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!options.ctrl || e.ctrlKey) &&
        (!options.alt || e.altKey) &&
        (!options.shift || e.shiftKey)
      ) {
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, options]);
}

/**
 * Hook for tracking window size
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial size

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook for media queries
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    const updateMatches = () => setMatches(media.matches);
    
    updateMatches();
    media.addEventListener('change', updateMatches);
    
    return () => {
      media.removeEventListener('change', updateMatches);
    };
  }, [query]);

  return matches;
}

/**
 * Hook for tracking element position and size
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>() {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateSize = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        setSize({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
        });
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(ref.current);

    return () => {
      if (ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, ...size };
}

/**
 * Hook for throttled function calls
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef(0);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const lastArgs = useRef<Parameters<T> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      lastArgs.current = args;

      const execute = () => {
        lastRun.current = Date.now();
        timeout.current = null;
        if (lastArgs.current) {
          callback(...lastArgs.current);
        }
      };

      if (now - lastRun.current >= delay) {
        if (timeout.current) {
          clearTimeout(timeout.current);
          timeout.current = null;
        }
        execute();
      } else if (!timeout.current) {
        const timeRemaining = delay - (now - lastRun.current);
        timeout.current = setTimeout(execute, timeRemaining);
      }
    },
    [callback, delay]
  );
}