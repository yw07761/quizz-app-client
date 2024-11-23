import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}

  // Lấy danh sách người dùng
  getUsers(): Observable<User[]> {
    const token = localStorage.getItem('auth_token'); // Đảm bảo bạn lưu token với tên 'auth_token'
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
    });
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }
  

  // Cập nhật vai trò người dùng
  updateUserRole(userId: string, role: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role }, { headers });
  }

  // Xóa người dùng
  deleteUser(userId: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { headers });
  }
}
