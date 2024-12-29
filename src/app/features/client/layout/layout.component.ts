import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  heroStar,
  heroFolder,
  heroCalendar,
  heroChatBubbleLeftRight,
  heroBookOpen
} from '@ng-icons/heroicons/outline';
import { ThemeSwitcherComponent } from '../../../shared/components/theme-switcher/theme-switcher.component';
import { LanguageSelectorComponent } from '../../../shared';
import { AuthService } from '../../../core/services/auth.service';

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
      heroStar
    })
  ],
  templateUrl: './layout.component.html'
})
export class ClientLayoutComponent implements OnInit {
  user: User | null = null;
  isMobileMenuOpen = false;
  isUserMenuOpen = false;
  isDark = false;

  navigationItems: NavigationItem[] = [
    { label: 'NAV.DASHBOARD', route: '/client/dashboard', icon: 'heroPresentationChartLine' },
    { label: 'NAV.LAWYERS', route: '/client/lawyers', icon: 'heroScale' },
    { label: 'NAV.APPOINTMENTS', route: '/client/appointments', icon: 'heroCalendar' },
    { label: 'NAV.FEEDBACK', route: '/client/feedback', icon: 'heroStar' },
    { label: 'NAV.RESOURCES', route: '/client/resources', icon: 'heroBookOpen' },
    { label: 'NAV.POST', route: '/client/posts', icon: 'heroChatBubbleLeftRight' }
  ];

  constructor(
    private elementRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {
    this.loadUserData();
  }

  ngOnInit() {
    // Check dark mode preference
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
    }

    // Handle mobile menu separately
    if (!this.elementRef.nativeElement.querySelector('#mobileMenu')?.contains(event.target as Node)) {
      this.isMobileMenuOpen = false;
    }
  }

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
    this.router.navigate(['/login']);
  }
}
