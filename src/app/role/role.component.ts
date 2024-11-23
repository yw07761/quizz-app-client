import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent implements OnInit {
  selectedRole: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Check if the user is logged in
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/register']);
      return;
    }

    // Redirect admin users directly to the Admin Dashboard
    if (user.role === 'admin') {
      alert('Bạn là admin. Chuyển hướng đến Admin Dashboard.');
      this.router.navigate(['/admin-dashboard']);
    }
  }

  handleOptionClick(role: 'student' | 'teacher'): void {
    this.errorMessage = null;
    this.selectedRole = role;
    this.isLoading = true;

    const user = this.authService.getCurrentUser();
    if (!user?._id) {
      this.setErrorMessage('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    // Prevent role change if the user is an admin
    if (user.role === 'admin') {
      this.setErrorMessage('Admin không thể thay đổi vai trò.');
      return;
    }

    // Update user role
    this.authService.updateUserRole(user._id, role).subscribe({
      next: (response) => {
        console.log('Vai trò đã được cập nhật thành công:', response);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.isLoading = false;

        // Navigate based on selected role
        this.navigateToDashboard(role);
      },
      error: (error) => {
        console.error('Cập nhật vai trò thất bại:', error);
        this.setErrorMessage(error.message || 'Cập nhật vai trò thất bại. Vui lòng thử lại.');
      },
    });
  }

  // Navigate to the appropriate dashboard
  private navigateToDashboard(role: 'student' | 'teacher'): void {
    if (role === 'student') {
      this.router.navigate(['/student-dashboard']);
    } else {
      this.router.navigate(['/teacher-dashboard']);
    }
  }

  // Set an error message and stop the loading state
  private setErrorMessage(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.selectedRole = null;
  }
}
