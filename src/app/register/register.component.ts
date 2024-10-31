import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, RouterOutlet, HttpClientModule],
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

  constructor(private router: Router, private authService: AuthService) { }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp!';
      alert("Mật khẩu không khớp!");
      return;
    }

    const registrationData = {
      username: `${this.firstName} ${this.lastName}`, // Kết hợp họ và tên
      email: this.email,
      password: this.password
    };

    this.authService.register(registrationData).subscribe({
      next: (response) => {
        console.log('Đăng ký thành công:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Đăng ký thất bại:', error);
        this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';
        alert("Trùng email");
      }
    });
  }
}