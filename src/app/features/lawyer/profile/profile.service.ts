import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LawyerProfileData } from '../models/lawyer.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LawyerProfileService {
  private apiUrl = `${environment.API_URL}/lawyers`;

  constructor(private http: HttpClient) {}

  createProfile(formData: FormData): Observable<LawyerProfileData> {
    const url = `${this.apiUrl}/profile`;
    return this.http.post<LawyerProfileData>(url, formData);
  }

  getProfile(): Observable<LawyerProfileData> {
    const url = `${this.apiUrl}/profile`;
    return this.http.get<LawyerProfileData>(url);
  }

  updateProfile(lawyerId: string, formData: FormData): Observable<LawyerProfileData> {
    const url = `${this.apiUrl}/${lawyerId}`;
    return this.http.patch<LawyerProfileData>(url, formData);
  }
}