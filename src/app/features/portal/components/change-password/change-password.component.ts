import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ToasterService } from '../../../../core/services/toaster.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isSubmitting = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toaster: ToasterService
  ) {
    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
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
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid && !this.isSubmitting && this.token) {
      this.isSubmitting = true;
      const { password, confirmPassword } = this.changePasswordForm.value;

      this.authService.resetPassword(this.token, password, confirmPassword).subscribe({
        next: () => {
          this.toaster.success('PASSWORD.RESET_SUCCESS');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 400) {
            this.toaster.error('PASSWORD.INVALID_PASSWORD_REQUIREMENTS');
          } else {
            this.toaster.error('PASSWORD.RESET_ERROR');
          }
        }
      });
    }
  }
} 