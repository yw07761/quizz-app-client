import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterModule  } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-pw',
  standalone: true,
  template: `
    <a routerLink="/login">login</a>
  `, 
  imports: [RouterLink, RouterOutlet, RouterModule, FormsModule],
  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.scss'
})
export class ResetPWComponent {
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = ''; // Biến để lưu thông báo lỗi

  constructor(private router: Router) {}

  onSubmit(frm1 :any) {
    console.log('thành công !')
    this.errorMessage = ''; // Reset thông báo lỗi

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu không khớp!';
      return;
    }
    const resetPasswordData = {
      password: frm1.password,
      confirmPasswordail: frm1.confirmPassword,
    };
    console.log('Dữ liệu', resetPasswordData);
    alert('Đổi mật khẩu thành công chuyển đến trang đăng nhập ngay bây giờ!');
    // Ví dụ: Gửi dữ liệu đến API và điều hướng nếu thành công
    // this.registrationService.register(registrationData).subscribe(
    //   response => {
    //     // Nếu thành công
    this.router.navigate(['/login']);
    //   },
    //   error => {
    //     // Xử lý lỗi
    //     this.errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';
    //   }
    // );
  }
}
