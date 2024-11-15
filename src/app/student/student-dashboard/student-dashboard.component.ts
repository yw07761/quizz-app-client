import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { Router } from '@angular/router';
import { Exam } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Import RouterModule

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule  // Ensure RouterModule is imported
  ]
})
export class StudentDashboardComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  examHistory: any[] = [];
  activeExams: Exam[] = [];

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadExamHistory();
      this.loadActiveExams();
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

  loadExamHistory() {
    const userId = this.user?._id;
    if (userId) {
      this.examService.getExamHistory(userId).subscribe({
        next: (history) => {
          this.examHistory = history;
        },
        error: (error) => {
          console.error('Error loading exam history:', error);
        }
      });
    } else {
      console.warn('User ID not found. Unable to load exam history.');
    }
  }

  loadActiveExams() {
    this.examService.getPublishedExams().subscribe({
      next: (exams) => {
        const now = new Date();
        this.activeExams = exams.filter(exam => 
          exam.status === 'published' &&
          new Date(exam.startDate) <= now &&
          new Date(exam.endDate) >= now
        );
      },
      error: (error) => {
        console.error('Error loading active exams:', error);
      }
    });
  }

  takeExam(exam: Exam) {
    this.router.navigate(['/exam-take', exam._id]);
  }

  // Add the navigateToTakeExam method
 
}
