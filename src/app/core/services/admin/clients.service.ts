import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
    activeUsers: number;
    requestUsers: number;
    upcomingUsers: number;
    unreadMessages: number;
}

@Injectable({
    providedIn: 'root'
})
export class ClientsService {
    private apiUrl = `${environment.API_URL}/clients`;

    constructor(private http: HttpClient) { }


    getClients(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    terminateClients(clientId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/activate/${clientId}`);
    }

    filterClients(data: { searchTerm?: string; status?: string; page?: number; limit?: number }): Observable<any> {
        const params = new HttpParams()
            .set('searchTerm', data.searchTerm || '')
            .set('status', data.status || '')
            .set('page', data.page?.toString() || '1')
            .set('limit', data.limit?.toString() || '5000');

        return this.http.get(`${this.apiUrl}`, { params });
    }
}
