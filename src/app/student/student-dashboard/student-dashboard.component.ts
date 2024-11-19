// student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { Router, NavigationEnd } from '@angular/router';
import { Exam } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class StudentDashboardComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  examHistory: any[] = [];
  activeExams: any[] = [];
  completedExams: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadExamsAndHistory();

      // Lắng nghe sự kiện navigation để refresh khi quay lại dashboard
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        if (event.url === '/student-dashboard') {
          this.loadExamsAndHistory();
        }
      });
    }
  }

  loadExamsAndHistory() {
    this.loading = true;
    this.activeExams = [];
    this.completedExams = [];
    
    // Get last exam result from session storage first
    const lastResultStr = sessionStorage.getItem('lastExamResult');
    let lastResult = null;
    if (lastResultStr) {
      try {
        lastResult = JSON.parse(lastResultStr);
        sessionStorage.removeItem('lastExamResult');
      } catch (e) {
        console.error('Error parsing last result:', e);
      }
    }

    // Load exam history
    if (this.user) {
      this.examService.getExamHistory(this.user._id).subscribe({
        next: (history) => {
          console.log('Exam History:', history);
          
          // Create set of completed exam IDs
          const completedExamIds = new Set();
          
          // Add IDs from history
          history.forEach(h => {
            const examId = h.examId._id || h.examId;
            completedExamIds.add(examId);
          });

          // Add last result if exists
          if (lastResult) {
            const lastExamId = lastResult.examId._id || lastResult.examId;
            completedExamIds.add(lastExamId);
          }

          // Load published exams
          this.examService.getPublishedExams().subscribe({
            next: (exams) => {
              console.log('Published Exams:', exams);
              const now = new Date();

              // Process each exam
              exams.forEach(exam => {
                const startDate = new Date(exam.startDate);
                const endDate = new Date(exam.endDate);

                // If exam is completed
                if (completedExamIds.has(exam._id)) {
                  // Find result for this exam
                  let result = history.find(h => 
                    (h.examId._id || h.examId) === exam._id
                  );

                  // Use last result if it matches and no history found
                  if (!result && lastResult && 
                      (lastResult.examId._id === exam._id || lastResult.examId === exam._id)) {
                    result = lastResult;
                  }

                  if (result) {
                    this.completedExams.push({
                      ...exam,
                      score: result.score,
                      maxScore: exam.maxScore || result.maxScore,
                      percentageScore: result.percentageScore,
                      startTime: new Date(result.startTime),
                      endTime: new Date(result.endTime),
                      submittedAt: new Date(result.endTime)
                    });
                  }
                } 
                // If exam is active and not completed
                else if (
                  exam.status === 'published' && 
                  startDate <= now && 
                  endDate >= now
                ) {
                  this.activeExams.push(exam);
                }
              });

              // Sort completed exams by submission time (newest first)
              this.completedExams.sort((a, b) => 
                b.submittedAt.getTime() - a.submittedAt.getTime()
              );

              console.log('Final Active Exams:', this.activeExams);
              console.log('Final Completed Exams:', this.completedExams);
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading exams:', error);
              this.loading = false;
            }
          });
        },
        error: (error) => {
          console.error('Error loading exam history:', error);
          this.loading = false;
        }
      });
    }
  }

  takeExam(exam: any) {
    // Lưu thông tin exam hiện tại vào session storage
    sessionStorage.setItem('currentExam', JSON.stringify(exam));
    this.router.navigate(['/exam-take', exam._id]);
  }

  viewResult(examId: string) {
    this.router.navigate(['/exams-history', examId]);
  }

  refreshDashboard() {
    this.loadExamsAndHistory();
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

  formatDate(date: string | Date): string {
    if (!date) return '';
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return String(date);
    }
  }
}