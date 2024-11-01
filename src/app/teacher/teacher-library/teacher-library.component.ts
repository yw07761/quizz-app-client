import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { QuestionService } from '../../../services/question.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  answers: Answer[];
  category?: string;
  group?: string;
}

@Component({
  selector: 'app-teacher-library',
  templateUrl: './teacher-library.component.html',
  styleUrls: ['./teacher-library.component.scss'],
  standalone: true,
  imports: [
    CommonModule,  // Import để sử dụng ngClass, ngIf, ngFor, etc.
    FormsModule,   // Import để sử dụng [(ngModel)] cho các form
  ]
})
export class TeacherLibraryComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  questions: Question[] = [];

  constructor(
    private authService: AuthService,
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit() {
    // Lấy thông tin người dùng từ AuthService
    this.user = this.authService.getCurrentUser();
    // Lấy danh sách câu hỏi từ QuestionService
    this.questions = this.questionService.getQuestions();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  navigateToCreateQuestion() {
    // Điều hướng đến trang tạo câu hỏi
    this.router.navigate(['/question']);
  }
}
