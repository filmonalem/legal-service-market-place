import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToasterService } from './toaster.service';
import { environment } from '../../../environments/environment';

interface User {
  userId: string;
  email: string;
  username: string;
  role: 'admin' |'super_admin' | 'client' | 'lawyer';
  isAdmin: boolean;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  user: User;
    userId: string;
    lawyerId?: string; 
    role: 'admin' | 'super_admin' | 'client' | 'lawyer';
  accessToken: string;
}

// Add this interface to match the backend DTO
interface ResetPasswordDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.API_URL}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toaster: ToasterService
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap({
          next: (response) => {
            sessionStorage.setItem('user', JSON.stringify(response.user));
            sessionStorage.setItem('access_token', response.accessToken);
            sessionStorage.setItem('user_role', response.user.role);
            sessionStorage.setItem('phone', response.user.phone);
            this.toaster.success(`Welcome back, ${response.user.firstName}! Login successful.`);
            this.redirectBasedOnRole(response.user.role);
          },
          error: (error) => {
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.status === 401) {
              errorMessage = 'Invalid email or password.';
            } else if (error.status === 404) {
              errorMessage = 'User not found.';
            }
            
            this.toaster.error(errorMessage);
          }
        })
      );
  }
  signup(userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, userData)
      .pipe(
        tap({
          next: (response) => {
            // Ensure you access the properties directly from the response
            sessionStorage.setItem('userId', response.userId);
            sessionStorage.setItem('lawyerId', response.lawyerId || '');
            sessionStorage.setItem('user_role', response.role);
            this.toaster.success(`Welcome! Your account has been created successfully.`);
            this.redirectBasedOnRole(response.role); // Redirect based on role
          },
          error: (error) => {
            // Handle error as previously defined
            let errorMessage = 'Registration failed. Please try again.';
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.status === 409) {
              errorMessage = 'Email or username already exists.';
            } else if (error.status === 400) {
              errorMessage = 'Invalid registration data. Please check your inputs.';
            }
            this.toaster.error(errorMessage);
          }
        })
      );
  }
  redirectBasedOnRole(role: string): void {
    console.log('Redirecting user with role:', role);
    
    switch (role.toLowerCase()) {
      case 'super_admin':
        this.router.navigate(['/admin']); 
        break;
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'client':
        this.router.navigate(['/client']);
        break;
      case 'lawyer':
        this.router.navigate(['/lawyer']);
        break;
      default:
        this.router.navigate(['/']);
        this.toaster.error('Invalid user role');
    }
  }

  getUser(): User | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  getUserRole(): string | null {
    return sessionStorage.getItem('user_role');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    sessionStorage.clear();
    this.toaster.info('You have been logged out successfully.');
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string, confirmPassword: string): Observable<any> {
    const resetPasswordDto: ResetPasswordDto = {
      token,
      newPassword,
      confirmPassword
    };
    
    return this.http.post(`${this.API_URL}/reset-password`, resetPasswordDto);
  }

  changePassword(currentPassword: string, newPassword: string, userId: string): Observable<any> {
    return this.http.patch(`${this.API_URL}/change-password`, {
      currentPassword,
      newPassword,
      userId
    });
  }
} 