import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
  activeClients: number;
  pendingAppointments: number;
  activeCases: number;
  monthlyEarnings: number;
  completedCases: number;
  unreadMessages: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Case {
  id: string;
  title: string;
  client: string;
  status: 'active' | 'pending' | 'completed';
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.API_URL}/lawyers/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getUpcomingAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments`);
  }

  getRecentCases(): Observable<Case[]> {
    return this.http.get<Case[]>(`${this.apiUrl}/cases`);
  }
} 