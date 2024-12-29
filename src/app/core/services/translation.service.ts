import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'ti', 'am']);
    translate.setDefaultLang('en');
    
    const browserLang = translate.getBrowserLang();
    const initialLang = browserLang?.match(/en|ti|am/) ? browserLang : 'en';
    this.setInitialLanguage(initialLang);
  }

  private setInitialLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    document.documentElement.lang = lang;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLangSubject.next(lang);
    document.documentElement.lang = lang;
  }

  getCurrentLang(): string {
    return this.translate.currentLang;
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }

  isRTL(lang: string): boolean {
    return ['ar', 'he'].includes(lang);
  }
} 