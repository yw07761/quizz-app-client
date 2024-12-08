import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface User {
  username: string;
  email: string;
  _id: string;
}

interface ExamStatistics {
  exam: {
    username: string;
  };
  totalParticipants: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
  participants: Array<{
    username: string;
    email: string;
    score: number;
    user: string;
    }>;
}

@Component({
  selector: 'app-teacher-statistics',
  templateUrl: './teacher-statistics.component.html',
  styleUrls: ['./teacher-statistics.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class TeacherStatisticsComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  examId: string = '';
  statistics: any = null;
  errorMessage: string = '';
  userId: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.examId = this.route.snapshot.paramMap.get('id')!;

    console.log('Exam ID from URL:', this.examId);

    if (!this.examId) {
      this.errorMessage = 'Mã bài kiểm tra không hợp lệ.';
      return;
    }

    this.loadStatistics();
  }

  // Navigate back to the previous page
  goBack(): void {
    window.history.back();
  }

  // Handle viewing details of a selected participant
  viewExamDetails(userId: string) {
    console.log('viewExamDetails called');
    console.log('Exam ID:', this.examId);
    console.log('User ID:', userId);
  
    if (!this.examId) {
      this.errorMessage = 'Mã bài kiểm tra không hợp lệ!';
      console.error('Exam ID không hợp lệ!');
      return;
    }
  
    if (!userId) {
      this.errorMessage = 'User ID không hợp lệ!';
      console.error('User ID không hợp lệ!', userId);
      return;
    }
  
    // Call API để lấy chi tiết bài kiểm tra của học viên
    this.examService.getStudentExamDetails(this.examId, userId).subscribe({
      next: (data) => {
        console.log('API response data:', data);
  
        if (!data) {
          this.errorMessage = 'Không có dữ liệu chi tiết bài kiểm tra cho User ID này!';
          alert(this.errorMessage);
          return;
        }
  
        console.log('Navigating to exam-result-detail page with:', this.examId, userId);
        this.router.navigate(['/exam-result-detail', this.examId, userId]);
      },
      error: (error) => {
        console.error('Error fetching student exam details:', error);
        this.errorMessage = 'Không thể tải chi tiết bài kiểm tra. Vui lòng thử lại sau.';
      }
    });
  }
  
  

  // Load exam statistics from API
  loadStatistics(): void {
    this.examService.getExamStatistics(this.examId).subscribe({
      next: (data) => {
        console.log('Data from API:', data); // Xem cấu trúc dữ liệu từ API
  
        if (data && !data.error) {
          this.statistics = data;
          console.log('Participants:', this.statistics.participants); // Kiểm tra danh sách participants
  
          if (!this.statistics.participants || !this.statistics.participants.length) {
            this.errorMessage = 'Không có dữ liệu người tham gia.';
            return;
          }
        } else {
          this.errorMessage = 'Không có dữ liệu thống kê cho bài kiểm tra này.';
        }
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.errorMessage = 'Không thể tải thống kê. Vui lòng thử lại sau.';
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
}
