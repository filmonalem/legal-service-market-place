import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslateModule } from '@ngx-translate/core';

interface Language {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="relative">
      <!-- Mobile view -->
      <button 
        (click)="toggleDropdown()" 
        class="md:hidden flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <img 
          [src]="getCurrentLanguageFlag()" 
          [alt]="getCurrentLanguageName()" 
          class="w-4 h-4 rounded-sm object-cover"
        >
        <svg 
          class="w-3 h-3 transition-transform duration-200"
          [class.rotate-180]="isOpen"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Desktop view -->
      <button 
        (click)="toggleDropdown()" 
        class="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <img 
          [src]="getCurrentLanguageFlag()" 
          [alt]="getCurrentLanguageName()" 
          class="w-5 h-5 rounded-sm object-cover"
        >
        <span class="text-sm font-medium">{{ getCurrentLanguageName() }}</span>
        <svg 
          class="w-4 h-4 transition-transform duration-200"
          [class.rotate-180]="isOpen"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown (responsive) -->
      <div 
        *ngIf="isOpen"
        class="absolute right-0 mt-2 w-36 md:w-48 text-foreground dark:text-foreground rounded-md shadow-lg bg-background dark:bg-background ring-1 ring-black ring-opacity-5 z-50"
      >
        <div 
          class="py-1" 
          role="menu" 
          aria-orientation="vertical"
        >
          <button
            *ngFor="let lang of languages"
            (click)="selectLanguage(lang.code)"
            class="w-full flex items-center px-3 md:px-4 py-2 text-xs md:text-sm text-foreground dark:text-foreground hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
          >
            <img 
              [src]="lang.flag" 
              [alt]="lang.name" 
              class="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 rounded-sm object-cover"
            >
            {{ lang.name }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: relative;
    }
  `]
})
export class LanguageSelectorComponent implements OnInit {
  isOpen = false;
  languages: Language[] = [
    { 
      code: 'en', 
      name: 'English',
      flag: '/assets/images/flags/en.svg'
    },
    { 
      code: 'ti', 
      name: 'ትግርኛ',
      flag: '/assets/images/flags/er.svg'
    },
    { 
      code: 'am', 
      name: 'አማርኛ',
      flag: '/assets/images/flags/et.svg'
    }
  ];

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  toggleDropdown(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = !this.isOpen;
  }

  selectLanguage(langCode: string) {
    this.translationService.changeLanguage(langCode);
    this.isOpen = false;
  }

  getCurrentLanguageFlag(): string {
    const currentLang = this.languages.find(
      lang => lang.code === this.translationService.getCurrentLang()
    );
    return currentLang?.flag || this.languages[0].flag;
  }

  getCurrentLanguageName(): string {
    const currentLang = this.languages.find(
      lang => lang.code === this.translationService.getCurrentLang()
    );
    return currentLang?.name || this.languages[0].name;
  }

  private onDocumentClick(event: Event) {
    if (!(event.target as HTMLElement).closest('app-language-selector')) {
      this.isOpen = false;
    }
  }
} 