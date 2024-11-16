import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
export interface Exam {
  _id?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status?: string; // Add status field to represent exam's visibility
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
  questions: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/exams';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Create a new exam
  createExam(exam: Exam): Observable<any> {
    console.log("Exam data being sent:", exam);
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, exam, { headers });
  }

  // Get the list of all exams (for teachers)
  getExams(): Observable<Exam[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Exam[]>(this.apiUrl, { headers });
  }

  // Get only published exams (for students) using query parameter
  getPublishedExams(): Observable<Exam[]> {
    const url = `${this.apiUrl}?status=published`; // Use query parameter instead of separate endpoint
    return this.http.get<Exam[]>(url);
  }

  // Get details of a specific exam by _id
  getExamById(_id: string): Observable<Exam> {
    console.log("Fetching exam by ID:", _id);
    const headers = this.getAuthHeaders();
    return this.http.get<Exam>(`${this.apiUrl}/${_id}`, { headers }).pipe(
      tap(exam => console.log("Fetched exam from API:", exam)),
      catchError(error => {
        console.error('Error fetching exam:', error);
        return throwError(error);
      })
    );
  }

  // Update an existing exam (include status for publishing)
  updateExam(id: string, exam: Exam): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, exam, { headers });
  }

  // Delete an exam
  deleteExam(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  // Fetch exam for student to take the test
  getExam(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Submit answers for an exam
  submitExam(id: string, answers: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${id}/submit`, { answers }, { headers }).pipe(
      tap(response => console.log("Exam submitted successfully:", response)),
      catchError(this.handleError)
    );
  }
  private handleError(error: any): Observable<never> {
    console.error("Error details:", error);
    return throwError(error);
  }
  // Fetch exam results
  getResult(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/results`);
  }

  // Get exam history for a student
  getExamHistory(userId: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}/results`, { headers });
  }
}  
