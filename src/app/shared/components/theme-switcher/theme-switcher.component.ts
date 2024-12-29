import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class ThemeSwitcherComponent implements OnInit {
  isDark: boolean = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.isDarkMode$.subscribe(
      isDark => this.isDark = isDark
    );
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
} 