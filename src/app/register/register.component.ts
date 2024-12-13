import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  emailExists: boolean | undefined;

  constructor(private router: Router, private authService: AuthService) { }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    this.successMessage = '';
  
    // Kiểm tra tính hợp lệ của form
    if (!form.valid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      return;
    }
  
    // Kiểm tra mật khẩu có trùng khớp không
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp!';
      return;
    }
  
    // Kiểm tra định dạng email
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Email không hợp lệ!';
      return;
    }
  
    // Kiểm tra email đã tồn tại chưa
    this.authService.checkEmailExist(this.email).subscribe({
      next: (exists) => {
        if (exists) {
          this.emailExists = true;
          this.errorMessage = 'Email đã được đăng ký!';
          return;
        }
        // Tiến hành đăng ký nếu email chưa tồn tại
        this.emailExists = false;
        this.registerUser(); // Tiến hành đăng ký người dùng
      },
      error: (error) => {
        console.error('Lỗi khi kiểm tra email:', error);
        this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';
      }
    });
  }

  // Phương thức đăng ký người dùng
  registerUser() {
    const userData = {
      username: `${this.firstName} ${this.lastName}`, // Ghép tên và họ thành username
      email: this.email,
      password: this.password
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.successMessage = 'Đăng ký thành công! Vui lòng đăng nhập.';
        setTimeout(() => {
          this.navigateToLogin(); // Chuyển hướng tới trang đăng nhập sau khi thành công
        }, 2000);
      },
      error: (error) => {
        console.error('Lỗi khi đăng ký:', error);
        this.errorMessage = 'Có lỗi xảy ra khi đăng ký, vui lòng thử lại.';
      }
    });
  }

  // Kiểm tra tính hợp lệ của email
  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Kiểm tra mật khẩu hợp lệ
  isValidPassword(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordPattern.test(password);
  }
}
