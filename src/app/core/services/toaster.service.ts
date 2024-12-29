import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);

  constructor() {}

  show(toast: Toast) {
    const currentToasts = this.toasts$.value;
    this.toasts$.next([...currentToasts, toast]);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast);
    }, toast.duration || 3000);
  }

  success(message: string, duration = 3000) {
    this.show({ message, type: 'success', duration });
  }

  error(message: string, duration = 3000) {
    this.show({ message, type: 'error', duration });
  }

  info(message: string, duration = 3000) {
    this.show({ message, type: 'info', duration });
  }

  warning(message: string, duration = 3000) {
    this.show({ message, type: 'warning', duration });
  }

  private remove(toast: Toast) {
    const currentToasts = this.toasts$.value;
    this.toasts$.next(currentToasts.filter(t => t !== toast));
  }

  getToasts() {
    return this.toasts$.asObservable();
  }
} 