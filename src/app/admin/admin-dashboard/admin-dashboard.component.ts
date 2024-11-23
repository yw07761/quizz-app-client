import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Đảm bảo có AuthService để kiểm tra vai trò người dùng
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AdminDashboardComponent implements OnInit {
  isDropdownActive = false;
  user: any = null;

  // Khai báo các mục trong dashboard, có thể dùng để hiển thị thêm thông tin, hoặc trạng thái người dùng
  menuItems = [
    { label: 'Quản lý người dùng', route: '/admin-user' },
    { label: 'Quản lý ngân hàng câu hỏi', route: '/admin-question' },
    { label: 'Quản lý bài thi', route: '/admin-exam' }
  ];

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Kiểm tra vai trò người dùng khi vào trang dashboard
    const user = this.authService.getCurrentUser();
    if (!user) {
      // Nếu không có thông tin người dùng, chuyển hướng đến trang đăng nhập
      this.router.navigate(['/login']);
    } else if (user.role !== 'admin') {
      // Nếu không phải admin, chuyển hướng đến trang không được phép
      this.router.navigate(['/unauthorized']);
    } else {
      console.log('Admin Dashboard đã được khởi tạo');
    }
  }

  // Xử lý khi người dùng nhấn vào các mục menu
  onMenuItemClick(route: string): void {
    this.router.navigate([route]);
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
  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }
}
