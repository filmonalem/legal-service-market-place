import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroEnvelope, 
  heroArrowPath, 
  heroCheckCircle,
  heroArrowLeft 
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule, NgIconComponent],
  templateUrl: './forgot-password.component.html',
  providers: [
    provideIcons({
      heroEnvelope,
      heroArrowPath,
      heroCheckCircle,
      heroArrowLeft
    })
  ]
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isSubmitting = false;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToasterService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.forgotPassword(email).subscribe({
        next: () => {
          this.emailSent = true;
          this.isSubmitting = false;
          this.toaster.success('PASSWORD.RESET_EMAIL_SENT');
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 404) {
            this.toaster.error('PASSWORD.EMAIL_NOT_FOUND');
          } else {
            this.toaster.error('PASSWORD.RESET_EMAIL_ERROR');
          }
        }
      });
    }
  }
} 