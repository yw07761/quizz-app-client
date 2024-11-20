import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ExamResultService {
    private baseUrl = 'http://localhost:3000/exams/user';  // Đảm bảo baseUrl là đúng với người dùng
  
    constructor(private http: HttpClient) {}
  
    private getHeaders(): HttpHeaders {
      const token = localStorage.getItem('auth_token'); 
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }
  
    // Lấy kết quả bài thi của người dùng
    getExamResult(userId: string, examId: string): Observable<any> {
      const headers = this.getHeaders(); // Lấy header với token
      return this.http.get(`${this.baseUrl}/${userId}/results/${examId}`, { headers });  // Chỉnh sửa đúng endpoint
    }
  
    // Thêm một kết quả bài thi cho người dùng
    addExamResult(newResult: {
      studentId: string;
      examId: string;
      answers: { questionId: string; answer: string }[];
      startTime: string;
      endTime: string;
      score: number;
      percentageScore: number;
    }): Observable<any> {
      const headers = this.getHeaders(); // Lấy header với token
      return this.http.post(`${this.baseUrl}/results`, newResult, { headers });
    }
  
    // Lấy tất cả kết quả bài thi của người dùng
    getAllResultsForUser(userId: string): Observable<any> {
      const headers = this.getHeaders(); 
      return this.http.get(`${this.baseUrl}/${userId}/results`, { headers });
    }
  
    // Thêm câu trả lời vào bài thi của người dùng
    addAnswerToExamResult(examResultId: string, questionId: string, answer: string): Observable<any> {
      const headers = this.getHeaders();
      return this.http.post(`${this.baseUrl}/results/${examResultId}/answers`, { questionId, answer }, { headers });
    }
  }
  