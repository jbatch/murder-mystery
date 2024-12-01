// cache.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CacheEntry {
  timestamp: number;
  data: any;
}

interface Cache {
  [key: string]: CacheEntry;
}

export class RequestCache {
  private cache: Cache = {};
  private static instance: RequestCache;
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  private constructor() {
    // Load cache from localStorage on initialization
    const savedCache = localStorage.getItem("mysteryGeneratorCache");
    if (savedCache) {
      this.cache = JSON.parse(savedCache);
    }
  }

  public static getInstance(): RequestCache {
    if (!RequestCache.instance) {
      RequestCache.instance = new RequestCache();
    }
    return RequestCache.instance;
  }

  private saveToLocalStorage(): void {
    localStorage.setItem("mysteryGeneratorCache", JSON.stringify(this.cache));
  }

  private generateKey(prompt: string): string {
    // Remove whitespace and normalize the string
    const normalizedPrompt = prompt.replace(/\s+/g, " ").trim();

    // Create a simple numeric hash
    let hash = 0;
    for (let i = 0; i < normalizedPrompt.length; i++) {
      const char = normalizedPrompt.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to hex string
    return Math.abs(hash).toString(16);
  }

  public get(prompt: string): any | null {
    const key = this.generateKey(prompt);
    const entry = this.cache[key];

    if (!entry) return null;

    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      delete this.cache[key];
      this.saveToLocalStorage();
      return null;
    }

    return entry.data;
  }

  public set(prompt: string, data: any): void {
    const key = this.generateKey(prompt);
    this.cache[key] = {
      timestamp: Date.now(),
      data,
    };
    this.saveToLocalStorage();
  }

  public clear(): void {
    this.cache = {};
    localStorage.removeItem("mysteryGeneratorCache");
  }
}
