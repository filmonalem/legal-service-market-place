import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  activeCases: number;
  pendingTasks: number;
  upcomingAppointments: number;
  unreadMessages: number;
}

export interface Case {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  date: string;
  lawyer: string;
  description?: string;
}

export interface Appointment {
  id: string;
  title: string;
  lawyer: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.API_URL}/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getRecentCases(): Observable<Case[]> {
    return this.http.get<Case[]>(`${this.apiUrl}/recent-cases`);
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/upcoming-appointments`);
  }
} 