import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LegalResourcesService {
  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getEthiopianLawGuide(): Observable<any> {
    return this.http.get(`${this.API_URL}/resources/ethiopian-law`);
  }
} 