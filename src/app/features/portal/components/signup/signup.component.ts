import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

interface Role {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ReactiveFormsModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  roles: Role[] = [
    {
      id: 'client',
      name: 'SIGNUP.ROLES.CLIENT.NAME',
      description: 'SIGNUP.ROLES.CLIENT.DESCRIPTION'
    },
    {
      id: 'lawyer',
      name: 'SIGNUP.ROLES.LAWYER.NAME',
      description: 'SIGNUP.ROLES.LAWYER.DESCRIPTION'
    },
    {
      id: 'admin',
      name: 'SIGNUP.ROLES.ADMIN.NAME',
      description: 'SIGNUP.ROLES.ADMIN.DESCRIPTION'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern(/^(\+251|0)(9|7)[0-9]{8}$/) 
      ]],
      gender: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
    return null;
  }

  
  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const formData = { ...this.signupForm.value };
  
      formData.fullName = `${formData.firstName} ${formData.lastName}`.trim();
      delete formData.firstName;
      delete formData.lastName;
      delete formData.confirmPassword;
  
      this.authService.signup(formData).subscribe({
        next: (response) => {
          console.log('API Response:', response);
          
          if (response.userId && response.role) {
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Unexpected response structure';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Signup Error:', error);
          this.errorMessage = error.error?.message || 'An error occurred during signup';
        },
        complete: () => {
          this.isLoading = false;
        }    
      });
    }
  }
}