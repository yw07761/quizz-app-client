import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <a routerLink="/register">register</a>
    <a routerLink="/forgot-password">forgot-password</a>
  `, 
  imports: [RouterLink, FormsModule, ReactiveFormsModule, RouterOutlet, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;  // Use string or null for error messages

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Đang thực hiện gửi biểu mẫu:', this.loginForm.value);
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Đăng nhập thành công:', response);
          this.router.navigate(['/role']);
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem('user', JSON.stringify(response.user));

          // Điều hướng dựa trên vai trò
          const user = response.user;
          if (user.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/role']);
          }
        },
        error: (err) => {
          console.error('Đăng nhập thất bại:', err);
          this.errorMessage = 'Invalid credentials';  // Show error message
        }
      });
    } else {
      console.log('Form không hợp lệ');
    }
  }
}
