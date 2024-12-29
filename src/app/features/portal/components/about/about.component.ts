import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  stats = [
    { value: '2+', key: 'ABOUT.STATS.EXPERIENCE' },
    { value: '500+', key: 'ABOUT.STATS.CASES' },
    { value: '50+', key: 'ABOUT.STATS.LAWYERS' },
    { value: '98%', key: 'ABOUT.STATS.SUCCESS_RATE' }
  ];

  team = [
    {
      name: 'ABOUT.TEAM.MEMBER1.NAME',
      role: 'ABOUT.TEAM.MEMBER1.ROLE',
      description: 'ABOUT.TEAM.MEMBER1.DESCRIPTION'
    }
  ];

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.currentLang$.subscribe(() => {
      this.stats = [...this.stats];
      this.team = [...this.team];
    });
  }
}
