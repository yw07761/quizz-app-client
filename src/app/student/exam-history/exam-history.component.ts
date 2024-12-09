import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface ExamResult {
  _id: string;
  studentId: string;
  examName?: string;
  examId: {
    _id: string;
    name: string;
    description: string;
    maxScore: number;
    duration: number;
    startDate: string;
    endDate: string;
  };
  score: number;
  startTime: Date | string;
  endTime: Date | string;
}

interface ExamStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  totalTimeSpent: string;
  totalTimeSpentInMinutes: number;
  highestScore: number; // Điểm cao nhất
  lowestScore: number; // Điểm thấp nhất
}

@Component({
  selector: 'app-exam-history',
  templateUrl: './exam-history.component.html',
  styleUrls: ['./exam-history.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ExamHistoryComponent implements OnInit {
  user: any = null;
  examHistory: ExamResult[] = [];
  examStats: ExamStats | null = null;
  loading = true;
  error: string | null = null;
  isDropdownActive = false;

  constructor(
    private authService: AuthService,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadExamHistory();
    }
  }

  loadExamHistory() {
    this.loading = true;
    this.error = null;

    if (!this.user?._id) {
      this.error = 'Không tìm thấy thông tin người dùng';
      this.loading = false;
      return;
    }

    this.examService.getExamHistory(this.user._id).subscribe({
      next: (results: ExamResult[]) => {
        this.examHistory = results;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam history:', error);
        this.error = 'Không thể tải lịch sử bài thi. Vui lòng thử lại sau.';
        this.loading = false;
      }
    });
  }

  calculateStats() {
    const totalExams = this.examHistory.length;
    const completedExams = this.examHistory.filter(result => result.score !== null).length;
    const totalScore = this.examHistory.reduce((total, result) => total + (result.score || 0), 0);
    const averageScore = totalExams > 0 ? (totalScore / totalExams) : 0;

    const totalTimeSpentInMinutes = this.examHistory.reduce((total, result) => {
      const startTime = new Date(result.startTime);
      const endTime = new Date(result.endTime);
      return total + Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    }, 0);

    const totalTimeSpent = this.formatDuration(totalTimeSpentInMinutes); // Keep the formatted time

    // Điểm cao nhất và thấp nhất
    const highestScore = Math.max(...this.examHistory.map(result => result.score || 0));
    const lowestScore = Math.min(...this.examHistory.map(result => result.score || 0));

    this.examStats = {
      totalExams,
      completedExams,
      averageScore,
      totalTimeSpent,
      totalTimeSpentInMinutes,
      highestScore,
      lowestScore
    };
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours > 0 ? `${hours} giờ ` : ''}${remainingMinutes} phút`;
  }
  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }
  filterResults(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.examHistory = this.examHistory.filter(result =>
      result.examId.name.toLowerCase().includes(searchTerm) ||
      result.examId.description.toLowerCase().includes(searchTerm)
    );
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
