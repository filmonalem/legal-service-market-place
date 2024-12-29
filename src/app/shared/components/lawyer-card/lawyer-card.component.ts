import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroStar,
  heroMapPin,
  heroScale,
  heroAcademicCap,
  heroBriefcase,
  heroLanguage
} from '@ng-icons/heroicons/outline';

export interface Lawyer {
  id: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  specialization: string;
  experience: number;
  rating: number;
  location: string;
  languages: string[];
  hourlyRate: number;
  education: string;
  casesWon: number;
  availability: boolean;
  description?: string;
}

@Component({
  selector: 'app-lawyer-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NgIconComponent],
  providers: [
    provideIcons({
      heroStar,
      heroMapPin,
      heroScale,
      heroAcademicCap,
      heroBriefcase,
      heroLanguage
    })
  ],
  templateUrl: './lawyer-card.component.html'
})
export class LawyerCardComponent {
  @Input() lawyer!: Lawyer;
  @Output() viewProfile = new EventEmitter<Lawyer>();
  @Output() bookAppointment = new EventEmitter<Lawyer>();
} 