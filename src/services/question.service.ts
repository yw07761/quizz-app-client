import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:3000/questions'; // URL của server API

  constructor(private http: HttpClient) {}

  // Lấy danh sách câu hỏi từ server
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  // Thêm câu hỏi mới vào server
  addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  // Cập nhật câu hỏi hiện có trên server
  updateQuestion(question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${question._id}`, question);
  }

  // Xóa câu hỏi theo ID từ server
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
