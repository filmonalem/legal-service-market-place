import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BookingPayload {
  lawyerId: string;
  consultationType: string;
  date: string;
  timeSlot: string;
  description: string;
  attachments?: File[];
}

export interface TimeSlot {
  id: string;
  time: string;
  date: string;
  available: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.API_URL}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(bookingData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, bookingData);
  }

  getAvailableSlots(lawyerId: string, date: string): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.apiUrl}/slots/${lawyerId}`, {
      params: { date }
    });
  }

  getLawyerDetails(lawyerId: string): Observable<any> {
    return this.http.get(`${environment.API_URL}/lawyers/${lawyerId}`);
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bookingId}`);
  }
} 