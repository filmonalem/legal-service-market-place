import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { heroEye, heroEyeSlash, heroArrowPath } from '@ng-icons/heroicons/outline';
import { provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  templateUrl: './reset-password.component.html',
  providers: [
    provideIcons({
      heroEye,
      heroEyeSlash,
      heroArrowPath
    })
  ]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isSubmitting = false;
  token: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toaster: ToasterService
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.toaster.error('PASSWORD.INVALID_RESET_LINK');
      this.router.navigate(['/login']);
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && !this.isSubmitting && this.token) {
      this.isSubmitting = true;
      const { newPassword, confirmPassword } = this.resetPasswordForm.value;

      this.authService.resetPassword(this.token, newPassword, confirmPassword).subscribe({
        next: () => {
          this.toaster.success('PASSWORD.RESET_SUCCESS');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 400) {
            if (error.error.message === 'Passwords do not match') {
              this.toaster.error('PASSWORD.PASSWORDS_DONT_MATCH');
            } else {
              this.toaster.error('PASSWORD.INVALID_PASSWORD_REQUIREMENTS');
            }
          } else {
            this.toaster.error('PASSWORD.RESET_ERROR');
          }
        }
      });
    }
  }

  togglePasswordVisibility(field: 'new' | 'confirm'): void {
    if (field === 'new') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
} 