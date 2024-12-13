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
  
    // Check for form validity
    if (!form.valid) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin!';
      return;
    }
  
    // Check password match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp!';
      return;
    }
  
    // Check email format
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Email không hợp lệ!';
      return;
    }
  
     // Check if email exists
    this.authService.checkEmailExist(this.email).subscribe({
    next: (exists) => {
      if (exists) {
        this.emailExists = true;
        return;
      }
      // Proceed with registration if email doesn't exist
      this.emailExists = false;
      // Continue the registration process...
    },
    error: (error) => {
      console.error('Lỗi khi kiểm tra email:', error);
      this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';
    }
  });
  }
  
  // Add these methods in RegisterComponent class
isValidEmail(email: string): boolean {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
}

isValidPassword(password: string): boolean {
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordPattern.test(password);
}

}

