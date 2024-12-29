import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum CaseStatus {
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
}

export interface Case {
  description: string;
  status: CaseStatus;
  completed: boolean;
  lawyerId: string; 
  caseName: string; 
  caseId?: string; // Optional if caseId is returned from the server
}

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private apiUrl = `${environment.API_URL}/cases`;

  constructor(private http: HttpClient) {}

  createCase(caseData: Case): Observable<Case> {
    return this.http.post<Case>(this.apiUrl, caseData).pipe(
      catchError(this.handleError)
    );
  }

  getCases(lawyerId: string): Observable<Case[]> {
    return this.http.get<Case[]>(`${this.apiUrl}?lawyerId=${lawyerId}`).pipe(
      catchError(this.handleError)
    );
  }

  updateCase(caseId: string, caseData: Partial<Case>): Observable<Case> {
    return this.http.put<Case>(`${this.apiUrl}/${caseId}`, caseData).pipe(
      catchError(this.handleError)
    );
  }

  deleteCase(caseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${caseId}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}