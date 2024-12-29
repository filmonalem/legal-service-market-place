import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface Contract {
  contractId: string;            
  lawyerId: string;                
  effectiveDate: string;           
  purpose: string;                 
  compensationRate: number;        
  paymentTerms: string;            
  termStart: string;               
  termEnd: string;                 
  confidentialityClause: boolean;  
  agreementClause: boolean;       
  additionalNotes: string;      
  showDetails?: boolean;   
}
@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = `${environment.API_URL}/contracts`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }
  getOneContract(lawyerId:string): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${this.apiUrl}/${lawyerId}`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError) 
    );
  }
  confirmContract(contractId: string, lawyerId: string): Observable<Contract> {
    return this.http.patch<Contract>(`${this.apiUrl}/confirm/${contractId}`, {}, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  rejectContract(contractId: string): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/${contractId}/reject`, {}, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    // Customize error handling as needed
    return throwError('Something bad happened; please try again later.');
  }
}