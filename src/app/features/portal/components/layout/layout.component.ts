import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent } from '@ng-icons/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeSwitcherComponent } from '../../../../shared/components/theme-switcher/theme-switcher.component';
import { LanguageSelectorComponent } from '../../../../shared';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    TranslateModule,
    NgIconComponent,
    ThemeSwitcherComponent,
    LanguageSelectorComponent
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('200ms ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  isMobileMenuOpen = false;
  isServicesOpen = false;
  isResourcesOpen = false;

  navItems = {
    services: [
      { path: '/services/service1', label: 'NAV.SERVICE1' },
      { path: '/services/service2', label: 'NAV.SERVICE2' },
      { path: '/services/service3', label: 'NAV.SERVICE3' }
    ],
    resources: [
      { path: '/resources/guides', label: 'NAV.GUIDES' },
      { path: '/resources/documents', label: 'NAV.DOCUMENTS' },
      { path: '/resources/faq', label: 'NAV.FAQ' }
    ]
  };

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdowns();
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.closeDropdowns();
    }
  }

  toggleServicesDropdown(event: Event) {
    event.stopPropagation(); 
    this.isServicesOpen = !this.isServicesOpen;
    if (this.isServicesOpen) {
      this.isResourcesOpen = false;
    }
  }

  toggleResourcesDropdown(event: Event) {
    event.stopPropagation(); 
    this.isResourcesOpen = !this.isResourcesOpen;
    if (this.isResourcesOpen) {
      this.isServicesOpen = false;
    }
  }

  closeDropdowns() {
    this.isServicesOpen = false;
    this.isResourcesOpen = false;
  }
}