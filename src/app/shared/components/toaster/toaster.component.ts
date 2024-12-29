import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroCheckCircle,
  heroXCircle,
  heroExclamationCircle,
  heroInformationCircle,
  heroXMark
} from '@ng-icons/heroicons/outline';
import { ToasterService, Toast } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroCheckCircle,
      heroXCircle,
      heroExclamationCircle,
      heroInformationCircle,
      heroXMark
    })
  ],
  template: `
    <div class="absolute left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center space-y-2">
      <div
        *ngFor="let toast of toasts"
        class="flex items-center p-4 rounded-lg shadow-lg min-w-[300px] transform transition-all duration-300 ease-in-out"
        [ngClass]="{
          'bg-green-100 text-green-800': toast.type === 'success',
          'bg-red-100 text-red-800': toast.type === 'error',
          'bg-blue-100 text-blue-800': toast.type === 'info',
          'bg-yellow-100 text-yellow-800': toast.type === 'warning'
        }"
      >
        <!-- Icon for the toast type -->
        <ng-icon [name]="getIcon(toast.type)" class="w-5 h-5 mr-3"></ng-icon>
        <!-- Toast message -->
        <p class="flex-1 text-center">{{ toast.message }}</p>
      </div>
    </div>
  `
})
export class ToasterComponent implements OnInit {
  toasts: Toast[] = []; // Array to store toast messages

  constructor(private toasterService: ToasterService) {}

  ngOnInit() {
    // Subscribe to toaster service to get toast messages
    this.toasterService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  
  getIcon(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'heroCheckCircle';
      case 'error':
        return 'heroXCircle';
      case 'warning':
        return 'heroExclamationCircle';
      case 'info':
        return 'heroInformationCircle';
      default:
        return 'heroInformationCircle';
    }
  }
}
