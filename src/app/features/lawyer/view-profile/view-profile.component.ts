import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LawyersService } from '../../../core/services/admin/lawyers.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { CapitalizePipe } from '../../../capitalize.pipe';

interface Lawyer {
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
  location?: string;
  specialization?: string;
  experience?: string;
  languages?: string;
  hourlyRate?: number;
  birthDate?: string;
  licenseExpiryDate?: string;
  licenseNumber?: string;
  degreeDocumentPath?: string;
  licenseDocumentPath?: string;
  certificatesDocumentPath?: string;
}

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    CapitalizePipe
  ],
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {
  selectedLawyer: Lawyer | null = null;
  showClientProfile: boolean = false;
  isDarkMode: boolean = false;

  constructor(
    private lawyersService: LawyersService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    const getId = sessionStorage.getItem('user');
    if (getId) {
      const user = JSON.parse(getId); 
      const lawyerId = user?.lawyerId;
      if (lawyerId) {
        this.viewProfile(lawyerId);
      } else {
        this.toasterService.error('No lawyer ID found in user data');
      }
    } else {
      this.toasterService.error('No user data found in session storage');
    }
  }
  
  viewProfile(lawyerId: string): void {
    this.lawyersService.getLawyerInfoById(lawyerId).subscribe(
      (data: any) => {
        if (data) {
          const lawyer: Lawyer = {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            age: data.age || '',
            gender: data.gender,
            lawyerId: data.lawyerId,
            photoURL: data.photoURL,
            lawyerType: data.lawyerType || '',
            status: data.status,
            lawyerSince: data.lawyerSince || '',
            lawyerDescription: data.bio,
            createdDate: data.createdDate,
            location: data.location || '',
            specialization: data.specialization || '',
            experience: data.experience || '',
            languages: data.languages || '',
            hourlyRate: data.hourlyRate || null,
            birthDate: data.birthDate || '',
            licenseExpiryDate: data.licenseExpiryDate || '',
            licenseNumber: data.licenseNumber || '',
            degreeDocumentPath: data.degreeDocumentPath || '',
            licenseDocumentPath: data.licenseDocumentPath || '',
            certificatesDocumentPath: data.certificatesDocumentPath || '',
          };
          console.log('Lawyer Profile:', lawyer);
          this.selectedLawyer = lawyer;
          this.showClientProfile = true; // Show profile after fetching
        } else {
          this.toasterService.error('No lawyer found with this ID');
        }
      },
      error => {
        console.error('Error fetching lawyer profile:', error);
        this.toasterService.error('Failed to fetch lawyer profile');
      }
    );
  }
}