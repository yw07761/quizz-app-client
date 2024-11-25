import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';  // Import the AuthService

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id?: string;
  text: string;
  answers: Answer[];
  category?: string;
  group?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:3000/questions'; // URL của server API

  constructor(private http: HttpClient, private authService: AuthService) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Server Error:', error);
    return throwError(() => new Error('Something went wrong with the API'));
  }

  // Utility method to get headers with Authorization token
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Retrieve the token using AuthService
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Lấy danh sách câu hỏi từ server
  getQuestions(): Observable<Question[]> {
    const headers = this.getAuthHeaders(); // Include token in headers
    return this.http.get<Question[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Lấy câu hỏi theo ID
  getQuestionById(id: string): Observable<Question> {
    const headers = this.getAuthHeaders(); // Include token in headers
    return this.http.get<Question>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Thêm câu hỏi mới
  addQuestion(question: Question): Observable<Question> {
    const headers = this.getAuthHeaders(); // Include token in headers
    return this.http.post<Question>(this.apiUrl, question, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Cập nhật câu hỏi
  updateQuestion(question: Question): Observable<Question> {
    const headers = this.getAuthHeaders(); // Include token in headers
    return this.http.put<Question>(`${this.apiUrl}/${question._id}`, question, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Xóa câu hỏi
  deleteQuestion(id: string): Observable<any> {
    const headers = this.getAuthHeaders(); // Include token in headers
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Cập nhật trạng thái câu hỏi
  updateQuestionStatus(questionId: string, status: 'approved' | 'pending' | 'rejected'): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/${questionId}`, { status }, { headers }).pipe( // Pass the status in the request body
      catchError(this.handleError)
    );
  }
  
}
