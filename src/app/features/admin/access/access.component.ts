import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import {
  heroFolder,
  heroDocumentText,
  heroClipboardDocument,
  heroUserGroup,
} from '@ng-icons/heroicons/outline';
import { ToasterService } from '../../../core/services/toaster.service';
import { DashboardStats, LawyersService } from '../../../core/services/admin/lawyers.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Lawyers {
  fullName: string;
  email: string;
  phoneNumber: string;
  age: string;
  gender: string;
  lawyerId: string;
  photoURL?: string;
  lawyerType: string;
  status: string;
  lawyerSince: string;
  lawyerDescription: string;
  createdDate: string;
}

interface Transaction {
  transactionId: string;
  lawyerId: string;
  email: string;
  phoneNumber: string;
  gender: string;
  fullName: string;
  lawyerPhotoUrl?: string;
  date: Date;
  transactionType: string;
  status: string;
  amount: number;
}

interface FilterData {
  searchTerm: string;
  status: string;
}

@Component({
  selector: 'app-access',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideIcons({
      heroFolder,
      heroDocumentText,
      heroClipboardDocument,
      heroUserGroup
    })
  ],
  templateUrl: './access.component.html',
  styleUrl: './access.component.css'
})
export class AccessComponent implements OnInit {
  isLoading = false;
  showEditModal = false;
  showClientProfile = false;
  showEducationProfile = false;


  stats: DashboardStats = {
    activeLawyers: 0,
    requestLawyers: 0,
    upcomingLawyers: 0,
    unreadMessages: 0
  };
  transactions: Transaction[] = [];
  lawyers: Lawyers[] = [];
  searchControl = new FormControl();
  searchData = '';
  filterData: FilterData = {
    searchTerm: this.searchData,
    status: "",
  };

  constructor(
    private lawyerService: LawyersService,
    private toasterService: ToasterService
  ) {
    this.searchControl.valueChanges.subscribe((value) => {
      this.searchData = value;
      this.filterData.searchTerm = value;
    });
  }

  ngOnInit(): void {
    this.fetchLawyerStats();
    this.fetchLawyers();
  }

  fetchLawyerStats(): void {
    this.isLoading = true;
    this.lawyerService.getDataLawyer().subscribe({
      next: (data: DashboardStats) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toasterService.error('Failed to fetch lawyer stats');
      }
    });
  }

  filterLawyer(): void {
    this.isLoading = true;
    this.lawyerService.filterLawyers(this.filterData).subscribe({
      next: (response: { data: Lawyers[]; pagination: any }) => {
        this.lawyers = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toasterService.error('Failed to filter lawyers');
      }
    });
  }

  fetchLawyers(): void {
    this.isLoading = true;
    this.lawyerService.getDataLawyer().subscribe({
      next: (response: { data: Lawyers[]; pagination: any }) => {
        this.lawyers = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toasterService.error('Failed to fetch lawyers data');
      }
    });
  }

  calculateAge(birthDate: Date): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  formatDateToYMD(date: string | Date): string {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0];
  }

  closeModals(): void {
    this.showEditModal = false;
  }

  openModals(): void {
    this.showEditModal = true;
  }

  viewProfile(lawyerId: string) {
    console.log(lawyerId)
    this.showClientProfile = !this.showClientProfile
  }

  showLawyerDetails() {
    this.showEducationProfile = !this.showEducationProfile
  }

  confirmLawyer(lawyerId: string): void { }
}
