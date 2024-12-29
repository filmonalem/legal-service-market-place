import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
            Unauthorized Access
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        <div>
          <a routerLink="/" 
             class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Return to Home
          </a>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {} 