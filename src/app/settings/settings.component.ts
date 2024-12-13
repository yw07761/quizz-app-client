import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SettingsComponent implements OnInit {
  user: any = null;
  updatedUser: any = {}; // Initialize an object for the updated user information
  showPasswordForm: boolean = false; // State to toggle password change form

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.updatedUser = { ...this.user };
    }
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
  }

  updateUser() {
    if (this.updatedUser) {
      // Check if the password form is visible and validate passwords
      if (this.showPasswordForm) {
        if (!this.updatedUser.currentPassword || !this.updatedUser.newPassword) {
          alert('Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.');
          return;
        }
  
        if (this.updatedUser.currentPassword === this.updatedUser.newPassword) {
          alert('Mật khẩu mới không được trùng với mật khẩu cũ.');
          return;
        }
      }
  
      // Proceed with update if validation passes
      this.authService.updateUser(this.updatedUser).subscribe({
        next: (response) => {
          alert('Cập nhật thông tin thành công!');
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
        }
      });
    } else {
      console.error('No user data to update.');
    }
  }
  

  goBack(): void {
    window.history.back();
  }
}