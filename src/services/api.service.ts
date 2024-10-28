import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Đảm bảo ApiService được cung cấp ở root
})
export class ApiService {
  baseUrl = 'http://localhost:3000'; // Địa chỉ API của bạn

  constructor(private httpClient: HttpClient) {}

  // Phương thức gửi yêu cầu POST
  post(url: string, body: any): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}${url}`, body, { withCredentials: true });
  }

  // Phương thức gửi yêu cầu GET
  get(url: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}${url}`, { withCredentials: true });
  }
}
