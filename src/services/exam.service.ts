import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  sections: Array<{
    title: string;
    description: string;
    questions: Array<{
      _id: string;
      text: string;
      answers: Array<{
        text: string;
        isCorrect: boolean;
      }>;
      score: number;
    }>;
  }>;
  createdBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/exams'; // Điều chỉnh URL API của bạn

  constructor(private http: HttpClient) { }

  createExam(examData: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, examData);
  }

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  getExamById(id: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  updateExam(id: string, examData: Exam): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/${id}`, examData);
  }

  deleteExam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}