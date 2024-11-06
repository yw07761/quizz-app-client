import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private baseUrl = 'http://localhost:3000/classes'; // Địa chỉ API của bạn

  constructor(private http: HttpClient) {}

  // Lấy header với token từ localStorage
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); // Lấy token từ localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Lấy danh sách các lớp
  getClasses(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.baseUrl, { headers });
  }

  // Thêm mới một lớp học với các trường cần thiết
  addClass(newClass: { 
    classId: string; 
    className: string; 
    description: string; 
    teacher: string; 
    startDate: string; 
    endDate?: string; 
    maxStudents: number; 
    location: string; 
    status: string; 
  }): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.baseUrl, newClass, { headers });
  }

  // Thêm học viên vào lớp bằng cách cung cấp classId và email học viên
  addStudent(classId: string, studentEmail: string): Observable<any> {
    const headers = this.getHeaders();
    const data = {
      email: studentEmail.trim() // Đảm bảo email không có khoảng trắng
    };
    return this.http.post(`${this.baseUrl}/${classId}/add-student`, data, { headers });
  }
}