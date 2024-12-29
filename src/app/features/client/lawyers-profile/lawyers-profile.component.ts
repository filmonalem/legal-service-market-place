import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroStar,
  heroMapPin,
  heroScale,
  heroAcademicCap,
  heroBriefcase,
  heroLanguage,
  heroEye,
  heroCalendar
} from '@ng-icons/heroicons/outline';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LawyersService } from '../../../core/services/admin/lawyers.service';
import { ToasterService } from '../../../core/services/toaster.service';

interface LawyerInfo {
  lawyerId: string; // Ensure this exists
}

interface Lawyer {
  lawyerId: string;
  userId: string;
  fullName: string; 
  gender: string;
  email: string;
  phoneNumber: string;
  photoURL?: string; 
  role: string;
  isAgree: boolean;
  hasIssue: boolean;
  createdDate: string;
  lawyerInfo: LawyerInfo | null; // Use the LawyerInfo interface
}

@Component({
  selector: 'app-lawyers-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    RouterLink,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent
  ],
  providers: [
    provideIcons({
      heroStar,
      heroMapPin,
      heroScale,
      heroAcademicCap,
      heroBriefcase,
      heroLanguage,
      heroEye,
      heroCalendar
    })
  ],
  templateUrl: './lawyers-profile.component.html'
})
export class LawyersProfileComponent implements OnInit {
  lawyers: Lawyer[] = [];
  selectedLawyer?: Lawyer;
  isDarkMode = false;
  isLoading = false;
  searchTerm: string = '';
  constructor(private router: Router, private lawyerService: LawyersService, private toasterService: ToasterService) {}

  ngOnInit() {
    this.fetchLawyers();
  }
  
  onViewProfile(lawyer: Lawyer) {
    const lawyerId = lawyer.lawyerId; 
    if (lawyerId) {
        this.lawyerService.getLawyerById(lawyerId).subscribe({
            next: (lawyerDetails: any) => { // Temporarily use 'any' to debug
                console.log('Lawyer Details:', lawyerDetails); // Log the raw response
                // Validate the structure here
                this.selectedLawyer = lawyerDetails; // This will throw an error if structure is wrong
                this.router.navigate(['/client/lawyers', lawyerId]);
            },
            error: () => {
                this.toasterService.error('Failed to fetch lawyer details');
            }
        });
    } else {
        this.toasterService.error('Lawyer ID not found');
    }
}
fetchLawyers(): void {
  this.isLoading = true;
  this.lawyerService.getDataLawyer().subscribe({
    next: (response: { data: Lawyer[]; pagination: any }) => {
      // Filter lawyers who have isAgree set to true
      this.lawyers = response.data.filter(lawyer => lawyer.isAgree);
      this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
      this.toasterService.error('Failed to fetch lawyers data');
    }
  });
}
  onBookAppointment(lawyer: Lawyer) {
    this.router.navigate(['/client/appointments/new'], {
      queryParams: { lawyerId: lawyer.lawyerId }
    });
  }
  filteredLawyers() {
    if (!this.searchTerm) {
      return this.lawyers; // Return all lawyers if no search term
    }
    const term = this.searchTerm.toLowerCase();
    return this.lawyers.filter(lawyer => 
      lawyer.fullName.toLowerCase().includes(term) || 
      lawyer.email.toLowerCase().includes(term) ||
      lawyer.phoneNumber.includes(term) // Adjust based on what you want to search
    );
  }
}