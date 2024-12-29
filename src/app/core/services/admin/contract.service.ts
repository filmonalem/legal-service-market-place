import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
    activeContracts: number,
    requestContracts: number,
    upcomingContracts: number,
    unreadMessages: number
}

interface ContractData {
    contractId: string,
    lawyerId: string,
    effectiveDate: string,
    purpose: string,
    compensationRate: number,
    paymentTerms: string,
    termStart: Date,
    termEnd: Date,
    confidentiallyClause: string,
    agreementClause: boolean,
    additionalNotes: string
}


@Injectable({
    providedIn: 'root'
})
export class ContractsService {
    private apiUrl = `${environment.API_URL}/contracts`;

    constructor(private http: HttpClient) { }

    submitContract(contractData: any): Observable<any> {
        return this.http.post(this.apiUrl, contractData);
    }

    getAllDataContracts(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    getContractsByLawyer(lawyerId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/lawyer/${lawyerId}`);
    }


    confirmContractAgreement(contractId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/confirm/${contractId}`, contractId);
    }
} 