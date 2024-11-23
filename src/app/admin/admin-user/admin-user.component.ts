import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService, User } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AdminUserComponent implements OnInit {
  user: any = null;
  users: User[] = []; // Danh sách người dùng
  isDropdownActive = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user.role !== 'admin') {
      this.router.navigate(['/unauthorized']); // Chặn truy cập nếu không phải admin
    } else {
      this.loadUsers(); // Chỉ admin mới được load danh sách người dùng
    }
  }
  goBack(): void {
    this.router.navigate(['/admin-dashboard']); // Điều hướng về trang Dashboard
  }
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error: any) => {
        if (error.status === 403) {
          console.error('Bạn không có quyền truy cập:', error.error.message);
          alert('Vui lòng đăng nhập lại!');
          this.router.navigate(['/login']); // Chuyển hướng người dùng đến trang đăng nhập
        } else {
          console.error('Lỗi tải danh sách người dùng:', error);
        }
      },
    });
  }
  

  updateUserRole(user: User, role: string) {
    this.userService.updateUserRole(user._id, role).subscribe({
      next: () => {
        alert(`Đã cập nhật vai trò của ${user.username} thành ${role}`);
        this.loadUsers(); // Reload danh sách người dùng
      },
      error: (error: any) => {
        console.error('Lỗi cập nhật vai trò:', error);
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Bạn có chắc muốn xóa người dùng ${user.username}?`)) {
      this.userService.deleteUser(user._id).subscribe({
        next: () => {
          alert(`Đã xóa người dùng ${user.username}`);
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('Lỗi xóa người dùng:', error);
        }
      });
    }
  }
}
