import { Injectable, signal, Signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme: WritableSignal<string> = signal('system');
  paletteToggle: boolean = false;


  constructor() { }

  initTheme() {
    const theme = localStorage.getItem('theme') || 'system';
    this.theme.set(theme);
    this.switchTheme(theme);
  }

  switchTheme(preference: string) {
    switch(preference) {
      case 'dark':
        this.initializeDarkPalette(true);
        break;
      case 'light':
        this.initializeDarkPalette(false);
        break;
      case 'system':
        this.enableSystemPreference();
        break;
      default:
        this.enableSystemPreference();
    }
  }

  setTheme(preference: string) {
    localStorage.setItem('theme', preference);
    this.theme.set(preference);
    this.initTheme();
  }

  getTheme(): Signal<string> {
    return this.theme
  }

  enableSystemPreference() {
     // Use matchMedia to check the user preference
     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
     // Initialize the dark palette based on the initial
     // value of the prefers-color-scheme media query
     this.initializeDarkPalette(prefersDark.matches);
 
     // Listen for changes to the prefers-color-scheme media query
     prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));

  }

  // Check/uncheck the toggle and update the palette based on isDark
  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
