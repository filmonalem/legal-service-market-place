import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Booking } from '../../lawyer/models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.API_URL}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getAvailableSlots(lawyerId: string, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/slots?lawyerId=${lawyerId}&date=${date}`);
  }
 
  getOneBooking(lawyerId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/lawyer/${lawyerId}`).pipe(
      catchError(this.handleError)
    );
  }
  
  confirmBooking(bookingId: string, payload: { date: string; timeSlot: string;  }): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/confirm/${bookingId}`, payload);
}

rescheduleBooking(bookingId: string, payload: { date: string; timeSlot: number }): Observable<Booking> {
  return this.http.put<Booking>(`${this.apiUrl}/reschedule/${bookingId}`, payload).pipe(
    catchError(this.handleError)
  );
}


  cancelBooking(bookingId: string): Observable<any> {
    const url = `${this.apiUrl}/cancel/${bookingId}`;
    return this.http.delete(url);
  }
  getAppointments(lawyerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${lawyerId}`);
}
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    // Customize error handling as needed
    return throwError('Something bad happened; please try again later.');
  }
} 