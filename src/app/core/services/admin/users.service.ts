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
export class UsersService {
    private apiUrl = `${environment.API_URL}/users`;

    constructor(private http: HttpClient) { }


    getUsers(): Observable<any> {
        return this.http.get(`${this.apiUrl}`);
    }

    userActivateUser(userId: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/activate/${userId}`,userId);
    }
getOneUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
    }
    transferUser(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/transfer/${userId}`);
    }


    filterUsers(data: { searchTerm?: string; status?: string; page?: number; limit?: number }): Observable<any> {
        const params = new HttpParams()
            .set('searchTerm', data.searchTerm || '')
            .set('status', data.status || '')
            .set('page', data.page?.toString() || '1')
            .set('limit', data.limit?.toString() || '5000');

        return this.http.get(`${this.apiUrl}`, { params });
    }
}
