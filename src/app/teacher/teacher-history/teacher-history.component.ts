import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService, Exam } from '../../../services/exam.service';

@Component({
  selector: 'app-teacher-history',
  standalone: true,
  templateUrl: './teacher-history.component.html',
  styleUrl: './teacher-history.component.scss',
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class TeacherHistoryComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  activeExams: Exam[] = [];
  draftExams: Exam[] = [];
  publishedExams: Exam[] = []; 

  constructor(
    private authService: AuthService,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadExams();
  }

  loadExams() {
    this.examService.getExams().subscribe({
      next: (exams) => {
        const now = new Date();
        this.activeExams = exams.filter(
          exam =>
            new Date(exam.startDate) <= now &&
            new Date(exam.endDate) >= now &&
            exam.status !== 'published'
        );
        this.draftExams = exams.filter(
          exam =>
            new Date(exam.startDate) > now &&
            exam.status !== 'published'
        );
        this.publishedExams = exams.filter(exam => exam.status === 'published'); // Lọc bài kiểm tra đã xuất bản
      },
      error: (error) => {
        console.error('Error loading exams:', error);
      }
    });
  }
  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  viewExamDetails(exam: Exam) {
    this.router.navigate(['/exam-details', exam._id]);
  }

  navigateToStatistics(examId: string) {
    this.router.navigate(['/teacher-statistics', examId]);
  }
  
}
