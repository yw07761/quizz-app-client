import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Question } from './question.service';
export interface Exam {
  results: any[];
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
export interface ExamSubmissionAnswer {
  questionId: string;
  answer: string;
  timestamp: string;  // Changed to string since we're sending ISO string
}

export interface ExamSubmission {
  answers: ExamSubmissionAnswer[];
  startTime: string;
  endTime: string;
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

    private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    let errorMessage: string;

    if (error.status === 0) {
      errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    } else if (error.status === 401) {
      errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
      this.authService.logout();
    } else if (error.status === 403) {
      errorMessage = 'Bạn không có quyền truy cập tài nguyên này.';
    } else if (error.status === 404) {
      errorMessage = 'Không tìm thấy dữ liệu yêu cầu.';
    } else if (error.status === 500) {
      errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
    } else {
      errorMessage = error.error?.message || 'Đã xảy ra lỗi không xác định.';
    }

    return throwError(() => new Error(errorMessage));
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

  getExamQuestionById(questionId: string): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/questions/${questionId}`);
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


  submitExam(id: string, submissionData: ExamSubmission): Observable<any> {
    const headers = this.getAuthHeaders();
    
    // Ensure dates are valid
    const formattedData = {
      answers: submissionData.answers,
      startTime: submissionData.startTime,
      endTime: submissionData.endTime
    };

    return this.http.post(`${this.apiUrl}/${id}/submit`, formattedData, { headers }).pipe(
      tap(response => console.log('Exam submitted:', response)),
      catchError(error => {
        console.error('Submit error:', error);
        return throwError(() => error);
      })
    );
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

  getExamResult(resultId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/results/${resultId}`, { headers });
  }
  

  getExamDetails(examId: string): Observable<any> {
    const url = `${this.apiUrl}/${examId}`;
    console.log('Fetching exam details from URL:', url); // Debug the URL
    return this.http.get<any>(url);
  }
  getExamStatistics(examId: string): Observable<any> {
    const url = `${this.apiUrl}/${examId}/statistics`;
    console.log('Fetching exam statistics from URL:', url); // Debug the URL
    return this.http.get<any>(url);
  }
  getStudentExamDetails(examId: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}/exams/${examId}/results/${userId}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('Error fetching student exam details:', error);
        return this.handleError(error);
      })
    );
  }
  
  
}