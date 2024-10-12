import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  template: `
    <a routerLink="/login">login</a>
  `, 
  imports: [RouterLink, RouterOutlet],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';

  onSubmit() {
    if (!this.email) {
      alert('Please enter your email address!');
      return;
    }

    // Giả sử bạn có một API để gửi yêu cầu đặt lại mật khẩu
    const forgotPasswordData = {
      email: this.email
    };

    // Thực hiện logic gửi dữ liệu đến backend ở đây
    console.log('Forgot Password Data:', forgotPasswordData);

    // Thông báo cho người dùng rằng yêu cầu đã được gửi
    alert('A password reset link has been sent to your email address.');

    // Có thể điều hướng người dùng về trang đăng nhập
    // this.router.navigate(['/login']);
  }
}
