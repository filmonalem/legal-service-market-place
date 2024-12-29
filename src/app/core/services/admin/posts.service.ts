import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
export interface CreatePostDto {
  title: string;
  content: string;
  description: string;
  uploadBy: string;
  fileImages: string[];
}
@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.API_URL}/posts`;

  constructor(private http: HttpClient) {}

  submitData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit`, data);
  }

  createPost(postData: { title: string; description: string; image?: string }): Observable<any> {
    return this.http.post(this.apiUrl, postData);
  }

  getPosts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPostById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updatePost(id: string, postData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, postData);
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}