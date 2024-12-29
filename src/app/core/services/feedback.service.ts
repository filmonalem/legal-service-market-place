import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FeedbackPayload {
  overallRating: number;
  expertise: number;
  communication: number;
  responsiveness: number;
  value: number;
  professionalism: number;
  review: string;
  recommendation: boolean;
  improvements?: string;
  anonymous: boolean;
  lawyerId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = `${environment.API_URL}/feedback`;

  constructor(private http: HttpClient) {}

  submitFeedback(feedback: FeedbackPayload): Observable<any> {
    return this.http.post(this.apiUrl, feedback);
  }

  getFeedbackForLawyer(lawyerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/lawyer/${lawyerId}`);
  }
} 