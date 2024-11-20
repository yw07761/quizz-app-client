// student-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

interface ExamResult {
  _id: string;
  examId: {
    _id: string;
    name: string;
    description: string;
    sections: {
      title: string;
      questions: any[];
    }[];
  } | string;
  examName?: string;
  description?: string;
  score: number;
  maxScore?: number;
  percentageScore: number;
  answers: any[];
  startTime: Date | string;
  endTime: Date | string;
}

interface ProcessedExam {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  status: string;
  sections: {
    title: string;
    questions: any[];
  }[];
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  maxScore: number;
  percentageScore: number;
  startTime: Date;
  endTime: Date;
  submittedAt: Date;
}

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class StudentDashboardComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  examHistory: ExamResult[] = [];
  activeExams: ProcessedExam[] = [];
  completedExams: ProcessedExam[] = [];
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

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        if (event.url === '/student-dashboard') {
          this.loadExamsAndHistory();
        }
      });
    }
  }

  calculateTotalQuestions(exam: any): number {
    if (exam && Array.isArray(exam.sections)) {
      return exam.sections.reduce((total: any, section: { questions: string | any[]; }) => {
        return total + (Array.isArray(section.questions) ? section.questions.length : 0);
      }, 0);
    }
    return 0;
  }

  processExam(exam: any): ProcessedExam {
    const totalQuestions = this.calculateTotalQuestions(exam);
    const now = new Date();
    return {
      _id: exam._id,
      name: exam.name || exam.examName || 'Bài thi mới',
      description: exam.description || '450',
      startDate: new Date(exam.startDate),
      endDate: new Date(exam.endDate),
      duration: exam.duration || 0,
      status: exam.status || 'published',
      sections: exam.sections || [],
      score: 0,
      correctAnswers: 0,
      totalQuestions,
      maxScore: totalQuestions,
      percentageScore: 0,
      startTime: now,
      endTime: now,
      submittedAt: now
    };
  }

  processCompletedExam(exam: any, result: any): ProcessedExam {
    const totalQuestions = this.calculateTotalQuestions(exam);
    const correctAnswers = result.score || 0;
    const startTime = new Date(result.startTime);
    const endTime = new Date(result.endTime);
    
    return {
      _id: exam._id,
      name: result.examName || exam.name || 'Bài thi mới',
      description: result.description || exam.description || '450',
      startDate: new Date(exam.startDate),
      endDate: new Date(exam.endDate),
      duration: exam.duration || 0,
      status: 'completed',
      sections: exam.sections || [],
      score: correctAnswers,
      correctAnswers,
      totalQuestions,
      maxScore: totalQuestions,
      percentageScore: (correctAnswers / totalQuestions) * 100,
      startTime,
      endTime,
      submittedAt: endTime
    };
  }

  loadExamsAndHistory() {
    this.loading = true;
    this.activeExams = [];
    this.completedExams = [];
    
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

    if (this.user) {
      this.examService.getExamHistory(this.user._id).subscribe({
        next: (history) => {
          console.log('Exam History:', history);
          
          const completedExamIds = new Set(
            history.map(h => h.examId._id || h.examId)
          );
          
          if (lastResult) {
            completedExamIds.add(lastResult.examId._id || lastResult.examId);
          }

          this.examService.getPublishedExams().subscribe({
            next: (exams) => {
              console.log('Published Exams:', exams);
              const now = new Date();

              exams.forEach(exam => {
                const startDate = new Date(exam.startDate);
                const endDate = new Date(exam.endDate);

                if (completedExamIds.has(exam._id)) {
                  let result = history.find(h => 
                    (h.examId._id || h.examId) === exam._id
                  );

                  if (!result && lastResult && 
                      (lastResult.examId._id === exam._id || lastResult.examId === exam._id)) {
                    result = lastResult;
                  }

                  if (result) {
                    const processedExam = this.processCompletedExam(exam, result);
                    console.log('Processed completed exam:', processedExam);
                    this.completedExams.push(processedExam);
                  }
                } else if (
                  exam.status === 'published' && 
                  startDate <= now && 
                  endDate >= now
                ) {
                  const processedExam = this.processExam(exam);
                  console.log('Processed active exam:', processedExam);
                  this.activeExams.push(processedExam);
                }
              });

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

  takeExam(exam: ProcessedExam) {
    const examData = {
      ...exam,
      startDate: exam.startDate.toISOString(),
      endDate: exam.endDate.toISOString()
    };
    sessionStorage.setItem('currentExam', JSON.stringify(examData));
    this.router.navigate(['/exam-take', exam._id]);
  }

  viewResult(examId: string) {
    const examData = this.completedExams.find(exam => exam._id === examId);
    this.router.navigate(['/exam-result-detail', examId], {
      state: { examData }
    });
  }
  refreshDashboard() {
    this.loadExamsAndHistory();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
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
      return '-';
    }
  }

  formatScore(exam: ProcessedExam): string {
    return `${exam.correctAnswers}/${exam.totalQuestions} (${exam.percentageScore.toFixed(1)}%)`;
  }

  getTimeRemaining(exam: ProcessedExam): string {
    const now = new Date();
    const end = exam.endDate;
    const diffTime = Math.abs(end.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `Còn ${diffDays} ngày`;
  }

  getPercentageScore(exam: ProcessedExam): number {
    return exam.percentageScore || 0;
  }

  getProgressBarColor(exam: ProcessedExam): string {
    const score = this.getPercentageScore(exam);
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#3b82f6';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
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
}