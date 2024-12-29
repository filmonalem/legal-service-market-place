import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroBars3,
  heroBell,
  heroUser,
  heroCog8Tooth,
  heroCreditCard,
  heroArrowRightOnRectangle,
  heroSquares2x2,
  heroCalendar,
  heroChatBubbleLeftRight,
  heroDocumentText,
  heroUserGroup,
  heroScale,
  heroClipboardDocument,
  heroIdentification,
  heroPresentationChartLine
} from '@ng-icons/heroicons/outline';
import { LanguageSelectorComponent } from '../../../shared/components/language-selector/language-selector.component';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}
interface User {
  userId: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

@Component({
  selector: 'app-lawyer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    TranslateModule,
    NgIconComponent,
    LanguageSelectorComponent,
    ThemeSwitcherComponent
  ],
  providers: [
    provideIcons({
      heroBars3,
      heroBell,
      heroUser,
      heroCog8Tooth,
      heroCreditCard,
      heroPresentationChartLine,
      heroArrowRightOnRectangle,
      heroSquares2x2,
      heroCalendar,
      heroChatBubbleLeftRight,
      heroDocumentText,
      heroUserGroup,
      heroScale,
      heroClipboardDocument,
      heroIdentification
    })
  ],
  templateUrl: './layout.component.html'
})
export class LawyerLayoutComponent implements OnInit {
  // user: User | null = null;
  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  isDark = false;
  user = JSON.parse(sessionStorage.getItem('user') || '{}');

  navigationItems: NavigationItem[] = [
    { label: 'NAV.DASHBOARD', route: '/lawyer/dashboard', icon: 'heroPresentationChartLine' },
    { label: 'NAV.PROFILE', route: '/lawyer/profile', icon: 'heroIdentification' },
    { label: 'NAV.APPOINTMENTS', route: '/lawyer/appointments', icon: 'heroCalendar' },
    { label: 'NAV.CASES', route: '/lawyer/cases', icon: 'heroScale' },
    { label: 'NAV.CLIENTS', route: '/lawyer/clients', icon: 'heroUserGroup' },
    { label: 'NAV.DOCUMENTS', route: '/lawyer/documents', icon: 'heroDocumentText' },
    { label: 'NAV.CONTRACT', route: '/lawyer/contract', icon: 'heroClipboardDocument' },
  ];

  constructor(    private elementRef: ElementRef,
  ) {
    this.isDark = localStorage.getItem('theme') === 'dark';
  }

  ngOnInit() {
    this.isDark = localStorage.getItem('theme') === 'dark';

  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Get the profile menu button and dropdown
    const profileButton = this.elementRef.nativeElement.querySelector('#profileButton');
    const profileDropdown = this.elementRef.nativeElement.querySelector('#profileDropdown');
    
   // Check if click is outside both the button and dropdown
   if (!profileButton?.contains(event.target as Node) && 
   !profileDropdown?.contains(event.target as Node)) {
 this.isUserMenuOpen = false;
}}

loadUserData() {
  const userData = sessionStorage.getItem('user');
  if (userData) {
    this.user = JSON.parse(userData);
  }
}

get userInitials(): string {
  if (this.user?.email) {
    return this.user.email[0].toUpperCase();
  }
  return 'U';
}
  toggleMobileMenu(event: Event) {
    event.stopPropagation();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeAllMenus() {
    this.isUserMenuOpen = false;
    this.isMobileMenuOpen = false;
  }

  logout() {
    sessionStorage.clear();
    window.location.href = '/login';
  }
}
