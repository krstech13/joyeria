import { Injectable, signal, effect, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Inject platform ID to check if we're in browser
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Private signal for theme state - default to dark
  private _theme = signal<Theme>('dark');
  
  // Public readonly computed
  public readonly theme = computed(() => this._theme());
  public readonly isDark = computed(() => this._theme() === 'dark');
  public readonly isLight = computed(() => this._theme() === 'light');

  private readonly STORAGE_KEY = 'krs-theme-preference';

  constructor() {
    // Initialize theme from localStorage or system preference (browser only)
    this.initializeTheme();
    
    // Set up effect to persist theme changes (browser only)
    if (this.isBrowser) {
      effect(() => {
        const currentTheme = this._theme();
        this.applyTheme(currentTheme);
        this.saveThemePreference(currentTheme);
      });
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this._theme.update(current => current === 'dark' ? 'light' : 'dark');
    // Apply immediately if in browser
    if (this.isBrowser) {
      this.applyTheme(this._theme());
      this.saveThemePreference(this._theme());
    }
  }

  /**
   * Set specific theme
   */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
    if (this.isBrowser) {
      this.applyTheme(theme);
      this.saveThemePreference(theme);
    }
  }

  /**
   * Initialize theme from storage or system preference
   */
  private initializeTheme(): void {
    if (!this.isBrowser) {
      // Server-side: default to dark
      this._theme.set('dark');
      return;
    }

    // Check localStorage first
    const stored = this.getStoredTheme();
    if (stored) {
      this._theme.set(stored);
      this.applyTheme(stored);
      return;
    }

    // Fall back to system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    this._theme.set(theme);
    this.applyTheme(theme);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;
    
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  }

  /**
   * Save theme preference to localStorage
   */
  private saveThemePreference(theme: Theme): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }

  /**
   * Get stored theme from localStorage
   */
  private getStoredTheme(): Theme | null {
    if (!this.isBrowser) return null;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (e) {
      console.warn('Could not read theme preference:', e);
    }
    return null;
  }
}