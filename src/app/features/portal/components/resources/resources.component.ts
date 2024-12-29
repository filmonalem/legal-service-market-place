import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../../core/services/translation.service';
import { Subject, takeUntil } from 'rxjs';

interface Subsection {
  title: string;
  items: string[];
}

interface Section {
  title: string;
  content: string;
  subsections: Subsection[];
}

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  currentLang: string = 'en';
  
  sections: Section[] = [
    {
      title: 'RESOURCES.SECTIONS.CONSTITUTION.TITLE',
      content: 'RESOURCES.SECTIONS.CONSTITUTION.CONTENT',
      subsections: [
        {
          title: 'RESOURCES.SECTIONS.CONSTITUTION.SUBSECTIONS.FUNDAMENTAL_RIGHTS',
          items: [
            'RESOURCES.SECTIONS.CONSTITUTION.ITEMS.RIGHT_TO_LIFE',
            'RESOURCES.SECTIONS.CONSTITUTION.ITEMS.RIGHT_TO_LIBERTY',
            'RESOURCES.SECTIONS.CONSTITUTION.ITEMS.RIGHT_TO_EQUALITY'
          ]
        },
        {
          title: 'RESOURCES.SECTIONS.CONSTITUTION.SUBSECTIONS.FEDERAL_STRUCTURE',
          items: [
            'RESOURCES.SECTIONS.CONSTITUTION.ITEMS.FEDERAL_STRUCTURE',
            'RESOURCES.SECTIONS.CONSTITUTION.ITEMS.STATE_POWERS',
            'RESOURCES.SECTIONS.CONSTITUTION.ITEMS.LOCAL_GOVERNMENT'
          ]
        }
      ]
    },
    {
      title: 'RESOURCES.SECTIONS.CIVIL_CODE.TITLE',
      content: 'RESOURCES.SECTIONS.CIVIL_CODE.CONTENT',
      subsections: [
        {
          title: 'RESOURCES.SECTIONS.CIVIL_CODE.SUBSECTIONS.CONTRACTS',
          items: [
            'RESOURCES.SECTIONS.CIVIL_CODE.ITEMS.CONTRACT_FORMATION',
            'RESOURCES.SECTIONS.CIVIL_CODE.ITEMS.CONTRACT_PERFORMANCE',
            'RESOURCES.SECTIONS.CIVIL_CODE.ITEMS.CONTRACT_BREACH'
          ]
        },
        {
          title: 'RESOURCES.SECTIONS.CIVIL_CODE.SUBSECTIONS.PROPERTY',
          items: [
            'RESOURCES.SECTIONS.CIVIL_CODE.ITEMS.OWNERSHIP',
            'RESOURCES.SECTIONS.CIVIL_CODE.ITEMS.POSSESSION',
            'RESOURCES.SECTIONS.CIVIL_CODE.ITEMS.SERVITUDES'
          ]
        }
      ]
    }
  ];

  constructor(
    private translationService: TranslationService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Get initial language
    this.currentLang = this.translationService.getCurrentLang();
    
    // Subscribe to language changes from TranslationService
    this.translationService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        console.log('TranslationService language changed:', lang);
        this.currentLang = lang;
        this.updateTranslations();
      });

    // Subscribe to TranslateService language changes
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        console.log('TranslateService language changed:', event.lang);
        this.currentLang = event.lang;
        this.updateTranslations();
      });

    // Initial setup
    this.updateTranslations();
  }

  private updateTranslations() {
    // Set the language in TranslateService
    this.translateService.use(this.currentLang);
    
    // Force update of sections
    this.sections = [...this.sections];
    
    // Force change detection
    this.cdr.detectChanges();
    
    console.log('Translations updated for language:', this.currentLang);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  downloadResources(): void {
    console.log('Downloading resources...');
  }

  generateId(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Debug method to check current translations
  checkTranslation(key: string): void {
    console.log(`Translation for ${key}:`, this.translateService.instant(key));
  }
}
