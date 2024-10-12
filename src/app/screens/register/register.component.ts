import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink,FormsModule, RouterOutlet],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  lname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = ''; // Biến để lưu thông báo lỗi

  constructor(private router: Router) { }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit(frm1 :any) {
    console.log('đăng ký thành công !')
    this.errorMessage = ''; // Reset thông báo lỗi

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp!';
      return;
    }
    const registrationData = {
      lname: frm1.lname,
      email: frm1.email,
      password: frm1.password
    };
    console.log('Dữ liệu đăng ký:', registrationData);
    
    // Ví dụ: Gửi dữ liệu đến API và điều hướng nếu thành công
    // this.registrationService.register(registrationData).subscribe(
    //   response => {
    //     // Nếu thành công
    //     this.router.navigate(['/login']);
    //   },
    //   error => {
    //     // Xử lý lỗi
    //     this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';
    //   }
    // );
  }
}
