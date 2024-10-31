import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  user: any = null; // Khai báo biến user

  constructor(private authService: AuthService) {} // Constructor chỉ inject service

  ngOnInit() {
    // Khởi tạo giá trị cho user trong lifecycle hook
    this.user = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Xử lý logout thành công
        window.location.href = '/login'; // hoặc sử dụng Router để navigate
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Xử lý lỗi nếu cần
      }
    });
  }
}