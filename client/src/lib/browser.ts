/**
 * Browser Environment Detection Utilities
 * 
 * These utilities help prevent SSR (Server-Side Rendering) hydration errors
 * by safely detecting browser-only APIs like window, document, and localStorage.
 * 
 * Use these instead of direct window/document access to ensure code works
 * during both server-side rendering and client-side hydration.
 */

/**
 * Returns true if code is running in browser environment
 * Use this to guard browser-only code
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Returns true if code is running in server environment
 * Use this for server-specific logic
 */
export const isServer = typeof window === 'undefined';

/**
 * Safely access window object
 * Returns undefined on server, window object in browser
 */
export const safeWindow = isBrowser ? window : undefined;

/**
 * Safely access document object
 * Returns undefined on server, document object in browser
 */
export const safeDocument = isBrowser ? document : undefined;

/**
 * Safely access localStorage
 * Returns undefined on server, localStorage in browser
 */
export const safeLocalStorage = isBrowser ? window.localStorage : undefined;

/**
 * Safely access sessionStorage
 * Returns undefined on server, sessionStorage in browser
 */
export const safeSessionStorage = isBrowser ? window.sessionStorage : undefined;

/**
 * Safely access navigator
 * Returns undefined on server, navigator in browser
 */
export const safeNavigator = isBrowser ? window.navigator : undefined;

/**
 * Execute a callback only in browser environment
 * @param callback Function to execute in browser
 * @returns Return value of callback, or undefined if on server
 */
export function onBrowser<T>(callback: () => T): T | undefined {
  if (isBrowser) {
    return callback();
  }
  return undefined;
}

/**
 * Execute a callback only on server
 * @param callback Function to execute on server
 * @returns Return value of callback, or undefined if in browser
 */
export function onServer<T>(callback: () => T): T | undefined {
  if (isServer) {
    return callback();
  }
  return undefined;
}

/**
 * Safely get a value from localStorage
 * @param key Storage key
 * @param defaultValue Default value if not found or on server
 * @returns Stored value or default
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser || !window.localStorage) {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set a value in localStorage
 * @param key Storage key
 * @param value Value to store
 * @returns true if successful, false otherwise
 */
export function setLocalStorageItem<T>(key: string, value: T): boolean {
  if (!isBrowser || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param key Storage key to remove
 * @returns true if successful, false otherwise
 */
export function removeLocalStorageItem(key: string): boolean {
  if (!isBrowser || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current window dimensions safely
 * @returns Window dimensions or default values
 */
export function getWindowDimensions() {
  if (!isBrowser) {
    return { width: 1200, height: 800 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Scroll to top of page safely
 */
export function scrollToTop() {
  if (isBrowser) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * Scroll to element by ID safely
 * @param elementId ID of element to scroll to
 */
export function scrollToElement(elementId: string) {
  if (isBrowser) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

/**
 * Copy text to clipboard safely
 * @param text Text to copy
 * @returns Promise resolving to true if successful
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!isBrowser || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get user agent string safely
 * @returns User agent string or empty string
 */
export function getUserAgent(): string {
  return isBrowser ? window.navigator.userAgent : '';
}

/**
 * Check if user is on mobile device
 * @returns true if mobile device detected
 */
export function isMobileDevice(): boolean {
  if (!isBrowser) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Get URL query parameters safely
 * @returns URLSearchParams object or null
 */
export function getQueryParams(): URLSearchParams | null {
  if (!isBrowser) return null;
  return new URLSearchParams(window.location.search);
}

/**
 * Open URL in new tab safely
 * @param url URL to open
 */
export function openInNewTab(url: string): void {
  if (isBrowser) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
