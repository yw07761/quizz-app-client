import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <a routerLink="/register">register</a>
    <a routerLink="/forgot-password">forgot-password</a>
  `, 
  imports: [RouterLink, FormsModule, ReactiveFormsModule, RouterOutlet, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

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
        },
        error: (err) => {
          console.error('Đăng nhập thất bại:', err);
        }
      });
    } else {
      console.log('Form không hợp lệ');
    }
  }
}
