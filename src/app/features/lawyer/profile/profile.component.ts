import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroUser,
  heroCamera,
  heroBriefcase,
  heroAcademicCap,
  heroLanguage,
  heroMapPin,
  heroPhone,
  heroEnvelope,
  heroGlobeAlt
} from '@ng-icons/heroicons/outline';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ToasterService } from '../../../core/services/toaster.service';
import { LawyerProfileService } from './profile.service';
import { finalize } from 'rxjs/operators';

interface FormStep {
  title: string;
  subtitle: string;
  key: 'personal' | 'professional' | 'documents';
}

interface LawyerProfileData {
  userId: string;
  lawyerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  specialization: string;
  barNumber: string;
  experience: number;
  languages: string[];
  bio: string;
  hourlyRate: number;
}

@Component({
  selector: 'app-lawyer-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent
  ],
  providers: [
    provideIcons({
      heroUser,
      heroCamera,
      heroBriefcase,
      heroAcademicCap,
      heroLanguage,
      heroMapPin,
      heroPhone,
      heroEnvelope,
      heroGlobeAlt
    })
  ],
  templateUrl: './profile.component.html'
})
export class LawyerProfileComponent implements OnInit {
  lawyerId: string | null = null;
  userId: string | null = null; 
  email: string | null = null;
  currentStep = 0;
  formSteps: FormStep[] = [
    { title: 'LAWYER_PROFILE.STEPS.PERSONAL.TITLE', subtitle: 'LAWYER_PROFILE.STEPS.PERSONAL.SUBTITLE', key: 'personal' },
    { title: 'LAWYER_PROFILE.STEPS.PROFESSIONAL.TITLE', subtitle: 'LAWYER_PROFILE.STEPS.PROFESSIONAL.SUBTITLE', key: 'professional' },
    { title: 'LAWYER_PROFILE.STEPS.DOCUMENTS.TITLE', subtitle: 'LAWYER_PROFILE.STEPS.DOCUMENTS.SUBTITLE', key: 'documents' }
  ];
  profileForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private profileService: LawyerProfileService,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadUserData();
  }

  private initForm() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      birthDate: [null, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(09|07)\d{8}$/)]],
      licenseNumber: ['', Validators.required],
      licenseExpiryDate: [null, Validators.required],
      location: ['', Validators.required],
      specialization: ['', Validators.required],
      barNumber: ['', Validators.required],
      experience: ['', [Validators.required, Validators.min(0)]],
      languages: [[], Validators.required],
      bio: ['', [Validators.required, Validators.minLength(100)]],
      hourlyRate: ['', [Validators.required, Validators.min(0)]],
      documents: this.fb.group({
        degree: [null],
        license: [null],
        certificates: [null]
      })
    });
  }

  
  private loadUserData() {
    const userJson = sessionStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.lawyerId = user.lawyerId;
        this.userId = user.userId;
        this.email= user.email;
        
        // Set email in the form if it exists in sessionStorage
        if (user.email) {
          this.profileForm.patchValue({
            email: user.email
          });
          // Optionally disable the email field since it's coming from session
          this.profileForm.get('email')?.disable();
        }
      } catch (error) {
        console.error("Error parsing user JSON from sessionStorage:", error);
        this.toaster.error('Error loading user data');
      }
    } else {
      console.warn("No user data found in sessionStorage");
    }
  }

  canProceed(): boolean {
    return this.isStepValid(this.currentStep);
  }

  private getStepFields(step: number): string[] {
    switch (step) {
      case 0: return ['firstName', 'lastName', 'birthDate', 'phoneNumber', 'location'];
      case 1: return ['specialization', 'licenseNumber', 'licenseExpiryDate', 'barNumber', 'experience', 'languages', 'bio', 'hourlyRate'];
      case 2: return ['documents.degree', 'documents.license', 'documents.certificates'];
      default: return [];
    }
  }

  isStepValid(step: number): boolean {
    return this.getStepFields(step).every(field => this.profileForm.get(field)?.valid);
  }

  nextStep() {
    if (this.canProceed()) {
      this.currentStep++;
    } else {
      this.markCurrentStepFieldsAsTouched();
      this.toaster.error('LAWYER_PROFILE.ERROR.REQUIRED_FIELDS');
    }
  }

  private markCurrentStepFieldsAsTouched() {
    this.getStepFields(this.currentStep).forEach(field => {
      const control = this.profileForm.get(field);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

// In the onSubmit method
onSubmit() {
  if (this.isFormValid()) {
    const profileJson = this.constructProfileJson(); // Construct JSON object

    this.isLoading = true;

    this.profileService.createProfile(profileJson).subscribe({
      next: () => {
        sessionStorage.setItem('user', JSON.stringify({ userId: this.lawyerId, email: this.profileForm.value.email }));
        this.toaster.success('LAWYER_PROFILE.SUCCESS.CREATE');
        this.profileForm.reset();
        this.isLoading = false;
      },
      error: (errorResponse) => {
        console.error("Error during profile creation:", errorResponse);
        this.toaster.error('LAWYER_PROFILE.ERROR.CREATE_FAILED');
        this.isLoading = false;
      }
    });
  } else {
    this.markAllFieldsAsTouched();
    this.toaster.error('LAWYER_PROFILE.ERROR.FORM_INVALID');
  }
}
private constructProfileJson(): any {
  const profileData = this.profileForm.value;

  const birthDate = new Date(profileData.birthDate);
  const licenseExpiryDate = new Date(profileData.licenseExpiryDate);

  if (isNaN(birthDate.getTime())) {
    this.toaster.error('Invalid birth date. Please select a valid date.');
    return null;
  }

  if (isNaN(licenseExpiryDate.getTime())) {
    this.toaster.error('Invalid license expiry date. Please select a valid date.');
    return null;
  }
  

  // Construct JSON object
  return {
    userId: this.userId,
    lawyerId: this.lawyerId,
    fullName: this.fullName, // Combine first and last name
    email: this.email,
    gender: profileData.gender,
    birthDate: birthDate.toISOString(),
    phoneNumber: profileData.phoneNumber,
    location: profileData.location,
    specialization: profileData.specialization,
    licenseNumber: profileData.licenseNumber,
    licenseExpiryDate: licenseExpiryDate.toISOString(),
    barNumber: profileData.barNumber,
    experience: profileData.experience,
    languages: profileData.languages, // Array of strings
    bio: profileData.bio,
    hourlyRate: profileData.hourlyRate,
    documents: {
      degree: profileData.documents.degree || null,
      license: profileData.documents.license || null,
      certificates: profileData.documents.certificates || []
    }
  };
}
// Update the constructFormData method
private constructFormData(): FormData | null {
  const formData = new FormData();
  const profileData = this.profileForm.value;

  // Add required fields to formData
  formData.append('lawyerId', this.lawyerId!);
  if (this.email) {
    formData.append('email', this.email); // Append email only if it's not null
  }

  formData.append('gender', profileData.gender);
  formData.append('location', profileData.location);
  formData.append('phoneNumber', profileData.phoneNumber);
  formData.append('specialization', profileData.specialization);
  formData.append('licenseNumber', profileData.licenseNumber);
  formData.append('experience', profileData.experience.toString());

  // Handle birth date
  const birthDate = new Date(profileData.birthDate);
  if (isNaN(birthDate.getTime())) {
    this.toaster.error('Invalid birth date. Please select a valid date.');
    return null;
  }
  formData.append('birthDate', birthDate.toISOString());

  // Handle license expiry date
  const licenseExpiryDate = new Date(profileData.licenseExpiryDate);
  if (isNaN(licenseExpiryDate.getTime())) {
    this.toaster.error('Invalid license expiry date. Please select a valid date.');
    return null;
  }
  formData.append('licenseExpiryDate', licenseExpiryDate.toISOString());

  // Handle document uploads
  this.appendDocuments(formData, profileData.documents);

  return formData;
}
// Separate method to handle document uploads
private appendDocuments(formData: FormData, documents: any) {
  if (documents) {
    if (documents.degree) {
      formData.append('profilePicture', documents.degree as File);
    }
    if (documents.license) {
      formData.append('license', documents.license as File);
    }
    if (documents.certificates) {
      Array.from(documents.certificates as FileList).forEach(cert => {
        formData.append('certificates', cert);
      });
    }
  }
}

    private markAllFieldsAsTouched() {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  onFileChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileForm.get('documents')?.get(field)?.setValue(file);
    }
  }

  isFormValid(): boolean {
    const requiredFields = [
      'firstName', 'lastName', 'birthDate', 'phoneNumber',
      'location', 'gender', 'specialization', 'licenseNumber',
      'licenseExpiryDate', 'experience', 'languages', 'bio', 'hourlyRate'
    ];
    return requiredFields.every(field => {
      const control = this.profileForm.get(field);
      return control?.valid && control?.value !== null && control?.value !== '';
    }) && this.lawyerId !== null && this.fullName !== '';
  }

  get fullName(): string {
    const firstName = this.profileForm.get('firstName')?.value || '';
    const lastName = this.profileForm.get('lastName')?.value || '';
    return `${firstName} ${lastName}`.trim();
  }

  private logFormValidation(step: number) {
    const fields = this.getStepFields(step);
    console.log('Current Step:', step);
    console.log('Form Valid:', this.profileForm.valid);
    console.log('Form Values:', this.profileForm.value);
    
    fields.forEach(field => {
      const control = this.profileForm.get(field);
      console.log(`Field ${field}:`, {
        value: control?.value,
        valid: control?.valid,
        touched: control?.touched,
        errors: control?.errors
      });
    });
  }
}