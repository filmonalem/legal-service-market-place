import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroUser, 
  heroEnvelope, 
  heroPhone, 
  heroCamera,
  heroLockClosed,
  heroArrowRightOnRectangle,
  heroCog,
  heroEye,
  heroCreditCard
} from '@ng-icons/heroicons/outline';
import { AuthService } from '../../../core/services/auth.service';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    NgIconComponent
  ],
  providers: [
    provideIcons({
      heroUser,
      heroEnvelope,
      heroPhone,
      heroCamera,
      heroLockClosed,
      heroArrowRightOnRectangle,
      heroCog,
      heroEye,
      heroCreditCard
    })
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  user: any;

  navigationItems = [
    { label: 'PROFILE.VIEW', icon: 'heroEye', route: '/client/profile' },
    { label: 'PROFILE.SETTINGS', icon: 'heroCog', route: '/client/settings' },
    { label: 'PROFILE.BILLING', icon: 'heroCreditCard', route: '/client/billing' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToasterService,
    private router: Router
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      phoneNumber: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: ProfileComponent.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.profileForm.patchValue({
        email: this.user.email,
        phoneNumber: this.user.phoneNumber || ''
      });
    }
  }

  static passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  getUserInitial(): string {
    return this.user?.firstName?.charAt(0) || 'U';
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.profileForm.patchValue({
        phoneNumber: this.user.phoneNumber || ''
      });
    }
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid && !this.isLoading) {
      this.isLoading = true;
      // Implement profile update logic
      this.isLoading = false;
      this.isEditMode = false;
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid && !this.isLoading) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;
      const userId = this.user?.userId;

      this.authService.changePassword(currentPassword, newPassword, userId).subscribe({
        next: () => {
          this.toaster.success('PROFILE.SUCCESS.PASSWORD_CHANGED');
          this.passwordForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          if (error.status === 401) {
            this.toaster.error('PROFILE.ERROR.INVALID_CURRENT_PASSWORD');
          } else {
            this.toaster.error('PROFILE.ERROR.PASSWORD_CHANGE_FAILED');
          }
          this.isLoading = false;
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
