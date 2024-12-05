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
    userId: string;
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
    private router: Router, // Inject Router
    private route: ActivatedRoute, 
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.examId = this.route.snapshot.paramMap.get('id')!;  // Chú ý tham số là 'id' thay vì 'examId'
    
    
    console.log('Exam ID from URL:', this.examId); // Debugging line
  
    if (!this.examId) {
      this.errorMessage = 'Mã bài kiểm tra không hợp lệ.';
      console.error(this.errorMessage); // Log the error for debugging
      return;
    }
    
    this.loadStatistics();
  }
  
  goBack(): void {
    window.history.back();
  }

  viewExamDetails(userId: string) {
    if (!userId || !this.examId) {
      console.error('Invalid userId or examId:', userId, this.examId);
      return;
    }
    
    console.log('Navigating to exam result detail for userId:', userId, 'and examId:', this.examId);
    // Navigate to the exam result detail page with both examId and userId in the URL
    this.router.navigate([`/exam-result-detail/examid/${this.examId}/userid/${userId}`]);
  }
  
  
  
  
  loadStatistics(): void {
    this.examService.getExamStatistics(this.examId).subscribe({
      next: (data) => {
        console.log('Data from API:', data); // Kiểm tra dữ liệu
        if (data && data.exam) {
          this.statistics = data;
          this.errorMessage = '';  // Reset error message if data is loaded successfully
          // Kiểm tra dữ liệu participants
          data.participants.forEach((participant: any) => {
            console.log('Participant userId:', participant.userId); // Xem userId của mỗi participant
          });
        } else {
          this.errorMessage = 'Không có dữ liệu thống kê cho bài kiểm tra này.';
        }
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        if (error.status === 404) {
          this.errorMessage = 'Bài kiểm tra không tồn tại hoặc đã bị xóa.';
        } else {
          this.errorMessage = 'Không thể tải thống kê. Vui lòng thử lại sau.';
        }
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
