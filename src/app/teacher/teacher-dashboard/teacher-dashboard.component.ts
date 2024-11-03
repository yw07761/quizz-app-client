import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService, Exam } from '../../../services/exam.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class TeacherDashboardComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  activeExams: Exam[] = [];
  draftExams: Exam[] = [];

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
        this.activeExams = exams.filter(exam => new Date(exam.startDate) <= now && new Date(exam.endDate) >= now);
        this.draftExams = exams.filter(exam => new Date(exam.startDate) > now);
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
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  navigateToCreateExam() {
    // Điều hướng tới trang tạo bài thi
    this.router.navigate(['/exam-create']);
  }
}
