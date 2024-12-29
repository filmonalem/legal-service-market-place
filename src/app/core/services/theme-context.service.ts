import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeContextService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  private currentTheme = new BehaviorSubject<Theme>('system');
  isDarkMode$ = this.isDarkMode.asObservable();
  currentTheme$ = this.currentTheme.asObservable();

  constructor() {
    // Initialize theme from localStorage or system preference
    this.initializeTheme();
    this.watchSystemTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    this.setTheme(savedTheme);
  }

  private watchSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (this.currentTheme.value === 'system') {
          this.updateTheme(e.matches);
        }
      });

      // Initial check for system theme
      if (this.currentTheme.value === 'system') {
        this.updateTheme(mediaQuery.matches);
      }
    }
  }

  setTheme(theme: Theme) {
    this.currentTheme.next(theme);
    localStorage.setItem('theme', theme);

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.updateTheme(systemDark);
    } else {
      this.updateTheme(theme === 'dark');
    }
  }

  private updateTheme(isDark: boolean) {
    this.isDarkMode.next(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
} 