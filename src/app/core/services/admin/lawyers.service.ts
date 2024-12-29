import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
  
    activeLawyers: number;
    requestLawyers: number;
    upcomingLawyers: number;
    unreadMessages: number;
}
export interface Lawyer {
  lawyerInfoId: string;
  fullName: string;
  lawyerId: string;
  userId: string;
  email: string;
  phoneNumber: string;
  location: string;
  specialization: string;
  experience: number;
  languages: string;
  bio: string;
  hourlyRate: number;
  photoURL?: string; 
  gender: string;
  casesWon?: number;
  rating?: number;
  birthDate: string;
  licenseExpiryDate: string;
  licenseNumber: string;
  degreeDocumentPath?: string;
  licenseDocumentPath?: string;
  certificatesDocumentPath?: string;
}
@Injectable({
    providedIn: 'root'
})
export class LawyersService {
    private apiUrl = `${environment.API_URL}/lawyers`;

    constructor(private http: HttpClient) { }


    getDataLawyer(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    filterLawyers(data: { searchTerm?: string; status?: string; page?: number; limit?: number }): Observable<any> {
        const params = new HttpParams()
            .set('searchTerm', data.searchTerm || '')
            .set('status', data.status || '')
            .set('page', data.page?.toString() || '1')
            .set('limit', data.limit?.toString() || '5000');

        return this.http.get(`${this.apiUrl}`, { params });
    }



  getLawyers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getLawyerInfoById(lawyerId: string): Observable<Lawyer> {
    const url = `${this.apiUrl}/info/${lawyerId}`;
    return this.http.get<Lawyer>(url);
  }
  getLawyerById(lawyerId: string): Observable<Lawyer> {
    const url = `${this.apiUrl}/info/${lawyerId}`;
    return this.http.get<Lawyer>(url);
  }
  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments`);
  }

  getClientProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clients/${id}`);
  }
}
