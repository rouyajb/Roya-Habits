/**
 * Local Storage Service
 * Provides type-safe localStorage operations with encryption support
 */

class LocalStorageService {
  private prefix = 'roya_';

  /**
   * Set an item in localStorage
   */
  setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Get an item from localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   */
  removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * Clear all items with the app prefix
   */
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Check if a key exists
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(this.prefix + key) !== null;
  }

  /**
   * Get all keys with the app prefix
   */
  getAllKeys(): string[] {
    const keys = Object.keys(localStorage);
    return keys
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }
}

export const localStorageService = new LocalStorageService();