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
    FormsModule    // Import để sử dụng [(ngModel)] cho các form
  ]
})
export class TeacherLibraryComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  selectedCategory: string = '';
  selectedGroup: string = '';
  uniqueCategories: string[] = [];
  uniqueGroups: string[] = [];
  isFilterDropdownVisible: boolean = false; // Điều khiển hiển thị dropdown lọc

  constructor(
    private authService: AuthService,
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.questions = this.questionService.getQuestions();
    this.filteredQuestions = this.questions;

    if (this.questions && this.questions.length > 0) {
      this.uniqueCategories = [
        ...new Set(this.questions.map(q => q.category).filter(Boolean) as string[])
      ];

      this.uniqueGroups = [
        ...new Set(this.questions.map(q => q.group).filter(Boolean) as string[])
      ];
    }
  }

  toggleFilterDropdown() {
    this.isFilterDropdownVisible = !this.isFilterDropdownVisible;
  }

  filterQuestions() {
    // Lọc câu hỏi dựa trên danh mục và nhóm đã chọn
    this.filteredQuestions = this.questions.filter(question => {
      const categoryMatch = this.selectedCategory ? question.category === this.selectedCategory : true;
      const groupMatch = this.selectedGroup ? question.group === this.selectedGroup : true;
      return categoryMatch && groupMatch;
    });

    // Đóng dropdown sau khi áp dụng lọc
    this.isFilterDropdownVisible = false;
  }

  editQuestion(index: number) {
    const question = this.filteredQuestions[index];
    this.router.navigate(['/question'], { state: { question } });
  }

  deleteQuestion(index: number) {
    const questionToDelete = this.filteredQuestions[index];
    const confirmDelete = window.confirm('Bạn có chắc muốn xóa câu hỏi này không?');
    if (confirmDelete) {
      this.questions = this.questions.filter(q => q !== questionToDelete);
      this.filteredQuestions = this.filteredQuestions.filter(q => q !== questionToDelete);
      this.questionService.setQuestions(this.questions);
    }
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
    this.router.navigate(['/question']);
  }
}
