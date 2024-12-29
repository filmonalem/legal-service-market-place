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
  imports: [CommonModule,TranslateModule, RouterLink],
  templateUrl: './help.component.html',
  styleUrl: './help.component.css'
})
export class HelpComponent implements OnInit {
  activeSection: string | null = null;
  currentTourStep: number = 0;
  isTourActive: boolean = false;

  helpSections: HelpSection[] = [
    {
      id: 'profile-creation',
      title: 'HELP_LAWYER.SECTIONS.PROFILE_CREATION.TITLE',
      description: 'HELP_LAWYER.SECTIONS.PROFILE_CREATION.DESCRIPTION',
      icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
      steps: [
        {
          title: 'HELP_LAWYER.TOUR.STEP1.TITLE',
          content: 'Follow these steps to create your profile.'
        },
        {
          title: 'HELP_LAWYER.TOUR.STEP2.TITLE',
          content: 'Fill out your personal information.'
        },
        {
          title: 'HELP_LAWYER.TOUR.STEP3.TITLE',
          content: 'Upload your qualifications and certifications.'
        },
        {
          title: 'HELP_LAWYER.TOUR.STEP4.TITLE',
          content: 'Review and submit your profile for approval.'
        }
      ]
    },
    {
      id: 'contract-agreement',
      title: 'HELP_LAWYER.SECTIONS.CONTRACT_AGREEMENT.TITLE',
      description: 'HELP_LAWYER.SECTIONS.CONTRACT_AGREEMENT.DESCRIPTION',
      icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4',
      steps: [
        {
          title: 'HELP_LAWYER.TOUR.STEP1.TITLE',
          content: 'Once your profile is approved, you will receive a contract agreement.'
        },
        {
          title: 'HELP_LAWYER.TOUR.STEP2.TITLE',
          content: 'Review the contract thoroughly before signing.'
        },
        {
          title: 'HELP_LAWYER.TOUR.STEP3.TITLE',
          content: 'Sign the contract to finalize your registration.'
        }
      ]
    },
    {
      id: 'access-appointments',
      title: 'HELP_LAWYER.SECTIONS.ACCESS_APPOINTMENTS.TITLE',
      description: 'HELP_LAWYER.SECTIONS.ACCESS_APPOINTMENTS.DESCRIPTION',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      steps: [
        {
          title: 'HELP_LAWYER.TOUR.STEP1.TITLE',
          content: 'After signing the contract, you will gain access to the appointment system.'
        },
        {
          title: 'HELP_LAWYER.TOUR.STEP2.TITLE',
          content: 'Schedule your first appointment through the portal.'
        },
        {
          title: 'HELP_LAWYER.TOUR.STEP3.TITLE',
          content: 'Manage your appointments and client interactions.'
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
