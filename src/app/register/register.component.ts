import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = ''; // Biến để lưu thông báo lỗi

  constructor(private router: Router) { }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit() {
    this.errorMessage = ''; // Reset thông báo lỗi

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp!';
      return;
    }

    // Giả sử bạn muốn gửi dữ liệu đăng ký đến một API
    const registrationData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    // Thực hiện logic gửi dữ liệu đến backend ở đây
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
