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
  studentId: string;
  examName?: string;
  name?: string;
  description?: string;
  examId: {
    _id: string;
    name: string;
    examName?: string;
    description: string;
    maxScore: number;
    duration: number;
    sections: {
      title: string;
      questions: any[];
    }[];
    startDate?: string;
    endDate?: string;
    status?: string;
  } | string;
  answers: {
    questionId: string;
    answer: string;
    timestamp: Date;
  }[];
  startTime: Date | string;
  endTime: Date | string;
  score: number;
  percentageScore: number;
  maxScore?: number;
}

interface ProcessedExamResult extends Omit<ExamResult, 'examId'> {
  examId: {
    _id: string;
    name: string;
    description: string;
    maxScore: number;
    duration: number;
    sections: {
      title: string;
      questions: any[];
    }[];
    startDate: string;
    endDate: string;
    status: string;
  };
  submittedAt: Date;
  timeSpent: number;
  numberOfAnswers: number;
  correctAnswers: number;
  totalQuestions: number;
}

@Component({
  selector: 'app-exam-history',
  templateUrl: './exam-history.component.html',
  styleUrls: ['./exam-history.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ExamHistoryComponent implements OnInit {
  user: any = null;
  examHistory: ProcessedExamResult[] = [];
  filteredExamHistory: ProcessedExamResult[] = [];
  loading = true;
  isDropdownActive = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadExamHistory();

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        if (event.url === '/exam-history') {
          this.loadExamHistory();
        }
      });
    }
  }

  processExamResult(result: ExamResult): ProcessedExamResult {
    const startTime = new Date(result.startTime);
    const endTime = new Date(result.endTime);
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    // Calculate total questions
    const calculateTotalQuestions = (examData: any): number => {
      if (examData && Array.isArray(examData.sections)) {
        return examData.sections.reduce((total: any, section: { questions: string | any[]; }) => {
          return total + (Array.isArray(section.questions) ? section.questions.length : 0);
        }, 0);
      }
      return result.answers?.length || 0;
    };

    let examData: ProcessedExamResult['examId'];
    const totalQuestions = typeof result.examId === 'string' ? 
      (result.answers?.length || 0) : 
      calculateTotalQuestions(result.examId);

    if (typeof result.examId === 'string') {
      examData = {
        _id: result.examId,
        name: result.examName || 'Bài thi mới nhất',
        description: result.description || '450',
        maxScore: totalQuestions,
        duration: timeSpent,
        sections: [],
        startDate: startTime.toISOString(),
        endDate: endTime.toISOString(),
        status: 'completed'
      };
    } else if (!result.examId) {
      examData = {
        _id: result._id,
        name: result.examName || 'Bài thi mới nhất',
        description: result.description || '450',
        maxScore: totalQuestions,
        duration: timeSpent,
        sections: [],
        startDate: startTime.toISOString(),
        endDate: endTime.toISOString(),
        status: 'completed'
      };
    } else {
      const originalExam = result.examId;
      examData = {
        ...originalExam,
        name: result.examName || originalExam.examName || originalExam.name || 'Bài thi mới nhất',
        description: result.description || originalExam.description || '450',
        maxScore: totalQuestions,
        duration: originalExam.duration || timeSpent,
        sections: originalExam.sections || [],
        startDate: originalExam.startDate || startTime.toISOString(),
        endDate: originalExam.endDate || endTime.toISOString(),
        status: originalExam.status || 'completed'
      };
    }

    return {
      ...result,
      examId: examData,
      startTime,
      endTime,
      submittedAt: endTime,
      timeSpent,
      numberOfAnswers: result.answers?.length || 0,
      correctAnswers: result.score || 0,
      totalQuestions,
      score: result.score,
      percentageScore: (result.score / totalQuestions) * 100
    };
  }

  loadExamHistory() {
    this.loading = true;
    this.error = null;

    if (!this.user?._id) {
      this.error = 'Không tìm thấy thông tin người dùng';
      this.loading = false;
      return;
    }

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

    this.examService.getExamHistory(this.user._id).subscribe({
      next: (results: ExamResult[]) => {
        console.log('Raw exam results:', results);
        
        this.examHistory = results.map(result => {
          const processed = this.processExamResult(result);
          console.log('Processed result:', processed);
          return processed;
        });

        if (lastResult) {
          const processedLastResult = this.processExamResult(lastResult);
          if (!this.examHistory.some(r => r._id === processedLastResult._id)) {
            this.examHistory.unshift(processedLastResult);
          }
        }
        
        this.sortExamHistory();
        this.filteredExamHistory = [...this.examHistory];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam history:', error);
        this.error = 'Không thể tải lịch sử bài thi. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  sortExamHistory() {
    this.examHistory.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  filterResults(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredExamHistory = this.examHistory.filter(result =>
      result.examId.name.toLowerCase().includes(searchTerm) ||
      result.examId.description.toLowerCase().includes(searchTerm) ||
      result.score.toString().includes(searchTerm)
    );
  }

  viewExamDetails(examId: string) {
    this.router.navigate(['/exams-history', examId]);
  }

  formatDate(date: Date | string): string {
    try {
      const dateObj = new Date(date);
      return dateObj.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return String(date);
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours > 0 ? `${hours} giờ ` : ''}${remainingMinutes} phút`;
  }

  getExamStatus(result: ProcessedExamResult): string {
    return 'Đã hoàn thành';
  }

  formatScore(result: ProcessedExamResult): string {
    return `${result.correctAnswers}/${result.totalQuestions} (${result.percentageScore.toFixed(1)}%)`;
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
}
