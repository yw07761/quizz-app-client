// src/services/exam.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Exam {
  _id?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  maxAttempts: number;
  duration: number;
  maxScore: number;
  autoDistributeScore: boolean;
  showStudentResult: boolean;
  displayResults: string;
  questionOrder: string;
  questionsPerPage: number;
  sections: Section[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Section {
  title: string;
  description: string;
  questions: any[]; // Hoặc định nghĩa interface Question cụ thể
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/exams'; // URL của API

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Tạo bài thi mới
  createExam(exam: Exam): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, exam, { headers });
  }

  // Lấy danh sách bài thi
  getExams(): Observable<Exam[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Exam[]>(this.apiUrl, { headers });
  }

  // Lấy chi tiết một bài thi
  getExamById(id: string): Observable<Exam> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Exam>(`${this.apiUrl}/${id}`, { headers });
  }

  // Cập nhật bài thi
  updateExam(id: string, exam: Exam): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, exam, { headers });
  }

  // Xóa bài thi
  deleteExam(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}