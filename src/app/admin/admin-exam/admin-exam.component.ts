import { Component, OnInit } from '@angular/core';
import { ExamService, Exam } from '../../../services/exam.service'; // Đảm bảo bạn đã tạo đúng service cho bài thi
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-admin-exam',
  templateUrl: './admin-exam.component.html',
  styleUrls: ['./admin-exam.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminExamComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  exams: Exam[] = [];
  users: any[] = []; // Danh sách tất cả người dùng

  constructor(
    private examService: ExamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExams();
    this.loadUsers()
  }

  // Hàm tải danh sách bài thi
  loadExams() {
    this.examService.getExams().subscribe({
      next: (exams) => {
        this.exams = exams;
      },
      error: (error) => {
        console.error('Error loading exams:', error);
      }
    });
  }
  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log('Danh sách người dùng:', this.users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }
  
  getCreatorName(createdById: string): string {
    const user = this.users.find(u => u._id === createdById);
    return user ? user.username : 'Không xác định'; // Nếu không tìm thấy trả về "Không xác định"
  }
  
  // Hàm xem chi tiết bài thi
  viewExamDetails(exam: Exam) {
    this.router.navigate(['/exam-details', exam._id]);
  }

  // Hàm xóa bài thi
  deleteExam(exam: Exam) {
    if (confirm(`Are you sure you want to delete the exam "${exam.name}"?`)) {
      this.examService.deleteExam(exam._id!).subscribe({
        next: () => {
          this.loadExams(); // Tải lại danh sách bài thi sau khi xóa
          alert('Exam deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting exam:', error);
        }
      });
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
  goBack(): void {
    this.router.navigate(['/admin-dashboard']); // Điều hướng về trang Dashboard
  }
  navigateToStatistics(examId: string) {
    this.router.navigate(['/teacher-statistics', examId]);
  }
  
}
