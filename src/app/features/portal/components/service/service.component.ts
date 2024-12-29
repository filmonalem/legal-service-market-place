import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './service.component.html'
})
export class ServiceComponent implements OnInit {
  services = [
    {
      title: 'SERVICES.CORPORATE.TITLE',
      description: 'SERVICES.CORPORATE.DESCRIPTION',
      features: [
        'SERVICES.CORPORATE.FEATURES.BUSINESS',
        'SERVICES.CORPORATE.FEATURES.CONTRACT',
        'SERVICES.CORPORATE.FEATURES.MERGER'
      ],
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    {
      title: 'SERVICES.IP.TITLE',
      description: 'SERVICES.IP.DESCRIPTION',
      features: [
        'SERVICES.IP.FEATURES.PATENT',
        'SERVICES.IP.FEATURES.TRADEMARK',
        'SERVICES.IP.FEATURES.COPYRIGHT'
      ],
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
    },
    {
      title: 'SERVICES.LITIGATION.TITLE',
      description: 'SERVICES.LITIGATION.DESCRIPTION',
      features: [
        'SERVICES.LITIGATION.FEATURES.CIVIL',
        'SERVICES.LITIGATION.FEATURES.DISPUTE',
        'SERVICES.LITIGATION.FEATURES.APPEALS'
      ],
      icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
    }
  ];

  additionalServices = [
    {
      title: 'SERVICES.FAMILY.TITLE',
      description: 'SERVICES.FAMILY.DESCRIPTION',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    },
    {
      title: 'SERVICES.REAL_ESTATE.TITLE',
      description: 'SERVICES.REAL_ESTATE.DESCRIPTION',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      title: 'SERVICES.EMPLOYMENT.TITLE',
      description: 'SERVICES.EMPLOYMENT.DESCRIPTION',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },
    {
      title: 'SERVICES.TAX.TITLE',
      description: 'SERVICES.TAX.DESCRIPTION',
      icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
    }
  ];

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.currentLang$.subscribe(() => {
      this.services = [...this.services];
      this.additionalServices = [...this.additionalServices];
    });
  }
}
