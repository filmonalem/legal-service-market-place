import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../core/services/translation.service';
interface HelpStep {
  title: string;
  content: string;
}

interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps?: HelpStep[];
}
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent implements OnInit {
  activeSection: string | null = null;
  currentTourStep: number = 0;
  isTourActive: boolean = false;

  helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'HELP.SECTIONS.GETTING_STARTED.TITLE',
      description: 'HELP.SECTIONS.GETTING_STARTED.DESCRIPTION',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      steps: [
        {
          title: 'HELP.TOUR.STEP1.TITLE',
          content: 'HELP.TOUR.STEP1.CONTENT'
        },
        {
          title: 'HELP.TOUR.STEP2.TITLE',
          content: 'HELP.TOUR.STEP2.CONTENT'
        }
      ]
    },
    {
      id: 'legal-services',
      title: 'HELP.SECTIONS.LEGAL_SERVICES.TITLE',
      description: 'HELP.SECTIONS.LEGAL_SERVICES.DESCRIPTION',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      steps: [
        {
          title: 'HELP.SECTIONS.LEGAL_SERVICES.FINDING_LAWYER.TITLE',
          content: 'HELP.SECTIONS.LEGAL_SERVICES.FINDING_LAWYER.CONTENT'
        },
        {
          title: 'HELP.SECTIONS.LEGAL_SERVICES.BOOKING.TITLE',
          content: 'HELP.SECTIONS.LEGAL_SERVICES.BOOKING.CONTENT'
        },
        {
          title: 'HELP.SECTIONS.LEGAL_SERVICES.CONSULTATION.TITLE',
          content: 'HELP.SECTIONS.LEGAL_SERVICES.CONSULTATION.CONTENT'
        },
        {
          title: 'HELP.SECTIONS.LEGAL_SERVICES.PAYMENT.TITLE',
          content: 'HELP.SECTIONS.LEGAL_SERVICES.PAYMENT.CONTENT'
        }
      ]
    },
    {
      id: 'account',
      title: 'HELP.SECTIONS.ACCOUNT.TITLE',
      description: 'HELP.SECTIONS.ACCOUNT.DESCRIPTION',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      steps: [
        {
          title: 'HELP.SECTIONS.ACCOUNT.PROFILE.TITLE',
          content: 'HELP.SECTIONS.ACCOUNT.PROFILE.CONTENT'
        },
        {
          title: 'HELP.SECTIONS.ACCOUNT.SECURITY.TITLE',
          content: 'HELP.SECTIONS.ACCOUNT.SECURITY.CONTENT'
        },
        {
          title: 'HELP.SECTIONS.ACCOUNT.NOTIFICATIONS.TITLE',
          content: 'HELP.SECTIONS.ACCOUNT.NOTIFICATIONS.CONTENT'
        },
        {
          title: 'HELP.SECTIONS.ACCOUNT.BILLING.TITLE',
          content: 'HELP.SECTIONS.ACCOUNT.BILLING.CONTENT'
        }
      ]
    }
  ];

  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.currentLang$.subscribe(() => {
      this.helpSections = [...this.helpSections];
    });
  }

  toggleSection(sectionId: string) {
    this.activeSection = this.activeSection === sectionId ? null : sectionId;
  }

  startTour(section: HelpSection) {
    if (section.steps?.length) {
      this.isTourActive = true;
      this.currentTourStep = 0;
      this.showCurrentStep();
    }
  }

  nextStep(section: HelpSection) {
    if (section.steps && this.currentTourStep < section.steps.length - 1) {
      this.currentTourStep++;
      this.showCurrentStep();
    } else {
      this.endTour();
    }
  }

  previousStep(section: HelpSection) {
    if (this.currentTourStep > 0) {
      this.currentTourStep--;
      this.showCurrentStep();
    }
  }

  endTour() {
    this.isTourActive = false;
    this.currentTourStep = 0;
  }

  private showCurrentStep() {
    console.log('Showing step:', this.currentTourStep);
  }

}
