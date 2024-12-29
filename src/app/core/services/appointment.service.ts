import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../features/client/appointment/appointment.component';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.API_URL}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAppointment(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }
  getAppointmentsByClient(userId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/client/${userId}`);
  }
  getAppointmentsByLawyer(lawyerId:string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/lawyer/${lawyerId}`);
  }

  createAppointment(appointmentData: Partial<Appointment>): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointmentData);
  }

  updateAppointment(id: string, appointmentData: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointmentData);
  }
    rescheduleAppointment(appointmentId: string, payload: { date: string; timeSlot: number;  }) : Observable<Appointment> {
      return this.http.put<Appointment>(`${this.apiUrl}/reschedule/${appointmentId}`, { payload });
    }

  cancelAppointment(id: string, reason?: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/cancel`, { reason });
  }

 

  sendReminder(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/remind`, {});
  }
} 