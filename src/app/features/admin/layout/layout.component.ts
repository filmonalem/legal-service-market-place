import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBars3,
  heroBell,
  heroUser,
  heroCog8Tooth,
  heroCreditCard,
  heroArrowRightOnRectangle,
  heroPresentationChartLine,
  heroScale,
  heroFolder,
  heroCalendar,
  heroChatBubbleLeftRight,
  heroBookOpen,
  heroUserGroup,
  heroNewspaper
} from '@ng-icons/heroicons/outline';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';
import { LanguageSelectorComponent } from '../../../shared';

interface User {
  userId: string;
  email: string;
  role: string;
  isAdmin: boolean;
}

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgIconComponent,
    ThemeSwitcherComponent,
    LanguageSelectorComponent
  ],
  providers: [
    provideIcons({
      heroBars3,
      heroBell,
      heroUser,
      heroCog8Tooth,
      heroCreditCard,
      heroArrowRightOnRectangle,
      heroPresentationChartLine,
      heroScale,
      heroFolder,
      heroCalendar,
      heroChatBubbleLeftRight,
      heroBookOpen,
      heroUserGroup,
      heroNewspaper
    })
  ],
  templateUrl: './layout.component.html'
})
export class AdminLayoutComponent implements OnInit {
  user = JSON.parse(sessionStorage.getItem('user') || '{}');
  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  isDark = false;

  navigationItems: NavigationItem[] = [
    { label: 'NAV.DASHBOARD', route: '/admin/dashboard', icon: 'heroPresentationChartLine' },
    { label: 'NAV.USERS', route: '/admin/users', icon: 'heroUserGroup' },
    { label: 'NAV.CLIENTS', route: '/admin/clients', icon: 'heroScale' },
    { label: 'NAV.LAWYERS', route: '/admin/lawyers', icon: 'heroScale' },
    { label: 'NAV.CONTRACT', route: '/admin/contract', icon: 'heroBookOpen' },
    { label: 'NAV.POST', route: '/admin/post', icon: 'heroNewspaper' },
    { label: 'NAV.ACCESS', route: '/admin/access', icon: 'heroCog8Tooth' },
  ];

  constructor(private readonly elementRef:ElementRef) {
    this.isDark = localStorage.getItem('theme') === 'dark';
  }

  ngOnInit() {
    this.isDark = localStorage.getItem('theme') === 'dark';
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const profileButton = this.elementRef.nativeElement.querySelector('#profileButton');
    const profileDropdown = this.elementRef.nativeElement.querySelector('#profileDropdown');
    
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
