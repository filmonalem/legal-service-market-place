import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroBell, 
  heroGlobeAlt, 
  heroMoon, 
  heroSun,
  heroLanguage,
  heroDevicePhoneMobile
} from '@ng-icons/heroicons/outline';
import { ToasterService } from '../../../core/services/toaster.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TranslationService } from '../../../core/services/translation.service';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    NgIconComponent,
    ThemeSwitcherComponent,
    LanguageSelectorComponent
  ],
  providers: [
    provideIcons({
      heroBell,
      heroGlobeAlt,
      heroMoon,
      heroSun,
      heroLanguage,
      heroDevicePhoneMobile
    })
  ],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  notificationForm: FormGroup;
  isDark = false;

  constructor(
    private fb: FormBuilder,
    private toaster: ToasterService,
    private themeService: ThemeService,
    private translationService: TranslationService
  ) {
    this.notificationForm = this.fb.group({
      emailNotifications: [true],
      smsNotifications: [false]
    });
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDark = isDark;
    });
  }
} 