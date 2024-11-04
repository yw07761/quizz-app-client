// src/services/exam.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

export interface Exam {
  _id?: string; // Ensure _id is the property used to represent exam IDs
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
  questions: any[]; // Replace with specific Question interface if available
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/exams'; // Base API URL for exams

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Create a new exam
  createExam(exam: Exam): Observable<any> {
    console.log("Exam data being sent:", exam); // Kiểm tra dữ liệu
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl, exam, { headers });
  }
  

  // Get the list of exams
  getExams(): Observable<Exam[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Exam[]>(this.apiUrl, { headers });
  }

  // Get details of a specific exam by _id
  getExamById(_id: string): Observable<Exam> {
    console.log("Fetching exam by ID:", _id);
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Exam>(`${this.apiUrl}/${_id}`, { headers }).pipe(
      tap(exam => console.log("Fetched exam from API:", exam)) // Log dữ liệu nhận được
    );
  }
  
  

  // Update an existing exam
  updateExam(id: string, exam: Exam): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/${id}`, exam, { headers });
  }

  // Delete an exam
  deleteExam(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}