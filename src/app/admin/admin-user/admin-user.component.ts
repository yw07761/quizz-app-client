import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { UserService, User } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Add FormsModule for ngModel binding

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule], // Import FormsModule if you're using ngModel
})
export class AdminUserComponent implements OnInit {
  user: any = null;
  users: User[] = []; // Danh sách người dùng
  isDropdownActive = false;
  isCreateAccountVisible = false;
  isEditUserVisible = false;
  userToEdit: any = {};

  newUser = {
    username: '',
    email: '',
    password: '',
    role: 'student',
    dateOfBirth: '',  
    gender: 'male',   
    phoneNumber: '',  
  };
  
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

  createAccount() {
    this.userService.createUser(this.newUser).subscribe({
      next: (user) => {
        alert(`Tạo tài khoản thành công!`);
        this.loadUsers(); // Tải lại danh sách người dùng
        this.resetForm(); // Reset form sau khi tạo tài khoản
        this.isCreateAccountVisible = false; // Hide form after creation
      },
      error: (error: any) => {
        console.error('Lỗi tạo tài khoản:', error);
        alert('Đã xảy ra lỗi khi tạo tài khoản.');
      }
    });
  }

  resetForm() {
    this.newUser = {
      username: '',
      email: '',
      password: '',
      role: 'student',
      dateOfBirth: '',  
      gender: 'male',   
      phoneNumber: '',
    };
  }

  // Toggle form visibility
  toggleCreateAccount() {
    this.isCreateAccountVisible = !this.isCreateAccountVisible;
  }
// Edit user: Show the edit form with pre-filled values
toggleEditUser(user: User) {
  this.isEditUserVisible = !this.isEditUserVisible;
  if (this.isEditUserVisible) {
    this.userToEdit = { ...user }; // Clone the user data for editing
    console.log('Editing user:', this.userToEdit);  // Debugging line
  } else {
    this.userToEdit = null; // Reset when hiding the form
  }
}


updateUser() {
  console.log('Updating user:', this.userToEdit); // Kiểm tra dữ liệu trước khi gửi lên server
  if (this.userToEdit) {
    this.userService.updateUser(this.userToEdit).subscribe({
      next: () => {
        alert('Cập nhật tài khoản thành công!');
        this.loadUsers();
        this.isEditUserVisible = false;
      },
      error: (error: any) => {
        console.error('Lỗi cập nhật tài khoản:', error);
        alert('Có lỗi xảy ra khi cập nhật tài khoản.');
      }
    });
  }
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
