import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service'; // Import dịch vụ ExamService
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exam-history',
  templateUrl: './exam-history.component.html',
  styleUrls: ['./exam-history.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ExamHistoryComponent implements OnInit {
  user: any = null;
  examHistory: any[] = []; // Danh sách lịch sử bài thi
  filteredExamHistory: any[] = []; // Danh sách đã lọc
  isDropdownActive = false;

  constructor(private authService: AuthService, private examService: ExamService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser ();
    this.loadExamHistory(); // Gọi phương thức để tải lịch sử bài thi
  }

  loadExamHistory() {
    // Gọi dịch vụ để lấy lịch sử bài thi của học sinh
    this.examService.getExamHistory(this.user._id).subscribe({
      next: (history) => {
        this.examHistory = history;
        this.filteredExamHistory = history; // Khởi tạo danh sách đã lọc
      },
      error: (error) => {
        console.error('Error loading exam history:', error);
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

  filterResults(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredExamHistory = this.examHistory.filter(exam => 
      exam.name.toLowerCase().includes(searchTerm) || 
      exam.score.toString().includes(searchTerm) // Tìm theo tên bài thi hoặc điểm
    );
  }

  applyFilter() {
    // Nếu cần thực hiện thêm thao tác lọc, có thể thực hiện tại đây
    console.log('Filter applied');
  }

  viewExamDetails(examId: string) {
    // Chuyển hướng đến trang chi tiết bài thi
    window.location.href = `/exam-details/${examId}`;
  }
}